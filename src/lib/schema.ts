// =====================================================
// Schema markup (JSON-LD) utilities
// =====================================================
// - parseFAQFromText: detects FAQ Q&A patterns in plain text
// - generateProductSchema: Product schema for product detail pages
// - generateFAQSchema: FAQPage schema for FAQ accordions
// - generateOrganizationSchema: Organization/LocalBusiness schema for site-wide use
// =====================================================

export type FAQItem = { question: string; answer: string };
export type ParsedFAQ = { regularText: string[]; faqs: FAQItem[] };

/**
 * Detects FAQ patterns in plain text.
 *
 * A "question" is a non-empty line that ends with "?" and is reasonably short
 * (< 200 chars). Lines that immediately follow a question (until the next
 * question or a blank-line-then-non-QA block) are treated as its answer.
 *
 * HTML content is returned untouched (caller should detect HTML before calling).
 *
 * @returns { regularText, faqs }
 *   - regularText: non-FAQ lines (preserved in original order, trimmed)
 *   - faqs: ordered list of { question, answer }
 */
export function parseFAQFromText(text: string): ParsedFAQ {
  if (!text || !text.trim()) {
    return { regularText: [], faqs: [] };
  }

  const lines = text.split(/\r?\n/);
  const regularText: string[] = [];
  const faqs: FAQItem[] = [];

  let i = 0;
  let pendingQuestion: string | null = null;
  let answerBuffer: string[] = [];

  const isQuestion = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (!trimmed.endsWith("?")) return false;
    // Avoid treating long paragraphs ending with "?" as questions
    if (trimmed.length > 200) return false;
    // Skip obvious list markers / heading syntax — but allow a "* item?" style
    if (/^\s*#{1,6}\s/.test(line)) return false;
    return true;
  };

  const flushQuestion = () => {
    if (pendingQuestion === null) return;
    const answer = answerBuffer.join("\n").trim();
    if (answer) {
      faqs.push({ question: pendingQuestion, answer });
    } else {
      // Orphan question — treat as regular text so it isn't lost
      regularText.push(pendingQuestion);
    }
    pendingQuestion = null;
    answerBuffer = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (isQuestion(line)) {
      // Starting a new question — flush any in-progress Q&A first
      flushQuestion();
      pendingQuestion = trimmed;
      i++;
      continue;
    }

    if (pendingQuestion !== null) {
      if (trimmed === "") {
        // Blank line — peek ahead. If next non-blank is a question (or EOF),
        // this FAQ ends here. Otherwise treat as a paragraph break in the answer.
        let j = i + 1;
        while (j < lines.length && lines[j].trim() === "") j++;
        if (j >= lines.length || isQuestion(lines[j])) {
          flushQuestion();
          i++;
          continue;
        }
        // Paragraph break inside the answer
        answerBuffer.push("");
        i++;
        continue;
      }
      // Answer line
      answerBuffer.push(trimmed);
      i++;
      continue;
    }

    // Not inside a Q&A block — collect as regular text (skip blank lines)
    if (trimmed !== "") {
      regularText.push(trimmed);
    }
    i++;
  }

  // Flush trailing question
  flushQuestion();

  return { regularText, faqs };
}

/**
 * Builds a schema.org Product JSON-LD object from a product.
 *
 * Accepts the frontend `Product` shape (see src/lib/data.ts) but tolerates
 * partial/unknown input — every field is optional and defaults safely.
 */
export function generateProductSchema(product: any): object {
  if (!product || typeof product !== "object") return {};

  const name: string = product.name ?? "Product";
  const description: string | undefined =
    product.shortDescription || product.description || undefined;
  const brand: string = product.brand ?? "BD71 Pet Shop";
  const price: number = Number(product.price ?? 0);
  const sku: string | undefined = product.sku || undefined;
  const inStock: boolean = product.inStock !== false;

  const image: string | undefined =
    product.featured_image ||
    (Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : undefined);

  const rating: number = Number(product.rating ?? 0);
  const reviews: number = Number(product.reviews ?? 0);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    brand: { "@type": "Brand", name: brand },
    sku,
    image,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "BD71 Pet Shop" },
    },
  };

  if (rating > 0 && reviews > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount: reviews,
    };
  }

  // Strip undefined values to keep JSON-LD clean
  return cleanUndefined(schema) as object;
}

/**
 * Builds a schema.org FAQPage JSON-LD object from a list of FAQs.
 */
export function generateFAQSchema(faqs: FAQItem[]): object {
  if (!Array.isArray(faqs) || faqs.length === 0) return {};

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

/**
 * Builds a schema.org Organization (with LocalBusiness-friendly fields)
 * JSON-LD object from site info.
 *
 * Used in the root layout for site-wide structured data.
 */
export function generateOrganizationSchema(siteInfo: any): object {
  if (!siteInfo || typeof siteInfo !== "object") return {};

  const name: string = siteInfo.name ?? "BD71 Pet Shop";
  const legalName: string | undefined = siteInfo.legalName ?? name;
  const domain: string = siteInfo.domain ?? "bd71shop.com.bd";
  const url: string = siteInfo.url ?? `https://${domain}`;
  const logo: string = siteInfo.logo ?? `${url}/logo.svg`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    legalName,
    url,
    logo,
    email: siteInfo.email,
    telephone: siteInfo.phone,
    foundingDate: siteInfo.founded,
  };

  if (siteInfo.founder) {
    schema.founder = { "@type": "Person", name: siteInfo.founder };
  }

  if (siteInfo.address) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: siteInfo.address,
      addressCountry: siteInfo.addressCountry ?? "BD",
    };
  }

  if (siteInfo.hours) {
    schema.openingHours = siteInfo.hours;
  }

  if (Array.isArray(siteInfo.sameAs) && siteInfo.sameAs.length > 0) {
    schema.sameAs = siteInfo.sameAs;
  } else {
    // Reasonable defaults — replace with real social profiles when available
    schema.sameAs = [];
  }

  return cleanUndefined(schema) as object;
}

/**
 * Recursively removes keys whose value is `undefined`.
 * Keeps `null` and other falsy-but-valid values.
 */
function cleanUndefined(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined);
  }
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (value === undefined) continue;
      out[key] = cleanUndefined(value);
    }
    return out;
  }
  return obj;
}

/**
 * Serializes a schema object to a JSON-LD string safe to embed inside
 * `<script type="application/ld+json">`.
 */
export function serializeSchema(schema: object): string {
  // Escape <, >, and & to prevent JSON-LD from rendering as visible text
  return JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

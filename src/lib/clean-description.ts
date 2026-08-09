// =====================================================
// Description cleaner — strips JSON-LD schema markup that
// WordPress SEO plugins (Yoast / RankMath) embed inside
// product descriptions.
// =====================================================
// Background:
//   WP SEO plugins inject <script type="application/ld+json">…</script>
//   blocks INTO the WooCommerce product description. The CMS migration
//   script's stripHtml() removes the <script> tags but keeps the JSON
//   content, so the raw schema text leaks into the visible description.
//   On the storefront, parseFAQFromText() then mistakes the leftover
//   JSON for FAQ answer text — that's why the FAQPage schema shows up
//   inside the last FAQ accordion item.
//
// This module removes:
//   1. <script>…</script> blocks entirely (including content)
//   2. Standalone JSON-LD objects that survived tag stripping
//   3. Trailing braces / fragments left behind
// =====================================================

/**
 * Removes <script>…</script> blocks (with their content) and any
 * standalone JSON-LD object literals from a description string.
 *
 * Safe to call on plain text or HTML — only removes the schema bits,
 * preserves everything else.
 */
export function stripSchemaMarkup(input: string | null | undefined): string {
  if (!input) return "";

  let out = input;

  // 1. Remove <script>…</script> blocks WITH their content.
  //    Uses [\s\S] so newlines are matched. Non-greedy so multiple
  //    script blocks are handled individually.
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

  // 2. Remove <style>…</style> blocks too (same risk, same fix).
  out = out.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");

  // 3. Remove standalone JSON-LD objects that survived tag stripping.
  //    A JSON-LD object always starts with {"@context": or {"@type":
  //    and ends with a matching closing brace. We do a balanced
  //    extraction so nested objects (FAQPage.mainEntity[].acceptedAnswer
  //    etc.) are removed as a single unit.
  out = out.replace(
    /\{\s*"@(?:context|type)"\s*:[^{}]*?(?:\{[^{}]*\}[^{}]*?)*\}/g,
    ""
  );

  // 4. Some Yoast builds emit pretty-printed JSON-LD with newlines and
  //    indentation that the compact regex above won't catch. Run a
  //    second pass that handles multi-line objects starting with
  //    { "@context" or { "@type" (note the optional whitespace after
  //    the quote — both forms appear in the wild).
  out = removeJsonLdBlocks(out);

  // 5. Trim leftover whitespace / empty lines left behind.
  out = out
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+|\s+$/g, "")
    .trim();

  return out;
}

/**
 * Balanced-brace removal of any {...} block whose first key is
 * "@context" or "@type". Handles nested objects and pretty-printed
 * JSON with newlines/indentation.
 */
function removeJsonLdBlocks(text: string): string {
  // Find candidate start positions
  const startRegex = /\{\s*"@(?:context|type)"\s*:/g;
  let result = text;
  let match: RegExpExecArray | null;

  // Loop because removing one block may expose another
  // (limit iterations to avoid pathological inputs)
  for (let iter = 0; iter < 10; iter++) {
    startRegex.lastIndex = 0;
    match = startRegex.exec(result);
    if (!match) break;

    const startIdx = match.index;
    const endIdx = findMatchingBrace(result, startIdx);
    if (endIdx === -1) {
      // Unbalanced — bail out, leave the rest alone
      break;
    }

    // Remove the block (and any trailing newline)
    result =
      result.slice(0, startIdx) +
      result.slice(endIdx + 1).replace(/^\n+/, "");
  }

  return result;
}

/**
 * Given a string and the index of an opening `{`, returns the index of
 * the matching closing `}`. Handles nested objects, arrays, and strings
 * (including escaped quotes).
 */
function findMatchingBrace(text: string, startIdx: number): number {
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = startIdx; i < text.length; i++) {
    const ch = text[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (ch === "\\") {
      escape = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }

  return -1; // unbalanced
}

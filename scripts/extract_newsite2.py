import re
import os
import sys

pages = {
    "about": "/home/z/my-project/newsite_pages/about.html",
    "contact": "/home/z/my-project/newsite_pages/contact.html",
    "privacy": "/home/z/my-project/newsite_pages/privacy-policy.html",
    "terms": "/home/z/my-project/newsite_pages/terms-conditions.html",
    "dmca": "/home/z/my-project/newsite_pages/dmca-policy.html",
    "disclaimer": "/home/z/my-project/newsite_pages/disclaimer.html",
}

def clean_text(text):
    text = text.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"').replace('&#039;', "'").replace('&#39;', "'").replace('&rsquo;', "'").replace('&lsquo;', "'").replace('&ldquo;', '"').replace('&rdquo;', '"').replace('&mdash;', '—').replace('&ndash;', '–').replace('&hellip;', '...').replace('&#160;', '').replace('&pound;', '£').replace('&euro;', '€').replace('&#8211;', '–').replace('&#8212;', '—').replace('&#8216;', "'").replace('&#8217;', "'").replace('&#8220;', '"').replace('&#8221;', '"').replace('&#2547;', '৳')
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n[ \t]+', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def html_to_text(html):
    text = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<!--[\s\S]*?-->', '', text)
    text = re.sub(r'<h1[^>]*>(.*?)</h1>', r'\n\n# \1\n', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<h2[^>]*>(.*?)</h2>', r'\n\n## \1\n', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<h3[^>]*>(.*?)</h3>', r'\n\n### \1\n', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<h4[^>]*>(.*?)</h4>', r'\n\n#### \1\n', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'</p>', '\n\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'</li>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<li[^>]*>', '- ', text, flags=re.IGNORECASE)
    text = re.sub(r'<a[^>]*>(.*?)</a>', r'\1', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = clean_text(text)
    return text

# For each page, find the article/content section
target = sys.argv[1] if len(sys.argv) > 1 else None

for name, path in pages.items():
    if target and name != target:
        continue
    if not os.path.exists(path):
        continue
    with open(path) as f:
        html = f.read()

    print(f"\n{'='*70}")
    print(f"=== {name.upper()} ===")

    # Try to find content area - look for h2 with substantial following content
    # Strategy: find the last occurrence of <h1 or <h2 page-title, then take everything until footer
    # OR find specific content patterns

    # Try to find the main content by looking for the H1 of the page title
    # WordPress content usually has class entry-content or page-content
    content_m = re.search(r'<div[^>]*class="[^"]*(?:entry-content|page-content|content-area|site-content|elementor-widget-theme-post-content)[^"]*"[^>]*>([\s\S]*?)(?:</div>\s*<!--|<footer|</main|</article)', html, re.IGNORECASE)
    if not content_m:
        # Try to find article
        content_m = re.search(r'<article[^>]*>([\s\S]*?)</article>', html, re.IGNORECASE)
    if not content_m:
        # Try main tag
        content_m = re.search(r'<main[^>]*>([\s\S]*?)</main>', html, re.IGNORECASE)
    if not content_m:
        # Fallback: find body content between header and footer
        content_m = re.search(r'</header>([\s\S]*?)<footer', html, re.IGNORECASE)

    if content_m:
        text = html_to_text(content_m.group(1))
        print(f"--- CONTENT ({len(text)} chars) ---")
        print(text[:12000])
        with open(f"/home/z/my-project/clean_newsite_{name}.txt", 'w') as f:
            f.write(text)
    else:
        print("Could not extract content")

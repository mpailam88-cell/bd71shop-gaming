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

def extract_main(html):
    """Try to extract main content area"""
    # Try entry-content (WordPress default)
    patterns = [
        r'<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)</div>\s*<(?:footer|/article|/main|aside)',
        r'<article[^>]*>([\s\S]*?)</article>',
        r'<main[^>]*>([\s\S]*?)</main>',
        r'<div[^>]*id="content[^"]*"[^>]*>([\s\S]*?)</div>\s*<footer',
        r'<div[^>]*class="[^"]*page-content[^"]*"[^>]*>([\s\S]*?)</div>\s*<footer',
    ]
    for p in patterns:
        m = re.search(p, html, re.IGNORECASE)
        if m and len(m.group(1)) > 800:
            return m.group(1)
    return None

target = sys.argv[1] if len(sys.argv) > 1 else None

for name, path in pages.items():
    if target and name != target:
        continue
    if not os.path.exists(path):
        print(f"=== {name.upper()} === FILE NOT FOUND")
        continue
    with open(path) as f:
        html = f.read()
    print(f"\n{'='*70}")
    print(f"=== {name.upper()} ===")
    print(f"HTML length: {len(html)}")

    main = extract_main(html)
    if main:
        text = html_to_text(main)
        print(f"--- MAIN CONTENT ({len(main)} html chars) ---")
        print(text[:10000])
        # Save
        with open(f"/home/z/my-project/clean_newsite_{name}.txt", 'w') as f:
            f.write(text)
        print(f"\n--- Saved ({len(text)} chars) ---")
    else:
        print("--- MAIN extraction failed, dumping first 3000 chars of full text ---")
        text = html_to_text(html)
        print(text[:3000])

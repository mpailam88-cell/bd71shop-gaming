import json
import re
import os
import sys

files = {
    "about": "/home/z/my-project/fetch_about.json",
    "contact": "/home/z/my-project/fetch_contact.json",
    "privacy": "/home/z/my-project/fetch_privacy.json",
    "terms": "/home/z/my-project/fetch_terms.json",
    "dmca": "/home/z/my-project/fetch_dmca.json",
    "disclaimer": "/home/z/my-project/fetch_disclaimer.json",
}

def clean_text(text):
    text = text.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"').replace('&#39;', "'").replace('&rsquo;', "'").replace('&lsquo;', "'").replace('&ldquo;', '"').replace('&rdquo;', '"').replace('&mdash;', '—').replace('&ndash;', '–').replace('&hellip;', '...')
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n[ \t]+', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def extract_main_content(html):
    """Try to find the main article/page content from HTML"""
    # Try common WordPress content selectors
    patterns = [
        r'<article[^>]*>([\s\S]*?)</article>',
        r'<main[^>]*>([\s\S]*?)</main>',
        r'<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)</div>\s*(?:</article>|<footer|<nav)',
        r'<div[^>]*class="[^"]*page-content[^"]*"[^>]*>([\s\S]*?)</div>\s*(?:</article>|<footer|<nav)',
        r'<div[^>]*class="[^"]*content-area[^"]*"[^>]*>([\s\S]*?)</div>\s*<aside',
        r'<div[^>]*id="content[^"]*"[^>]*>([\s\S]*?)</div>\s*<footer',
        r'<div[^>]*class="[^"]*post-content[^"]*"[^>]*>([\s\S]*?)</div>',
    ]
    for p in patterns:
        m = re.search(p, html, re.IGNORECASE)
        if m and len(m.group(1)) > 500:
            return m.group(1)
    return None

def html_to_text(html):
    text = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<!--[\s\S]*?-->', '', text)
    # Preserve heading structure
    text = re.sub(r'<h1[^>]*>(.*?)</h1>', r'\n\n## \1\n', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<h2[^>]*>(.*?)</h2>', r'\n\n## \1\n', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<h3[^>]*>(.*?)</h3>', r'\n\n### \1\n', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<h4[^>]*>(.*?)</h4>', r'\n\n#### \1\n', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<h5[^>]*>(.*?)</h5>', r'\n\n#### \1\n', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'</p>', '\n\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'</li>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<li[^>]*>', '- ', text, flags=re.IGNORECASE)
    # Remove links but keep text
    text = re.sub(r'<a[^>]*>(.*?)</a>', r'\1', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = clean_text(text)
    return text

target = sys.argv[1] if len(sys.argv) > 1 else None

for name, path in files.items():
    if target and name != target:
        continue
    if not os.path.exists(path):
        print(f"=== {name.upper()} === FILE NOT FOUND")
        continue
    with open(path) as f:
        data = json.load(f)
    d = data.get('data', {})
    title = d.get('title', 'N/A')
    html = d.get('html', '')
    print(f"\n{'='*70}")
    print(f"=== {name.upper()} ===")
    print(f"Title: {title}")
    print(f"URL: {d.get('url','N/A')}")

    main = extract_main_content(html)
    if main:
        text = html_to_text(main)
        print(f"--- MAIN CONTENT (extracted, {len(main)} html chars) ---")
        print(text[:12000])
        # Save
        with open(f"/home/z/my-project/clean_{name}.txt", 'w') as f:
            f.write(f"TITLE: {title}\nURL: {d.get('url','')}\n\n{text}")
        print(f"\n--- Saved to clean_{name}.txt ({len(text)} chars) ---")
    else:
        print("--- MAIN CONTENT extraction failed, dumping raw text ---")
        text = html_to_text(html)
        print(text[:5000])

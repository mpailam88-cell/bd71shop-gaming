import json
import re
import os

def clean_text(text):
    text = text.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"').replace('&#39;', "'").replace('&rsquo;', "'").replace('&lsquo;', "'").replace('&ldquo;', '"').replace('&rdquo;', '"').replace('&mdash;', '—').replace('&ndash;', '–').replace('&hellip;', '...').replace('&#160;', '')
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n[ \t]+', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def html_to_text(html):
    text = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<!--[\s\S]*?-->', '', text)
    text = re.sub(r'<h[1-6][^>]*>(.*?)</h[1-6]>', r'\n\n## \1\n', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'</p>', '\n\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'</li>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<li[^>]*>', '- ', text, flags=re.IGNORECASE)
    text = re.sub(r'<a[^>]*>(.*?)</a>', r'\1', text, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = clean_text(text)
    return text

with open('/home/z/my-project/fetch_shop.json') as f:
    data = json.load(f)
d = data.get('data', {})
html = d.get('html', '')
print(f"Title: {d.get('title','')}")
print(f"HTML length: {len(html)}")
print("---")
text = html_to_text(html)
print(text[:15000])

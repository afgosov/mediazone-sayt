"""Mediazone sayti — CI tekshiruvi (faqat Python standart kutubxonasi).

Tekshiradi:
  1. Har sahifada <html lang>, <title>, meta description, viewport, charset bor.
  2. Barcha ichki havola va fayllar (href, src, srcset, url()) mavjud.
  3. Sahifa ichidagi #langarlar (masalan studio.html#onyx) haqiqatan bor id ga olib boradi.
  4. Bitta sahifada id takrorlanmaydi.
  5. config.js da telefon raqami bor.
Xato bo'lsa — ro'yxat chiqarib, 1 kodi bilan tugaydi.
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent.parent
PAGES = sorted(ROOT.glob("*.html"))
errors = []


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.refs, self.meta = [], [], {}
        self.lang = self.title = self.charset = None
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.append(a["id"])
        if tag == "html":
            self.lang = a.get("lang")
        if tag == "title":
            self._in_title = True
            self.title = ""
        if tag == "meta":
            if "charset" in a:
                self.charset = a["charset"]
            if "name" in a:
                self.meta[a["name"]] = a.get("content", "")
        for k in ("href", "src"):
            if a.get(k):
                self.refs.append((tag, a[k]))
        for part in (a.get("srcset") or "").split(","):
            if part.strip():
                self.refs.append((tag, part.strip().split()[0]))

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title:
            self.title += data


def local(ref):
    """Tashqi havola, tel:, mailto: va javascript: — tekshirilmaydi."""
    s = urlsplit(ref)
    return not (s.scheme or s.netloc or ref.startswith(("tel:", "mailto:", "javascript:", "data:")))


parsed = {}
for p in PAGES:
    pg = Page()
    pg.feed(p.read_text(encoding="utf-8"))
    parsed[p.name] = pg

for name, pg in parsed.items():
    if not pg.lang:
        errors.append(f"{name}: <html lang> yo'q")
    if not (pg.title or "").strip():
        errors.append(f"{name}: <title> bo'sh")
    if (pg.charset or "").lower() != "utf-8":
        errors.append(f"{name}: <meta charset=utf-8> yo'q")
    if not pg.meta.get("description", "").strip():
        errors.append(f"{name}: meta description yo'q")
    if "viewport" not in pg.meta:
        errors.append(f"{name}: meta viewport yo'q")
    dup = {i for i in pg.ids if pg.ids.count(i) > 1}
    if dup:
        errors.append(f"{name}: takroriy id: {', '.join(sorted(dup))}")

    for tag, ref in pg.refs:
        if not local(ref) or ref == "#":
            continue
        s = urlsplit(ref)
        path, frag = unquote(s.path), s.fragment
        target = name if not path else path
        f = (ROOT / target).resolve()
        if not f.exists():
            errors.append(f"{name}: <{tag}> fayl topilmadi: {ref}")
            continue
        if frag and f.suffix == ".html":
            ids = parsed.get(f.name)
            if ids is not None and frag not in ids.ids:
                errors.append(f"{name}: langar topilmadi: {ref}")

# CSS ichidagi url(...)
for css in ROOT.glob("assets/css/*.css"):
    for ref in re.findall(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", css.read_text(encoding="utf-8")):
        if local(ref) and not (css.parent / ref).resolve().exists():
            errors.append(f"{css.relative_to(ROOT)}: url() fayl topilmadi: {ref}")

# JS ichida yozilgan sahifa/fayl havolalari (sarlavha, futer, xona langarlari)
for js in ROOT.glob("assets/js/*.js"):
    text = js.read_text(encoding="utf-8")
    for ref in set(re.findall(r"""["']((?:[\w-]+\.html)(?:#[\w-]+)?|assets/[\w./-]+\.\w+)["']""", text)):
        path, _, frag = ref.partition("#")
        if not (ROOT / path).exists():
            errors.append(f"{js.relative_to(ROOT)}: fayl topilmadi: {ref}")
        elif frag and path in parsed and frag not in parsed[path].ids:
            errors.append(f"{js.relative_to(ROOT)}: langar topilmadi: {ref}")

cfg = (ROOT / "assets/js/config.js").read_text(encoding="utf-8")
if not re.search(r'phone:\s*"\+?\d[\d ]{8,}"', cfg):
    errors.append("assets/js/config.js: telefon raqami yo'q yoki noto'g'ri")

print(f"Tekshirildi: {len(PAGES)} sahifa")
if errors:
    print(f"\n{len(errors)} ta xato:")
    for e in errors:
        print("  -", e)
    sys.exit(1)
print("Hammasi joyida.")

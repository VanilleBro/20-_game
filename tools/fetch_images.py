#!/usr/bin/env python3
"""Lädt Zutaten- und Gerichtsfotos von TheMealDB, schneidet sie zu und speichert sie als WebP.

Aufruf:  python3 tools/fetch_images.py
Ergebnis: app/src/main/assets/img/ing/<key>.webp, app/src/main/assets/img/meal/<id>.webp,
          tools/image_report.json, tools/mealdb_ingredients.txt
"""
import io
import json
import os
import sys
import time
import urllib.parse
import urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def _arg(flag, default):
    return sys.argv[sys.argv.index(flag) + 1] if flag in sys.argv else default


CFG = json.load(open(os.path.join(ROOT, _arg("--config", "tools/images.json")), encoding="utf-8"))
OUT_ING = os.path.join(ROOT, _arg("--out", "app/src/main/assets/img/ing"))
REPORT = os.path.join(ROOT, _arg("--report", "tools/image_report.json"))
OUT_MEAL = os.path.join(ROOT, "app", "src", "main", "assets", "img", "meal")
API = "https://www.themealdb.com/api/json/v1/1/"
UA = {"User-Agent": "Mozilla/5.0 (20-dollar-game image fetcher)"}
if "--clean" in sys.argv and os.path.isdir(OUT_ING):
    import shutil
    shutil.rmtree(OUT_ING)
os.makedirs(OUT_ING, exist_ok=True)
os.makedirs(OUT_MEAL, exist_ok=True)


def get(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.status, r.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return 404, b""
            time.sleep(1 + i)
        except Exception:
            time.sleep(1 + i)
    return 0, b""


def save_ingredient(data, path, max_side=320):
    im = Image.open(io.BytesIO(data)).convert("RGBA")
    alpha = im.getchannel("A")
    # fast weiße Hintergründe zusätzlich wegschneiden ist nicht nötig – Bilder sind freigestellt
    bbox = alpha.point(lambda a: 255 if a > 12 else 0).getbbox()
    if bbox:
        im = im.crop(bbox)
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    im.save(path, "WEBP", quality=82, method=6)
    return im.size


def save_meal(data, path, side=360):
    im = Image.open(io.BytesIO(data)).convert("RGB")
    w, h = im.size
    s = min(w, h)
    im = im.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s))
    im = im.resize((side, side), Image.LANCZOS)
    im.save(path, "WEBP", quality=78, method=6)


def main():
    only_missing = "--missing" in sys.argv
    report = {"ingredients": {}, "meals": {}}

    # Offizielle Zutatenliste
    st, body = get(API + "list.php?i=list")
    official = {}
    if st == 200:
        for m in json.loads(body).get("meals") or []:
            n = (m.get("strIngredient") or "").strip()
            if n:
                official[n.lower()] = m
        with open(os.path.join(ROOT, "tools", "mealdb_ingredients.txt"), "w", encoding="utf-8") as f:
            f.write("\n".join(sorted(m["strIngredient"].strip() for m in official.values())))
    print(f"Offizielle Zutaten: {len(official)}")

    for key, cands in CFG["ingredients"].items():
        path = os.path.join(OUT_ING, key + ".webp")
        if only_missing and os.path.exists(path):
            report["ingredients"][key] = {"ok": True, "cached": True}
            continue
        hit = None
        for c in cands:
            m = official.get(c.lower())
            name = m["strIngredient"].strip() if m else c
            urls = []
            if m and m.get("strThumb"):
                urls.append(m["strThumb"])
            q = urllib.parse.quote(name)
            urls += [f"https://www.themealdb.com/images/ingredients/{q}.png",
                     f"https://www.themealdb.com/images/ingredients/{urllib.parse.quote(name.lower().replace(' ', '_'))}.png"]
            for u in urls:
                st, data = get(u)
                if st == 200 and len(data) > 500:
                    try:
                        size = save_ingredient(data, path)
                        hit = {"ok": True, "name": name, "official": bool(m), "url": u, "size": size}
                        break
                    except Exception as e:  # kaputtes Bild
                        print("  Fehler", key, u, e)
            if hit:
                break
        report["ingredients"][key] = hit or {"ok": False, "tried": cands}
        print(("OK  " if hit else "MISS"), key, (hit or {}).get("name", ""))

    for food, queries in CFG["meals"].items():
        path = os.path.join(OUT_MEAL, food + ".webp")
        hit = None
        for q in queries:
            st, body = get(API + "search.php?s=" + urllib.parse.quote(q))
            if st != 200:
                continue
            meals = json.loads(body).get("meals") or []
            if not meals:
                continue
            m = meals[0]
            st, data = get(m["strMealThumb"])
            if st == 200:
                save_meal(data, path)
                hit = {"ok": True, "query": q, "meal": m["strMeal"], "url": m["strMealThumb"],
                       "all": [x["strMeal"] for x in meals[:12]]}
                break
        report["meals"][food] = hit or {"ok": False}
        print(("OK  " if hit else "MISS"), "meal", food, (hit or {}).get("meal", ""))

    with open(REPORT, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=1)
    miss = [k for k, v in report["ingredients"].items() if not v.get("ok")]
    print(f"\nFehlend ({len(miss)}): {', '.join(miss)}")


if __name__ == "__main__":
    main()

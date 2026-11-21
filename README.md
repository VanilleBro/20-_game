# 🍔 20$ Game

Ein Bieter-Spiel für zwei Personen an einem Handy. Jeder startet mit **$20** und ersteigert Zutaten für sein Essen – am Ende wird entschieden, wer das bessere Gericht gebaut hat.

## 📱 Installieren

Unter **[Releases](../../releases/latest)** die Datei `20-Dollar-Game.apk` aufs Handy laden und öffnen
(eventuell „Apps aus unbekannten Quellen installieren“ erlauben).

Jeder Push auf `main` baut die App automatisch über GitHub Actions neu und erstellt ein neues Release.

## 🎮 Regeln

- 10 Essen zur Auswahl (Burger, Pizza, Hot Dog, Tacos, Döner, Sushi, Pancakes, Eisbecher, Sandwich, Pasta), jedes mit 18 möglichen Zutaten.
- **Jeder bekommt 4 Zutaten** (einstellbar). Es kommen so lange zufällige Zutaten, bis beide voll sind. Für jede wird abwechselnd geboten: **+1 $**, **+2 $** oder **Passen**.
- Ist einer schon voll, bekommt der andere die nächsten Zutaten gratis angeboten und kann sie nehmen oder überspringen.
- Wer passt, lässt den anderen mit seinem Höchstgebot gewinnen. Nur der Gewinner zahlt.
- Passen beide, ohne dass jemand geboten hat, kriegt keiner das Item.
- Wer zuerst bietet, wechselt jedes Item ab.
- Ist ein Spieler pleite, entscheidet der andere bei jedem weiteren Item, ob er es selbst nimmt oder dem anderen gibt.
- Am Ende tippt ihr auf den Gewinner – oder lasst bei Uneinigkeit die **App-Jury** entscheiden (geheime Item-Bewertungen, Kombo-Boni, Minuspunkte für ekliges Zeug, kleiner Bonus für Restgeld).

## 🍽️ Table-Mode

In den Einstellungen aktivierbar: Das Handy liegt zwischen euch auf dem Tisch. Die Hälfte von Spieler 2 ist umgedreht, und die Steuerung dreht sich immer zu dem Spieler, der gerade dran ist.

## 🖼️ Bilder

Die Zutaten- und Gerichtsfotos stammen von [TheMealDB](https://www.themealdb.com). Sie werden vom Workflow `.github/workflows/fetch-images.yml` geladen (Liste in `tools/images.json`), zugeschnitten und als WebP unter `app/src/main/assets/img/` gespeichert.
Auf dem Essen liegen natürliche Zutaten als echtes Foto; Soßen, Käse & Co. werden passend gezeichnet (`app/src/main/assets/scenes.js`).

## 🛠️ Technik

- Spiel: HTML/CSS/JavaScript in `app/src/main/assets/`
- Android-Hülle: WebView-App in Java (`app/src/main/java/...`)
- Build: `.github/workflows/build.yml` (Gradle 8.9, Android Gradle Plugin 8.5)
- `app/debug.keystore` ist ein öffentlicher Test-Schlüssel, damit Updates sich über ältere Versionen installieren lassen. Für eine Play-Store-Veröffentlichung einen eigenen, geheimen Schlüssel verwenden.

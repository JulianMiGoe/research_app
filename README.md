# Proben, Paper, Professur als App auf dem Handy

Dieser Ordner ist eine fertige Web-App (PWA). Du legst ihn auf GitHub Pages, öffnest die Adresse auf dem Handy und fügst sie zum Startbildschirm hinzu. Danach startet das Spiel wie eine App: ohne Browserleiste, mit eigenem Symbol und auch offline.

| Datei | Wozu |
|---|---|
| `index.html` | das Spiel |
| `manifest.webmanifest`, `sw.js`, `icons/` | machen daraus eine installierbare App, die offline läuft |
| `firebase-config.js`, `firestore.rules`, `firebase.json` | nur für den optionalen Cloud-Speicher |
| `.nojekyll` | sagt GitHub Pages, die Dateien unverändert auszuliefern |

## 1. Auf GitHub Pages veröffentlichen (etwa 10 Minuten)

1. Auf github.com oben rechts **+ → New repository**. Name zum Beispiel `proben-paper-professur`, Sichtbarkeit **Public** (GitHub Pages für private Repositories braucht ein bezahltes Konto), **Create repository**.
2. Auf der leeren Repository-Seite **uploading an existing file** anklicken und den **Inhalt** dieses Ordners hineinziehen, also `index.html`, `sw.js`, den Ordner `icons` usw. `index.html` muss ganz oben liegen, nicht in einem Unterordner. **Commit changes**.
   Die Datei `.nojekyll` ist versteckt (am Mac sichtbar mit Cmd + Umschalt + Punkt). Sie schadet nicht, wenn sie fehlt.
3. **Settings → Pages**. Unter *Build and deployment*: Source **Deploy from a branch**, Branch **main**, Ordner **/ (root)**, **Save**.
4. Nach ein bis zwei Minuten steht oben auf der Pages-Seite die Adresse, etwa `https://DEINNAME.github.io/proben-paper-professur/`.

Lieber mit Git im Terminal, im entpackten Ordner:

```bash
git init
git add .
git commit -m "Proben, Paper, Professur"
git branch -M main
git remote add origin https://github.com/DEINNAME/proben-paper-professur.git
git push -u origin main
```

## 2. Auf dem Handy installieren

- **iPhone (Safari):** Adresse öffnen → Teilen-Symbol → **Zum Home-Bildschirm** → Hinzufügen. Es muss Safari sein; in anderen Browsern fehlt die Option auf älteren iOS-Versionen.
- **Android (Chrome):** Adresse öffnen → Menü ⋮ → **App installieren** (oder **Zum Startbildschirm hinzufügen**).

Beim ersten Start braucht die App Internet, danach läuft sie auch offline. Der Spielstand liegt auf dem Gerät.

## 3. Spielstand aus Claude mitnehmen

1. Im Claude-Artefakt den **h-Index** oben im Kopf antippen (Lebenslauf) → ganz unten **Spielstand übertragen** → **Code erzeugen** → **Code kopieren**.
2. In der App: h-Index antippen → **Code einfügen** → einfügen → **Prüfen** → **Übernehmen**.

Das klappt in beide Richtungen und auch zwischen zwei Handys.

## 4. Optional: Cloud-Speicher mit Firebase (Handy und Laptop im Gleichstand)

Ohne Firebase speichert die App nur auf dem jeweiligen Gerät. Mit Firebase liegt der Spielstand zusätzlich in deinem eigenen Firebase-Projekt. Ein zweites Gerät verbindest du über einen 20-stelligen Spielstand-Code.

1. [console.firebase.google.com](https://console.firebase.google.com) → **Projekt hinzufügen**, zum Beispiel `proben-paper-professur`. Google Analytics brauchst du nicht. Ein bestehendes Projekt geht auch; das Spiel nutzt nur die Sammlung `spielstaende`.
2. **Build → Authentication → Jetzt starten → Anmeldemethode: Anonym** aktivieren.
3. **Authentication → Einstellungen → Autorisierte Domains → Domain hinzufügen:** `DEINNAME.github.io`.
4. **Build → Firestore Database → Datenbank erstellen**, Produktionsmodus, Standort zum Beispiel `europe-west3 (Frankfurt)`.
5. **Firestore → Regeln:** den Inhalt von `firestore.rules` einfügen → **Veröffentlichen**.
6. **Projekteinstellungen** (Zahnrad) → **Allgemein → Meine Apps → Web-App** (Symbol `</>`) registrieren. Aus der angezeigten `firebaseConfig` die Werte `apiKey`, `authDomain`, `projectId` und `appId` in `firebase-config.js` eintragen, statt `null`. Das Muster steht in der Datei.
7. Die geänderte `firebase-config.js` ins Repository hochladen (gleichnamige Datei ersetzen).
8. In der App: h-Index antippen → **Cloud-Speicher → Einschalten**. Auf dem zweiten Gerät **Code eingeben**.

Gut zu wissen:
- Der kostenlose Spark-Tarif reicht locker. Ein Spielstand ist etwa 150 bis 200 kB groß.
- Wer den Code kennt, kann den Spielstand laden. Behalte ihn für dich.
- Spiele nicht auf zwei Geräten gleichzeitig: Der zuletzt gespeicherte Stand gewinnt.
- Der `apiKey` in `firebase-config.js` ist kein Geheimnis; geschützt wird über die Regeln aus Schritt 5.

## Alternative: Firebase Hosting statt GitHub Pages

```bash
npm install -g firebase-tools
firebase login
firebase use --add      # im entpackten Ordner, Projekt auswählen
firebase deploy         # lädt App und Firestore-Regeln hoch
```

Die Adresse lautet dann `https://PROJEKT.web.app`. Diese Domain ist für die Anmeldung schon autorisiert.

## Updates einspielen

Bei einer neuen Version die Dateien im Repository ersetzen, vor allem `index.html` und `sw.js`, und `firebase-config.js` dabei nicht überschreiben, wenn du sie ausgefüllt hast. Die App holt sich die neue Version beim nächsten Start mit Internet. Falls nicht: App ganz schließen und neu öffnen.

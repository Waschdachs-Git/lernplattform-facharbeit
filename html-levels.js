// Stellt ein Standard-HTML-Dokument zur Verfügung (Vorlage für neue HTML-Seiten)
// Enthält das Grundgerüst, minimales Styling und ein kleines interaktives Beispiel
export const defaultTemplate = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <style>
    body { margin: 0; font-family: 'Inter', sans-serif; background: #111; color: #f5f5f7; }
    .card { max-width: 520px; margin: 24px auto; padding: 18px; border-radius: 14px; background: #1f1f24; border: 1px solid #2f2f33; }
    .pill { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #6a8bff33; color: #c7d0ff; border: 1px solid #2f3755; font-weight: 600; }
    button { padding: 10px 14px; border-radius: 12px; border: none; background: linear-gradient(135deg, #6a8bff, #9a6bff); color: #fff; font-weight: 700; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <span class="pill">Mini Demo</span>
    <h2>Hallo <span id="who">Coder</span></h2>
    <p>Baue hier deine eigenen Experimente. Style nach Belieben.</p>
    <button onclick="document.getElementById('who').textContent = 'World';">Sage Hi</button>
  </div>
</body>
</html>`;

// Enthält alle 16 Level fürs HTML-Modul
// Jedes Level hat: Titel, Beschreibung, Theorie, Check-Frage und Sandbox-Aufgabe
export const HTML_LEVELS = {
  1: {
    title: "Level 1: Die Atome des Webs – Was sind Tags?",
    desc: "Grundidee von öffnenden und schließenden Tags verstehen.",
    theory:
      "HTML ist wie eine Sprache aus Bausteinen, die man 'Tags' nennt. Ein Tag ist wie eine Klammer, die dem Browser sagt, was ein Inhalt ist. Fast jeder Baustein hat einen Anfang <tag> und ein Ende </tag>. Das Ende erkennt man immer an dem Schrägstrich /. Ein Beispiel: <p>Das ist ein Text</p>. Hier sagt das <p> (Paragraph), dass es sich um einen Textabsatz handelt. Ohne diese Tags wüsste der Browser nicht, ob etwas eine Überschrift, ein Bild oder ein einfacher Text ist.",
    check: {
      type: "quiz",
      question: "Welches Zeichen unterscheidet einen schließenden Tag von einem öffnenden Tag?",
      options: [
        { label: "/", value: "/" },
        { label: "#", value: "#" },
        { label: "?", value: "?" },
      ],
      answer: "/",
      tip: "Der Schrägstrich / steckt im schließenden Tag.",
    },
    sandbox: {
      prompt:
        "Schreibe zwei Absätze mit <p>. Tipp: Denke an die spitzen Klammern < > und an das End-Tag mit /.",
      defaultValue: "<!-- Schreibe hier dein erstes <p>-Tag -->\n",
      checklist: [
        "Öffnendes <p> schreiben",
        "Wort Hallo einfügen und </p> schließen",
        "Zweiten Absatz mit 'Lernen macht Spaß' erstellen",
      ],
    },
  },
  2: {
    title: "Level 2: Das Skelett – Die Boilerplate",
    desc: "DOCTYPE, html, head und body anlegen.",
    theory:
      "Jede Website braucht ein festes Grundgerüst, damit der Browser sie versteht. Man nennt das auch 'Boilerplate'. Ganz oben steht immer <!DOCTYPE html>, was dem Browser sagt: 'Achtung, hier kommt modernes HTML5!'. Danach kommt das <html>-Tag, das alles umschließt. In den <head> kommen Infos für den Browser (die man auf der Seite nicht sieht), und in den <body> kommt alles, was der Nutzer später auf der Seite sehen kann.",
    check: {
      type: "quiz",
      question: "In welchen Bereich schreibst du Inhalte, die der Nutzer auf der Website sehen soll?",
      options: [
        { label: "<body>", value: "body" },
        { label: "<head>", value: "head" },
        { label: "<meta>", value: "meta" },
      ],
      answer: "body",
      tip: "Sichtbarer Inhalt gehört in den <body>.",
    },
    sandbox: {
      prompt:
        "Schreibe die Boilerplate mit DOCTYPE, html, head und body. Tipp: head und body sind Geschwister innerhalb von html.",
      defaultValue: "<!-- Schreibe hier deine Boilerplate -->\n",
      checklist: [
        "<!DOCTYPE html> setzen",
        "<html> öffnen und unten </html> schließen",
        "<head> und <body> innerhalb von <html> anlegen",
      ],
    },
  },
  3: {
    title: "Level 3: Der Reisepass – Attribute",
    desc: "Attribute wie lang und id setzen.",
    theory:
      "Tags können noch mehr Infos speichern, sogenannte 'Attribute'. Sie funktionieren wie Adjektive in einer Sprache. Ein Attribut steht immer im startenden Tag und sieht so aus: name=\"wert\". Ein sehr wichtiges Attribut ist lang im <html>-Tag. Es sagt dem Browser, in welcher Sprache die Seite geschrieben ist (z. B. lang=\"de\" für Deutsch). Das hilft zum Beispiel Google, deine Seite richtig einzuordnen.",
    check: {
      type: "quiz",
      question: "Wo genau werden Attribute hingeschrieben?",
      options: [
        { label: "In den öffnenden Tag", value: "start" },
        { label: "In den schließenden Tag", value: "end" },
        { label: "Außerhalb der Tags", value: "outside" },
      ],
      answer: "start",
      tip: "Attribute stehen im öffnenden Tag nach dem Namen.",
    },
    sandbox: {
      prompt:
        "Füge Attribute hinzu: lang am html-Tag und id an einem Absatz. Tipp: name=\"wert\" und Anführungszeichen nicht vergessen! (Am Ende soll lang=\"en\" stehen.)",
      defaultValue:
        "<html>\n  <head></head>\n  <body>\n    <p>Infotext hier</p>\n  </body>\n</html>",
      checklist: [
        "lang=\"de\" zum <html>-Tag hinzufügen",
        "<p> mit id=\"info\" anlegen",
        "lang von de auf en ändern",
      ],
    },
  },
  4: {
    title: "Level 4: Die Schlagzeilen – Überschriften",
    desc: "Überschriften h1 bis h3 setzen.",
    theory:
      "Überschriften geben der Seite Struktur und helfen dem Leser, sich zurechtzufinden. In HTML gibt es sechs Stufen: <h1> ist die größte und wichtigste Überschrift (wie der Titel eines Buches). Danach folgen <h2> bis <h6>, die immer kleiner werden. Ein wichtiger Profi-Tipp: Die <h1> sollte nur ein einziges Mal pro Seite für das Hauptthema genutzt werden. Das ist sehr wichtig für die Suchmaschinenoptimierung (SEO).",
    check: {
      type: "quiz",
      question: "Welche Überschrift ist am kleinsten?",
      options: [
        { label: "<h6>", value: "h6" },
        { label: "<h3>", value: "h3" },
        { label: "<h1>", value: "h1" },
      ],
      answer: "h6",
      tip: "h1 ist die größte, h6 die kleinste.",
    },
    sandbox: {
      prompt:
        "Setze drei Überschriften. Tipp: Wenn du mit <h1> startest, schließe mit </h1>. Gleiches für h2/h3.",

      defaultValue:
        "<body>\n  <!-- Überschriften hier einfügen -->\n</body>",
      checklist: [
        "<h1> Meine Reise setzen",
        "<h2> Tag 1 hinzufügen",
        "<h3> Frühstück ergänzen",
      ],
    },
  },
  5: {
    title: "Level 5: Text mit Nachdruck – strong & em",
    desc: "Worte hervorheben und Zeilen umbrechen.",
    theory:
      "Mit <strong> betonst du etwas fett, mit <em> kursiv. Für Zeilenwechsel im gleichen Absatz nutzt du <br>. So kannst du kurze Vorstellungsblöcke oder Gedichte strukturieren, ohne neue Absätze zu beginnen.",
    check: {
      type: "quiz",
      question: "Welches Tag macht Text fett (semantisch betont)?",
      options: [
        { label: "<strong>", value: "strong" },
        { label: "<em>", value: "em" },
        { label: "<br>", value: "br" },
      ],
      answer: "strong",
      tip: "<strong> = wichtige, fette Betonung.",
    },
    sandbox: {
      prompt: "Schreibe ein Mini-Gedicht mit Namen, kursiver Vorliebe und drei Zeilen mit <br>.",
      defaultValue:
        "<p>Hallo, hier ist <strong></strong>!</p>\n<p>Lieblingsessen: <em></em></p>\n<p>Zeile eins<br>Zeile zwei<br>Zeile drei</p>",
      checklist: [
        "Deinen Namen mit <strong> fett markieren",
        "Ein Wort mit <em> kursiv hervorheben",
        "Drei Zeilen mit zwei <br>-Umbrüchen bauen",
      ],
    },
  },
  6: {
    title: "Level 6: Die Einkaufsliste – ungeordnete Listen",
    desc: "Mit <ul> und <li> sammeln und hervorheben.",
    theory:
      "Für Aufzählungen ohne feste Reihenfolge nutzt du <ul> (unordered list). Jede Zeile steckt in einem <li>. Einzelne Wörter kannst du mit <strong> hervorheben, ohne die Liste zu verlassen.",
    check: {
      type: "quiz",
      question: "Welches Tag umschließt alle Punkte einer ungeordneten Liste?",
      options: [
        { label: "<ul>", value: "ul" },
        { label: "<ol>", value: "ol" },
        { label: "<li>", value: "li" },
      ],
      answer: "ul",
      tip: "<ul> ist der Container, <li> die einzelnen Punkte.",
    },
    sandbox: {
      prompt: "Baue eine Einkaufsliste mit drei Punkten und markiere Milch fett.",
      defaultValue:
        "<ul>\n  <li></li>\n  <li></li>\n  <li></li>\n</ul>",
      checklist: [
        "<ul> mit drei <li>-Einträgen anlegen",
        "Äpfel und Bananen als Einträge setzen",
        "Milch mit <strong> hervorheben",
      ],
    },
  },
  7: {
    title: "Level 7: Reihenfolgen festlegen – geordnete Listen",
    desc: "Zwei <ol>-Listen für Filme und Schritte bauen.",
    theory:
      "Wenn die Reihenfolge wichtig ist, nimmst du <ol> (ordered list). Die Nummerierung erledigt der Browser. Jeder Schritt bleibt ein eigenes <li> – ideal für Anleitungen.",
    check: {
      type: "quiz",
      question: "Wann ist eine <ol> besser als eine <ul>?",
      options: [
        { label: "Bei Schritten mit Reihenfolge", value: "ordered" },
        { label: "Bei zufälligen Bullet-Points", value: "unordered" },
        { label: "Nie, Listen sind egal", value: "never" },
      ],
      answer: "ordered",
      tip: "Nummerierte Abläufe gehören in eine <ol>.",
    },
    sandbox: {
      prompt: "Erstelle zwei nummerierte Listen: Filme und Wasser-Schritte.",
      defaultValue:
        "<ol>\n  <li></li>\n  <li></li>\n</ol>\n\n<ol>\n  <li></li>\n  <li></li>\n</ol>",
      checklist: [
        "Zwei <ol>-Listen anlegen",
        "Erste Liste mit zwei Lieblingsfilmen füllen",
        "Zweite Liste mit zwei Wasser-Schritten füllen",
      ],
    },
  },
  8: {
    title: "Level 8: Das Web verbinden – Links",
    desc: "Links mit href setzen und in Listen nutzen.",
    theory:
      "Ein Link ist das Herzstück des Internets. Er verbindet deine Seite mit dem Rest der Welt. Das Tag dafür heißt <a> (Anchor). Damit der Link weiß, wo er hinführen soll, braucht er das Attribut href. Das sieht dann so aus: <a href=\"https://google.de\">Hier klicken</a>. Das Wort zwischen den Tags ist das, was man später anklicken kann. Ohne die Adresse im href weiß der Browser nicht, wohin die Reise gehen soll.",
    check: {
      type: "quiz",
      question: "In welches Attribut schreibt man die Internetadresse des Ziels?",
      options: [
        { label: "href", value: "href" },
        { label: "src", value: "src" },
        { label: "alt", value: "alt" },
      ],
      answer: "href",
      tip: "Die Zieladresse steht in href.",
    },
    sandbox: {
      prompt:
        "Setze Links mit korrektem href und kombiniere sie mit einer Liste. Tipp: Vergiss die Anführungszeichen um die Adresse nicht!",
      defaultValue:
        "<!-- 1) Link zu Wikipedia (Text: Lexikon) -->\n<a href=\"https://wikipedia.org\"></a>\n\n<!-- 2) Liste mit Link-Punkten -->\n<ul>\n  <li><a href=\"\"></a></li>\n  <li><a href=\"\"></a></li>\n</ul>\n\n<!-- 3) Mach einen Link-Text in einem <a> mit <strong> fett -->\n",
      checklist: [
        "Link zu https://wikipedia.org mit Text 'Lexikon' erstellen",
        "<ul>-Liste mit Link-Punkten bauen",
        "Einen Link-Text mit <strong> hervorheben",
      ],
    },
  },
  9: {
    title: "Level 9: Bilder einfügen – Ein Bild sagt mehr als...",
    desc: "Bilder mit src, alt und Breite einbinden.",
    theory:
      "Webseiten bestehen nicht nur aus Text. Mit dem Tag <img> kannst du Bilder anzeigen lassen. Dieser Tag ist eine Besonderheit: Er braucht kein End-Tag. Du musst ihm aber zwei wichtige Infos mitgeben: Das Attribut src (Source) sagt dem Browser, wo das Bild liegt. Das Attribut alt (Alternativtext) beschreibt das Bild. Das ist wichtig für Menschen, die nicht sehen können, da ihr Computer ihnen den Text vorliest. Außerdem wird dieser Text angezeigt, falls das Bild mal nicht geladen werden kann.",
    check: {
      type: "quiz",
      question: "Warum ist das alt-Attribut so wichtig?",
      options: [
        { label: "Barrierefreiheit und Ersatztext", value: "a11y" },
        { label: "Macht Bilder größer", value: "bigger" },
        { label: "Ändert die Farbe", value: "color" },
      ],
      answer: "a11y",
      tip: "alt beschreibt das Bild – wichtig für Screenreader und als Fallback.",
    },
    sandbox: {
      prompt: "Bild mit src, alt und fester Breite einfügen.",
      defaultValue:
        "<p>Logo einfügen:</p>\n<img src=\"\" alt=\"\" />\n\n<p>Adresse folgt:</p>",
    },
  },
  10: {
    title: "Level 10: Multimedia – Videos und Sound",
    desc: "Video mit controls einbetten und beschreiben.",
    theory:
      "Du kannst auch Videos oder Musik direkt einbauen. Dafür nutzt man die Tags <video> oder <audio>. Damit der Nutzer das Video auch starten kann, braucht der Browser einen Hinweis: Das Attribut controls. Wenn du dieses Wort einfach in den Tag schreibst, zeigt der Browser automatisch Knöpfe für Play, Pause und Lautstärke an. Ohne dieses Wort sieht der Nutzer nur ein Standbild, das er nicht starten kann.",
    check: {
      type: "quiz",
      question: "Was passiert, wenn du das Wort controls im Video-Tag vergisst?",
      options: [
        { label: "Es gibt keine Abspiel-Knöpfe", value: "no-controls" },
        { label: "Das Video wird doppelt", value: "double" },
        { label: "Das Video wird schwarzweiß", value: "bw" },
      ],
      answer: "no-controls",
      tip: "Ohne controls zeigt der Browser keine Buttons für Play/Pause.",
    },
    sandbox: {
      prompt: "Video mit controls einfügen und beschriften.",
      defaultValue:
        "<video></video>\n\n<p></p>",
    },
  },
  11: {
    title: "Level 11: Ordnung in Tabellen",
    desc: "Tabellen mit Zeilen und Zellen bauen.",
    theory:
      "Tabellen helfen dir, Daten übersichtlich zu ordnen, zum Beispiel für einen Stundenplan. Eine Tabelle fängt immer mit dem Tag <table> an. Sie ist wie ein Schrank aufgebaut: Zuerst baust du eine Reihe (<tr> für Table Row). In diese Reihe legst du dann die einzelnen Fächer oder Zellen (<td> für Table Data). Wenn du eine zweite Reihe willst, fängst du einfach ein neues <tr> unter der ersten Reihe an.",
    check: {
      type: "quiz",
      question: "Welches Tag benutzt man, um eine neue Zeile in einer Tabelle zu erstellen?",
      options: [
        { label: "<tr>", value: "tr" },
        { label: "<td>", value: "td" },
        { label: "<table>", value: "table" },
      ],
      answer: "tr",
      tip: "tr = table row, td = table data.",
    },
    sandbox: {
      prompt: "Baue eine kleine Tabelle mit zwei Zeilen.",
      defaultValue:
        "<table>\n  <tr>\n    <td></td>\n    <td></td>\n  </tr>\n</table>",
    },
  },
  12: {
    title: "Level 12: Die Kisten-Logik – Container (div & span)",
    desc: "div und span nutzen, um Inhalte zu gruppieren.",
    theory:
      "Manchmal möchtest du mehrere Elemente zusammenfassen, um sie später gemeinsam zu verschieben oder zu gestalten. Dafür gibt es 'Container'. Der wichtigste ist das <div>. Es ist wie eine unsichtbare Kiste, in die du alles Mögliche (Bilder, Texte, Überschriften) hineinstecken kannst. Wenn du nur ein einzelnes Wort mitten im Text markieren willst, nutzt du den Tag <span>. Diese Tags verändern das Aussehen der Seite erst einmal nicht – sie dienen nur der Ordnung.",
    check: {
      type: "quiz",
      question: "Welches Tag nutzt man eher für große Abschnitte oder ganze Blöcke auf der Seite?",
      options: [
        { label: "<div>", value: "div" },
        { label: "<span>", value: "span" },
        { label: "<p>", value: "p" },
      ],
      answer: "div",
      tip: "div = Block-Container, span = Inline.",
    },
    sandbox: {
      prompt: "Packe Inhalte in ein div und markiere das Wort 'Wichtig' mit span.",
      defaultValue:
        "<div>\n  <h2></h2>\n  <img src=\"\" alt=\"\" />\n</div>\n\n<p>Das ist ein <span></span> Hinweis.</p>",
    },
  },
  13: {
    title: "Level 13: Die Orientierung – Header, Main & Footer",
    desc: "Seite in Kopf, Inhalt und Fuß gliedern.",
    theory:
      "Stell dir eine Zeitung vor: Es gibt immer einen Kopfbereich mit dem Namen der Zeitung, den Hauptartikel in der Mitte und ganz unten rechtliche Infos. In HTML machen wir das genauso, damit der Browser (und Blinde, die Vorleseprogramme nutzen) die Seite versteht. Der <header> ist für das Logo und das Menü. In den <main>-Bereich kommt der eigentliche Hauptinhalt der Seite. Und ganz unten nutzt man den <footer> für Kontaktinfos oder das Impressum. Das nennt man 'semantisches HTML', weil die Tags dem Inhalt einen Sinn geben.",
    check: {
      type: "quiz",
      question: "In welchem Tag sollte der wichtigste Inhalt deiner Seite stehen?",
      options: [
        { label: "<main>", value: "main" },
        { label: "<header>", value: "header" },
        { label: "<footer>", value: "footer" },
      ],
      answer: "main",
      tip: "Der Kerninhalt gehört in <main>.",
    },
    sandbox: {
      prompt: "Baue Header, Main, Footer und fülle sie minimal. Tipp: Diese Tags teilen die Seite wie große Container in Bereiche.",
      defaultValue:
        "<header>\n  <h1></h1>\n</header>\n\n<main>\n  <!-- Inhalt hier -->\n</main>\n\n<footer>\n  <!-- Fußzeile hier -->\n</footer>",
    },
  },
  14: {
    title: "Level 14: Ordnung in der Box – Section & Article",
    desc: "Section und Article für saubere Struktur.",
    theory:
      "Innerhalb deines <main>-Bereichs wird es oft unübersichtlich. Um Ordnung zu halten, nutzt man <section> und <article>. Eine <section> (Abteilung) gruppiert Themen, die zusammengehören (z. B. 'Über mich' oder 'Meine Hobbys'). Ein <article> (Artikel) ist für Inhalte gedacht, die auch alleine Sinn ergeben würden, wie ein Blogpost oder eine Nachricht. Das hilft nicht nur der Ordnung, sondern auch Google, deine Seite besser zu lesen.",
    check: {
      type: "quiz",
      question: "Welches Tag nutzt man am besten für einen eigenständigen Blogbeitrag?",
      options: [
        { label: "<article>", value: "article" },
        { label: "<section>", value: "section" },
        { label: "<div>", value: "div" },
      ],
      answer: "article",
      tip: "Eigenständige Inhalte → <article>.",
    },
    sandbox: {
      prompt: "Section mit Artikel und Beschreibung erstellen. Tipp: Denke an Section als Schrank, Article als Schublade darin.",
      defaultValue:
        "<section>\n  <h2></h2>\n  <article>\n    <p></p>\n  </article>\n</section>",
    },
  },
  15: {
    title: "Level 15: Sag mir was! – Formulare und Inputs",
    desc: "Form, Label, Input und Button einsetzen.",
    theory:
      "Jetzt wird es interaktiv! Wenn du möchtest, dass Nutzer dir schreiben oder sich anmelden, brauchst du ein <form> (Formular). In diesem Formular nutzt man <input>-Felder. Es gibt verschiedene Typen: type=\"text\" für Namen, type=\"email\" für Adressen oder type=\"password\". Damit der Nutzer weiß, was er in das Feld schreiben soll, nutzt man das <label>-Tag als Beschriftung. Am Ende braucht jedes Formular einen <button>, um die Daten abzusenden.",
    check: {
      type: "quiz",
      question: "Welches Attribut beim Input-Tag bestimmt, ob man Text oder ein Passwort eingibt?",
      options: [
        { label: "type", value: "type" },
        { label: "name", value: "name" },
        { label: "placeholder", value: "placeholder" },
      ],
      answer: "type",
      tip: "type=\"text\" vs. type=\"password\" entscheidet den Feldtyp.",
    },
    sandbox: {
      prompt: "Ein kleines Formular mit Label, Input und Button bauen. Tipp: Input braucht kein End-Tag, und der Button muss im Form stehen.",
      defaultValue:
        "<form>\n  <label></label>\n  <input type=\"text\">\n  <button></button>\n</form>",
    },
  },
  16: {
    title: "Level 16: Das Gehirn der Seite – Der Head-Bereich",
    desc: "Title und Meta im Head ergänzen.",
    theory:
      "Du hast es fast geschafft! Zum Schluss schauen wir uns den <head>-Bereich noch einmal genauer an. Das ist das 'Gehirn' deiner Website. Hier stehen Dinge, die man auf der Seite nicht direkt sieht, die aber extrem wichtig sind. Das wichtigste Tag hier ist <title>. Der Text, den du hier reinschreibst, erscheint oben im Reiter deines Browsers. Außerdem stehen hier <meta>-Tags, die Google sagen, worum es auf deiner Seite geht oder wie groß sie auf einem Handy angezeigt werden soll.",
    check: {
      type: "quiz",
      question: "Wo erscheint der Text, den du in das <title>-Tag schreibst?",
      options: [
        { label: "Im Browser-Tab/Reiter", value: "tab" },
        { label: "Im Footer", value: "footer" },
        { label: "Im Body", value: "body" },
      ],
      answer: "tab",
      tip: "Der Titel steht oben im Browser-Tab.",
    },
    sandbox: {
      prompt: "Title und Meta Charset im Head ergänzen.",
      defaultValue:
        "<!DOCTYPE html>\n<html lang=\"de\">\n<head>\n  <!-- Kopfbereich: füge Title und Meta hinzu -->\n</head>\n<body>\n  <h1>Willkommen!</h1>\n</body>\n</html>",
    },
  },
};

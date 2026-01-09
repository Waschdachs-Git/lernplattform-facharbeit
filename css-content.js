// Stellt das Basis-HTML für alle CSS-Levels bereit
// Enthält alle Elemente, die für die verschiedenen Aufgaben gebraucht werden
export const CSS_BASE_HTML = `
<div class="page">
  <h1>Eine bunte Seite</h1>
  <p>Hier steht ein erster Absatz.</p>
  <p>Hier steht ein zweiter Absatz.</p>
  <div class="box">Das ist eine Box</div>
  <p class="highlight">Ein leuchtender Text</p>
  <p class="rand">Ein Text mit Rahmen</p>

  <div class="hintergrund">
    <h2 class="titel">Hex-Farben ausprobieren</h2>
    <button class="knopf" type="button">Klick mich</button>
  </div>

  <div class="text-block">Text-Block für Schriftarten</div>

  <div class="karte">Eine Karte (für Rahmen & Rundungen)</div>

  <button class="kreis" type="button">Kreis</button>

  <img alt="Demo Bild" src="https://via.placeholder.com/260x140" />

  <div class="glow">Glow Effekt</div>
  <div class="combo">Combo Box</div>

  <h2>Layout-Demo (für Level 9–12)</h2>
  <div class="span-demo">
    <span>Span A</span>
    <span>Span B</span>
    <span>Span C</span>
  </div>
  <div class="container">
    <div class="box demo-box demo-a">Box 1</div>
    <div class="box demo-box demo-b">Box 2</div>
    <div class="box demo-box demo-c">Box 3</div>
  </div>

  <h2>Responsive-Demo (für Level 13–16)</h2>
  <div class="layout-container">
    <div class="bild-box">Bild-Box</div>
    <div class="spalten">
      <div class="spalte">Spalte A</div>
      <div class="spalte">Spalte B</div>
    </div>
  </div>

  <h2>Galerie-Demo (für Level 15)</h2>
  <div class="galerie">
    <div class="galerie-item">1</div>
    <div class="galerie-item">2</div>
    <div class="galerie-item">3</div>
    <div class="galerie-item">4</div>
    <div class="galerie-item">5</div>
  </div>

  <h2>Mobile-First-Demo (für Level 16)</h2>
  <div class="mobile-layout">
    <button class="menue-knopf" type="button">Menü</button>
    <div class="seitenleiste">Seitenleiste (Desktop)</div>
    <div class="inhalt">Inhalt</div>
  </div>
</div>
`;

export function getCssPreviewHtml(levelKey) {
  const key = Number(levelKey);
  // Zeigt nur die HTML-Elemente, die für das jeweilige Level wichtig sind
  // So ist die Vorschau nicht überladen und Schüler können sich besser konzentrieren
  if (key <= 1) {
    return `
<div class="page">
  <h1>Eine bunte Seite</h1>
  <p>Hier steht ein erster Absatz.</p>
  <p>Hier steht ein zweiter Absatz.</p>
</div>`;
  }
  if (key === 2) {
    return `
<div class="page">
  <div class="box">Das ist eine Box</div>
  <p class="highlight">Ein leuchtender Text</p>
  <p class="rand">Ein Text mit Rahmen</p>
</div>`;
  }
  if (key === 3) {
    return `
<div class="page">
  <h1>Eine bunte Seite</h1>
  <p>Hier steht ein erster Absatz.</p>
  <p>Hier steht ein zweiter Absatz.</p>
</div>`;
  }
  if (key === 4) {
    return `
<div class="page">
  <div class="box">Das ist eine Box</div>
</div>`;
  }
  if (key === 5) {
    return `
<div class="page">
  <div class="hintergrund">
    <h2 class="titel">Hex-Farben ausprobieren</h2>
    <button class="knopf" type="button">Klick mich</button>
  </div>
</div>`;
  }
  if (key === 6) {
    return `
<div class="page">
  <h1>Schriften testen</h1>
  <div class="text-block">Text-Block für Schriftarten</div>
</div>`;
  }
  if (key === 7) {
    return `
<div class="page">
  <div class="karte">Eine Karte (für Rahmen & Rundungen)</div>
  <button class="kreis" type="button">Kreis</button>
  <img alt="Demo Bild" src="https://via.placeholder.com/260x140" />
</div>`;
  }
  if (key === 8) {
    return `
<div class="page">
  <div class="glow">Glow Effekt</div>
  <div class="combo">Combo Box</div>
</div>`;
  }
  if (key >= 9 && key <= 12) {
    return `
<div class="page">
  <h2>Layout-Demo</h2>
  <div class="span-demo">
    <span>Span A</span>
    <span>Span B</span>
    <span>Span C</span>
  </div>
  <div class="container">
    <div class="box demo-box demo-a">Box 1</div>
    <div class="box demo-box demo-b">Box 2</div>
    <div class="box demo-box demo-c">Box 3</div>
  </div>
</div>`;
  }
  if (key >= 13 && key <= 14) {
    return `
<div class="page">
  <h2>Responsive-Demo</h2>
  <div class="layout-container">
    <div class="bild-box">Bild-Box</div>
    <div class="spalten">
      <div class="spalte">Spalte A</div>
      <div class="spalte">Spalte B</div>
    </div>
  </div>
</div>`;
  }
  if (key === 15) {
    return `
<div class="page">
  <h2>Galerie-Demo</h2>
  <div class="galerie">
    <div class="galerie-item">1</div>
    <div class="galerie-item">2</div>
    <div class="galerie-item">3</div>
    <div class="galerie-item">4</div>
    <div class="galerie-item">5</div>
  </div>
</div>`;
  }
  if (key === 16) {
    return `
<div class="page">
  <h2>Mobile-First-Demo</h2>
  <div class="mobile-layout">
    <button class="menue-knopf" type="button">Menü</button>
    <div class="seitenleiste">Seitenleiste (Desktop)</div>
    <div class="inhalt">Inhalt</div>
  </div>
</div>`;
  }

  return CSS_BASE_HTML;
}

// Enthält alle 16 Level fürs CSS-Modul
// Jedes Level hat: Titel, Theorie, Check-Frage und Sandbox-Aufgabe
export const CSS_LEVELS = {
  1: {
    title: "Level 1: Was ist CSS?",
    theory:
      "HTML war das Skelett der Seite. CSS (Cascading Style Sheets) ist jetzt die Kleidung. Damit wird bestimmt, wie alles aussieht. Eine Regel in CSS sieht immer so aus: Zuerst wird angegeben, was gemeint ist (z. B. p), und dann wird in geschweiften Klammern { } geschrieben, was sich ändern soll. Beispiel: p { color: red; } macht alle Texte rot. Wichtig: Nach der Eigenschaft kommt ein Doppelpunkt : und am Ende ein Semikolon ;.",
    check: {
      question: "Welches Zeichen steht in CSS immer am Ende einer Zeile innerhalb der Klammern?",
      options: [
        { label: ";", value: ";" },
        { label: ":", value: ":" },
        { label: "#", value: "#" },
      ],
      answer: ";",
      tip: "Jede Anweisung endet mit einem Semikolon ;",
    },
    sandbox: {
      prompt: "Farben setzen für body, h1 und p.",
      help: "Achte auf die Klammern { } und das Semikolon ;",
      defaultCss: `/* Level 1: Passe die Farben an */
body {
  background-color: white;
}

h1 {
  color: black;
}

p {
  color: black;
}
`,
      checklist: [
        "Alle p-Texte blau färben",
        "Die h1-Überschrift grün machen",
        "Dem Body lightgrey als Hintergrund geben",
      ],
    },
  },
  2: {
    title: "Level 2: Klassen gezielt stylen",
    theory:
      "Manchmal sollen nicht alle Texte gleich aussehen. Dafür gibt es 'Klassen'. Im HTML bekommt ein Tag einen Namen, z. B. <p class=\"wichtig\">. In CSS wird dieser Name mit einem Punkt davor angesprochen: .wichtig { color: gold; }. So lässt sich ganz genau bestimmen, welches Element wie aussehen soll, ohne alle anderen zu verändern.",
    check: {
      question: "Welches Zeichen steht in CSS vor einem Namen, wenn es eine Klasse ist?",
      options: [
        { label: ".", value: "." },
        { label: "#", value: "#" },
        { label: "@", value: "@" },
      ],
      answer: ".",
      tip: "Vor Klassen steht immer ein Punkt.",
    },
    sandbox: {
      prompt: "Klassen .box, .highlight und .rand gestalten.",
      help: "Vergiss den Punkt vor dem Klassennamen nicht.",
      defaultCss: `/* Level 2: Arbeite mit Klassen */
.box {
  padding: 12px;
  border: 1px solid #999;
}

.highlight {
  color: black;
}

.rand {
  border: 1px solid gray;
}
`,
      checklist: [
        ".box bekommt eine Hintergrundfarbe",
        ".highlight wird orange",
        ".rand bekommt border: 2px solid black;",
      ],
    },
  },
  3: {
    title: "Level 3: Textgestaltung",
    theory:
      "CSS kann noch viel mehr als nur Farben. Die Schriftgröße kann mit font-size geändert werden (z. B. 20px für 20 Pixel). Mit text-align lässt sich festlegen, ob ein Text links, rechts oder in der Mitte (center) stehen soll. So können Überschriften schön mittig platziert werden, wie in einer echten Zeitung.",
    check: {
      question: "Welcher Befehl rückt einen Text in die Mitte der Seite?",
      options: [
        { label: "text-align: center;", value: "center" },
        { label: "font-size: 20px;", value: "size" },
        { label: "padding: 10px;", value: "padding" },
      ],
      answer: "center",
      tip: "text-align: center; richtet den Text mittig aus.",
    },
    sandbox: {
      prompt: "Überschrift und Absätze in Größe und Ausrichtung ändern.",
      help: "px immer direkt an die Zahl schreiben.",
      defaultCss: `/* Level 3: Text stylen */
h1 {
  font-size: 32px;
  text-align: left;
}

p {
  font-size: 14px;
  text-align: left;
}
`,
      checklist: [
        "h1 auf 50px setzen",
        "h1 zentrieren",
        "p auf 18px und rechts ausrichten",
      ],
    },
  },
  4: {
    title: "Level 4: Abstände der Box",
    theory:
      "Jedes Element auf der Seite ist eigentlich eine unsichtbare Box. Um diese Box herum können Abstände geschaffen werden. padding ist der Abstand innerhalb der Box (zwischen Text und Rand). margin ist der Abstand außerhalb der Box (zu anderen Elementen). Stell dir ein Bild in einem Rahmen vor: padding ist die weiße Fläche im Rahmen, margin ist der Platz zur Wand.",
    check: {
      question: "Welcher Befehl schafft Platz zwischen zwei verschiedenen Boxen?",
      options: [
        { label: "margin", value: "margin" },
        { label: "padding", value: "padding" },
        { label: "color", value: "color" },
      ],
      answer: "margin",
      tip: "margin schafft Abstand nach außen.",
    },
    sandbox: {
      prompt: "Box-Abstände sichtbar machen.",
      help: "padding wirkt innen, margin außen.",
      defaultCss: `/* Level 4: Box-Abstände */
.box {
  padding: 10px;
  margin-top: 10px;
  border: 1px solid gray;
}
`,
      checklist: [
        "padding: 20px; auf .box",
        "margin-top: 40px; auf .box",
        "border: 5px solid red; setzen",
      ],
      finishText: "Wow! Die Seite sieht schon viel besser aus. Im nächsten Teil geht es darum, wie Boxen nebeneinander geschoben werden!",
    },
  },

  5: {
    title: "Level 5: Farben für Profis (Hex-Codes)",
    theory:
      "Bisher wurden Farben einfach beim Namen genannt, wie red oder blue. Aber es gibt Millionen von Farben! Profis nutzen dafür 'Hex-Codes'. Diese fangen immer mit einer Raute # an, gefolgt von sechs Zeichen (Zahlen oder Buchstaben), zum Beispiel #ff0000 für Rot. Ein Tipp: #ffffff ist Weiß und #000000 ist Schwarz. So lassen sich ganz exakte Farbtöne treffen.",
    check: {
      question: "Womit fängt ein Hex-Code in CSS immer an?",
      options: [
        { label: "#", value: "#" },
        { label: ".", value: "." },
        { label: ";", value: ";" },
      ],
      answer: "#",
      tip: "Hex-Codes starten immer mit einer Raute #",
    },
    sandbox: {
      prompt: "Hex-Codes nutzen: dunkles Grau, Gold und Blau.",
      help: "Vergiss die Raute # vor dem Code nicht, sonst weiß der Browser nicht, dass es eine Farbe sein soll.",
      defaultCss: `/* Level 5: Hex-Codes */
.hintergrund {
  background-color: #ffffff;
  padding: 12px;
}

.titel {
  color: #000000;
}

.knopf {
  color: #000000;
  background-color: #ffffff;
  border: none;
  padding: 10px 14px;
}
`,
      checklist: [
        "Setze .hintergrund background-color auf #333333",
        "Gib .titel die Farbe #ffd700",
        "Style .knopf: Text #ffffff und Hintergrund #0000ff",
      ],
    },
  },

  6: {
    title: "Level 6: Schriften anpassen (font-family)",
    theory:
      "Die Standardschriftart sieht oft langweilig aus. Mit font-family lässt sich das ändern. Es kann zum Beispiel zwischen Schriften mit kleinen Häkchen (serif) oder ohne Häkchen (sans-serif) gewählt werden. Bei einer ganz bestimmten Schriftart wird ihr Name aufgeschrieben, z. B. Arial. Es ist klug, immer eine Ersatzschrift anzugeben, falls der Computer des Nutzers die erste nicht kennt.",
    check: {
      question: "Welche Schriftart hat KEINE kleinen Häkchen an den Enden der Buchstaben?",
      options: [
        { label: "sans-serif", value: "sans-serif" },
        { label: "serif", value: "serif" },
        { label: "monospace", value: "monospace" },
      ],
      answer: "sans-serif",
      tip: "sans-serif hat keine kleinen Häkchen.",
    },
    sandbox: {
      prompt: "Schriftarten für body, h1 und .text-block setzen.",
      help: 'Wenn eine Schriftart Leerzeichen im Namen hat (wie Times New Roman), wird sie in Anführungszeichen gesetzt: "Times New Roman"!',
      defaultCss: `/* Level 6: font-family */
body {
  font-family: sans-serif;
}

h1 {
  font-family: sans-serif;
}

.text-block {
  font-family: sans-serif;
}
`,
      checklist: [
        "Setze im body font-family auf Arial",
        "Gib h1 eine Serif-Schrift (z. B. \"Times New Roman\")",
        "Setze .text-block auf Verdana mit Fallback sans-serif",
      ],
    },
  },

  7: {
    title: "Level 7: Rahmen und Abrundungen (border-radius)",
    theory:
      "Mit border lassen sich Rahmen erstellen. Aber die Ecken können auch abgerundet werden! Das geht mit border-radius. Mit einem kleinen Wert wie 5px werden die Ecken nur leicht rund. Mit einem großen Wert wie 50% lässt sich aus einer quadratischen Box sogar ein Kreis machen! Das sieht viel moderner aus als harte Kanten.",
    check: {
      question: "Mit welchem Befehl werden die Ecken einer Box rund?",
      options: [
        { label: "border-radius", value: "border-radius" },
        { label: "border-color", value: "border-color" },
        { label: "box-shadow", value: "box-shadow" },
      ],
      answer: "border-radius",
      tip: "Der Befehl heißt border-radius.",
    },
    sandbox: {
      prompt: "Rahmen und runde Ecken erstellen.",
      help: "Achte darauf, dass border-radius oft erst richtig gut aussieht, wenn die Box auch eine Hintergrundfarbe oder einen Rahmen hat.",
      defaultCss: `/* Level 7: Rahmen & Rundungen */
.karte {
  background-color: white;
}

.kreis {
  background-color: white;
}

img {
  width: 260px;
  height: auto;
}
`,
      checklist: [
        "Setze .karte border: 2px solid black und border-radius: 10px",
        "Mache .kreis rund: width/height 100px und border-radius: 50%",
        "Gib img border-radius: 4px",
      ],
    },
  },

  8: {
    title: "Level 8: Schatten und Effekte (box-shadow)",
    theory:
      "Um die Seite lebendiger zu machen, können Elementen Schatten gegeben werden. Das geht mit box-shadow. Der Browser braucht die Info, wie weit der Schatten nach rechts und nach unten gehen soll und welche Farbe er hat. Beispiel: box-shadow: 5px 5px 10px grey;. Die dritte Zahl (10px) sagt dabei, wie 'verschwommen' der Schatten sein soll. So wirken Boxen fast so, als würden sie über der Seite schweben.",
    check: {
      question: "Welche Zahl im Befehl box-shadow: 2px 2px 5px black; bestimmt, wie stark der Schatten weichgezeichnet (verschwommen) ist?",
      options: [
        { label: "Die dritte Zahl (5px)", value: "5px" },
        { label: "Die erste Zahl (2px)", value: "2px" },
        { label: "Die Farbe (black)", value: "black" },
      ],
      answer: "5px",
      tip: "Die dritte Zahl ist die Unschärfe (Blur).",
    },
    sandbox: {
      prompt: "Schatten erstellen: normal, glow, kombiniert.",
      help: "Schatten wirken am besten, wenn sie dezent sind. Probiere mal ein helles Grau statt tiefem Schwarz für den Schatten aus.",
      defaultCss: `/* Level 8: box-shadow */
.box {
  background-color: white;
  padding: 12px;
}

.glow {
  background-color: white;
  padding: 12px;
  margin-top: 12px;
}

.combo {
  background-color: white;
  padding: 12px;
  margin-top: 12px;
}
`,
      checklist: [
        "Gib .box box-shadow: 5px 5px 10px black",
        "Erstelle Glow auf .glow: box-shadow: 0px 0px 20px yellow",
        "Kombiniere bei .combo: Hintergrundfarbe, border-radius und dezenten Schatten",
      ],
    },
  },

  9: {
    title: "Level 9: Block oder Inline? (display)",
    theory:
      "Bisher landen Boxen immer untereinander, wie Bauklötze, die man stapelt. Das liegt daran, dass Tags wie <div> oder <h1> sogenannte 'Block-Elemente' sind – sie nehmen immer die ganze Breite ein. Es gibt aber auch 'Inline-Elemente', die sich wie Text verhalten und nebeneinander stehen bleiben. Mit dem Befehl display lässt sich das ändern und dem Browser sagen, wie er die Boxen behandeln soll.",
    check: {
      question: "Wie verhalten sich 'Block-Elemente' normalerweise auf der Seite?",
      options: [
        { label: "Sie nehmen die ganze Breite ein und stapeln sich untereinander", value: "stack" },
        { label: "Sie stehen immer nebeneinander wie Text", value: "inline" },
        { label: "Sie sind unsichtbar", value: "hidden" },
      ],
      answer: "stack",
      tip: "Block-Elemente nehmen die ganze Breite und stehen untereinander.",
    },
    sandbox: {
      prompt: "display ausprobieren: block, inline-block und feste Breite.",
      help: "inline-block ist eine tolle Mischung: Die Boxen stehen nebeneinander, aber die Größe lässt sich trotzdem noch bestimmen!",
      defaultCss: `/* Level 9: display */
.span-demo {
  margin-top: 12px;
}

.container {
  margin-top: 12px;
}

/* 1) span auf block setzen */

/* 2) Boxen nebeneinander: inline-block */

/* 3) Boxen gleich groß: width 100px */
`,
      checklist: [
        "Setze die drei span auf display: block;",
        "Setze die div-Boxen auf display: inline-block;",
        "Gib den Boxen width: 100px;",
      ],
    },
  },

  10: {
    title: "Level 10: Die Wunderwaffe – Flexbox starten",
    theory:
      "Sachen mit inline-block nebeneinander zu schieben, ist oft mühsam. Deshalb wurde 'Flexbox' erfunden. Dem Eltern-Element (der großen Kiste, in der alles drin ist) wird nur der Befehl display: flex; gegeben. Wie von Zauberhand springen alle Kinder-Elemente (die kleinen Boxen darin) sofort nebeneinander. Das ist heute der Standard für fast jede Webseite.",
    check: {
      question: "Welchen Befehl schreibst du in den Container, damit alle Boxen darin sofort nebeneinander stehen?",
      options: [
        { label: "display: flex;", value: "display: flex;" },
        { label: "display: block;", value: "display: block;" },
        { label: "position: absolute;", value: "position: absolute;" },
      ],
      answer: "display: flex;",
      tip: "Flexbox startest du mit display: flex; im Container.",
    },
    sandbox: {
      prompt: "Flexbox aktivieren und Platz schaffen.",
      help: "Achte darauf: Du schreibst display: flex; immer in die 'Mama-Box' (den Container), nicht in die einzelnen Kinder-Boxen!",
      defaultCss: `/* Level 10: Flexbox starten */
.container {
  height: 120px;
}

/* 1) display: flex; in .container */

/* 2) margin: 10px; für die Boxen */

/* 3) background-color für .container */
`,
      checklist: [
        "Aktiviere Flexbox in .container (display: flex;)",
        "Gib den Boxen margin: 10px;",
        "Gib .container eine Hintergrundfarbe",
      ],
    },
  },

  11: {
    title: "Level 11: Platz verteilen (justify-content)",
    theory:
      "Wenn deine Boxen nebeneinander stehen, kleben sie meistens links fest. Mit justify-content kannst du sie wie auf einer Perlenschnur verschieben. Mit center kommen sie in die Mitte, mit flex-end nach rechts. Besonders cool ist space-between: Dabei wird der freie Platz genau zwischen die Boxen geschoben, sodass sie den ganzen Platz ausnutzen.",
    check: {
      question: "Welcher Wert verteilt den Platz so, dass die Boxen ganz links und ganz rechts am Rand kleben und dazwischen Platz ist?",
      options: [
        { label: "space-between", value: "space-between" },
        { label: "center", value: "center" },
        { label: "flex-start", value: "flex-start" },
      ],
      answer: "space-between",
      tip: "space-between verteilt den Platz zwischen den Boxen.",
    },
    sandbox: {
      prompt: "justify-content ausprobieren: center, space-around, flex-end.",
      help: "Justify-Content funktioniert nur, wenn du vorher auch display: flex; eingeschaltet hast!",
      defaultCss: `/* Level 11: justify-content */
.container {
  display: flex;
  height: 120px;
  background-color: #eeeeee;
}
`,
      checklist: [
        "Setze justify-content: center;",
        "Setze justify-content: space-around;",
        "Setze justify-content: flex-end;",
      ],
    },
  },

  12: {
    title: "Level 12: Die Höhe bändigen (align-items)",
    theory:
      "Du kannst Boxen nicht nur von links nach rechts schieben, sondern auch von oben nach unten. Das geht mit align-items. Wenn dein Container sehr hoch ist, kannst du mit align-items: center; dafür sorgen, dass die Boxen genau in der vertikalen Mitte schweben. Das war früher im Webdesign extrem schwer – mit Flexbox ist es nur eine Zeile Code.",
    check: {
      question: "Mit welchem Befehl zentrierst du Elemente von oben nach unten (vertikal)?",
      options: [
        { label: "align-items: center;", value: "align-items: center;" },
        { label: "justify-content: center;", value: "justify-content: center;" },
        { label: "display: block;", value: "display: block;" },
      ],
      answer: "align-items: center;",
      tip: "Vertikal zentrierst du mit align-items: center;",
    },
    sandbox: {
      prompt: "align-items und justify-content kombinieren.",
      help: "Das ist die absolute Profi-Kombination: Mit display: flex;, justify-content: center; und align-items: center; bekommst du alles auf der Welt genau in die Mitte.",
      defaultCss: `/* Level 12: align-items */
.container {
  display: flex;
  height: 300px;
  background-color: #eeeeee;
}
`,
      checklist: [
        "Zentriere die Boxen vertikal: align-items: center;",
        "Setze zusätzlich justify-content: center;",
        "Setze align-items: flex-end;",
      ],
    },
  },

  13: {
    title: "Level 13: Starre vs. Flexible Größen (px vs. %)",
    theory:
      "Bisher haben wir Größen oft in Pixeln (px) angegeben. Pixel sind aber 'starr'. Eine Box mit 500px Breite ist auf einem kleinen Handy-Bildschirm viel zu breit. Flexibler sind Prozentangaben (%). Wenn du einer Box width: 50% gibst, nimmt sie immer genau die Hälfte des verfügbaren Platzes ein – egal wie groß der Bildschirm ist. Das ist der erste Schritt zum 'Responsive Design' (anpassungsfähiges Design).",
    check: {
      question: "Welche Einheit solltest du nutzen, damit eine Box immer die gesamte Breite des Bildschirms ausfüllt?",
      options: [
        { label: "100%", value: "100%" },
        { label: "100px", value: "100px" },
        { label: "10em", value: "10em" },
      ],
      answer: "100%",
      tip: "Wenn etwas immer die ganze Breite haben soll, nimm 100%.",
    },
    sandbox: {
      prompt: "Mach Größen flexibel mit % und begrenze mit max-width.",
      help: "max-width ist wie eine Stopp-Marke: Die Box darf schrumpfen, aber niemals breiter werden als dieser Wert.",
      defaultCss: `/* Level 13: px vs. % */
/* Basis, damit du direkt etwas siehst */
.layout-container {
  border: 2px dashed #9ca3af;
  padding: 12px;
}

.bild-box {
  width: 400px;
  padding: 14px;
  border-radius: 10px;
  background-color: #bfdbfe;
  font-weight: 700;
}

.spalten {
  margin-top: 12px;
}

.spalte {
  width: 100%;
  display: inline-block;
  padding: 12px;
  border-radius: 10px;
  background-color: #bbf7d0;
}
`,
      checklist: [
        "Ändere .bild-box von 400px auf width: 100%;",
        "Gib .spalte width: 50%;",
        "Setze max-width: 800px; für .layout-container",
      ],
    },
    reward: "Belohnung: Responsive Rookie",
  },

  14: {
    title: "Level 14: Die Zauberformel – Media Queries",
    theory:
      "Media Queries sind wie Weichen bei der Bahn. Du kannst dem Browser sagen: 'Wenn der Bildschirm schmaler als 600 Pixel ist (wie bei einem Handy), dann nutze diese anderen CSS-Regeln'. Das schreibt man so: @media (max-width: 600px) { ... }. Alles, was in den geschweiften Klammern steht, gilt dann nur für kleine Bildschirme. So kannst du zum Beispiel die Schrift auf dem Handy größer machen oder Farben ändern.",
    check: {
      question: "Ab welcher Bildschirmbreite greifen die Regeln, wenn du @media (max-width: 480px) schreibst?",
      options: [
        { label: "Ab 480 Pixeln und darunter", value: "480" },
        { label: "Ab 480 Pixeln und darüber", value: ">480" },
        { label: "Erst ab 1200 Pixeln", value: "1200" },
      ],
      answer: "480",
      tip: "max-width bedeutet: bis zu dieser Breite (inklusive).",
    },
    sandbox: {
      prompt: "Schreibe eine Media Query und ändere darin Hintergrund und Schriftgröße.",
      help: "Vergiss nicht: In der Media-Query brauchst du eine Klammer für @media und eine zweite, die alle Regeln umschließt.",
      defaultCss: `/* Level 14: Media Queries */
body {
  background-color: white;
}

h1 {
  font-size: 42px;
}

/* 1) @media (max-width: 600px) { ... } */
/* 2) darin: body background-color: lightblue; */
/* 3) darin: h1 font-size: 24px; */
`,
      checklist: [
        "Erstelle eine Media Query mit max-width: 600px",
        "Setze in der Media Query body background-color: lightblue;",
        "Setze in der Media Query h1 font-size: 24px;",
      ],
    },
    reward: "Belohnung: Media-Query Magier",
  },

  15: {
    title: "Level 15: Platzmangel – Flex-Wrap",
    theory:
      "Du weißt schon, dass display: flex; alle Boxen nebeneinander schiebt. Auf einem schmalen Handy wird das aber oft zu eng. Mit dem Befehl flex-wrap: wrap; erlaubst du den Boxen, in die nächste Zeile zu rutschen, wenn der Platz nicht mehr reicht. Das ist perfekt für Bildergalerien oder Menüs, die sich automatisch anpassen sollen.",
    check: {
      question: "Was passiert standardmäßig mit Flex-Boxen, wenn sie zu breit für den Bildschirm sind und man KEIN 'wrap' nutzt?",
      options: [
        { label: "Sie werden zusammengequetscht oder ragen aus dem Bildschirm heraus", value: "quetsch" },
        { label: "Sie ordnen sich automatisch in neue Zeilen", value: "auto" },
        { label: "Sie verschwinden", value: "weg" },
      ],
      answer: "quetsch",
      tip: "Ohne wrap versucht Flex alles in einer Zeile zu lassen.",
    },
    sandbox: {
      prompt: "Mach eine Galerie, die umbricht und in der Mitte steht.",
      help: "Stell dir flex-wrap wie Text vor: Wenn die Zeile voll ist, geht es unten weiter.",
      defaultCss: `/* Level 15: flex-wrap */
.galerie {
  border: 2px dashed #9ca3af;
  padding: 12px;
}

.galerie-item {
  height: 80px;
  border-radius: 10px;
  background-color: #fecaca;
  display: grid;
  place-items: center;
  font-weight: 800;
}

/* 1) .galerie: display: flex; + flex-wrap: wrap; */
/* 2) .galerie: justify-content: center; */
/* 3) .galerie-item: width: 200px; */
`,
      checklist: [
        "Aktiviere Flexbox in .galerie und setze flex-wrap: wrap;",
        "Setze justify-content: center;",
        "Gib .galerie-item width: 200px;",
      ],
    },
    reward: "Belohnung: Wrap-Wizard",
  },

  16: {
    title: "Level 16: Mobile First – Elemente verstecken",
    theory:
      "Manchmal ist weniger mehr. Auf einem Handy ist oft kein Platz für große Seitenleisten oder riesige Werbebanner. Mit dem Befehl display: none; kannst du Elemente komplett verschwinden lassen. Profis nutzen das in Media-Queries, um unwichtige Dinge auf dem Handy auszublenden und nur das Wichtigste anzuzeigen. Das nennt man oft 'Mobile First' – man denkt zuerst an das Handy-Erlebnis.",
    check: {
      question: "Welchen Befehl nutzt du, um ein Element auf der Seite komplett unsichtbar zu machen, sodass es auch keinen Platz mehr wegnimmt?",
      options: [
        { label: "display: none;", value: "display: none;" },
        { label: "opacity: 0;", value: "opacity: 0;" },
        { label: "visibility: hidden;", value: "visibility: hidden;" },
      ],
      answer: "display: none;",
      tip: "display: none; nimmt auch den Platz weg.",
    },
    sandbox: {
      prompt: "Verstecke auf dem Handy die Seitenleiste und zeige den Menü-Button.",
      help: "display: none; ist radikal: Das Element ist für den Browser so, als wäre es gar nicht da.",
      defaultCss: `/* Level 16: Mobile First */
.mobile-layout {
  border: 2px dashed #9ca3af;
  padding: 12px;
  border-radius: 12px;
}

.menue-knopf {
  display: none; /* der Button ist am Anfang versteckt */
  border: 1px solid #334155;
  background: #0f172a;
  color: white;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 800;
}

.seitenleiste {
  margin-top: 12px;
  padding: 12px;
  border-radius: 10px;
  background-color: #fde68a;
  font-weight: 700;
}

.inhalt {
  margin-top: 12px;
  padding: 12px;
  border-radius: 10px;
  background-color: #bbf7d0;
}

/* 1) @media (max-width: 500px) { ... } */
/* 2) darin: .seitenleiste { display: none; } */
/* 3) darin: .menue-knopf { display: block; } */
`,
      checklist: [
        "Erstelle eine Media Query bis 500px",
        "Verstecke .seitenleiste in der Media Query",
        "Zeige .menue-knopf in der Media Query (display: block;)",
      ],
    },
    reward: "Belohnung: Mobile-First Profi",
  },
};

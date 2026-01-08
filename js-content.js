export const JS_LEVELS = {
	1: {
		title: "Level 1: Das Gehirn der Website",
		theory:
			"HTML war das Skelett, CSS die Kleidung – und JavaScript ist jetzt das Gehirn. Mit JavaScript kannst du deiner Seite Befehle geben. Der einfachste Befehl ist alert(). Damit öffnest du ein kleines Nachrichtenfenster im Browser. Ein weiterer wichtiger Helfer ist console.log(). Damit schreibst du Nachrichten in eine Art 'geheimes Tagebuch' des Browsers (die Konsole), um zu prüfen, ob dein Code funktioniert.",
		check: {
			question: "Welchen Befehl nutzt man, um ein aufploppendes Nachrichtenfenster anzuzeigen?",
			options: [
				{ label: "alert()", value: "alert" },
				{ label: "console.log()", value: "log" },
				{ label: "print()", value: "print" },
			],
			answer: "alert",
			tip: "alert() öffnet ein Nachrichtenfenster.",
		},
		sandbox: {
			prompt: "Nutze alert und console.log.",
			help:
				"Vergiss die runden Klammern () und die Anführungszeichen \" \" bei Texten nicht. Am Ende jeder Zeile setzt man in JavaScript meistens ein Semikolon ;.",
			defaultCode: `// Level 1: Probier es aus\n\n`,
			checklist: [
				"Schreibe: alert(\"Hallo!\");",
				"Nutze: console.log(\"Test läuft\");",
				"Schreibe zwei verschiedene console.log Nachrichten",
			],
		},
	},
	2: {
		title: "Level 2: Variablen – Kisten für Informationen",
		theory:
			"Oft musst du dir Informationen merken, um sie später wieder zu benutzen. Dafür gibt es 'Variablen'. Stell sie dir wie Kisten vor, auf denen ein Name steht. Mit dem Wort let erstellst du so eine Kiste. Beispiel: let name = \"Max\";. Jetzt weiß der Computer: In der Kiste mit dem Namen 'name' liegt der Text 'Max'. Du kannst den Inhalt der Kiste später jederzeit ändern.",
		check: {
			question: "Mit welchem Wort erstellt man in modernem JavaScript eine Variable (eine Kiste)?",
			options: [
				{ label: "let", value: "let" },
				{ label: "var", value: "var" },
				{ label: "make", value: "make" },
			],
			answer: "let",
			tip: "Mit let erstellst du eine Variable.",
		},
		sandbox: {
			prompt: "Erstelle und ändere eine Variable.",
			help:
				"Beim console.log(stadt) brauchst du keine Anführungszeichen, weil du den Namen der Kiste meinst, nicht das Wort 'stadt' selbst!",
			defaultCode: `// Level 2: Variablen\n\n`,
			checklist: [
				"Erstelle let stadt mit deiner Lieblingsstadt",
				"Gib stadt mit console.log(stadt) aus",
				"Ändere stadt und gib sie erneut aus",
			],
		},
	},
	3: {
		title: "Level 3: Datentypen – Text oder Zahl?",
		theory:
			"JavaScript muss wissen, was in der Kiste liegt. Es gibt zwei wichtige Typen: Texte (Strings) und Zahlen (Numbers). Texte müssen immer in Anführungszeichen stehen: \"Das ist ein Text\". Zahlen schreibt man einfach so: 25. Das ist wichtig, denn mit Zahlen kann der Computer rechnen, mit Texten nicht. Für den Computer ist \"5\" ein Buchstabe, aber 5 ist eine echte Zahl.",
		check: {
			question: "Was ist der Unterschied zwischen 10 und \"10\" in JavaScript?",
			options: [
				{ label: "10 ist eine Zahl, \"10\" ist Text", value: "type" },
				{ label: "Beides ist eine Zahl", value: "same" },
				{ label: "Beides ist Text", value: "text" },
			],
			answer: "type",
			tip: "Mit Anführungszeichen ist es Text (String).",
		},
		sandbox: {
			prompt: "Lege Zahl und Text in Variablen ab.",
			help:
				"Wenn du eine Zahl in Anführungszeichen setzt, kann JavaScript nicht mehr damit rechnen. Achte also gut darauf!",
			defaultCode: `// Level 3: Datentypen\n\n`,
			checklist: [
				"Erstelle let alter als Zahl (ohne Anführungszeichen)",
				"Erstelle let hobby als Text (mit Anführungszeichen)",
				"Gib beide Variablen mit console.log aus",
			],
		},
	},
	4: {
		title: "Level 4: Rechnen mit JavaScript",
		theory:
			"Dein Computer ist eigentlich ein riesiger Taschenrechner. Du kannst JavaScript nutzen, um Plus (+), Minus (-), Mal (*) oder Geteilt (/) zu rechnen. Du kannst sogar mit Variablen rechnen! Wenn du let gesamt = zahl1 + zahl2; schreibst, nimmt JavaScript die Inhalte aus den beiden Kisten und legt das Ergebnis in eine neue Kiste.",
		check: {
			question: "Welches Zeichen nutzt man in JavaScript für die Multiplikation (Malnehmen)?",
			options: [
				{ label: "*", value: "*" },
				{ label: "x", value: "x" },
				{ label: "%", value: "%" },
			],
			answer: "*",
			tip: "In JavaScript ist Malnehmen: *",
		},
		sandbox: {
			prompt: "Rechne mit Variablen.",
			help:
				"Du kannst auch direkt rechnen, zum Beispiel: console.log(10 * 5);. Probier es mal aus!",
			defaultCode: `// Level 4: Rechnen\n\n`,
			checklist: [
				"Erstelle let a und let b mit Zahlen",
				"Erstelle let ergebnis = a + b",
				"Gib ergebnis aus und probiere Minus (-) aus",
			],
		},
	},
	5: {
		title: "Level 5: Wahr oder Falsch? (Booleans & Vergleiche)",
		theory:
			"Computer kennen oft nur zwei Zustände: Ja oder Nein. In der Programmierung nennen wir das true (wahr) und false (falsch). Um das zu prüfen, nutzt man Vergleichszeichen. Mit > prüfst du, ob etwas größer ist, und mit === (drei Gleichheitszeichen), ob zwei Dinge exakt gleich sind. Das Ergebnis so eines Vergleichs ist immer eine 'Wahr/Falsch-Aussage' (ein Boolean).",
		check: {
			question: "Welches Zeichen nutzt man in JavaScript, um zu prüfen, ob zwei Werte exakt gleich sind?",
			options: [
				{ label: "==", value: "==" },
				{ label: "===", value: "===" },
				{ label: "=", value: "=" },
			],
			answer: "===",
			tip: "Exakt gleich prüfst du mit drei Gleichheitszeichen: ===",
		},
		sandbox: {
			prompt: "Booleans und Vergleiche üben.",
			help: "Vergleiche sind wie Fragen an den Computer. Er antwortet dir immer mit true oder false.",
			defaultCode: `// Level 5: Wahr oder Falsch?
// Vergleiche mit true/false testen

// Aufgabe 1: Erstelle eine Variable check und speichere darin das Ergebnis von 10 > 5.
let check = false; // <-- ersetze false durch den Vergleich 10 > 5

// Aufgabe 2: Gib check in der Konsole aus.
// console.log(check);

// Aufgabe 3: Vergleiche "Apfel" und "Birne" (exakt gleich?) und gib das Ergebnis aus.
let wortCheck = false; // <-- ersetze false durch einen Vergleich mit ===
// console.log(wortCheck);
`,
			checklist: [
				"Erstelle check = 10 > 5",
				"Nutze console.log(check)",
				"Vergleiche \"Apfel\" === \"Birne\" und gib es aus",
			],
		},
	},
	6: {
		title: "Level 6: Wenn-Dann-Entscheidungen (If-Statements)",
		theory:
			"Jetzt wird es spannend! Mit einer if-Abfrage (Wenn-Abfrage) kann dein Programm Entscheidungen treffen. Das Prinzip ist einfach: Wenn etwas wahr ist, dann führe den Code in den geschweiften Klammern { } aus. Wenn es nicht wahr ist, ignoriert der Computer den Teil einfach. Beispiel: if (alter > 18) { alert(\"Volljährig!\"); }.",
		check: {
			question:
				"Welche Klammern umschließen den Code, der ausgeführt werden soll, wenn die if-Bedingung wahr ist?",
			options: [
				{ label: "Runde Klammern ( )", value: "()" },
				{ label: "Eckige Klammern [ ]", value: "[]" },
				{ label: "Geschweifte Klammern { }", value: "{}" },
			],
			answer: "{}",
			tip: "Der Code-Block steht in geschweiften Klammern: { }",
		},
		sandbox: {
			prompt: "If-Abfrage schreiben.",
			help: "Achte darauf, dass die Bedingung (die Prüfung) immer in runden Klammern ( ) stehen muss!",
			defaultCode: `// Level 6: If-Statements

// Aufgabe 1: Erstelle eine Variable punkte = 100;
let punkte = 0; // <-- ändere auf 100

// Aufgabe 2 + 3: Prüfe, ob punkte genau 100 ist.
// Wenn es stimmt, soll ein alert(\"Gewonnen!\") erscheinen.

// if (punkte === 100) {
//   alert("Gewonnen!");
// }
`,
			checklist: [
				"Erstelle punkte = 100",
				"Schreibe eine if-Abfrage (punkte === 100)",
				"Zeige alert(\"Gewonnen!\") im if-Block",
			],
		},
	},
	7: {
		title: "Level 7: Was ist mit dem Rest? (Else-Zweig)",
		theory:
			"Oft willst du nicht nur sagen, was bei 'Wahr' passieren soll, sondern auch, was im anderen Fall passiert. Dafür gibt es else (Ansonsten). Wenn die if-Bedingung nicht zutrifft, springt der Computer automatisch in den else-Teil. So kannst du zum Beispiel sagen: Wenn die Antwort richtig ist, gib Punkte – ansonsten zeige eine Fehlermeldung.",
		check: {
			question: "Welches Wort nutzt man, um Code auszuführen, wenn die if-Bedingung FALSCH ist?",
			options: [
				{ label: "else", value: "else" },
				{ label: "maybe", value: "maybe" },
				{ label: "other", value: "other" },
			],
			answer: "else",
			tip: "Der Gegen-Teil heißt else.",
		},
		sandbox: {
			prompt: "If/Else mit Passwort.",
			help:
				"Der else-Teil braucht keine eigene Prüfung in Klammern. Er ist einfach der Auffangkorb für alles, was nicht in das if gepasst hat.",
			defaultCode: `// Level 7: Else-Zweig

// Aufgabe 1: Erstelle eine Variable passwort mit einem Text deiner Wahl.
let passwort = ""; // <-- setze hier ein Passwort

// Aufgabe 2 + 3:
// Prüfe, ob das Passwort genau "geheim123" ist.
// Wenn nicht, schreibe "Zugriff verweigert" in die Konsole.

// if (passwort === "geheim123") {
//   console.log("Zugriff erlaubt");
// } else {
//   console.log("Zugriff verweigert");
// }
`,
			checklist: [
				"Erstelle passwort als Text",
				"Prüfe: passwort === \"geheim123\"",
				"Nutze else mit console.log(\"Zugriff verweigert\")",
			],
		},
	},
	8: {
		title: "Level 8: Deine eigenen Befehle (Funktionen)",
		theory:
			"Bisher haben wir Code einfach untereinander geschrieben. Wenn du aber eine Aufgabe öfter erledigen willst, kannst du sie in einer 'Funktion' speichern. Eine Funktion ist wie ein Rezept, das du einmal aufschreibst und dann immer wieder aufrufen kannst. Mit function name() { ... } erstellst du sie, und mit name(); führst du sie aus. Das spart Zeit und macht deinen Code übersichtlicher.",
		check: {
			question: "Wie nennt man es, wenn man eine Funktion startet?",
			options: [
				{ label: "Funktionsaufruf (Aufrufen)", value: "call" },
				{ label: "Funktionspause", value: "pause" },
				{ label: "Funktionsfehler", value: "error" },
			],
			answer: "call",
			tip: "Man sagt: Funktionsaufruf (du rufst die Funktion auf).",
		},
		sandbox: {
			prompt: "Eine Funktion erstellen und aufrufen.",
			help:
				"Eine Funktion ist wie eine Maschine: Sie steht erst mal nur da. Erst wenn du den Start-Knopf drückst (die Funktion aufrufst), passiert etwas!",
			defaultCode: `// Level 8: Funktionen

// Aufgabe 1: Erstelle eine Funktion mit dem Namen begruessung.
function begruessung() {
  // Aufgabe 2: Schreibe hier ein console.log("Hallo, schön dich zu sehen!");
}

// Aufgabe 3: Rufe die Funktion am Ende deines Codes auf.
// begruessung();
`,
			checklist: [
				"Erstelle function begruessung()",
				"Schreibe console.log(\"Hallo, schön dich zu sehen!\") in die Funktion",
				"Rufe begruessung() am Ende auf",
			],
		},
	},
	9: {
		title: "Level 9: Die Brücke bauen (Elemente finden)",
		theory:
			"Damit JavaScript etwas auf deiner Seite ändern kann, muss es das Element zuerst finden. Das ist so, als würdest du im Supermarkt nach einem bestimmten Produkt suchen. Am einfachsten geht das mit der ID, die wir in HTML gelernt haben. Der Befehl dazu heißt: document.getElementById(\"deine-id\"). Diesen 'Fund' speichern wir meistens in einer Variable, um später damit zu arbeiten.",
		check: {
			question: "Welchen Befehl nutzt man, um ein Element anhand seiner ID in JavaScript zu finden?",
			options: [
				{ label: "document.getElementById()", value: "getElementById" },
				{ label: "document.querySelectorAll()", value: "queryAll" },
				{ label: "window.find()", value: "find" },
			],
			answer: "getElementById",
			tip: "Mit document.getElementById(\"id\") findest du ein Element per ID.",
		},
		sandbox: {
			prompt: "Elemente per ID finden.",
			help:
				"Achte genau auf die Groß- und Kleinschreibung bei getElementById. Das 'I' und das 'D' müssen groß sein!",
			defaultCode: `// Level 9: Elemente finden
// Elemente per ID auf der Seite finden

// Aufgabe 1: Überschrift mit der ID "titel" finden
let meinTitel = null;
// meinTitel = document.getElementById("titel");

// Aufgabe 2: Element mit der ID "box" finden
let meineBox = null;
// meineBox = document.getElementById("box");

// Aufgabe 3: Prüfen, ob es klappt
// console.log(meinTitel);
`,
			checklist: [
				"Suche #titel und speichere es in meinTitel",
				"Suche #box und speichere es in meineBox",
				"Nutze console.log(meinTitel)",
			],
		},
	},
	10: {
		title: "Level 10: Inhalte verändern (Text & HTML)",
		theory:
			"Wenn du ein Element gefunden hast, kannst du seinen Inhalt verändern. Mit dem Befehl .innerText kannst du den Text einer Überschrift oder eines Absatzes einfach austauschen. Beispiel: meinTitel.innerText = \"Neue Überschrift\";. So kannst du Nachrichten auf deiner Seite anzeigen lassen, ohne die HTML-Datei zu ändern.",
		check: {
			question: "Mit welcher Eigenschaft änderst du nur den geschriebenen Text innerhalb eines Elements?",
			options: [
				{ label: ".innerText", value: "innerText" },
				{ label: ".innerHTML", value: "innerHTML" },
				{ label: ".value", value: "value" },
			],
			answer: "innerText",
			tip: "Nur den Text änderst du mit .innerText.",
		},
		sandbox: {
			prompt: "Text in Elementen ändern.",
			help:
				"Vergiss nicht, dass der neue Text in Anführungszeichen \" \" stehen muss, da es ein String (Text) ist.",
			defaultCode: `// Level 10: Text ändern
// Texte mit .innerText austauschen

// Aufgabe 1: Suche #nachricht
let nachricht = null;
// nachricht = document.getElementById("nachricht");

// Aufgabe 2: Setze den Text auf: "Du hast es gefunden!"
// nachricht.innerText = "Du hast es gefunden!";

// Aufgabe 3: Ändere auch #status auf: "System bereit"
let status = null;
// status = document.getElementById("status");
// status.innerText = "System bereit";
`,
			checklist: [
				"Suche #nachricht und speichere es",
				"Setze nachricht.innerText auf 'Du hast es gefunden!'",
				"Setze status.innerText auf 'System bereit'",
			],
		},
	},
	11: {
		title: "Level 11: Auf Klicks reagieren (Event Listener)",
		theory:
			"Jetzt wird es richtig interaktiv! Wir bringen dem Browser bei, auf den Nutzer zu hören. Das geht mit einem 'Event Listener' (Ereignis-Zuhörer). Mit dem Befehl addEventListener(\"click\", ...) sagst du einem Element: 'Warte darauf, dass dich jemand anklickt, und dann starte eine Funktion'. Das ist die Basis für jeden Button im Internet.",
		check: {
			question:
				"Wie heißt die Funktion, die darauf 'wartet', dass ein Nutzer eine Aktion (wie einen Klick) ausführt?",
			options: [
				{ label: "addEventListener", value: "addEventListener" },
				{ label: "addClick", value: "addClick" },
				{ label: "waitForClick", value: "waitForClick" },
			],
			answer: "addEventListener",
			tip: "Du nutzt addEventListener(\"click\", function() { ... }).",
		},
		sandbox: {
			prompt: "Klick-Event bauen.",
			help:
				"Das Wort 'click' muss in Anführungszeichen stehen. Die Funktion, die danach kommt, braucht wieder geschweifte Klammern { }.",
			defaultCode: `// Level 11: Event Listener
// Auf Klicks vom Nutzer reagieren

// Aufgabe 1: Button #klick-mich finden
let meinKnopf = null;
// meinKnopf = document.getElementById("klick-mich");

// Aufgabe 2 + 3: Event Listener hinzufügen
// Wenn geklickt wird: alert("Button wurde geklickt!");

// meinKnopf.addEventListener("click", function () {
//   alert("Button wurde geklickt!");
// });
`,
			checklist: [
				"Suche den Button #klick-mich",
				"Füge addEventListener(\"click\", ...) hinzu",
				"Zeige alert(\"Button wurde geklickt!\") im Handler",
			],
		},
	},
	12: {
		title: "Level 12: Das Finale (Interaktive Website)",
		theory:
			"Herzlichen Glückwunsch zum letzten Level! Jetzt verbinden wir alles: Wir suchen ein Element, warten auf einen Klick und verändern dann die Seite. Du kannst zum Beispiel mit JavaScript auch das CSS verändern. Mit .style.backgroundColor = \"blue\" änderst du die Farbe einer Box, sobald der Nutzer darauf klickt. Du hast nun alle Werkzeuge, um eine eigene kleine App zu bauen!",
		check: {
			question: "Welche drei Sprachen hast du nun kombiniert, um diese Interaktion zu ermöglichen?",
			options: [
				{ label: "HTML, CSS und JavaScript", value: "all" },
				{ label: "PHP, SQL und JavaScript", value: "backend" },
				{ label: "CSS, Word und Excel", value: "office" },
			],
			answer: "all",
			tip: "Es sind genau: HTML, CSS und JavaScript.",
		},
		sandbox: {
			prompt: "Finale: Button klickt, Box wird rot.",
			help:
				"Du schaffst das! Denke an die Punkte zwischen den Befehlen: box.style.backgroundColor.",
			defaultCode: `// Level 12: Finale
// Alle Techniken zusammenführen

// Aufgabe 1: Suche den Button (#farbe-button) und die Box (#quadrat).
let farbeButton = null;
let quadrat = null;

// farbeButton = document.getElementById("farbe-button");
// quadrat = document.getElementById("quadrat");

// Aufgabe 2 + 3:
// Wenn auf den Button geklickt wird, soll sich die Box rot färben.

// farbeButton.addEventListener("click", function () {
//   quadrat.style.backgroundColor = "red";
// });
`,
			checklist: [
				"Suche #farbe-button und #quadrat",
				"Erstelle einen click-Event-Listener",
				"Setze quadrat.style.backgroundColor auf 'red'",
			],
		},
	},
};

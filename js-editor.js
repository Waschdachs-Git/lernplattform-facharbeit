import { JS_LEVELS } from "./js-content.js";

// Speicher-Schlüssel für den JavaScript-Fortschritt im Browser
const JS_STATE_KEY = "cyj:js_state";

// Alle wichtigen HTML-Elemente aus dem Dokument holen
const jsPanel = document.getElementById("js-level-panel");
const jsLevelTitle = document.getElementById("js-level-title");
const jsLevelDesc = document.getElementById("js-level-desc");
const jsTheoryText = document.getElementById("js-theory-text");
const jsTheoryBtn = document.getElementById("js-theory-done");
const jsCheckBody = document.getElementById("js-check-body");
const jsCheckBtn = document.getElementById("js-check-submit");
const jsCheckFeedback = document.getElementById("js-check-feedback");
const jsSandboxHint = document.getElementById("js-sandbox-hint");
const jsChecklist = document.getElementById("js-sandbox-checklist");
const jsEditor = document.getElementById("js-sandbox-editor");
const jsRunBtn = document.getElementById("js-sandbox-run");
const jsCheckSandboxBtn = document.getElementById("js-sandbox-check");
const jsPreview = document.getElementById("js-sandbox-preview");
const jsConsole = document.getElementById("js-console");
const jsFeedback = document.getElementById("js-sandbox-feedback");
const jsPhaseBadges = document.getElementById("js-phase-badges");
const jsTheoryCard = document.getElementById("js-phase-theory");
const jsCheckCard = document.getElementById("js-phase-check");
const jsSandboxCard = document.getElementById("js-phase-sandbox");
const jsOverview = document.getElementById("js-level-overview");

// Aktueller Lernstand (wird aus localStorage geladen)
let jsState = buildDefaultJsState();
// Callback-Funktion, die bei Fortschritt aufgerufen wird
let onJsProgress = () => {};
let onSandboxComplete = () => {};

// Token-System für die Vorschau (verhindert alte Nachrichten)
const previewRunToken = {};
let messageBridgeBound = false;

// Erstellt das HTML-Grundgerüst für die Vorschau je nach Level
// Jedes Level bekommt eigene Elemente mit IDs zum Testen
function getPreviewMarkup(levelKey) {
	const key = Number(levelKey);

	if (key === 9) {
		return `
			<h2 id="titel">Beispiel-Titel</h2>
			<div id="box" style="padding: 12px; border: 2px solid currentColor; border-radius: 10px;">Das ist die Box</div>
		`;
	}

	if (key === 10) {
		return `
			<p id="nachricht">(Hier steht gleich deine Nachricht)</p>
			<p id="status">Status: unbekannt</p>
		`;
	}

	if (key === 11) {
		return `
			<button id="klick-mich" style="padding: 10px 14px;">Klick mich</button>
			<p style="margin-top: 10px;">Tipp: Öffne die Konsole links, um Ausgaben zu sehen.</p>
		`;
	}

	if (key === 12) {
		return `
			<button id="farbe-button" style="padding: 10px 14px;">Box rot machen</button>
			<div id="quadrat" style="width: 110px; height: 110px; border: 2px solid currentColor; border-radius: 10px; margin-top: 12px;"></div>
		`;
	}

	return `
		<p>Hier ist eine kleine Vorschau-Fläche.</p>
		<p>In den Levels 9–12 findest du hier Buttons und Elemente mit IDs.</p>
	`;
}

// Baut das komplette HTML-Dokument für die iframe-Vorschau
// Bindet den Code ein und fängt console.log/alert ab
function buildPreviewSrcdoc(levelKey, code, token) {
	const safeCode = String(code || "").replace(/<\s*\/\s*script\s*>/gi, "<\\/script>");
	const markup = getPreviewMarkup(levelKey);

	return `<!doctype html>
<html lang="de">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<style>
		:root { color-scheme: light; }
		body { margin: 0; padding: 14px; background: #fff; color: #111; }
		* { box-sizing: border-box; }
	</style>
</head>
<body>
	${markup}

	<script>
		(function () {
			var token = ${JSON.stringify(String(token))};
			function post(text) {
				parent.postMessage({ type: "js-console", token: token, text: String(text) }, "*");
			}

			var originalLog = console.log;
			console.log = function () {
				try {
					var args = Array.prototype.slice.call(arguments);
					post(args.map(String).join(" "));
				} catch (e) {
					post("Fehler: console.log konnte nicht gelesen werden.");
				}
				return originalLog.apply(console, arguments);
			};

			window.alert = function (msg) {
				post("[alert] " + String(msg));
			};

			window.addEventListener("error", function (e) {
				post("Fehler: " + (e && e.message ? e.message : "Unbekannter Fehler"));
			});

			document.addEventListener("DOMContentLoaded", function () {
				try {
					${safeCode}
				} catch (err) {
					post("Fehler: " + (err && err.message ? err.message : String(err)));
				}
			});
		})();
	</script>
</body>
</html>`;
}

// Aktualisiert die Vorschau mit neuem Code
// Erzeugt ein Token, damit nur passende Konsolen-Nachrichten ankommen
function renderPreview(levelKey, code) {
	if (!jsPreview) return;
	const token = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
	previewRunToken[String(levelKey)] = token;
	jsPreview.srcdoc = buildPreviewSrcdoc(levelKey, code, token);
}

// Erstellt einen frischen Lernstand für alle JS-Level
// Nutzt den Standard-Code aus js-content.js
function buildDefaultJsState() {
	const levels = {};
	Object.keys(JS_LEVELS).forEach((key) => {
		levels[key] = {
			theoryDone: false,
			checkDone: false,
			sandboxDone: false,
			tasksDone: [false, false, false],
			codeValue: JS_LEVELS[key].sandbox.defaultCode,
			previewCode: JS_LEVELS[key].sandbox.defaultCode,
			consoleLines: [],
		};
	});
	return { activeLevel: 1, levels };
}

// Lädt den gespeicherten Lernstand aus dem Browser (localStorage)
// Falls nichts gespeichert ist, wird der Default-Stand genutzt
function loadJsState() {
	try {
		const stored = JSON.parse(localStorage.getItem(JS_STATE_KEY) || "null");
		const levels = {};
		Object.keys(JS_LEVELS).forEach((key) => {
			levels[key] = {
				...jsState.levels[key],
				...(stored?.levels?.[key] || {}),
				tasksDone: stored?.levels?.[key]?.tasksDone || jsState.levels[key]?.tasksDone || [false, false, false],
				codeValue: stored?.levels?.[key]?.codeValue ?? jsState.levels[key].codeValue,
				previewCode: stored?.levels?.[key]?.previewCode ?? jsState.levels[key].previewCode,
				consoleLines: stored?.levels?.[key]?.consoleLines || [],
			};
		});
		jsState = { ...jsState, ...(stored || {}), levels };
	} catch {
		jsState = buildDefaultJsState();
	}
	return jsState;
}

// Speichert den aktuellen Lernstand im Browser
// So bleibt der Fortschritt auch nach dem Schließen erhalten
function saveJsState() {
	localStorage.setItem(JS_STATE_KEY, JSON.stringify(jsState));
}

export function hydrateJsState() {
	return loadJsState();
}

export function getJsState() {
	return jsState;
}

export function setJsActiveLevel(level) {
	jsState.activeLevel = level;
	saveJsState();
}

export function resetJsLevel(levelKey) {
	loadJsState();
	const key = String(levelKey);
	if (!JS_LEVELS[key]) return;
	jsState.levels[key] = {
		theoryDone: false,
		checkDone: false,
		sandboxDone: false,
		tasksDone: [false, false, false],
		codeValue: JS_LEVELS[key].sandbox.defaultCode,
		previewCode: JS_LEVELS[key].sandbox.defaultCode,
		consoleLines: [],
	};
	saveJsState();
}

export function computeJsProgress() {
	const totalSteps = Object.keys(JS_LEVELS).length * 3;
	let done = 0;
	Object.values(jsState.levels).forEach((lvl) => {
		if (lvl.theoryDone) done += 1;
		if (lvl.checkDone) done += 1;
		if (lvl.sandboxDone) done += 1;
	});
	return totalSteps ? Math.round((done / totalSteps) * 100) : 0;
}

export function completeAllJsLevels() {
	Object.keys(JS_LEVELS).forEach((key) => {
		jsState.levels[key] = {
			...jsState.levels[key],
			theoryDone: true,
			checkDone: true,
			sandboxDone: true,
			tasksDone: [true, true, true],
		};
	});
	saveJsState();
}

// Ermittelt, in welcher Phase das Level gerade ist
// (Theorie → Check → Sandbox → Fertig)
function getCurrentJsPhase(levelState) {
	if (!levelState?.theoryDone) return "theory";
	if (!levelState?.checkDone) return "check";
	if (!levelState?.sandboxDone) return "sandbox";
	return "done";
}

// Zeigt nur die passende Phasen-Karte an
// Die anderen Phasen werden ausgeblendet
function setJsPhaseVisibility(currentPhase) {
	const show = (card, key) => {
		if (!card) return;
		const isVisible = key === currentPhase || (currentPhase === "done" && key === "sandbox");
		card.hidden = !isVisible;
		card.style.display = isVisible ? "grid" : "none";
	};
	show(jsTheoryCard, "theory");
	show(jsCheckCard, "check");
	show(jsSandboxCard, "sandbox");
}

// Zeigt kleine Badges (Theorie/Check/Sandbox) mit Fortschritts-Häkchen
function renderJsPhaseBadges(levelKey) {
	if (!jsPhaseBadges) return;
	const state = jsState.levels[levelKey];
	const badges = [
		{ label: "Theorie", done: state.theoryDone },
		{ label: "Check", done: state.checkDone },
		{ label: "Sandbox", done: state.sandboxDone },
	];
	jsPhaseBadges.innerHTML = "";
	badges.forEach((badge) => {
		const span = document.createElement("span");
		span.className = `pill ${badge.done ? "is-done" : ""}`;
		span.textContent = badge.done ? `${badge.label} ✓` : badge.label;
		jsPhaseBadges.appendChild(span);
	});
}

// Zeigt die Checkliste mit Aufgaben für das aktuelle Level
// Hakt erledigte Aufgaben grün ab
function renderCheck(levelKey) {
	if (!jsCheckBody) return;
	const cfg = JS_LEVELS[levelKey].check;
	const name = `js-check-${levelKey}`;
	jsCheckBody.innerHTML = "";

	const p = document.createElement("p");
	p.className = "muted";
	p.textContent = cfg.question;
	jsCheckBody.appendChild(p);

	const wrap = document.createElement("div");
	wrap.className = "check-options";
	cfg.options.forEach((option, idx) => {
		const label = document.createElement("label");
		label.className = "check-option";
		const input = document.createElement("input");
		input.type = "radio";
		input.name = name;
		input.value = option.value;
		if (idx === 0) input.required = true;
		label.appendChild(input);
		const span = document.createElement("span");
		span.textContent = option.label;
		label.appendChild(span);
		wrap.appendChild(label);
	});
	jsCheckBody.appendChild(wrap);
}

function renderChecklist(levelKey) {
	if (!jsChecklist) return;
	jsChecklist.innerHTML = "";
	const tasks = JS_LEVELS[levelKey].sandbox.checklist;
	const state = jsState.levels[levelKey];
	const doneList = state.tasksDone || [false, false, false];
	tasks.forEach((task, idx) => {
		const li = document.createElement("li");
		li.textContent = task;
		li.classList.toggle("is-done", !!state.sandboxDone || !!doneList[idx]);
		jsChecklist.appendChild(li);
	});
}

// Speichert neue Konsolen-Ausgaben für ein Level
function setConsoleLines(levelKey, lines) {
	jsState.levels[levelKey].consoleLines = lines;
	saveJsState();
	renderConsole(levelKey);
}

// Zeigt alle Konsolen-Ausgaben für das aktuelle Level an
function renderConsole(levelKey) {
	if (!jsConsole) return;
	const lines = jsState.levels[levelKey].consoleLines || [];
	jsConsole.textContent = lines.length ? lines.join("\n") : "(Konsole ist leer)";
}

// Führt den Code in einer sicheren Test-Umgebung aus
// Fängt console.log und alert ab, damit sie nicht das echte Fenster stören
function runUserCode(code) {
	const logs = [];
	// Fake-Konsole: fängt alle console.log() Aufrufe ab
	const fakeConsole = {
		log: (...args) => {
			logs.push(args.map((v) => String(v)).join(" "));
		},
	};
	const fakeAlert = (msg) => {
		logs.push(`[alert] ${String(msg)}`);
	};

	try {
		// Code wird als neue Funktion ausgeführt (isoliert vom Rest der App)
		const fn = new Function("console", "alert", `${code}\n`);
		fn(fakeConsole, fakeAlert);
		return { ok: true, logs };
	} catch (err) {
		logs.push(`Fehler: ${err?.message || String(err)}`);
		return { ok: false, logs };
	}
}

// Prüft, welche der 3 Aufgaben im Sandbox-Modus erledigt sind
// Nutzt einfache Regex-Muster, um den Code zu scannen
// Gibt zurück: Liste mit true/false + Tipp für die nächste Aufgabe
function checkTasks(levelKey, code) {
	const text = code || "";

	if (levelKey === 1) {
		const t1 = /alert\s*\(\s*["']Hallo!\s*["']\s*\)\s*;?/i.test(text);
		const t2 = /console\.log\s*\(\s*["']Test\s*(läuft|laeuft)\s*["']\s*\)\s*;?/i.test(text);
		const msgs = Array.from(text.matchAll(/console\.log\s*\(\s*["']([^"']+)["']\s*\)/gi)).map((m) => m[1]);
		const unique = Array.from(new Set(msgs.map((s) => s.trim()))).filter(Boolean);
		const t3 = unique.length >= 2;
		const tip = !t1
			? "Schreibe genau: alert(\"Hallo!\");"
			: !t2
				? "Schreibe: console.log(\"Test läuft\");"
				: !t3
					? "Du brauchst mindestens zwei verschiedene console.log(\"...\") Nachrichten."
					: "";
		return { erledigt: [t1, t2, t3], tip };
	}

	if (levelKey === 2) {
		const assigns = Array.from(text.matchAll(/(?:let\s+)?stadt\s*=\s*["']([^"']+)["']\s*;?/gi)).map((m) => m[1]);
		const hasLet = /let\s+stadt\s*=\s*["'][^"']+["']\s*;?/i.test(text);
		const hasLog = /console\.log\s*\(\s*stadt\s*\)\s*;?/i.test(text);
		const unique = Array.from(new Set(assigns.map((s) => s.trim()))).filter(Boolean);
		const changed = unique.length >= 2;
		const t1 = hasLet;
		const t2 = hasLog;
		const t3 = changed && hasLog;
		const tip = !t1
			? "Erstelle: let stadt = \"...\";"
			: !t2
				? "Gib deine Variable aus: console.log(stadt);"
				: !t3
					? "Ändere stadt auf eine andere Stadt und logge nochmal (console.log(stadt))."
					: "";
		return { erledigt: [t1, t2, t3], tip };
	}

	if (levelKey === 3) {
		const t1 = /let\s+alter\s*=\s*\d+\s*;?/i.test(text);
		const t2 = /let\s+hobby\s*=\s*["'][^"']+["']\s*;?/i.test(text);
		const hasLogAlter = /console\.log\s*\(\s*alter\s*\)\s*;?/i.test(text);
		const hasLogHobby = /console\.log\s*\(\s*hobby\s*\)\s*;?/i.test(text);
		const t3 = hasLogAlter && hasLogHobby;
		const tip = !t1
			? "Schreibe: let alter = 25; (ohne Anführungszeichen)"
			: !t2
				? "Schreibe: let hobby = \"...\"; (mit Anführungszeichen)"
				: !t3
					? "Gib beide Variablen aus: console.log(alter); und console.log(hobby);"
					: "";
		return { erledigt: [t1, t2, t3], tip };
	}

	if (levelKey === 4) {
		const t1 = /let\s+a\s*=\s*\d+\s*;?/i.test(text) && /let\s+b\s*=\s*\d+\s*;?/i.test(text);
		const t2 = /let\s+ergebnis\s*=\s*a\s*\+\s*b\s*;?/i.test(text);
		const hasLogErgebnis = /console\.log\s*\(\s*ergebnis\s*\)\s*;?/i.test(text);
		const hasMinus = /a\s*-\s*b/.test(text) || /-\s*\d+/.test(text) || /console\.log\s*\(\s*a\s*-\s*b\s*\)/i.test(text);
		const t3 = hasLogErgebnis && hasMinus;
		const tip = !t1
			? "Erstelle: let a = 3; und let b = 5;"
			: !t2
				? "Erstelle: let ergebnis = a + b;"
				: !hasLogErgebnis
					? "Gib es aus: console.log(ergebnis);"
					: !hasMinus
						? "Probiere Minus (-) aus, z. B. console.log(a - b);"
						: "";
		return { erledigt: [t1, t2, t3], tip };
	}

	if (levelKey === 5) {
		// Aufgabe 1: check = 10 > 5
		const t1 = /\bcheck\b\s*=\s*10\s*>\s*5\s*;?/i.test(text);
		// Aufgabe 2: console.log(check)
		const t2 = /console\.log\s*\(\s*check\s*\)\s*;?/i.test(text);
		// Aufgabe 3: "Apfel" === "Birne" und Ausgabe
		const compare = /["']Apfel["']\s*===\s*["']Birne["']/i.test(text);
		const logCompare = /console\.log\s*\(\s*\w+\s*\)\s*;?/i.test(text) && compare;
		const t3 = compare && logCompare;
		const tip = !t1
			? "Setze check auf den Vergleich: let check = 10 > 5;"
			: !t2
				? "Gib check aus: console.log(check);"
				: !compare
					? "Vergleiche die Wörter: \"Apfel\" === \"Birne\""
					: !t3
						? "Gib das Ergebnis des Wort-Vergleichs auch mit console.log(...) aus."
						: "";
		return { erledigt: [t1, t2, t3], tip };
	}

	if (levelKey === 6) {
		// Aufgabe 1: punkte = 100
		const t1 = /let\s+punkte\s*=\s*100\s*;?/i.test(text);
		// Aufgabe 2: if (punkte === 100)
		const t2 = /if\s*\(\s*punkte\s*===\s*100\s*\)\s*\{/i.test(text);
		// Aufgabe 3: alert("Gewonnen!") im if-Block
		const t3 = /if\s*\(\s*punkte\s*===\s*100\s*\)\s*\{[\s\S]*?alert\s*\(\s*["']Gewonnen!["']\s*\)\s*;?[\s\S]*?\}/i.test(text);
		const tip = !t1
			? "Erstelle: let punkte = 100;"
			: !t2
				? "Schreibe: if (punkte === 100) { ... }"
				: !t3
					? "Setze in den if-Block: alert(\"Gewonnen!\");"
					: "";
		return { erledigt: [t1, t2, t3], tip };
	}

	if (levelKey === 7) {
		// Aufgabe 1: passwort ist Text
		const t1 = /let\s+passwort\s*=\s*["'][^"']+["']\s*;?/i.test(text);
		// Aufgabe 2: if (passwort === "geheim123")
		const t2 = /if\s*\(\s*passwort\s*===\s*["']geheim123["']\s*\)\s*\{/i.test(text);
		// Aufgabe 3: else + console.log("Zugriff verweigert")
		const t3 = /else\s*\{[\s\S]*?console\.log\s*\(\s*["']Zugriff\s+verweigert["']\s*\)\s*;?[\s\S]*?\}/i.test(text);
		const tip = !t1
			? "Erstelle eine Text-Variable: let passwort = \"...\";"
			: !t2
				? "Prüfe: if (passwort === \"geheim123\") { ... }"
				: !t3
					? "Nutze else und schreibe: console.log(\"Zugriff verweigert\");"
					: "";
		return { erledigt: [t1, t2, t3], tip };
	}

	if (levelKey === 8) {
		// Aufgabe 1: function begruessung()
		const t1 = /function\s+begruessung\s*\(\s*\)\s*\{/i.test(text);
		// Aufgabe 2: console.log("Hallo, schön dich zu sehen!") in Funktion
		const t2 = /function\s+begruessung\s*\(\s*\)\s*\{[\s\S]*?console\.log\s*\(\s*["']Hallo,\s*schön\s*dich\s*zu\s*sehen!["']\s*\)\s*;?[\s\S]*?\}/i.test(text);
		// Aufgabe 3: begruessung(); am Ende
		const t3 = /\bbegruessung\s*\(\s*\)\s*;?/i.test(text);
		const tip = !t1
			? "Erstelle: function begruessung() { ... }"
			: !t2
				? "Schreibe in die Funktion: console.log(\"Hallo, schön dich zu sehen!\");"
				: !t3
					? "Rufe die Funktion auf: begruessung();"
					: "";
		return { erledigt: [t1, t2, t3], tip };
	}

	if (levelKey === 9) {
		const t1 = /\bmeinTitel\b\s*=\s*document\.getElementById\s*\(\s*["']titel["']\s*\)\s*;?/i.test(text);
		const t2 = /\bmeineBox\b\s*=\s*document\.getElementById\s*\(\s*["']box["']\s*\)\s*;?/i.test(text);
		const t3 = /console\.log\s*\(\s*meinTitel\s*\)\s*;?/i.test(text);
		const tip = !t1
			? "Setze: meinTitel = document.getElementById(\"titel\");"
			: !t2
				? "Setze: meineBox = document.getElementById(\"box\");"
				: !t3
					? "Teste es mit: console.log(meinTitel);"
					: "";
		return { erledigt: [t1, t2, t3], tip };
	}

	if (levelKey === 10) {
		const t1 = /\bnachricht\b\s*=\s*document\.getElementById\s*\(\s*["']nachricht["']\s*\)\s*;?/i.test(text);
		const t2 = /nachricht\.innerText\s*=\s*["']Du\s+hast\s+es\s+gefunden!["']\s*;?/i.test(text);
		const hasStatus = /\bstatus\b\s*=\s*document\.getElementById\s*\(\s*["']status["']\s*\)\s*;?/i.test(text);
		const setStatus = /status\.innerText\s*=\s*["']System\s+bereit["']\s*;?/i.test(text);
		const t3 = hasStatus && setStatus;
		const tip = !t1
			? "Suche zuerst: nachricht = document.getElementById(\"nachricht\");"
			: !t2
				? "Setze: nachricht.innerText = \"Du hast es gefunden!\";"
				: !t3
					? "Vergiss #status nicht: status = ... und status.innerText = \"System bereit\";"
					: "";
		return { erledigt: [t1, t2, t3], tip };
	}

	if (levelKey === 11) {
		const t1 = /\bmeinKnopf\b\s*=\s*document\.getElementById\s*\(\s*["']klick-mich["']\s*\)\s*;?/i.test(text);
		const t2 = /meinKnopf\.addEventListener\s*\(\s*["']click["']\s*,\s*function\s*\(\s*\)\s*\{/i.test(text);
		const t3 = /addEventListener\s*\(\s*["']click["']\s*,\s*function\s*\(\s*\)\s*\{[\s\S]*?alert\s*\(\s*["']Button\s+wurde\s+geklickt!["']\s*\)\s*;?[\s\S]*?\}\s*\)\s*;?/i.test(text);
		const tip = !t1
			? "Suche den Button: meinKnopf = document.getElementById(\"klick-mich\");"
			: !t2
				? "Hänge dran: meinKnopf.addEventListener(\"click\", function () { ... });"
				: !t3
					? "Schreibe in den Handler: alert(\"Button wurde geklickt!\");"
					: "";
		return { erledigt: [t1, t2, t3], tip };
	}

	if (levelKey === 12) {
		const hasBtn = /\bfarbeButton\b\s*=\s*document\.getElementById\s*\(\s*["']farbe-button["']\s*\)\s*;?/i.test(text);
		const hasBox = /\bquadrat\b\s*=\s*document\.getElementById\s*\(\s*["']quadrat["']\s*\)\s*;?/i.test(text);
		const t1 = hasBtn && hasBox;
		const t2 = /farbeButton\.addEventListener\s*\(\s*["']click["']\s*,\s*function\s*\(\s*\)\s*\{/i.test(text);
		const t3 = /quadrat\.style\.backgroundColor\s*=\s*["']red["']\s*;?/i.test(text);
		const tip = !t1
			? "Suche beide Elemente: farbeButton = ... und quadrat = ..."
			: !t2
				? "Erstelle den click-Listener: farbeButton.addEventListener(\"click\", function () { ... });"
				: !t3
					? "Im Handler: quadrat.style.backgroundColor = \"red\";"
					: "";
		return { erledigt: [t1, t2, t3], tip };
	}

	return { erledigt: [false, false, false], tip: "Unbekanntes Level." };
}

function renderJsSandbox(levelKey) {
	const data = JS_LEVELS[levelKey];
	if (jsSandboxHint) {
		const prompt = data.sandbox.prompt || "";
		const help = data.sandbox.help || "";
		jsSandboxHint.textContent = help ? `${prompt} Tipp: ${help}` : prompt;
	}
	if (jsEditor) jsEditor.value = jsState.levels[levelKey].codeValue;
	renderPreview(levelKey, "");
	renderChecklist(levelKey);
	renderConsole(levelKey);
	if (jsFeedback) jsFeedback.textContent = jsState.levels[levelKey].sandboxDone ? "Sieht gut aus!" : "";
}

function renderJsLabUI() {
	const levelKey = jsState.activeLevel;
	const data = JS_LEVELS[levelKey];
	if (!data) return;
	const phase = getCurrentJsPhase(jsState.levels[levelKey]);

	if (jsLevelTitle) jsLevelTitle.textContent = data.title;
	if (jsLevelDesc) jsLevelDesc.textContent = "Drei Phasen: Theorie, Check, Sandbox.";
	if (jsTheoryText) jsTheoryText.textContent = data.theory;

	renderJsPhaseBadges(levelKey);
	setJsPhaseVisibility(phase);

	if (jsTheoryBtn) {
		jsTheoryBtn.disabled = jsState.levels[levelKey].theoryDone;
		jsTheoryBtn.textContent = jsState.levels[levelKey].theoryDone ? "Abgehakt" : "Gelesen";
	}

	if (jsCheckFeedback) jsCheckFeedback.textContent = jsState.levels[levelKey].checkDone ? "Sauber, weiter geht's!" : "";
	renderCheck(levelKey);
	renderJsSandbox(levelKey);
}

function handleTheoryDone() {
	const levelKey = jsState.activeLevel;
	jsState.levels[levelKey].theoryDone = true;
	saveJsState();
	renderJsLabUI();
	onJsProgress(computeJsProgress());
}

function handleCheckSubmit() {
	const levelKey = jsState.activeLevel;
	const cfg = JS_LEVELS[levelKey].check;
	const selected = jsCheckBody?.querySelector("input[type='radio']:checked");
	const value = selected?.value;
	if (!value) {
		if (jsCheckFeedback) jsCheckFeedback.textContent = "Bitte wähle eine Antwort.";
		return;
	}
	if (value === cfg.answer) {
		jsState.levels[levelKey].checkDone = true;
		saveJsState();
		if (jsCheckFeedback) jsCheckFeedback.textContent = "Richtig!";
		renderJsLabUI();
		onJsProgress(computeJsProgress());
	} else {
		if (jsCheckFeedback) jsCheckFeedback.textContent = cfg.tip || "Schau nochmal.";
	}
}

function handleRun() {
	const levelKey = jsState.activeLevel;
	if (!jsEditor) return;
	const code = jsEditor.value;
	jsState.levels[levelKey].codeValue = code;
	jsState.levels[levelKey].previewCode = code;
	saveJsState();

	setConsoleLines(levelKey, []);
	renderPreview(levelKey, code);
	if (jsFeedback && !jsState.levels[levelKey].sandboxDone) jsFeedback.textContent = "Konsole aktualisiert.";
}

function handleSandboxCheck() {
	const levelKey = jsState.activeLevel;
	if (!jsEditor) return;
	const code = jsEditor.value;
	jsState.levels[levelKey].codeValue = code;
	saveJsState();

	const result = checkTasks(levelKey, code);
	const vorher = jsState.levels[levelKey].tasksDone || [false, false, false];
	const jetzt = vorher.map((ok, idx) => ok || !!result.erledigt?.[idx]);
	jsState.levels[levelKey].tasksDone = jetzt;
	jsState.levels[levelKey].sandboxDone = jetzt.every(Boolean);
	saveJsState();

	renderChecklist(levelKey);
	if (jsState.levels[levelKey].sandboxDone) {
		onSandboxComplete(levelKey);
		if (jsFeedback) jsFeedback.textContent = "Top, weiter!";
		onJsProgress(computeJsProgress());
		renderJsLabUI();
	} else {
		if (jsFeedback) jsFeedback.textContent = result.tip;
	}
}

export function renderJsLevelOverview(onOpenLevel) {
	if (!jsOverview) return;
	const openHandler = onOpenLevel || (() => {});
	loadJsState();
	jsOverview.innerHTML = "";

	Object.entries(JS_LEVELS).forEach(([key, data]) => {
		const state = jsState.levels[key];
		const stepsDone = [state?.theoryDone, state?.checkDone, state?.sandboxDone].filter(Boolean).length;
		const percent = Math.round((stepsDone / 3) * 100);

		const card = document.createElement("article");
		card.className = "level-card";

		const top = document.createElement("div");
		top.className = "level-top";

		const titleWrap = document.createElement("div");
		const eyebrow = document.createElement("p");
		eyebrow.className = "eyebrow";
		eyebrow.textContent = `Level ${key}`;
		const title = document.createElement("h4");
		title.textContent = data.title;
		const desc = document.createElement("p");
		desc.className = "muted";
		desc.textContent = data.theory.slice(0, 120) + "...";
		titleWrap.appendChild(eyebrow);
		titleWrap.appendChild(title);
		titleWrap.appendChild(desc);

		const badge = document.createElement("span");
		badge.className = `pill ${jsState.activeLevel === Number(key) ? "is-done" : ""}`;
		badge.textContent = jsState.activeLevel === Number(key) ? "Aktiv" : "Bereit";

		top.appendChild(titleWrap);
		top.appendChild(badge);

		const meta = document.createElement("div");
		meta.className = "level-meta";
		const status = document.createElement("span");
		status.className = "muted";
		const labels = ["Theorie", "Check", "Sandbox"];
		status.textContent = labels[stepsDone] ? `${labels[stepsDone]} als nächstes` : "Fertig";
		const value = document.createElement("strong");
		value.textContent = `${percent}%`;
		meta.appendChild(status);
		meta.appendChild(value);

		const line = document.createElement("div");
		line.className = "progress-line";
		const lineSpan = document.createElement("span");
		lineSpan.style.width = `${percent}%`;
		line.appendChild(lineSpan);

		const footer = document.createElement("footer");
		const cta = document.createElement("button");
		cta.type = "button";
		cta.className = "primary-btn";
		const isRepeat = percent >= 100;
		cta.textContent = isRepeat ? "Level wiederholen" : "Level starten";
		cta.addEventListener("click", () => {
			if (isRepeat) resetJsLevel(Number(key));
			openHandler(Number(key));
		});

		const steps = document.createElement("span");
		steps.className = "muted";
		steps.textContent = `${stepsDone}/3 Phasen`;

		footer.appendChild(cta);
		footer.appendChild(steps);

		card.appendChild(top);
		card.appendChild(meta);
		card.appendChild(line);
		card.appendChild(footer);

		jsOverview.appendChild(card);
	});
}

export function renderJsLab() {
	loadJsState();
	if (!jsPanel) return;
	jsPanel.hidden = false;
	jsPanel.removeAttribute("hidden");
	renderJsLabUI();
}

export function wireJsLab(options = {}) {
	onJsProgress = options.onProgress || (() => {});
	onSandboxComplete = options.onSandboxComplete || (() => {});
	loadJsState();

	if (!messageBridgeBound) {
		messageBridgeBound = true;
		window.addEventListener("message", (event) => {
			if (!jsPreview || event.source !== jsPreview.contentWindow) return;
			const data = event.data;
			if (!data || data.type !== "js-console") return;
			const token = String(data.token || "");
			const levelKey = Object.keys(previewRunToken).find((k) => previewRunToken[k] === token);
			if (!levelKey) return;

			const text = String(data.text || "");
			const lines = jsState.levels[levelKey].consoleLines || [];
			lines.push(text);
			jsState.levels[levelKey].consoleLines = lines.slice(-200);
			saveJsState();
			if (Number(levelKey) === jsState.activeLevel) renderConsole(levelKey);
		});
	}

	if (jsTheoryBtn) jsTheoryBtn.addEventListener("click", handleTheoryDone);
	if (jsCheckBtn) jsCheckBtn.addEventListener("click", handleCheckSubmit);
	if (jsRunBtn) jsRunBtn.addEventListener("click", handleRun);
	if (jsCheckSandboxBtn) jsCheckSandboxBtn.addEventListener("click", handleSandboxCheck);

	if (jsEditor) {
		jsEditor.addEventListener("input", () => {
			const lvl = jsState.activeLevel;
			jsState.levels[lvl].codeValue = jsEditor.value;
			saveJsState();
		});
	}

	renderJsLab();
}

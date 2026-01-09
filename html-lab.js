import { HTML_LEVELS } from "./html-levels.js";
import {
  getHtmlState,
  loadHtmlState,
  setActiveLevel,
  resetHtmlLevel,
  updateLevelState,
  computeHtmlProgress,
  getCurrentPhase,
} from "./html-state.js";

// Alle wichtigen HTML-Elemente aus dem Dokument holen
const htmlLevelPanel = document.getElementById("html-level-panel");
const htmlLevelTabs = document.querySelectorAll("[data-html-level]");
const levelOverview = document.getElementById("level-overview");
const htmlLevelTitle = document.getElementById("html-level-title");
const htmlLevelDesc = document.getElementById("html-level-desc");
const htmlPhaseBadges = document.getElementById("html-phase-badges");
const theoryText = document.getElementById("theory-text");
const theoryDoneBtn = document.getElementById("theory-done-btn");
const checkBody = document.getElementById("check-body");
const checkSubmit = document.getElementById("check-submit");
const checkFeedback = document.getElementById("check-feedback");
const sandboxHint = document.getElementById("sandbox-hint");
const sandboxEditor = document.getElementById("sandbox-editor");
const sandboxShowPreviewBtn = document.getElementById("sandbox-show-preview");
const sandboxCheckBtn = document.getElementById("sandbox-check");
const sandboxFeedback = document.getElementById("sandbox-feedback");
const sandboxPreview = document.getElementById("sandbox-preview");
const theoryCard = document.getElementById("phase-theory");
const checkCard = document.getElementById("phase-check");
const sandboxCard = document.getElementById("phase-sandbox");

// Callback-Funktion, die bei Fortschritt aufgerufen wird
let onProgress = () => {};
let onSandboxComplete = () => {};
// Handler für das Öffnen von Levels (aus der Übersicht heraus)
let openLevelHandler = () => {};

// Zeigt kleine Badges (Theorie/Check/Sandbox) mit Fortschritts-Häkchen
function renderPhaseBadges(levelKey) {
  const state = getHtmlState().levels[levelKey];
  if (!htmlPhaseBadges) return;
  const badges = [
    { label: "Theorie", done: state.theoryDone },
    { label: "Check", done: state.checkDone },
    { label: "Sandbox", done: state.sandboxDone },
  ];
  htmlPhaseBadges.innerHTML = "";
  badges.forEach((badge) => {
    const span = document.createElement("span");
    span.className = `pill ${badge.done ? "is-done" : ""}`;
    span.textContent = badge.done ? `${badge.label} ✓` : badge.label;
    htmlPhaseBadges.appendChild(span);
  });
}

// Zeigt die Checkliste mit Aufgaben für die Sandbox
// Hakt alle Aufgaben ab, wenn das Level abgeschlossen ist
function renderSandboxChecklist(levelKey) {
  const listEl = document.getElementById("sandbox-checklist");
  if (!listEl) return;
  const tasks = HTML_LEVELS[levelKey]?.sandbox?.checklist || [];
  const state = getHtmlState();
  listEl.innerHTML = "";
  const allDone = state.levels[levelKey]?.sandboxDone;
  tasks.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    li.classList.toggle("is-done", !!allDone);
    listEl.appendChild(li);
  });
}

// Zeigt nur die passende Phasen-Karte an (Theorie/Check/Sandbox)
// Die anderen Phasen werden ausgeblendet
function setPhaseVisibility(currentPhase) {
  const show = (card, key) => {
    if (!card) return;
    const isVisible = key === currentPhase || (currentPhase === "done" && key === "sandbox");
    card.hidden = !isVisible;
    card.style.display = isVisible ? "grid" : "none";
  };

  show(theoryCard, "theory");
  show(checkCard, "check");
  show(sandboxCard, "sandbox");
}

// Baut die Quiz-Frage mit Radio-Buttons auf
function renderCheckUI(levelData, levelKey) {
  if (!checkBody) return;
  const { question, options } = levelData.check;
  const name = `html-check-${levelKey}`;
  checkBody.innerHTML = "";

  const p = document.createElement("p");
  p.className = "muted";
  p.textContent = question;
  checkBody.appendChild(p);

  const list = document.createElement("div");
  list.className = "check-options";
  options.forEach((option, idx) => {
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
    list.appendChild(label);
  });
  checkBody.appendChild(list);
}

// Erstellt die Level-Übersicht mit allen Karten
// Zeigt Fortschritt und erlaubt das Starten/Wiederholen von Levels
export function renderLevelOverview(onOpenLevel) {
  if (onOpenLevel) openLevelHandler = onOpenLevel;
  const openHandler = onOpenLevel || openLevelHandler;
  loadHtmlState();
  if (!levelOverview) return;
  levelOverview.innerHTML = "";

  Object.entries(HTML_LEVELS).forEach(([key, data]) => {
    const state = getHtmlState().levels[key];
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
    desc.textContent = data.desc;
    titleWrap.appendChild(eyebrow);
    titleWrap.appendChild(title);
    titleWrap.appendChild(desc);

    const badge = document.createElement("span");
    badge.className = `pill ${getHtmlState().activeLevel === Number(key) ? "is-done" : ""}`;
    badge.textContent = getHtmlState().activeLevel === Number(key) ? "Aktiv" : "Bereit";

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
			if (isRepeat) resetHtmlLevel(Number(key));
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

    levelOverview.appendChild(card);
  });
}

// Zeigt das HTML-Level-Labor an (Theorie/Check/Sandbox)
// Lädt den aktuellen Stand und füllt alle UI-Elemente
export function renderHtmlLab() {
  loadHtmlState();
  if (!htmlLevelPanel) return;
  const levelKey = getHtmlState().activeLevel || 1;
  const data = HTML_LEVELS[levelKey];
  if (!data) return;

  const phase = getCurrentPhase(getHtmlState().levels[levelKey]);

  htmlLevelPanel.hidden = false;
  htmlLevelPanel.removeAttribute("hidden");

  htmlLevelTabs.forEach((btn) => {
    const lvl = Number(btn.dataset.htmlLevel);
    btn.classList.toggle("is-active", lvl === levelKey);
  });

  if (htmlLevelTitle) htmlLevelTitle.textContent = data.title;
  if (htmlLevelDesc) htmlLevelDesc.textContent = data.desc;
  if (theoryText) theoryText.textContent = data.theory;

  renderPhaseBadges(levelKey);
  renderCheckUI(data, levelKey);
  renderSandboxChecklist(levelKey);

  setPhaseVisibility(phase);

  if (checkFeedback) {
    checkFeedback.textContent = getHtmlState().levels[levelKey].checkDone ? "Sauber, weiter geht's!" : "";
  }

  if (theoryDoneBtn) {
    theoryDoneBtn.disabled = getHtmlState().levels[levelKey].theoryDone;
    theoryDoneBtn.textContent = getHtmlState().levels[levelKey].theoryDone ? "Abgehakt" : "Gelesen";
  }

  if (sandboxHint) sandboxHint.textContent = data.sandbox.prompt;
  if (sandboxEditor) {
    const stored = getHtmlState().levels[levelKey].sandboxValue || data.sandbox.defaultValue || "";
    sandboxEditor.value = stored;
  }
  if (sandboxFeedback) {
    sandboxFeedback.textContent = getHtmlState().levels[levelKey].sandboxDone ? "Sieht gut aus!" : "";
  }
  if (sandboxPreview) {
    // Vorschau ist unabhängig vom "fertig"-Haken und wird per Button gesteuert.
		const html = getHtmlState().levels[levelKey].previewValue || "";
		const doc = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { margin: 0; padding: 16px; background: white; color: #0f172a; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
      img { max-width: 100%; height: auto; }
    </style>
  </head>
  <body>${html}</body>
</html>`;
		if ("srcdoc" in sandboxPreview) {
			sandboxPreview.srcdoc = doc;
		} else {
			sandboxPreview.innerHTML = html;
		}
  }
}

// Zeigt die Vorschau des HTML-Codes im iframe
// Markiert das Level noch nicht als fertig (nur Vorschau!)
function showHtmlPreview(levelKey) {
  // Vorschau anzeigen, ohne das Level als fertig zu markieren
  const value = sandboxEditor?.value || "";
  updateLevelState(levelKey, { previewValue: value });
	if (sandboxPreview) {
		const doc = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { margin: 0; padding: 16px; background: white; color: #0f172a; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
      img { max-width: 100%; height: auto; }
    </style>
  </head>
  <body>${value}</body>
</html>`;
		if ("srcdoc" in sandboxPreview) sandboxPreview.srcdoc = doc;
		if (!("srcdoc" in sandboxPreview)) sandboxPreview.innerHTML = value;
	}
  if (sandboxFeedback && !getHtmlState().levels[levelKey].sandboxDone) sandboxFeedback.textContent = "Vorschau aktualisiert.";
}

// Prüft, ob die Sandbox-Aufgabe richtig gelöst wurde
// Bei Erfolg wird das Level als abgeschlossen markiert
function checkHtmlResult(levelKey) {
  // Code prüfen und bei Erfolg abhaken
  const value = sandboxEditor?.value || "";
  updateLevelState(levelKey, { sandboxValue: value });

  const res = validateSandbox(levelKey, value);
  if (res.ok) {
    updateLevelState(levelKey, { sandboxDone: true, previewValue: value });
    onSandboxComplete(levelKey);
    renderPhaseBadges(levelKey);
    renderSandboxChecklist(levelKey);
    renderHtmlLab();
    renderLevelOverview();
    onProgress(computeHtmlProgress());
    if (sandboxFeedback) sandboxFeedback.textContent = "Top, weiter!";
    if (levelKey === 16) celebrateHtmlCompletion();
  } else {
    if (sandboxFeedback) sandboxFeedback.textContent = res.tip || "Schau dir die Hinweise nochmal an.";
  }
}

// Prüft den HTML-Code für jedes Level mit Regex-Mustern
// Gibt zurück: { ok: true/false, tip: "Hilfe-Text" }
function validateSandbox(levelKey, value) {
  const input = (value || "").trim();
  if (!input) return { ok: false, tip: "Schreibe etwas in die Sandbox." };

  if (levelKey === 1) {
    const paras = input.match(/<p[\s\S]*?<\/p>/gi) || [];
    if (paras.length < 2) return { ok: false, tip: "Fast richtig! Hast du daran gedacht, beide Absätze mit </p> zu schließen?" };
    const firstOk = /<p[^>]*>\s*Hallo\s*<\/p>/i.test(paras[0]);
    const secondOk = /<p[^>]*>\s*Lernen\s+macht\s+Spaß\s*<\/p>/i.test(paras[1]);
    if (!firstOk) return { ok: false, tip: "Setze 'Hallo' zwischen <p> und </p>. Denke an > und / im End-Tag." };
    if (!secondOk) return { ok: false, tip: "Schreibe einen zweiten Absatz mit 'Lernen macht Spaß'." };
    return { ok: true };
  }

  if (levelKey === 2) {
    if (!/<!DOCTYPE\s+html>/i.test(input)) return { ok: false, tip: "Starte mit <!DOCTYPE html> in der ersten Zeile." };
    if (!/<html[\s>]/i.test(input)) return { ok: false, tip: "Öffne <html> nach dem DOCTYPE." };
    if (!/<\/html>/i.test(input)) return { ok: false, tip: "Schließe dein <html> mit </html>." };
    if (!/<head[\s>][\s\S]*<\/head>/i.test(input)) return { ok: false, tip: "Setze <head></head> als erstes Kind in <html>." };
    if (!/<body[\s>][\s\S]*<\/body>/i.test(input)) return { ok: false, tip: "Füge <body></body> nach dem head ein." };
    return { ok: true };
  }

  if (levelKey === 3) {
    const htmlTag = input.match(/<html[^>]*>/i)?.[0] || "";
    if (!/lang=\s*"en"/i.test(htmlTag)) return { ok: false, tip: "Ändere lang im <html>-Tag auf \"en\"." };
    const hasP = /<p[^>]*id=\s*"info"[^>]*>[\s\S]*?<\/p>/i.test(input);
    if (!hasP) return { ok: false, tip: "Füge ein <p id=\"info\"></p> in den Body ein." };
    return { ok: true };
  }

  if (levelKey === 4) {
    const hasH1 = /<h1[^>]*>\s*Meine Reise\s*<\/h1>/i.test(input);
    const hasH2 = /<h2[^>]*>\s*Tag\s*1\s*<\/h2>/i.test(input);
    const hasH3 = /<h3[^>]*>\s*Frühstück\s*<\/h3>/i.test(input);
    if (!hasH1) return { ok: false, tip: "Setze eine <h1> mit dem Text 'Meine Reise'. Denke an </h1>." };
    if (!hasH2) return { ok: false, tip: "Füge eine <h2> mit 'Tag 1' hinzu und schließe sie." };
    if (!hasH3) return { ok: false, tip: "Baue eine <h3> mit 'Frühstück'." };
    return { ok: true };
  }

  if (levelKey === 5) {
    const hasStrongName = /<strong[^>]*>[^<]*<\/strong>/i.test(input);
    const hasEmWord = /<em[^>]*>[^<]+<\/em>/i.test(input);
    const brCount = (input.match(/<br\s*\/?>(?=<|\s|$)/gi) || []).length;
    if (!hasStrongName) return { ok: false, tip: "Setze deinen Namen in ein <strong>-Tag (mit End-Tag)." };
    if (!hasEmWord) return { ok: false, tip: "Markiere ein Wort mit <em> für Kursivschrift." };
    if (brCount < 2) return { ok: false, tip: "Nutze <br> zwischen den drei Zeilen deines Gedichts." };
    return { ok: true };
  }

  if (levelKey === 6) {
    const hasUl = /<ul[\s\S]*?<\/ul>/i.test(input);
    const liItems = input.match(/<li[\s\S]*?<\/li>/gi) || [];
    const hasApples = /<li[\s\S]*>\s*Äpfel\s*<\/li>/i.test(input);
    const hasBananas = /<li[\s\S]*>\s*Bananen\s*<\/li>/i.test(input);
    const milkLi = (liItems.find((li) => /milch/i.test(li)) || "");
    const milkStrong = /<strong[\s\S]*>\s*Milch\s*<\/strong>/i.test(milkLi);
    if (!hasUl) return { ok: false, tip: "Achte darauf, dass alle <li> innerhalb von <ul> stehen." };
    if (liItems.length < 3 || !hasApples || !hasBananas) return { ok: false, tip: "Füge Äpfel, Bananen und Milch als drei Punkte ein." };
    if (!milkStrong) return { ok: false, tip: "Umschließe 'Milch' mit <strong>, um es fett zu machen." };
    return { ok: true };
  }

  if (levelKey === 7) {
    const olBlocks = input.match(/<ol[\s\S]*?<\/ol>/gi) || [];
    if (olBlocks.length < 2) return { ok: false, tip: "Baue zwei <ol>-Listen (Filme und Wasser-Schritte)." };
    const firstOl = olBlocks[0];
    const filmLis = firstOl.match(/<li[\s\S]*?<\/li>/gi) || [];
    if (filmLis.length < 2) return { ok: false, tip: "Mindestens zwei Lieblingsfilme in die erste <ol>." };
    const waterOl = olBlocks[1];
    const waterLis = waterOl.match(/<li[\s\S]*?<\/li>/gi) || [];
    if (waterLis.length < 2) return { ok: false, tip: "Zweite <ol> braucht zwei Schritte zum Wasser einschenken." };
    return { ok: true };
  }

  if (levelKey === 8) {
    const wikipediaLink = /<a[^>]*href=\s*"https?:\/\/wikipedia\.org"[^>]*>\s*Lexikon\s*<\/a>/i.test(input);
    const ulBlock = (input.match(/<ul[\s\S]*?<\/ul>/i) || [""])[0];
    const listHasLinks = /<li[\s\S]*><a[^>]*href=\s*"https?:\/\//i.test(ulBlock);
    const hasStrongLink = /<a[^>]*>\s*<strong[\s\S]*>[^<]*<\/strong>\s*<\/a>/i.test(input);
    if (!wikipediaLink) return { ok: false, tip: "Erstelle einen Link zu https://wikipedia.org mit dem Text 'Lexikon'." };
    if (!listHasLinks) return { ok: false, tip: "Baue eine <ul> mit Link-Punkten (z. B. Google, YouTube)." };
    if (!hasStrongLink) return { ok: false, tip: "Setze einen Link-Text fett mit <strong>." };
    return { ok: true };
  }

  if (levelKey === 9) {
    const imgMatch = input.match(/<img[^>]*>/i);
    if (!imgMatch) return { ok: false, tip: "Füge ein <img>-Tag ein." };
    const img = imgMatch[0];
    const hasSrc = /src=\s*"https?:\/\/codeyourjourney\.de\/assets\/logo\.png"/i.test(img);
    const hasAlt = /alt=\s*"Das Logo der Lernseite"/i.test(img);
    const hasWidth = /width=\s*"150"/i.test(img);
    if (!hasSrc) return { ok: false, tip: "Nutze genau die gegebene Bildadresse bei src." };
    if (!hasAlt) return { ok: false, tip: "Setze alt=\"Das Logo der Lernseite\"." };
    if (!hasWidth) return { ok: false, tip: "Setze width=\"150\" für die Breite." };
    return { ok: true };
  }

  if (levelKey === 10) {
    const videoMatch = input.match(/<video[^>]*>/i);
    if (!videoMatch) return { ok: false, tip: "Füge einen <video>-Tag hinzu." };
    const video = videoMatch[0];
    const hasSrc = /src=\s*"intro\.mp4"/i.test(video);
    const hasControls = /controls(\s|>|$)/i.test(video);
    const hasParagraph = /<p[^>]*>[^<]*<\/p>/i.test(input);
    if (!hasSrc) return { ok: false, tip: "Setze src=\"intro.mp4\" in den Video-Tag." };
    if (!hasControls) return { ok: false, tip: "Füge controls hinzu, damit Buttons erscheinen." };
    if (!hasParagraph) return { ok: false, tip: "Schreibe unter das Video einen erklärenden <p>-Text." };
    return { ok: true };
  }

  if (levelKey === 11) {
    const hasTable = /<table[\s\S]*?<\/table>/i.test(input);
    if (!hasTable) return { ok: false, tip: "Starte mit <table> ... </table>." };
    const rows = input.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    if (rows.length < 2) return { ok: false, tip: "Baue mindestens zwei <tr>-Zeilen." };
    const firstRow = rows[0];
    const secondRow = rows[1];
    const firstCells = firstRow.match(/<td[\s\S]*?<\/td>/gi) || [];
    const secondCells = secondRow.match(/<td[\s\S]*?<\/td>/gi) || [];
    if (firstCells.length < 2 || secondCells.length < 2) return { ok: false, tip: "Jede Zeile braucht zwei <td>-Zellen." };
    if (!/Gegenstand/i.test(firstCells[0]) || !/Preis/i.test(firstCells[1])) return { ok: false, tip: "Erste Zeile: 'Gegenstand' und 'Preis' in die Zellen schreiben." };
    const hasPrice = /50€|50\s*€/i.test(secondCells[1]);
    if (!/Tastatur/i.test(secondCells[0]) || !hasPrice) return { ok: false, tip: "Zweite Zeile: 'Tastatur' und '50€' eintragen." };
    return { ok: true };
  }

  if (levelKey === 12) {
    const hasDiv = /<div[\s\S]*?<\/div>/i.test(input);
    const hasH2 = /<h2[\s\S]*?<\/h2>/i.test(input);
    const hasImg = /<img[^>]*src=\s*"[^"]+"[^>]*>/i.test(input);
    const spanOnWichtig = /<span[\s\S]*>\s*Wichtig\s*<\/span>/i.test(input);
    const hasP = /<p[\s\S]*?<\/p>/i.test(input);
    if (!hasDiv) return { ok: false, tip: "Setze deine Inhalte in ein <div>." };
    if (!hasH2) return { ok: false, tip: "Füge eine Überschrift <h2> im div ein." };
    if (!hasImg) return { ok: false, tip: "Packe ein <img> mit src und alt ins div." };
    if (!hasP) return { ok: false, tip: "Schreibe einen Absatz mit dem Hinweistext." };
    if (!spanOnWichtig) return { ok: false, tip: "Umschließe das Wort 'Wichtig' mit <span>." };
    return { ok: true };
  }

  if (levelKey === 13) {
    const hasHeader = /<header[\s\S]*?<\/header>/i.test(input);
    const hasMain = /<main[\s\S]*?<\/main>/i.test(input);
    const hasFooter = /<footer[\s\S]*?<\/footer>/i.test(input);
    const h1InHeader = /<header[\s\S]*?<h1[\s\S]*>\s*Meine Website\s*<\/h1>[\s\S]*?<\/header>/i.test(input);
    const footerCopy = /<footer[\s\S]*>[^<]*Copyright\s*2026[^<]*<\/footer>/i.test(input);
    if (!hasHeader || !hasMain || !hasFooter) return { ok: false, tip: "Setze header, main und footer als Grundlayout." };
    if (!h1InHeader) return { ok: false, tip: "Packe eine <h1> mit 'Meine Website' in den header." };
    if (!footerCopy) return { ok: false, tip: "Schreibe 'Copyright 2026' in den footer." };
    return { ok: true };
  }

  if (levelKey === 14) {
    const hasSection = /<section[\s\S]*?<\/section>/i.test(input);
    const hasH2 = /<section[\s\S]*?<h2[\s\S]*>\s*Meine Projekte\s*<\/h2>/i.test(input);
    const hasArticle = /<section[\s\S]*?<article[\s\S]*?<\/article>[\s\S]*?<\/section>/i.test(input);
    const hasP = /<article[\s\S]*?<p[\s\S]*?<\/p>[\s\S]*?<\/article>/i.test(input);
    if (!hasSection) return { ok: false, tip: "Erstelle eine <section> als Container." };
    if (!hasH2) return { ok: false, tip: "Gib der Section eine <h2> 'Meine Projekte'." };
    if (!hasArticle) return { ok: false, tip: "Lege ein <article> in die Section." };
    if (!hasP) return { ok: false, tip: "Beschreibe dein Projekt mit einem <p> im Article." };
    return { ok: true };
  }

  if (levelKey === 15) {
    const formMatch = input.match(/<form[\s\S]*?<\/form>/i);
    if (!formMatch) return { ok: false, tip: "Baue ein <form> um deine Felder." };
    const formContent = formMatch[0];
    const hasLabel = /<label[\s\S]*>\s*Dein Name:\s*<\/label>/i.test(formContent);
    const hasInput = /<input[^>]*type=\s*"text"[^>]*>/i.test(formContent);
    const hasButton = /<button[^>]*>\s*Absenden\s*<\/button>/i.test(formContent);
    if (!hasLabel) return { ok: false, tip: "Füge ein <label> mit 'Dein Name:' hinzu." };
    if (!hasInput) return { ok: false, tip: "Setze ein <input type=\"text\"> ins Formular." };
    if (!hasButton) return { ok: false, tip: "Packe einen Button mit 'Absenden' ins Formular." };
    return { ok: true };
  }

  if (levelKey === 16) {
    const hasHead = /<head[\s\S]*?<\/head>/i.test(input);
    const hasTitle = /<title[\s\S]*>\s*Mein Coding Abenteuer\s*<\/title>/i.test(input);
    const hasMeta = /<meta[^>]*charset=\s*"utf-8"[^>]*>/i.test(input);
    if (!hasHead) return { ok: false, tip: "Arbeite im <head>-Bereich des Dokuments." };
    if (!hasTitle) return { ok: false, tip: "Setze <title>Mein Coding Abenteuer</title>." };
    if (!hasMeta) return { ok: false, tip: "Füge <meta charset=\"UTF-8\"> hinzu (auf Groß/Kleinschreibung achten)." };
    return { ok: true };
  }

  return { ok: false, tip: "Unbekanntes Level." };
}

// Zeigt eine kurze Erfolgsmeldung nach Level 16
// Und gibt einen kleinen Ausblick auf das CSS-Modul
function celebrateHtmlCompletion() {
  if (sandboxFeedback) {
    sandboxFeedback.textContent = "HTML abgeschlossen! Nächstes: CSS – Jetzt machen wir deine Seite bunt!";
  }
  if (htmlLevelPanel) {
    htmlLevelPanel.classList.add("just-unlocked");
    setTimeout(() => htmlLevelPanel.classList.remove("just-unlocked"), 1200);
  }
}

// Wird ausgelöst, wenn man die Theorie gelesen hat
// Markiert die Phase als erledigt und aktualisiert die Anzeige
function handleTheoryDone() {
  const levelKey = getHtmlState().activeLevel || 1;
  updateLevelState(levelKey, { theoryDone: true });
  renderHtmlLab();
  renderLevelOverview();
  onProgress(computeHtmlProgress());
}

// Prüft die Check-Frage (Multiple-Choice)
// Bei richtiger Antwort wird die Phase abgehakt
function handleCheckSubmit() {
  const levelKey = getHtmlState().activeLevel || 1;
  const config = HTML_LEVELS[levelKey].check;
  const selected = checkBody?.querySelector("input[type='radio']:checked");
  const value = selected?.value;
  if (!value) {
    if (checkFeedback) checkFeedback.textContent = "Wähle eine Option aus.";
    return;
  }
  if (value === config.answer) {
    updateLevelState(levelKey, { checkDone: true });
    if (checkFeedback) checkFeedback.textContent = "Richtig – weiter zur Sandbox!";
    renderPhaseBadges(levelKey);
    renderHtmlLab();
    renderLevelOverview();
    onProgress(computeHtmlProgress());
  } else if (checkFeedback) {
    checkFeedback.textContent = config.tip || "Knapp daneben. Schau dir die Theorie nochmal an.";
  }
}

// Verbindet alle Buttons und Eingabefelder mit den passenden Funktionen
// Wird einmal beim Start der App aufgerufen
export function wireHtmlLab(options = {}) {
  onProgress = options.onProgress || (() => {});
  onSandboxComplete = options.onSandboxComplete || (() => {});
  openLevelHandler = options.onOpenLevel || openLevelHandler;
  loadHtmlState();

  // Registriert Klicks auf die Level-Tabs (1 bis 16)
  htmlLevelTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const level = Number(btn.dataset.htmlLevel || "1");
      setActiveLevel(level);
      renderHtmlLab();
    });
  });

  // Verbindet die drei Hauptbuttons: Theorie, Check-Submit, Vorschau und Sandbox-Check
  if (theoryDoneBtn) theoryDoneBtn.addEventListener("click", handleTheoryDone);
  if (checkSubmit) checkSubmit.addEventListener("click", handleCheckSubmit);
  if (sandboxShowPreviewBtn) sandboxShowPreviewBtn.addEventListener("click", () => showHtmlPreview(getHtmlState().activeLevel || 1));
  if (sandboxCheckBtn) sandboxCheckBtn.addEventListener("click", () => checkHtmlResult(getHtmlState().activeLevel || 1));

  // Speichert den Code-Fortschritt bei jeder Eingabe im Editor
  if (sandboxEditor) {
    sandboxEditor.addEventListener("input", () => {
      const level = getHtmlState().activeLevel || 1;
      updateLevelState(level, { sandboxValue: sandboxEditor.value });
    });
  }

  renderHtmlLab();
}

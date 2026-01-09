import { CSS_LEVELS, CSS_BASE_HTML, getCssPreviewHtml } from "./css-content.js";

// Speicher-Schlüssel für den CSS-Fortschritt im Browser
const CSS_STATE_KEY = "cyj:css_state";

// Alle wichtigen HTML-Elemente aus dem Dokument holen
const cssPanel = document.getElementById("css-level-panel");
const cssTabs = document.querySelectorAll("[data-css-level]");
const cssLevelTitle = document.getElementById("css-level-title");
const cssLevelDesc = document.getElementById("css-level-desc");
const cssTheoryText = document.getElementById("css-theory-text");
const cssTheoryBtn = document.getElementById("css-theory-done");
const cssCheckBody = document.getElementById("css-check-body");
const cssCheckBtn = document.getElementById("css-check-submit");
const cssCheckFeedback = document.getElementById("css-check-feedback");
const cssSandboxHint = document.getElementById("css-sandbox-hint");
const cssChecklist = document.getElementById("css-sandbox-checklist");
const cssEditor = document.getElementById("css-sandbox-editor");
const cssSandboxShowPreviewBtn = document.getElementById("css-sandbox-show-preview");
const cssSandboxCheckBtn = document.getElementById("css-sandbox-check");
const cssPreview = document.getElementById("css-sandbox-preview");
const cssFeedback = document.getElementById("css-sandbox-feedback");
const cssOverview = document.getElementById("css-level-overview");
const cssPhaseBadges = document.getElementById("css-phase-badges");
const cssTheoryCard = document.getElementById("css-phase-theory");
const cssCheckCard = document.getElementById("css-phase-check");
const cssSandboxCard = document.getElementById("css-phase-sandbox");

// Aktueller Lernstand (wird aus localStorage geladen)
let cssState = buildDefaultCssState();
// Callback-Funktion, die bei Fortschritt aufgerufen wird
let onCssProgress = () => {};
let onSandboxComplete = () => {};

// Erstellt einen frischen Lernstand für alle CSS-Level
// Nutzt den Standard-CSS-Code aus css-content.js
function buildDefaultCssState() {
	// Startzustand für alle CSS-Level mit Demo-CSS füllen
  const levels = {};
  Object.keys(CSS_LEVELS).forEach((key) => {
    levels[key] = {
      theoryDone: false,
      checkDone: false,
      sandboxDone: false,
		// Speichert, welche der 3 Sandbox-Aufgaben schon erledigt sind
		tasksDone: [false, false, false],
		// Was zuletzt per "Vorschau" angezeigt wurde
		previewCssValue: CSS_LEVELS[key].sandbox.defaultCss,
      cssValue: CSS_LEVELS[key].sandbox.defaultCss,
    };
  });
  return { activeLevel: 1, levels };
}

// Lädt den gespeicherten Lernstand aus dem Browser (localStorage)
// Falls nichts gespeichert ist, wird der Default-Stand genutzt
function loadCssState() {
	// Gespeicherten Stand aus localStorage laden
  try {
    const stored = JSON.parse(localStorage.getItem(CSS_STATE_KEY) || "null");
    const levels = {};
    Object.keys(CSS_LEVELS).forEach((key) => {
      levels[key] = {
        ...cssState.levels[key],
        ...(stored?.levels?.[key] || {}),
			// Fallback, falls ältere Speicherstände noch kein tasksDone haben
			tasksDone: stored?.levels?.[key]?.tasksDone || cssState.levels[key]?.tasksDone || [false, false, false],
			previewCssValue: stored?.levels?.[key]?.previewCssValue || cssState.levels[key]?.previewCssValue || CSS_LEVELS[key].sandbox.defaultCss,
      };
    });
    cssState = { ...cssState, ...(stored || {}), levels };
  } catch (err) {
    console.warn("Konnte CSS-State nicht laden", err);
    cssState = buildDefaultCssState();
  }
  return cssState;
}

export function hydrateCssState() {
	return loadCssState();
}

// Speichert den aktuellen Lernstand im Browser
// So bleibt der Fortschritt auch nach dem Schließen erhalten
function saveCssState() {
	// Aktuellen Stand speichern
  localStorage.setItem(CSS_STATE_KEY, JSON.stringify(cssState));
}

// Merkt sich, welches Level gerade geöffnet ist
function setCssActiveLevel(level) {
  cssState.activeLevel = level;
  saveCssState();
}

// Berechnet den Gesamt-Fortschritt (alle Phasen aller Level)
export function computeCssProgress() {
  const totalSteps = Object.keys(CSS_LEVELS).length * 3;
  let done = 0;
  Object.values(cssState.levels).forEach((lvl) => {
    if (lvl.theoryDone) done += 1;
    if (lvl.checkDone) done += 1;
    if (lvl.sandboxDone) done += 1;
  });
  return totalSteps ? Math.round((done / totalSteps) * 100) : 0;
}

// ADMIN-Funktion: Schaltet alle CSS-Level frei (für Tests)
export function completeAllCssLevels() {
  Object.keys(cssState.levels).forEach((key) => {
    cssState.levels[key] = {
      ...cssState.levels[key],
      theoryDone: true,
      checkDone: true,
      sandboxDone: true,
		tasksDone: [true, true, true],
  		previewCssValue: cssState.levels[key].previewCssValue,
      cssValue: cssState.levels[key].cssValue,
    };
  });
  cssState.activeLevel = 1;
  saveCssState();
}

export function resetCssLevel(levelKey) {
  loadCssState();
  const key = String(levelKey);
  if (!CSS_LEVELS[key]) return;
  cssState.levels[key] = {
    theoryDone: false,
    checkDone: false,
    sandboxDone: false,
		tasksDone: [false, false, false],
    previewCssValue: CSS_LEVELS[key].sandbox.defaultCss,
    cssValue: CSS_LEVELS[key].sandbox.defaultCss,
  };
  saveCssState();
}

// Baut das iframe-Dokument für die Vorschau
// Kombiniert level-spezifisches HTML mit dem CSS-Code
function renderCssPreview(levelKey, cssText) {
  // iframe-Dokument für die Vorschau bauen
  if (!cssPreview) return;
  const css = cssText || "";
  const previewHtml = (typeof getCssPreviewHtml === "function" ? getCssPreviewHtml(levelKey) : CSS_BASE_HTML) || CSS_BASE_HTML;
  const doc = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { margin: 0; padding: 16px; background: white; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
      .page { max-width: 760px; }
    /* Basis-Styling nur für die Vorschau (damit die Layout-Boxen direkt sichtbar sind). */
    .span-demo span { display: inline; padding: 6px 10px; margin-right: 6px; border-radius: 8px; background-color: #dbeafe; }
    .container { margin-top: 12px; padding: 12px; border: 2px dashed #9ca3af; background-color: #f3f4f6; }
    .demo-box { padding: 12px; border-radius: 10px; font-weight: 600; }
    .demo-a { background-color: #fecaca; }
    .demo-b { background-color: #bbf7d0; }
    .demo-c { background-color: #bfdbfe; }
    </style>
    <style>${css}</style>
  </head>
  <body>${previewHtml}</body>
</html>`;

  if ("srcdoc" in cssPreview) {
    cssPreview.srcdoc = doc;
  } else {
    cssPreview.innerHTML = `<style>${css}</style>${previewHtml}`;
  }
}

function renderChecklist(levelKey) {
	// Checkliste neu malen und fertig abhaken, wenn Sandbox durch ist.
  if (!cssChecklist) return;
  cssChecklist.innerHTML = "";
  const tasks = CSS_LEVELS[levelKey].sandbox.checklist;
  const state = cssState.levels[levelKey];
  const doneList = state.tasksDone || [false, false, false];
  tasks.forEach((task, idx) => {
    const li = document.createElement("li");
    li.textContent = task;
    li.classList.toggle("is-done", !!state.sandboxDone || !!doneList[idx]);
    cssChecklist.appendChild(li);
  });
}

function renderTabs(levelKey) {
  cssTabs.forEach((btn) => {
    const lvl = Number(btn.dataset.cssLevel);
    btn.classList.toggle("is-active", lvl === levelKey);
  });
}

function renderCssPhaseBadges(levelKey) {
  // Zeigt die 3 Phasen wie beim HTML-Modul als kleine Pills.
  if (!cssPhaseBadges) return;
  const state = cssState.levels[levelKey];
  const badges = [
    { label: "Theorie", done: state.theoryDone },
    { label: "Check", done: state.checkDone },
    { label: "Sandbox", done: state.sandboxDone },
  ];
  cssPhaseBadges.innerHTML = "";
  badges.forEach((badge) => {
    const span = document.createElement("span");
    span.className = `pill ${badge.done ? "is-done" : ""}`;
    span.textContent = badge.done ? `${badge.label} ✓` : badge.label;
    cssPhaseBadges.appendChild(span);
  });
}

function getCurrentCssPhase(levelState) {
  // Bestimmt, welche Phase als nächstes dran ist.
  if (!levelState?.theoryDone) return "theory";
  if (!levelState?.checkDone) return "check";
  if (!levelState?.sandboxDone) return "sandbox";
  return "done";
}

function setCssPhaseVisibility(currentPhase) {
  // Genau wie im HTML-Modul: wir zeigen immer nur die aktuelle Phase.
  const show = (card, key) => {
    if (!card) return;
    const isVisible = key === currentPhase || (currentPhase === "done" && key === "sandbox");
    card.hidden = !isVisible;
    card.style.display = isVisible ? "grid" : "none";
  };

  show(cssTheoryCard, "theory");
  show(cssCheckCard, "check");
  show(cssSandboxCard, "sandbox");
}

export function renderCssLevelOverview(onOpenLevel) {
  if (!cssOverview) return;
  const openHandler = onOpenLevel || (() => {});
  loadCssState();
  cssOverview.innerHTML = "";

  Object.entries(CSS_LEVELS).forEach(([key, data]) => {
    const state = cssState.levels[key];
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
    badge.className = `pill ${cssState.activeLevel === Number(key) ? "is-done" : ""}`;
    badge.textContent = cssState.activeLevel === Number(key) ? "Aktiv" : "Bereit";

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
			if (isRepeat) resetCssLevel(Number(key));
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

    cssOverview.appendChild(card);
  });
}

function renderCheck(levelKey) {
  if (!cssCheckBody) return;
  const cfg = CSS_LEVELS[levelKey].check;
  const name = `css-check-${levelKey}`;
  cssCheckBody.innerHTML = "";

  const p = document.createElement("p");
  p.className = "muted";
  p.textContent = cfg.question;
  cssCheckBody.appendChild(p);

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
  cssCheckBody.appendChild(wrap);
}

function renderSandbox(levelKey) {
  const data = CSS_LEVELS[levelKey];
  if (cssSandboxHint) {
    const prompt = data.sandbox.prompt || "";
    const help = data.sandbox.help || "";
    cssSandboxHint.textContent = help ? `${prompt} Tipp: ${help}` : prompt;
  }
  if (cssEditor) cssEditor.value = cssState.levels[levelKey].cssValue;

	// Vorschau wird nur per Button aktualisiert (wir zeigen hier den letzten Stand).
	renderCssPreview(levelKey, cssState.levels[levelKey].previewCssValue);
  renderChecklist(levelKey);
  if (cssFeedback) cssFeedback.textContent = cssState.levels[levelKey].sandboxDone ? "Sieht gut aus!" : "";
}

function renderCssLabUI() {
  const levelKey = cssState.activeLevel;
  const data = CSS_LEVELS[levelKey];
  if (!data) return;
	const phase = getCurrentCssPhase(cssState.levels[levelKey]);

  renderTabs(levelKey);
  if (cssLevelTitle) cssLevelTitle.textContent = data.title;
  if (cssLevelDesc) cssLevelDesc.textContent = "Drei Phasen: Theorie, Check, Sandbox.";
  if (cssTheoryText) cssTheoryText.textContent = data.theory;
	renderCssPhaseBadges(levelKey);
	setCssPhaseVisibility(phase);
  if (cssTheoryBtn) {
    cssTheoryBtn.disabled = cssState.levels[levelKey].theoryDone;
    cssTheoryBtn.textContent = cssState.levels[levelKey].theoryDone ? "Abgehakt" : "Gelesen";
  }
	if (cssCheckFeedback) cssCheckFeedback.textContent = cssState.levels[levelKey].checkDone ? "Sauber, weiter geht's!" : "";
  renderCheck(levelKey);
  renderSandbox(levelKey);
}

function pruefeTeilaufgaben(levelKey, cssText) {
	// Hier prüfen wir die 3 Sandbox-Aufgaben pro Level.
  const css = cssText || "";

  const findMediaSegment = (maxWidthPx) => {
    const re = new RegExp(`@media\\s*\\(\\s*max-width\\s*:\\s*${maxWidthPx}px\\s*\\)`, "i");
    const idx = css.search(re);
    if (idx < 0) return "";
    return css.slice(idx, idx + 900);
  };

  if (levelKey === 1) {
    const pBlue = /p\s*{[^}]*color\s*:\s*blue\s*;/i.test(css);
    const h1Green = /h1\s*{[^}]*color\s*:\s*green\s*;/i.test(css);
    const bodyBg = /body\s*{[^}]*background-color\s*:\s*lightgrey\s*;/i.test(css);
    const erledigt = [pBlue, h1Green, bodyBg];
    const tip = !pBlue
      ? "Färbe die p-Texte mit color: blue;"
      : !h1Green
        ? "Mach die h1 grün."
        : !bodyBg
          ? "Setze background-color: lightgrey; auf body."
          : "";
    return { erledigt, tip };
  }

  if (levelKey === 2) {
    const boxBg = /\.box\s*{[^}]*background-color\s*:\s*[^;]+;/i.test(css);
    const hlOrange = /\.highlight\s*{[^}]*color\s*:\s*orange\s*;/i.test(css);
    const randBorder = /\.rand\s*{[^}]*border\s*:\s*2px\s+solid\s+black\s*;/i.test(css);
    const erledigt = [boxBg, hlOrange, randBorder];
    const tip = !boxBg
      ? "Gib .box eine Hintergrundfarbe."
      : !hlOrange
        ? "Setze color: orange; auf .highlight."
        : !randBorder
          ? "Schreibe border: 2px solid black; für .rand."
          : "";
    return { erledigt, tip };
  }

  if (levelKey === 3) {
    const h1Size = /h1\s*{[^}]*font-size\s*:\s*50px\s*;/i.test(css);
    const h1Center = /h1\s*{[^}]*text-align\s*:\s*center\s*;/i.test(css);
    const pSize = /p\s*{[^}]*font-size\s*:\s*18px\s*;/i.test(css);
    const pRight = /p\s*{[^}]*text-align\s*:\s*right\s*;/i.test(css);
    const erledigt = [h1Size, h1Center, pSize && pRight];
    const tip = !h1Size
      ? "Schreibe font-size: 50px; für h1."
      : !h1Center
        ? "Richte h1 mit text-align: center; aus."
        : !pSize
          ? "Setze p auf font-size: 18px;."
          : !pRight
            ? "Richte p nach rechts aus (text-align: right;)."
            : "";
    return { erledigt, tip };
  }

  if (levelKey === 4) {
    const pad = /\.box\s*{[^}]*padding\s*:\s*20px\s*;/i.test(css);
    const marginTop = /\.box\s*{[^}]*margin-top\s*:\s*40px\s*;/i.test(css);
    const border = /\.box\s*{[^}]*border\s*:\s*5px\s+solid\s+red\s*;/i.test(css);
    const erledigt = [pad, marginTop, border];
    const tip = !pad
      ? "Setze padding: 20px; auf .box."
      : !marginTop
        ? "margin-top: 40px; fehlt bei .box."
        : !border
          ? "Rahmen fehlt: border: 5px solid red;"
          : "";
    return { erledigt, tip };
  }

  if (levelKey === 5) {
    // Hex-Farben: .hintergrund, .titel, .knopf
    const bgDark = /\.hintergrund\s*{[^}]*background-color\s*:\s*#333333\s*;/i.test(css);
    const titleGold = /\.titel\s*{[^}]*color\s*:\s*#ffd700\s*;/i.test(css);
    const btnText = /\.knopf\s*{[^}]*color\s*:\s*#ffffff\s*;/i.test(css);
    const btnBg = /\.knopf\s*{[^}]*background(-color)?\s*:\s*#0000ff\s*;/i.test(css);
		const erledigt = [bgDark, titleGold, btnText && btnBg];
		const tip = !bgDark
			? "Setze für .hintergrund background-color: #333333;"
			: !titleGold
				? "Gib .titel die Farbe color: #ffd700;"
				: !btnText
					? "In .knopf fehlt noch: color: #ffffff;"
					: !btnBg
						? "In .knopf fehlt noch: background-color: #0000ff;"
						: "";
		return { erledigt, tip };
  }

  if (levelKey === 6) {
    // Schriften: body Arial, h1 Times New Roman, .text-block Verdana + sans-serif
    const bodyArial = /body\s*{[^}]*font-family\s*:\s*['\"]?Arial['\"]?\s*;?/i.test(css);
    const h1Serif = /h1\s*{[^}]*font-family\s*:\s*['\"]?Times\s+New\s+Roman['\"]?\s*;?/i.test(css);
    const blockVerdana = /\.text-block\s*{[^}]*font-family\s*:\s*Verdana\s*,\s*sans-serif\s*;?/i.test(css);
		const erledigt = [bodyArial, h1Serif, blockVerdana];
		const tip = !bodyArial
			? "Setze im body: font-family: Arial;"
			: !h1Serif
				? "Gib h1 z. B.: font-family: \"Times New Roman\";"
				: !blockVerdana
					? "Setze .text-block: font-family: Verdana, sans-serif;"
					: "";
		return { erledigt, tip };
  }

  if (levelKey === 7) {
    // Border & Radius
    const cardBorder = /\.karte\s*{[^}]*border\s*:\s*2px\s+solid\s+black\s*;/i.test(css);
    const cardRadius = /\.karte\s*{[^}]*border-radius\s*:\s*10px\s*;/i.test(css);
    const circleW = /\.kreis\s*{[^}]*width\s*:\s*100px\s*;/i.test(css);
    const circleH = /\.kreis\s*{[^}]*height\s*:\s*100px\s*;/i.test(css);
    const circleR = /\.kreis\s*{[^}]*border-radius\s*:\s*50%\s*;/i.test(css);
    const imgR = /img\s*{[^}]*border-radius\s*:\s*4px\s*;/i.test(css);
    const erledigt = [cardBorder && cardRadius, circleW && circleH && circleR, imgR];
    const tip = !cardBorder || !cardRadius
      ? "Für .karte fehlt border: 2px solid black; und/oder border-radius: 10px;"
      : !circleW || !circleH || !circleR
        ? "Für .kreis setze width: 100px; height: 100px; und border-radius: 50%;"
        : !imgR
          ? "Setze für img: border-radius: 4px;"
          : "";
    return { erledigt, tip };
  }

  if (levelKey === 8) {
    // Schatten
    const boxShadow = /\.box\s*{[^}]*box-shadow\s*:\s*5px\s+5px\s+10px\s+black\s*;/i.test(css);
    const glow = /\.glow\s*{[^}]*box-shadow\s*:\s*0px\s+0px\s+20px\s+yellow\s*;/i.test(css);
    const comboBg = /\.combo\s*{[^}]*background-color\s*:\s*[^;]+;/i.test(css);
    const comboRadius = /\.combo\s*{[^}]*border-radius\s*:\s*\d+px\s*;/i.test(css);
    const comboShadow = /\.combo\s*{[^}]*box-shadow\s*:\s*\d+px\s+\d+px\s+\d+px\s+[^;]+;/i.test(css);
    const erledigt = [boxShadow, glow, comboBg && comboRadius && comboShadow];
    const tip = !boxShadow
      ? "Gib .box den Schatten: box-shadow: 5px 5px 10px black;"
      : !glow
        ? "Für Glow setze .glow: box-shadow: 0px 0px 20px yellow;"
        : !comboBg || !comboRadius || !comboShadow
          ? "Bei .combo fehlen noch: background-color, border-radius und ein dezenter box-shadow."
          : "";
    return { erledigt, tip };
  }

  if (levelKey === 9) {
    // 1) span werden block, 2) Boxen werden inline-block, 3) Boxen bekommen width 100px
    const spanBlock =
      /span\s*{[^}]*display\s*:\s*block\s*;/i.test(css) ||
      /\.span-demo\s+span\s*{[^}]*display\s*:\s*block\s*;/i.test(css);
    const boxInline = /\.box\s*{[^}]*display\s*:\s*inline-block\s*;/i.test(css);
    const boxWidth = /\.box\s*{[^}]*width\s*:\s*100px\s*;/i.test(css);
    const erledigt = [spanBlock, boxInline, boxWidth];
    const tip = !spanBlock
      ? "Setze die spans auf display: block; (z. B. span { display: block; })"
      : !boxInline
        ? "Setze die Boxen auf display: inline-block;"
        : !boxWidth
          ? "Gib den Boxen width: 100px;"
          : "";
    return { erledigt, tip };
  }

  if (levelKey === 10) {
    // Flexbox starten
    const containerFlex = /\.container\s*{[^}]*display\s*:\s*flex\s*;/i.test(css);
    const boxMargin = /\.box\s*{[^}]*margin\s*:\s*10px\s*;/i.test(css);
    const containerBg = /\.container\s*{[^}]*background-color\s*:\s*[^;]+;/i.test(css);
    const erledigt = [containerFlex, boxMargin, containerBg];
    const tip = !containerFlex
      ? "Aktiviere Flexbox in .container: display: flex;"
      : !boxMargin
        ? "Gib den Boxen margin: 10px;"
        : !containerBg
          ? "Gib .container eine Hintergrundfarbe (background-color)."
          : "";
    return { erledigt, tip };
  }

  if (levelKey === 11) {
    // Hier schauen wir, ob die Boxen nebeneinander stehen (Flexbox) und ob justify-content stimmt.
    const containerFlex = /\.container\s*{[^}]*display\s*:\s*flex\s*;/i.test(css);
    const jcCenter = /\.container\s*{[^}]*justify-content\s*:\s*center\s*;/i.test(css);
    const jcAround = /\.container\s*{[^}]*justify-content\s*:\s*space-around\s*;/i.test(css);
    const jcEnd = /\.container\s*{[^}]*justify-content\s*:\s*flex-end\s*;/i.test(css);
    const erledigt = [containerFlex && jcCenter, containerFlex && jcAround, containerFlex && jcEnd];
    const tip = !containerFlex
      ? "Schalte zuerst Flexbox ein: .container { display: flex; }"
      : !jcCenter && !jcAround && !jcEnd
        ? "Setze justify-content (z. B. center / space-around / flex-end)."
        : "";
    return { erledigt, tip };
  }

  if (levelKey === 12) {
    // Vertikale Ausrichtung mit align-items.
    const containerFlex = /\.container\s*{[^}]*display\s*:\s*flex\s*;/i.test(css);
    const aiCenter = /\.container\s*{[^}]*align-items\s*:\s*center\s*;/i.test(css);
    const jcCenter = /\.container\s*{[^}]*justify-content\s*:\s*center\s*;/i.test(css);
    const aiEnd = /\.container\s*{[^}]*align-items\s*:\s*flex-end\s*;/i.test(css);
    const erledigt = [containerFlex && aiCenter, containerFlex && jcCenter, containerFlex && aiEnd];
    const tip = !containerFlex
      ? "Schalte zuerst Flexbox ein: .container { display: flex; }"
      : !aiCenter && !aiEnd
        ? "Setze align-items (z. B. center oder flex-end)."
        : "";
    return { erledigt, tip };
  }

  if (levelKey === 13) {
    const boxFull = /\.bild-box\s*{[^}]*width\s*:\s*100%\s*;?/i.test(css);
    const spalteHalf = /\.spalte\s*{[^}]*width\s*:\s*50%\s*;?/i.test(css);
    const maxW = /\.layout-container\s*{[^}]*max-width\s*:\s*800px\s*;?/i.test(css);
    const erledigt = [boxFull, spalteHalf, maxW];
    const tip = !boxFull
      ? "Setze .bild-box auf width: 100%;"
      : !spalteHalf
        ? "Setze .spalte auf width: 50%;"
        : !maxW
          ? "Setze .layout-container auf max-width: 800px;"
          : "";
    return { erledigt, tip };
  }

  if (levelKey === 14) {
    const segment = findMediaSegment(600);
    const hasMedia = /@media\s*\(\s*max-width\s*:\s*600px\s*\)/i.test(css);
    const bodyBlue = /body\s*{[^}]*background-color\s*:\s*lightblue\s*;?/i.test(segment || "");
    const h1Small = /h1\s*{[^}]*font-size\s*:\s*24px\s*;?/i.test(segment || "");
    const erledigt = [hasMedia, bodyBlue, h1Small];
    const tip = !hasMedia
      ? "Schreibe eine Media Query: @media (max-width: 600px) { ... }"
      : !bodyBlue
        ? "Setze IN der Media Query: body { background-color: lightblue; }"
        : !h1Small
          ? "Setze IN der Media Query: h1 { font-size: 24px; }"
          : "";
    return { erledigt, tip };
  }

  if (levelKey === 15) {
    const galerieFlex = /\.galerie\s*{[^}]*display\s*:\s*flex\s*;?/i.test(css);
    const galerieWrap = /\.galerie\s*{[^}]*flex-wrap\s*:\s*wrap\s*;?/i.test(css);
    const galerieCenter = /\.galerie\s*{[^}]*justify-content\s*:\s*center\s*;?/i.test(css);
    const itemW = /\.galerie-item\s*{[^}]*width\s*:\s*200px\s*;?/i.test(css);
    const erledigt = [galerieFlex && galerieWrap, galerieCenter, itemW];
    const tip = !galerieFlex || !galerieWrap
      ? "Setze .galerie auf display: flex; und flex-wrap: wrap;"
      : !galerieCenter
        ? "Setze .galerie auf justify-content: center;"
        : !itemW
          ? "Gib .galerie-item width: 200px;"
          : "";
    return { erledigt, tip };
  }

  if (levelKey === 16) {
    const segment = findMediaSegment(500);
    const hasMedia = /@media\s*\(\s*max-width\s*:\s*500px\s*\)/i.test(css);
    const sidebarHide = /\.seitenleiste\s*{[^}]*display\s*:\s*none\s*;?/i.test(segment || "");
    const menuShow = /\.menue-knopf\s*{[^}]*display\s*:\s*block\s*;?/i.test(segment || "");
    const erledigt = [hasMedia, sidebarHide, menuShow];
    const tip = !hasMedia
      ? "Schreibe eine Media Query: @media (max-width: 500px) { ... }"
      : !sidebarHide
        ? "Setze IN der Media Query: .seitenleiste { display: none; }"
        : !menuShow
          ? "Setze IN der Media Query: .menue-knopf { display: block; }"
          : "";
    return { erledigt, tip };
  }
  return { erledigt: [false, false, false], tip: "Unbekanntes Level." };
}

function checkCssLevel(levelKey, cssText) {
  // Kompatibel zum alten Rückgabeformat (ok/tip), aber mit Teilaufgaben.
  const res = pruefeTeilaufgaben(levelKey, cssText);
  return { ok: res.erledigt.every(Boolean), tip: res.tip, erledigt: res.erledigt };
}

function handleTheoryDone() {
  const levelKey = cssState.activeLevel;
  cssState.levels[levelKey].theoryDone = true;
  saveCssState();
  renderCssLabUI();
  onCssProgress(computeCssProgress());
}

function handleCheckSubmit() {
  const levelKey = cssState.activeLevel;
  const cfg = CSS_LEVELS[levelKey].check;
  const selected = cssCheckBody?.querySelector("input[type='radio']:checked");
  const value = selected?.value;
  if (!value) {
    if (cssCheckFeedback) cssCheckFeedback.textContent = "Bitte wähle eine Antwort.";
    return;
  }
  if (value === cfg.answer) {
    cssState.levels[levelKey].checkDone = true;
    saveCssState();
    if (cssCheckFeedback) cssCheckFeedback.textContent = "Richtig!";
    renderCssLabUI();
    onCssProgress(computeCssProgress());
  } else {
    if (cssCheckFeedback) cssCheckFeedback.textContent = cfg.tip || "Schau nochmal.";
  }
}

function handleSandboxShowPreview() {
  // Zeigt die Vorschau, ohne das Level als fertig zu markieren.
  const levelKey = cssState.activeLevel;
  if (!cssEditor) return;
  const value = cssEditor.value;
  cssState.levels[levelKey].cssValue = value;
  cssState.levels[levelKey].previewCssValue = value;
  saveCssState();
  renderCssPreview(levelKey, value);
  if (cssFeedback && !cssState.levels[levelKey].sandboxDone) cssFeedback.textContent = "Vorschau aktualisiert.";
}

function handleSandboxCheck() {
  // Prüft, ob die Aufgabe erfüllt ist. Bei Erfolg wird abgehakt.
  const levelKey = cssState.activeLevel;
  if (!cssEditor) return;
  const value = cssEditor.value;
  cssState.levels[levelKey].cssValue = value;
  saveCssState();

  const result = checkCssLevel(levelKey, value);
  const vorher = cssState.levels[levelKey].tasksDone || [false, false, false];
  const jetzt = vorher.map((ok, idx) => ok || !!result.erledigt?.[idx]);
  cssState.levels[levelKey].tasksDone = jetzt;
  cssState.levels[levelKey].sandboxDone = jetzt.every(Boolean);
  saveCssState();

  renderChecklist(levelKey);

  if (cssState.levels[levelKey].sandboxDone) {
    onSandboxComplete(levelKey);
    const reward = CSS_LEVELS[levelKey]?.reward ? ` ${CSS_LEVELS[levelKey].reward}` : "";
    if (cssFeedback) {
      cssFeedback.textContent = levelKey === 4 ? CSS_LEVELS[levelKey].sandbox.finishText : `Top, weiter!${reward}`;
    }
    onCssProgress(computeCssProgress());
    renderCssLabUI();
  } else {
    if (cssFeedback) cssFeedback.textContent = result.tip;
  }
}

export function renderCssLab() {
  loadCssState();
  if (!cssPanel) return;
  cssPanel.hidden = false;
  cssPanel.removeAttribute("hidden");
  renderCssLabUI();
}

export function wireCssLab(options = {}) {
  onCssProgress = options.onProgress || (() => {});
  onSandboxComplete = options.onSandboxComplete || (() => {});
  loadCssState();

  cssTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lvl = Number(btn.dataset.cssLevel);
      setCssActiveLevel(lvl);
      renderCssLabUI();
    });
  });

  if (cssTheoryBtn) cssTheoryBtn.addEventListener("click", handleTheoryDone);
  if (cssCheckBtn) cssCheckBtn.addEventListener("click", handleCheckSubmit);
  if (cssSandboxShowPreviewBtn) cssSandboxShowPreviewBtn.addEventListener("click", handleSandboxShowPreview);
  if (cssSandboxCheckBtn) cssSandboxCheckBtn.addEventListener("click", handleSandboxCheck);

  if (cssEditor) {
    cssEditor.addEventListener("input", () => {
      const lvl = cssState.activeLevel;
      cssState.levels[lvl].cssValue = cssEditor.value;
      saveCssState();
    });
  }

  renderCssLab();
}

export function getCssState() {
  return cssState;
}

export { setCssActiveLevel };

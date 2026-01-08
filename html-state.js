import { HTML_LEVELS } from "./html-levels.js";

// Speicher-Schlüssel für den HTML-Fortschritt im Browser
export const HTML_STATE_KEY = "cyj:html_state";

// Erstellt einen frischen Lernstand für alle HTML-Level
// Alle Level starten mit "nicht erledigt"
export function buildDefaultHtmlState() {
  const levels = {};
  Object.keys(HTML_LEVELS).forEach((key) => {
		// previewValue: Was zuletzt per "Vorschau" angezeigt wurde (unabhängig vom "fertig"-Haken)
    levels[key] = { theoryDone: false, checkDone: false, sandboxDone: false, sandboxValue: "", previewValue: "" };
  });
  return { activeLevel: 1, levels };
}

// Standard-Zustand, falls nichts gespeichert ist
export const defaultHtmlState = buildDefaultHtmlState();
// Aktueller Lernstand (wird beim Laden mit localStorage überschrieben)
export let htmlState = { ...defaultHtmlState };

// Gibt den aktuellen HTML-Lernstand zurück
export function getHtmlState() {
  return htmlState;
}

// Lädt den gespeicherten Lernstand aus dem Browser (localStorage)
// Falls nichts gespeichert ist oder ein Fehler auftritt, wird der Default-Stand genutzt
export function loadHtmlState() {
  try {
    const stored = JSON.parse(localStorage.getItem(HTML_STATE_KEY) || "null");
    const mergedLevels = {};
    Object.keys(HTML_LEVELS).forEach((key) => {
      mergedLevels[key] = { ...defaultHtmlState.levels[key], ...(stored?.levels?.[key] || {}) };
    });
    htmlState = { ...defaultHtmlState, ...(stored || {}), levels: mergedLevels };
  } catch (error) {
    console.warn("Konnte HTML-State nicht laden, verwende Defaults", error);
    htmlState = { ...defaultHtmlState };
  }
  return htmlState;
}

// Speichert den aktuellen Lernstand im Browser
// So bleibt der Fortschritt auch nach dem Schließen erhalten
export function persistHtmlState() {
  localStorage.setItem(HTML_STATE_KEY, JSON.stringify(htmlState));
}

// Setzt einen neuen Lernstand und speichert ihn
export function setHtmlState(nextState) {
  htmlState = nextState;
  persistHtmlState();
}

// Merkt sich, welches Level gerade geöffnet ist
export function setActiveLevel(levelKey) {
  htmlState.activeLevel = levelKey;
  persistHtmlState();
}

// ADMIN-Funktion: Schaltet alle HTML-Level frei (für Tests)
export function completeAllHtmlLevels() {
  // Alle Level als erledigt markieren
  Object.keys(htmlState.levels).forEach((key) => {
    htmlState.levels[key] = {
      ...htmlState.levels[key],
      theoryDone: true,
      checkDone: true,
      sandboxDone: true,
      sandboxValue: htmlState.levels[key].sandboxValue || "",
    };
  });
  htmlState.activeLevel = 1;
  persistHtmlState();
}

// Aktualisiert ein bestimmtes Level mit neuen Werten (z.B. checkDone: true)
export function updateLevelState(levelKey, patch) {
  htmlState.levels[levelKey] = { ...htmlState.levels[levelKey], ...patch };
  persistHtmlState();
}

// Setzt ein Level komplett zurück (für "Level wiederholen")
export function resetHtmlLevel(levelKey) {
  loadHtmlState();
  updateLevelState(levelKey, {
    theoryDone: false,
    checkDone: false,
    sandboxDone: false,
    sandboxValue: "",
		previewValue: "",
  });
}

export function computeHtmlProgress() {
  let done = 0;
  const totalSteps = Object.keys(HTML_LEVELS).length * 3;
  Object.values(htmlState.levels).forEach((level) => {
    if (level.theoryDone) done += 1;
    if (level.checkDone) done += 1;
    if (level.sandboxDone) done += 1;
  });
  return totalSteps ? Math.round((done / totalSteps) * 100) : 0;
}

export function getCurrentPhase(levelState) {
  if (!levelState.theoryDone) return "theory";
  if (!levelState.checkDone) return "check";
  if (!levelState.sandboxDone) return "sandbox";
  return "done";
}

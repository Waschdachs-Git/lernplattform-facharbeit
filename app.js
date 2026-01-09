import { HTML_LEVELS } from "./html-levels.js";
import { computeHtmlProgress, loadHtmlState, setActiveLevel, getHtmlState } from "./html-state.js";
import { renderHtmlLab, renderLevelOverview, wireHtmlLab } from "./html-lab.js";
import { CSS_LEVELS } from "./css-content.js";
import {
	wireCssLab,
	renderCssLab,
	computeCssProgress,
	hydrateCssState,
	completeAllCssLevels,
	setCssActiveLevel,
	renderCssLevelOverview,
	getCssState,
} from "./css-editor.js";
import { completeAllHtmlLevels } from "./html-state.js";
import {
	wireJsLab,
	renderJsLab,
	hydrateJsState,
	computeJsProgress,
	setJsActiveLevel,
	renderJsLevelOverview,
	getJsState,
	completeAllJsLevels,
} from "./js-editor.js";
import { JS_LEVELS } from "./js-content.js";

// Speicher-Schlüssel für localStorage
const NAME_KEY = "cyj:name"; // Name des Nutzers
const PROGRESS_KEY = "cyj:progress"; // Fortschritt pro Modul

// Alle wichtigen HTML-Elemente aus dem Dokument holen
const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".nav-btn[data-view-target]");
const viewTriggers = document.querySelectorAll("[data-view-target]");
const startButton = document.getElementById("start-btn");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("username");
const profileNameForm = document.getElementById("profile-name-form");
const profileNameInput = document.getElementById("profile-name-input");
const usernameDisplays = document.querySelectorAll("[data-username-display]");
const progressChip = document.getElementById("overall-progress");
const timelineItems = document.querySelectorAll(".timeline-item");
const progressBars = document.querySelectorAll(".progress-bar");
const miniProgressBars = document.querySelectorAll(".mini-progress span:not(.mini-value)");
const lessonButtons = document.querySelectorAll(".lesson-btn");
const topicButtons = document.querySelectorAll(".topic-btn:not(.side-topic)");
const sideTopicButtons = document.querySelectorAll(".side-topic");
const lessonView = document.getElementById("view-lesson");
const lessonHeading = document.getElementById("lesson-heading");
const lessonSummary = document.getElementById("lesson-summary");
const lessonLevel = document.getElementById("lesson-level");
const timelineCards = document.querySelectorAll(".timeline-item");
const masterProgressBar = document.getElementById("master-progress-bar");
const activeTopicTitle = document.getElementById("active-topic-title");
const activeTopicSummary = document.getElementById("active-topic-summary");
const activeTopicList = document.getElementById("active-topic-list");
const activeMini = document.getElementById("active-mini");
const activeMiniVal = document.getElementById("active-mini-val");
const topicActionButton = document.querySelector(".topic-actions .lesson-btn");
const htmlLevelPanel = document.getElementById("html-level-panel");
const cssLevelPanel = document.getElementById("css-level-panel");
const jsLevelPanel = document.getElementById("js-level-panel");
const levelsModuleEyebrow = document.getElementById("levels-module-eyebrow");
const levelsModuleTabs = document.querySelectorAll("[data-levels-module]");
const htmlLevelsOverview = document.getElementById("level-overview");
const cssLevelsOverview = document.getElementById("css-level-overview");
const jsLevelsOverview = document.getElementById("js-level-overview");

const profileLevelValue = document.getElementById("profile-level-value");
const profileLevelHint = document.getElementById("profile-level-hint");
const profileXpValue = document.getElementById("profile-xp-value");
const profileXpHint = document.getElementById("profile-xp-hint");
const badgeHtml = document.querySelector(".mini-badge.badge-html");
const badgeCss = document.querySelector(".mini-badge.badge-css");
const badgeJs = document.querySelector(".mini-badge.badge-js");

// Speicher-Schlüssel für das aktive Level-Modul (html/css/js)
const LEVELS_MODULE_KEY = "cyj:levelsModule";
let activeLevelsModule = localStorage.getItem(LEVELS_MODULE_KEY) || "html";

// XP-System: Speichert Punkte und welche Phasen schon belohnt wurden
const XP_STATE_KEY = "cyj:xp";

// Lädt den aktuellen XP-Stand aus dem Browser
function loadXpState() {
	try {
		const raw = JSON.parse(localStorage.getItem(XP_STATE_KEY) || "null");
		return {
			totalXp: Number(raw?.totalXp || 0),
			awarded: raw?.awarded && typeof raw.awarded === "object" ? raw.awarded : {},
		};
	} catch {
		return { totalXp: 0, awarded: {} };
	}
}

// Speichert den XP-Stand im Browser
function saveXpState(state) {
	localStorage.setItem(XP_STATE_KEY, JSON.stringify(state));
}

// Ermittelt die Schwierigkeitsstufe anhand der Level-Nummer
// Level 1-4: easy, 5-8: medium, 9-12: hard, 13+: expert
function getDifficultyTier(levelNumber) {
	if (levelNumber <= 4) return "easy";
	if (levelNumber <= 8) return "medium";
	if (levelNumber <= 12) return "hard";
	return "expert";
}

// Gibt zurück, wie viele XP eine Phase (Theorie/Check/Sandbox) wert ist
// Schwierigere Level geben mehr Punkte
function xpForPhase(levelNumber, phaseKey) {
	const tier = getDifficultyTier(levelNumber);
	const table = {
		easy: { theoryDone: 5, checkDone: 10, sandboxDone: 15 },
		medium: { theoryDone: 7, checkDone: 12, sandboxDone: 20 },
		hard: { theoryDone: 10, checkDone: 15, sandboxDone: 25 },
		expert: { theoryDone: 12, checkDone: 18, sandboxDone: 30 },
	};
	return table[tier]?.[phaseKey] || 0;
}

// Rechnet XP in Level um (alle 100 XP = 1 Level)
function xpToLevel(totalXp) {
	// Einfache Berechnung: alle 100 XP ein Level up
	return Math.max(1, Math.floor(totalXp / 100) + 1);
}

// Berechnet, wie viel XP für das nächste Level benötigt werden
function nextLevelXp(level) {
	return level * 100;
}

// Kleine Animation für XP/Level-Anzeige (kurzes Aufblinken)
function animateMetric(el, cls) {
	if (!el) return;
	el.classList.remove(cls);
	// Reflow erzwingen, damit die Animation neu startet
	void el.offsetWidth;
	el.classList.add(cls);
	window.setTimeout(() => el.classList.remove(cls), 500);
}

function showXpToast(message) {
	const text = String(message || "").trim();
	if (!text) return;

	let toast = document.querySelector(".xp-toast");
	if (!toast) {
		toast = document.createElement("div");
		toast.className = "xp-toast";
		document.body.appendChild(toast);
	}

	toast.textContent = text;
	toast.classList.add("is-visible");

	window.clearTimeout(showXpToast._t);
	showXpToast._t = window.setTimeout(() => {
		toast.classList.remove("is-visible");
	}, 2200);
}

function handleSandboxComplete(moduleKey, levelKey) {
	const lvl = Number(levelKey);
	if (!Number.isFinite(lvl)) return;

	const xpState = loadXpState();
	const awardId = `${moduleKey}:${lvl}:sandboxDone`;
	const xp = xpState.awarded?.[awardId] ? 0 : xpForPhase(lvl, "sandboxDone");

	// Wird nach dem onProgress-Aufruf ausgeführt (XP wird dort final vergeben).
	queueMicrotask(() => {
		if (xp > 0) showXpToast(`+${xp} XP (Sandbox abgeschlossen)`);
		setLevelsModule(moduleKey);
		showView("view-levels");
	});
}

// Aktualisiert die Profil-Anzeige mit XP und Level
function updateProfileUI({ gainedXp = 0 } = {}) {
	const xpState = loadXpState();
	const level = xpToLevel(xpState.totalXp);
	const nextXp = nextLevelXp(level);
	const remaining = Math.max(0, nextXp - xpState.totalXp);

	if (profileXpValue) profileXpValue.textContent = String(xpState.totalXp);
	if (profileLevelValue) profileLevelValue.textContent = String(level);
	if (profileXpHint) profileXpHint.textContent = remaining > 0 ? `${remaining} XP bis Level ${level + 1}` : `Level ${level} erreicht`;
	if (profileLevelHint) profileLevelHint.textContent = `Dein Level basiert auf deinen XP.`;

	if (gainedXp > 0) {
		animateMetric(profileXpValue, "xp-animate");
		animateMetric(profileLevelValue, "level-animate");
	}
}

// Aktualisiert die Badge-Anzeige (wird freigeschaltet bei 100% Fortschritt)
function updateBadges() {
	const stored = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
	const htmlPct = Number(stored.html || 0);
	const cssPct = Number(stored.css || 0);

	if (badgeHtml) badgeHtml.classList.toggle("is-earned", htmlPct >= 100);
	if (badgeCss) badgeCss.classList.toggle("is-earned", cssPct >= 100);
	if (badgeJs) badgeJs.classList.toggle("is-earned", Number(stored.js || 0) >= 100);
}

// Prüft alle erledigten Phasen und vergibt XP (nur einmal pro Phase)
// Verhindert doppelte XP-Vergabe durch awarded-Liste
function reconcileXpFromProgress() {
	const xpState = loadXpState();
	let gained = 0;

	const awardIfNeeded = (moduleKey, levelKey, phaseKey) => {
		const id = `${moduleKey}:${levelKey}:${phaseKey}`;
		if (xpState.awarded[id]) return;
		const lvl = Number(levelKey);
		const add = xpForPhase(lvl, phaseKey);
		if (add <= 0) return;
		xpState.awarded[id] = true;
		xpState.totalXp += add;
		gained += add;
	};

	const html = getHtmlState?.() || loadHtmlState();
	Object.entries(html?.levels || {}).forEach(([key, state]) => {
		if (state?.theoryDone) awardIfNeeded("html", key, "theoryDone");
		if (state?.checkDone) awardIfNeeded("html", key, "checkDone");
		if (state?.sandboxDone) awardIfNeeded("html", key, "sandboxDone");
	});

	const css = getCssState?.() || hydrateCssState();
	Object.entries(css?.levels || {}).forEach(([key, state]) => {
		if (state?.theoryDone) awardIfNeeded("css", key, "theoryDone");
		if (state?.checkDone) awardIfNeeded("css", key, "checkDone");
		if (state?.sandboxDone) awardIfNeeded("css", key, "sandboxDone");
	});

	const js = getJsState?.() || hydrateJsState();
	Object.entries(js?.levels || {}).forEach(([key, state]) => {
		if (state?.theoryDone) awardIfNeeded("js", key, "theoryDone");
		if (state?.checkDone) awardIfNeeded("js", key, "checkDone");
		if (state?.sandboxDone) awardIfNeeded("js", key, "sandboxDone");
	});

	if (gained > 0) saveXpState(xpState);
	updateProfileUI({ gainedXp: gained });
	updateBadges();
}

function showView(id) {
	views.forEach((view) => {
		view.classList.toggle("view-active", view.id === id);
	});

	navButtons.forEach((btn) => {
		const target = btn.getAttribute("data-view-target");
		btn.classList.toggle("is-active", target === id);
	});

	if (id === "view-levels") {
		setLevelsModule(activeLevelsModule);
	}
}

function setLevelsModule(moduleKey) {
	const next = moduleKey === "css" ? "css" : moduleKey === "js" ? "js" : "html";
	activeLevelsModule = next;
	localStorage.setItem(LEVELS_MODULE_KEY, next);

	if (levelsModuleEyebrow) {
		levelsModuleEyebrow.textContent = next === "css" ? "CSS Modul" : next === "js" ? "JS Modul" : "HTML Modul";
	}

	if (htmlLevelsOverview) htmlLevelsOverview.hidden = next !== "html";
	if (cssLevelsOverview) cssLevelsOverview.hidden = next !== "css";
	if (jsLevelsOverview) jsLevelsOverview.hidden = next !== "js";

	levelsModuleTabs.forEach((btn) => {
		btn.classList.toggle("is-active", btn.getAttribute("data-levels-module") === next);
	});

	if (next === "html") {
		renderLevelOverview(openLevelFromOverview);
	} else if (next === "css") {
		renderCssLevelOverview(openCssLevelFromOverview);
	} else {
		renderJsLevelOverview(openJsLevelFromOverview);
	}
}

function persistName(value) {
	localStorage.setItem(NAME_KEY, value.trim());
}

function updateUsernameDisplays(name) {
	const fallback = "Dein Name";
	const text = name?.trim() || fallback;
	usernameDisplays.forEach((node) => {
		node.textContent = text;
	});
}

function loadName() {
	const stored = localStorage.getItem(NAME_KEY) || "";
	if (nameInput) nameInput.value = stored;
	if (profileNameInput) profileNameInput.value = stored;
	updateUsernameDisplays(stored);
}

function updateTimelineItemProgress(lessonId, progress) {
	const item = Array.from(timelineItems).find((el) => el.dataset.lessonId === lessonId);
	if (!item) return;
	item.dataset.progress = progress;
	const bar = item.querySelector(".progress-bar span");
	if (bar) {
		bar.dataset.target = progress;
		bar.style.width = `${progress}%`;
		bar.setAttribute("aria-valuenow", progress);
		bar.setAttribute("aria-valuemin", "0");
		bar.setAttribute("aria-valuemax", "100");
	}
}

function hydrateProgress() {
	let total = 0;
	let count = 0;

	timelineItems.forEach((item, index) => {
		const raw = Number(item.dataset.progress || 0);
		const clamped = Math.max(0, Math.min(raw, 100));
		total += clamped;
		count += 1;

		const bar = progressBars[index];
		if (bar) {
			const span = bar.querySelector("span");
			bar.classList.toggle("is-empty", clamped === 0);
			span.dataset.target = clamped;
			span.style.width = "0%";
			span.setAttribute("aria-valuenow", clamped);
			span.setAttribute("aria-valuemin", "0");
			span.setAttribute("aria-valuemax", "100");
		}
	});

	const avg = count ? Math.round(total / count) : 0;
	if (progressChip) {
		progressChip.textContent = `${avg}%`;
	}

	if (masterProgressBar) {
		masterProgressBar.dataset.target = avg;
		masterProgressBar.style.width = "0%";
	}
}

function setLessonStates() {
	let previousDone = true;

	timelineItems.forEach((item, index) => {
		const raw = Number(item.dataset.progress || 0);
		const status = item.dataset.status || "locked";

		const isDone = raw >= 100 || status === "done";
		const isLocked = !previousDone || status === "locked";

		item.classList.toggle("is-done", isDone);
		item.classList.toggle("is-locked", !isDone && isLocked);

		previousDone = previousDone && isDone;
		if (index === 0 && !isDone) previousDone = true; // Erste Übung darf starten.
	});
}

function setTopicPanel(item) {
	if (!item || !activeTopicTitle || !activeTopicSummary || !activeTopicList) return;

	const title = item.dataset.lessonTitle || item.querySelector(".module-title")?.textContent?.trim();
	const summary = item.dataset.lessonSummary || item.querySelector(".module-sub")?.textContent?.trim();
	const progress = Number(item.dataset.progress || 0);
	const topics = (item.dataset.topics || "")
		.split("|")
		.map((entry) => entry.trim())
		.filter(Boolean);

	activeTopicTitle.textContent = title || "Modul";
	activeTopicSummary.textContent = summary || "Wähle ein Modul aus, um die Themen zu sehen.";

	activeTopicList.innerHTML = "";
	if (topics.length) {
		topics.forEach((topic) => {
			const li = document.createElement("li");
			li.textContent = topic;
			activeTopicList.appendChild(li);
		});
	} else {
		const li = document.createElement("li");
		li.textContent = "Noch keine Themen eingetragen";
		activeTopicList.appendChild(li);
	}

	if (activeMini && activeMiniVal) {
		const clamped = Math.max(0, Math.min(progress, 100));
		activeMiniVal.textContent = `${clamped}%`;
		activeMini.style.width = `${clamped}%`;
	}

	if (topicActionButton && item.dataset.lessonId) {
		topicActionButton.setAttribute("data-lesson-target", item.dataset.lessonId);
	}
}

function getLevelTitles(levels, limit = 6) {
	if (!levels || typeof levels !== "object") return [];
	return Object.keys(levels)
		.map((key) => Number(key))
		.filter((key) => Number.isFinite(key))
		.sort((a, b) => a - b)
		.slice(0, limit)
		.map((key) => levels[key]?.title)
		.filter(Boolean);
}

// Füllt die Roadmap-Übersicht aus den echten Level-Daten.
// Dadurch bleiben Titel/Teilthemen aktuell, auch wenn Inhalte in den Level-Dateien geändert werden.
function hydrateRoadmapTopicsFromLevels() {
	const levelsByModule = {
		html: HTML_LEVELS,
		css: CSS_LEVELS,
		js: JS_LEVELS,
	};

	timelineItems.forEach((item) => {
		const moduleId = item.dataset.lessonId;
		const levels = levelsByModule[moduleId];
		if (!levels) return;

		const titles = getLevelTitles(levels, 6);
		if (titles.length) {
			item.dataset.topics = titles.join("|");
		}
	});
}

function openLesson(item, topic = "") {
	if (!lessonView || !lessonHeading || !lessonSummary || !lessonLevel) return;

	const title = item.dataset.lessonTitle || "Lesson";
	const summary = item.dataset.lessonSummary || "Übungsdetails";
	const level = item.dataset.level || "Level";

	lessonHeading.textContent = topic ? `${title} · ${topic}` : title;
	lessonSummary.textContent = summary;
	lessonLevel.textContent = level;

	const isHtmlLesson = item.dataset.lessonId === "html";
	const isCssLesson = item.dataset.lessonId === "css";
	const isJsLesson = item.dataset.lessonId === "js";
	if (htmlLevelPanel) {
		htmlLevelPanel.hidden = !isHtmlLesson;
		if (isHtmlLesson) renderHtmlLab();
	}
	if (cssLevelPanel) {
		cssLevelPanel.hidden = !isCssLesson;
		if (isCssLesson) renderCssLab();
	}
	if (jsLevelPanel) {
		jsLevelPanel.hidden = !isJsLesson;
		if (isJsLesson) renderJsLab();
	}

	showView("view-lesson");
}

function openModuleLevels(moduleId) {
	if (moduleId === "css") {
		setLevelsModule("css");
		showView("view-levels");
		return;
	}
	if (moduleId === "js") {
		setLevelsModule("js");
		showView("view-levels");
		return;
	}
	setLevelsModule("html");
	showView("view-levels");
}

function wireLessons() {
	lessonButtons.forEach((btn) => {
		btn.addEventListener("click", (event) => {
			const targetId = event.currentTarget.getAttribute("data-lesson-target") || "";
			let item = event.currentTarget.closest(".timeline-item");
			if (!item && targetId) {
				item = Array.from(timelineItems).find((el) => el.dataset.lessonId === targetId);
			}
			if (!item || item.classList.contains("is-locked")) return;
			if (targetId === "html" || targetId === "css" || targetId === "js") {
				openModuleLevels(targetId);
				return;
			}
			openLesson(item);
		});
	});

	topicButtons.forEach((btn) => {
		btn.addEventListener("click", (event) => {
			const targetId = event.currentTarget.getAttribute("data-lesson-target") || "";
			const topic = event.currentTarget.getAttribute("data-topic") || "";
			let item = event.currentTarget.closest(".timeline-item");
			if (!item && targetId) {
				item = Array.from(timelineItems).find((el) => el.dataset.lessonId === targetId);
			}
			if (!item || item.classList.contains("is-locked")) return;
			openLesson(item, topic);
		});
	});

	setLessonStates();
}

function wireTimelineHover() {
	const activate = (item) => {
		timelineCards.forEach((el) => el.classList.remove("is-active"));
		item.classList.add("is-active");
		setTopicPanel(item);
	};

	timelineCards.forEach((item) => {
		item.addEventListener("mouseenter", () => activate(item));
		item.addEventListener("focusin", () => activate(item));
		item.addEventListener("click", () => activate(item));
	});
}

function wireSideTopics() {
	sideTopicButtons.forEach((btn) => {
		btn.addEventListener("click", (event) => {
			const target = event.currentTarget.getAttribute("data-lesson-target");
			const topic = event.currentTarget.getAttribute("data-topic") || "";
			const item = Array.from(timelineItems).find((el) => el.dataset.lessonId === target);
			if (!item || item.classList.contains("is-locked")) return;
			openLesson(item, topic);
		});
	});
}

function animateProgress() {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const bar = entry.target;
				const target = Number(bar.dataset.target || 0);
				requestAnimationFrame(() => {
					bar.style.width = `${target}%`;
				});
				observer.unobserve(bar);
			});
		},
		{ threshold: 0.3 }
	);

	document.querySelectorAll(".progress-bar span[data-target]").forEach((span) => observer.observe(span));
	miniProgressBars.forEach((span) => {
		const target = Number(span.parentElement?.querySelector(".mini-value")?.textContent?.replace("%", "") || 0);
		requestAnimationFrame(() => {
			span.style.width = `${target}%`;
		});
	});

	if (masterProgressBar && masterProgressBar.dataset.target) {
		requestAnimationFrame(() => {
			masterProgressBar.style.width = `${masterProgressBar.dataset.target}%`;
		});
	}
}

// Aktualisiert den HTML-Fortschritt und schaltet CSS frei, wenn HTML fertig ist
function updateHtmlProgress() {
	// Fortschritt berechnen und speichern
	const percent = computeHtmlProgress();
	const stored = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
	stored.html = percent;
	localStorage.setItem(PROGRESS_KEY, JSON.stringify(stored));
	updateTimelineItemProgress("html", percent);

	if (percent >= 100) {
		const htmlCard = Array.from(timelineItems).find((el) => el.dataset.lessonId === "html");
		if (htmlCard) htmlCard.dataset.status = "done";
		const cssCard = Array.from(timelineItems).find((el) => el.dataset.lessonId === "css");
		if (cssCard) {
			cssCard.dataset.status = cssCard.dataset.status === "done" ? "done" : "current";
			cssCard.classList.remove("is-locked");
		}
	}

	setLessonStates();
	hydrateProgress();
	animateProgress();

	const activeCard = document.querySelector(".timeline-item.is-active");
	if (activeCard) setTopicPanel(activeCard);
	reconcileXpFromProgress();
}

// Aktualisiert den CSS-Fortschritt und schaltet JS frei, wenn CSS fertig ist
function updateCssProgress(percent) {
// Fortschritt des CSS-Moduls speichern
	const stored = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
	stored.css = percent;
	localStorage.setItem(PROGRESS_KEY, JSON.stringify(stored));
	updateTimelineItemProgress("css", percent);
	if (percent >= 100) {
		const cssCard = Array.from(timelineItems).find((el) => el.dataset.lessonId === "css");
		if (cssCard) cssCard.dataset.status = "done";
		const jsCard = Array.from(timelineItems).find((el) => el.dataset.lessonId === "js");
		if (jsCard) {
			jsCard.dataset.status = jsCard.dataset.status === "done" ? "done" : "current";
			jsCard.classList.remove("is-locked");
		}
	}
	setLessonStates();
	hydrateProgress();
	animateProgress();
	const activeCard = document.querySelector(".timeline-item.is-active");
	if (activeCard) setTopicPanel(activeCard);
	reconcileXpFromProgress();
}

// Aktualisiert den JS-Fortschritt (letztes Modul)
function updateJsProgress(percent) {
	const stored = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
	stored.js = percent;
	localStorage.setItem(PROGRESS_KEY, JSON.stringify(stored));
	updateTimelineItemProgress("js", percent);
	if (percent >= 100) {
		const jsCard = Array.from(timelineItems).find((el) => el.dataset.lessonId === "js");
		if (jsCard) jsCard.dataset.status = "done";
	}
	setLessonStates();
	hydrateProgress();
	animateProgress();
	const activeCard = document.querySelector(".timeline-item.is-active");
	if (activeCard) setTopicPanel(activeCard);
	reconcileXpFromProgress();
}

// Öffnet ein HTML-Level aus der Level-Übersicht heraus
function openLevelFromOverview(levelKey) {
	setActiveLevel(levelKey);
	const htmlItem = Array.from(timelineItems).find((el) => el.dataset.lessonId === "html");
	if (htmlItem) {
		openLesson(htmlItem);
	} else {
		renderHtmlLab();
		showView("view-lesson");
	}
}

// Öffnet ein CSS-Level aus der Level-Übersicht heraus
function openCssLevelFromOverview(levelKey) {
	setCssActiveLevel(levelKey);
	const cssItem = Array.from(timelineItems).find((el) => el.dataset.lessonId === "css");
	if (cssItem) {
		openLesson(cssItem);
	} else {
		renderCssLab();
		showView("view-lesson");
	}
}

function openJsLevelFromOverview(levelKey) {
	setJsActiveLevel(levelKey);
	const jsItem = Array.from(timelineItems).find((el) => el.dataset.lessonId === "js");
	if (jsItem) {
		openLesson(jsItem);
	} else {
		renderJsLab();
		showView("view-lesson");
	}
}

function wireNavigation() {
	viewTriggers.forEach((btn) => {
		btn.addEventListener("click", (event) => {
			const target = event.currentTarget.getAttribute("data-view-target");
			showView(target);
		});
	});
}

function wireStartButton() {
	if (!startButton) return;
	startButton.addEventListener("click", () => showView("view-map"));
}

function wireLevelsModuleTabs() {
	levelsModuleTabs.forEach((btn) => {
		btn.addEventListener("click", () => {
			const key = btn.getAttribute("data-levels-module") || "html";
			setLevelsModule(key);
		});
	});
}

function applyName(value, { redirect = true } = {}) {
	const next = value.trim();
	persistName(next);
	updateUsernameDisplays(next);
	if (next.toUpperCase() === "ADMIN") {
		// ADMIN schaltet alles frei.
		completeAllHtmlLevels();
		completeAllCssLevels();
		completeAllJsLevels();
		updateHtmlProgress();
		updateCssProgress(computeCssProgress());
		updateJsProgress(computeJsProgress());
	}
	if (redirect) showView("view-start");
}

function wireNameForm() {
	if (!nameForm) return;
	nameForm.addEventListener("submit", (event) => {
		event.preventDefault();
		applyName(nameInput.value, { redirect: true });
	});
}

function wireProfileNameForm() {
	if (!profileNameForm) return;
	profileNameForm.addEventListener("submit", (event) => {
		event.preventDefault();
		applyName(profileNameInput.value, { redirect: false });
	});
}

function init() {
	loadHtmlState();
	hydrateCssState();
	hydrateJsState();
	loadName();
	hydrateRoadmapTopicsFromLevels();

	updateHtmlProgress();
	updateCssProgress(computeCssProgress());
	updateJsProgress(computeJsProgress());
	reconcileXpFromProgress();

	wireNavigation();
	wireStartButton();
	wireNameForm();
	wireProfileNameForm();
	wireLevelsModuleTabs();
	hydrateProgress();
	wireLessons();
	wireTimelineHover();
	wireSideTopics();

	wireHtmlLab({
		onProgress: updateHtmlProgress,
		onOpenLevel: openLevelFromOverview,
		onSandboxComplete: (levelKey) => handleSandboxComplete("html", levelKey),
	});
	wireCssLab({ onProgress: updateCssProgress, onSandboxComplete: (levelKey) => handleSandboxComplete("css", levelKey) });
	wireJsLab({ onProgress: updateJsProgress, onSandboxComplete: (levelKey) => handleSandboxComplete("js", levelKey) });

	if (activeLevelsModule === "css") {
		renderCssLevelOverview(openCssLevelFromOverview);
	} else if (activeLevelsModule === "js") {
		renderJsLevelOverview(openJsLevelFromOverview);
	} else {
		renderLevelOverview(openLevelFromOverview);
	}
	animateProgress();
	updateProfileUI();
	updateBadges();

	if (timelineItems.length) {
		timelineCards.forEach((el) => el.classList.remove("is-active"));
		timelineItems[0].classList.add("is-active");
		setTopicPanel(timelineItems[0]);
	}

	const storedName = localStorage.getItem(NAME_KEY) || "";
	const initialView = storedName ? "view-start" : "view-name";
	showView(initialView);
}

init();

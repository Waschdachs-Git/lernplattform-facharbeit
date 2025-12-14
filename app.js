const NAME_KEY = "cyj:name";
const CODE_KEY = "cyj:code";

const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".nav-btn[data-view-target]");
const viewTriggers = document.querySelectorAll("[data-view-target]");
const startButton = document.getElementById("start-btn");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("username");
const usernameDisplays = document.querySelectorAll("[data-username-display]");
const progressChip = document.getElementById("overall-progress");
const timelineItems = document.querySelectorAll(".timeline-item");
const progressBars = document.querySelectorAll(".progress-bar");
const codeInput = document.getElementById("code-input");
const previewFrame = document.getElementById("preview-frame");
const resetCodeBtn = document.getElementById("reset-code-btn");
const lessonButtons = document.querySelectorAll(".lesson-btn");
const topicButtons = document.querySelectorAll(".topic-btn");
const lessonView = document.getElementById("view-lesson");
const lessonHeading = document.getElementById("lesson-heading");
const lessonSummary = document.getElementById("lesson-summary");
const lessonTopics = document.getElementById("lesson-topics");
const lessonLevel = document.getElementById("lesson-level");

const defaultTemplate = `<!DOCTYPE html>
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

function showView(id) {
  views.forEach((view) => {
    view.classList.toggle("view-active", view.id === id);
  });

  navButtons.forEach((btn) => {
    const target = btn.getAttribute("data-view-target");
    btn.classList.toggle("is-active", target === id);
  });
}

function persistName(value) {
  localStorage.setItem(NAME_KEY, value.trim());
}

function loadName() {
  const stored = localStorage.getItem(NAME_KEY) || "";
  if (nameInput) {
    nameInput.value = stored;
  }
  updateUsernameDisplays(stored);
}

function updateUsernameDisplays(name) {
  const fallback = "Dein Name";
  const text = name?.trim() || fallback;
  usernameDisplays.forEach((node) => {
    node.textContent = text;
  });
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

function wireNameForm() {
  if (!nameForm) return;
  nameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = nameInput.value.trim();
    persistName(value);
    updateUsernameDisplays(value);
    showView("view-start");
  });
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
      if (clamped === 0) {
        bar.classList.add("is-empty");
        span.style.width = "0%";
      } else {
        bar.classList.remove("is-empty");
        span.style.width = `${clamped}%`;
      }
      span.setAttribute("aria-valuenow", clamped);
      span.setAttribute("aria-valuemin", "0");
      span.setAttribute("aria-valuemax", "100");
    }
  });

  const avg = count ? Math.round(total / count) : 0;
  if (progressChip) {
    if (avg === 0) {
      progressChip.textContent = "Noch kein Fortschritt";
      progressChip.classList.add("is-empty");
    } else {
      progressChip.textContent = `${avg}%`;
      progressChip.classList.remove("is-empty");
    }
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

function openLesson(item, topic = "") {
  if (!lessonView || !lessonHeading || !lessonSummary || !lessonTopics || !lessonLevel) return;

  const title = item.dataset.lessonTitle || "Lesson";
  const summary = item.dataset.lessonSummary || "Übungsdetails";
  const topics = (item.dataset.topics || "").split("|").filter(Boolean);
  const level = item.dataset.level || "Level";

  lessonHeading.textContent = topic ? `${title} · ${topic}` : title;
  lessonSummary.textContent = summary;
  lessonLevel.textContent = level;

  lessonTopics.innerHTML = "";
  topics.forEach((topic) => {
    const li = document.createElement("li");
    li.textContent = topic;
    lessonTopics.appendChild(li);
  });

  showView("view-lesson");
}

function wireLessons() {
  lessonButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const item = event.currentTarget.closest(".timeline-item");
      if (!item || item.classList.contains("is-locked")) return;
      openLesson(item);
    });
  });

  topicButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const item = event.currentTarget.closest(".timeline-item");
      const topic = event.currentTarget.getAttribute("data-topic") || "";
      if (!item || item.classList.contains("is-locked")) return;
      openLesson(item, topic);
    });
  });

  setLessonStates();
}

function loadCode() {
  if (!codeInput) return;
  const stored = localStorage.getItem(CODE_KEY) || defaultTemplate;
  codeInput.value = stored;
}

function persistCode(value) {
  localStorage.setItem(CODE_KEY, value);
}

function renderPreview() {
  if (!previewFrame || !codeInput) return;
  // Direkter write, damit Nutzer sofort Feedback erhält.
  const doc = previewFrame.contentWindow.document;
  doc.open();
  doc.write(codeInput.value);
  doc.close();
}

function wireEditor() {
  if (!codeInput) return;
  loadCode();
  renderPreview();

  codeInput.addEventListener("input", () => {
    const value = codeInput.value;
    persistCode(value);
    renderPreview();
  });

  if (resetCodeBtn) {
    resetCodeBtn.addEventListener("click", () => {
      codeInput.value = defaultTemplate;
      persistCode(defaultTemplate);
      renderPreview();
    });
  }
}

function init() {
  const storedName = localStorage.getItem(NAME_KEY) || "";
  if (nameInput) {
    nameInput.value = storedName;
  }
  updateUsernameDisplays(storedName);

  wireNavigation();
  wireStartButton();
  wireNameForm();
  hydrateProgress();
  wireEditor();
  wireLessons();

  // Starte mit Namenseingabe, falls noch nichts hinterlegt wurde.
  const initialView = storedName ? "view-start" : "view-name";
  showView(initialView);
}

init();

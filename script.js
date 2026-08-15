const BASE_URL = "https://mental-health-score-predictor-1-8frp.onrender.com";
const PREDICT_URL = `${BASE_URL}predict`;

const scoreConfig = {
  minScore: 0,
  maxScore: 10,
  ranges: [
    {
      min: 9,
      max: 10,
      label: "Strong",
      message:
        "Your current lifestyle indicators suggest strong overall mental wellness patterns.",
    },
    {
      min: 8,
      max: 8.99,
      label: "Very Good",
      message:
        "Your overall lifestyle indicators suggest very good mental wellness patterns.",
    },
    {
      min: 6,
      max: 7.99,
      label: "Good",
      message:
        "Your lifestyle and wellness indicators appear generally balanced.",
    },
    {
      min: 4,
      max: 5.99,
      label: "Moderate",
      message:
        "Some lifestyle factors may benefit from additional attention and balance.",
    },
    {
      min: 0,
      max: 3.99,
      label: "Needs Attention",
      message:
        "Several lifestyle indicators may currently benefit from additional care and attention.",
    },
  ],
};

const state = { gender: "", stress_level: "", lastData: null };
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function initializeApp() {
  initializeMouseEffects();
  initializeParticles();
  initializeChoices();
  initializeSliders();
  initializeGauge();
  initializeSpotlights();
  document
    .getElementById("assessmentForm")
    .addEventListener("submit", submitPrediction);
  document
    .getElementById("retryBtn")
    .addEventListener(
      "click",
      () => state.lastData && submitPrediction(null, state.lastData),
    );
}

function initializeMouseEffects() {
  if (reducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
  document.addEventListener(
    "mousemove",
    (e) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    },
    { passive: true },
  );
}

function initializeParticles() {
  if (reducedMotion) return;
  const wrap = document.getElementById("particles");
  for (let i = 0; i < 24; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.opacity = (0.15 + Math.random() * 0.35).toFixed(2);
    p.style.setProperty("--duration", `${8 + Math.random() * 10}s`);
    p.style.setProperty("--dx", `${-30 + Math.random() * 60}px`);
    p.style.setProperty("--dy", `${-45 + Math.random() * 90}px`);
    wrap.appendChild(p);
  }
}

function initializeSpotlights() {
  document.querySelectorAll(".spotlight").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
      card.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
    });
  });
}

function initializeChoices() {
  document.querySelectorAll(".choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const value = btn.dataset.value;
      state[name] = value;
      document
        .querySelectorAll(`.choice[data-name="${name}"]`)
        .forEach((x) => x.classList.remove("selected"));
      btn.classList.add("selected");
      clearFieldError(name);
    });
  });
}

function initializeSliders() {
  const sliders = [
    ["socialUsage", "socialUsageValue", "hrs/day"],
    ["studyHours", "studyHoursValue", "hrs/day"],
    ["activityHours", "activityHoursValue", "hrs/day"],
    ["sleepHours", "sleepHoursValue", "hrs/night"],
  ];
  sliders.forEach(([id, out, suffix]) => {
    const el = document.getElementById(id);
    const output = document.getElementById(out);
    const update = () => {
      const pct =
        ((Number(el.value) - Number(el.min)) /
          (Number(el.max) - Number(el.min))) *
        100;
      el.style.setProperty("--fill", `${pct}%`);
      output.textContent = `${formatNumber(Number(el.value))} ${suffix}`;
    };
    el.addEventListener("input", update);
    update();
  });
}

function formatNumber(n) {
  return Number.isInteger(Number(n)) ? String(Number(n)) : Number(n).toFixed(1);
}

function clearFieldError(name) {
  const field = document.querySelector(`[data-field="${name}"]`);
  if (!field) return;
  field.classList.remove("invalid");
  const err = field.querySelector(".error");
  if (err) err.textContent = "";
}

function setFieldError(name, message) {
  const field = document.querySelector(`[data-field="${name}"]`);
  if (!field) return;
  field.classList.add("invalid");
  const err = field.querySelector(".error");
  if (err) err.textContent = message;
}

function collectFormData() {
  return {
    age: Number(document.getElementById("age").value),
    gender: state.gender,
    country: document.getElementById("country").value,
    academic_level: document.getElementById("academicLevel").value,
    most_used_platform: document.getElementById("platform").value,
    purpose_of_use: document.getElementById("purpose").value,
    avg_daily_usage_hours: Number(document.getElementById("socialUsage").value),
    daily_unlocks: Number(document.getElementById("dailyUnlocks").value),
    study_hours: Number(document.getElementById("studyHours").value),
    physical_activity_hours: Number(
      document.getElementById("activityHours").value,
    ),
    sleep_hours_per_night: Number(document.getElementById("sleepHours").value),
    stress_level: state.stress_level,
  };
}

function validateForm(data) {
  document
    .querySelectorAll(".field")
    .forEach((f) => f.classList.remove("invalid"));
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
  let valid = true;
  const fail = (name, msg) => {
    setFieldError(name, msg);
    valid = false;
  };

  if (!Number.isFinite(data.age) || data.age < 10 || data.age > 100)
    fail("age", "Enter an age between 10 and 100.");
  if (!data.gender) fail("gender", "Please select your gender.");
  if (!data.country) fail("country", "Please select your country.");
  if (!data.academic_level)
    fail("academic_level", "Please select your academic level.");
  if (!data.most_used_platform)
    fail("most_used_platform", "Please select your most used platform.");
  if (!data.purpose_of_use)
    fail("purpose_of_use", "Please select your purpose of use.");
  if (!Number.isFinite(data.daily_unlocks) || data.daily_unlocks < 0)
    fail("daily_unlocks", "Enter a valid number of daily unlocks.");
  if (!data.stress_level)
    fail("stress_level", "Please select your stress level.");
  return valid;
}

async function submitPrediction(event, retryData = null) {
  if (event) event.preventDefault();
  const payload = retryData || collectFormData();
  if (!retryData && !validateForm(payload)) return;
  state.lastData = payload;
  showState("loading");

  try {
    const response = await fetch(PREDICT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Prediction failed");
    const data = await response.json();
    const score = Math.max(
      0,
      Math.min(10, Number(data.predicted_mental_health_score)),
    );
    if (!Number.isFinite(score)) throw new Error("Invalid score");
    await new Promise((resolve) =>
      setTimeout(resolve, reducedMotion ? 40 : 650),
    );
    showState("result");
    await animateGauge(score);
    renderInsights(payload);
  } catch (error) {
    showState("error");
  }
}

function showState(type) {
  const idle = document.getElementById("idleState");
  const loading = document.getElementById("loadingState");
  const error = document.getElementById("errorState");
  [idle, loading, error].forEach((x) => x.classList.remove("active"));
  document.getElementById("insights").classList.add("hidden");
  if (type === "loading") loading.classList.add("active");
  else if (type === "error") error.classList.add("active");
  else idle.classList.add("active");
}

function initializeGauge() {
  const group = document.getElementById("tickGroup");
  const cx = 210,
    cy = 210,
    r = 165;
  for (let i = 0; i <= 10; i++) {
    const deg = 180 + i * 18;
    const rad = (deg * Math.PI) / 180;
    const major = i === 0 || i === 5 || i === 10;
    const outer = r - 4;
    const inner = r - (major ? 20 : 13);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", cx + Math.cos(rad) * inner);
    line.setAttribute("y1", cy + Math.sin(rad) * inner);
    line.setAttribute("x2", cx + Math.cos(rad) * outer);
    line.setAttribute("y2", cy + Math.sin(rad) * outer);
    line.setAttribute("class", major ? "tick major" : "tick");
    group.appendChild(line);
  }
  updateGauge(0);
}

function scoreToAngle(score) {
  return -90 + (score / 10) * 180;
}

function updateGauge(score) {
  const value = Math.max(0, Math.min(10, score));
  document.getElementById("gaugeProgress").style.strokeDashoffset =
    `${100 - value * 10}`;
  document.getElementById("needleGroup").style.transform =
    `rotate(${scoreToAngle(value)}deg)`;
  document.getElementById("scoreNumber").textContent = value.toFixed(2);
}

function animateScore(from, to, duration) {
  return new Promise((resolve) => {
    if (reducedMotion) {
      updateGauge(to);
      resolve();
      return;
    }
    const start = performance.now();
    const frame = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      updateGauge(from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
}

function getScoreStatus(score) {
  return (
    scoreConfig.ranges.find(
      (range) => score >= range.min && score <= range.max,
    ) || scoreConfig.ranges[scoreConfig.ranges.length - 1]
  );
}

async function animateGauge(predictedScore) {
  const category = document.getElementById("scoreCategory");
  const description = document.getElementById("scoreDescription");
  category.textContent = "ANALYZING";
  description.textContent =
    "Your score is being calculated by the machine learning model.";
  updateGauge(0);
  await animateScore(0, 10, reducedMotion ? 20 : 1450);
  await new Promise((resolve) => setTimeout(resolve, reducedMotion ? 20 : 300));
  await animateScore(10, predictedScore, reducedMotion ? 20 : 850);
  const status = getScoreStatus(predictedScore);
  category.textContent = status.label.toUpperCase();
  description.textContent = status.message;
}

function renderInsights(data) {
  document.getElementById("resultSleep").textContent =
    `${formatNumber(data.sleep_hours_per_night)} hrs/night`;
  document.getElementById("resultSocial").textContent =
    `${formatNumber(data.avg_daily_usage_hours)} hrs/day`;
  document.getElementById("resultActivity").textContent =
    `${formatNumber(data.physical_activity_hours)} hrs/day`;
  document.getElementById("resultStudy").textContent =
    `${formatNumber(data.study_hours)} hrs/day`;

  const observations = [];
  if (data.sleep_hours_per_night < 6)
    observations.push(
      "Your sleep duration is relatively low. Building a more consistent sleep routine may support overall wellbeing.",
    );
  if (data.avg_daily_usage_hours >= 9)
    observations.push(
      "Your daily social media usage is relatively high. Regular screen breaks may help create a healthier digital balance.",
    );
  if (data.physical_activity_hours < 1)
    observations.push(
      "Adding regular movement, walking or exercise may support overall wellbeing.",
    );
  if (["High", "Very High"].includes(data.stress_level))
    observations.push(
      "Your reported stress level is elevated. Regular breaks, movement, relaxation and speaking with someone you trust may help.",
    );
  if (data.study_hours >= 10)
    observations.push(
      "Long study sessions can be demanding. Regular breaks may help support concentration and balance.",
    );
  if (!observations.length)
    observations.push(
      "Your submitted routine does not trigger any of the simple lifestyle flags used by this interface. Aim for sustainable balance across sleep, activity, study and screen time.",
    );

  document.getElementById("observationList").innerHTML = observations
    .slice(0, 3)
    .map((text) => `<p>• ${text}</p>`)
    .join("");
  const insights = document.getElementById("insights");
  insights.classList.remove("hidden");
  insights.animate(
    [
      { opacity: 0, transform: "translateY(10px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: reducedMotion ? 1 : 420, fill: "both" },
  );
}

document.addEventListener("DOMContentLoaded", initializeApp);

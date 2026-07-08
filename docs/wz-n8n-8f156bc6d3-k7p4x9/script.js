const leads = [
  {
    id: "WA-2041",
    name: "Maya Patel",
    company: "Northline Consulting",
    phone: "+44 7700 900421",
    message:
      "Hi, I need pricing for the Zoho CRM migration package. We have 12 agents and want WhatsApp follow-up.",
    source: "WhatsApp",
    deal: "CRM migration inquiry",
    owner: "Sales Ops",
    status: "Ready",
    confidence: 96,
    issue: "",
  },
  {
    id: "WA-2042",
    name: "Chris Bennett",
    company: "Bennett Homes",
    phone: "+44 7700 900882",
    message:
      "Can someone call tomorrow? We use Zoho but current Zapier flow duplicates contacts.",
    source: "WhatsApp",
    deal: "Duplicate contact fix",
    owner: "Implementation",
    status: "Ready",
    confidence: 91,
    issue: "",
  },
  {
    id: "WA-2043",
    name: "Unknown",
    company: "Harbor Fitness",
    phone: "",
    message:
      "Need a WhatsApp automation for class bookings. Please send options to the manager.",
    source: "WhatsApp",
    deal: "Booking automation",
    owner: "Review Queue",
    status: "Review",
    confidence: 68,
    issue: "Missing phone number",
  },
  {
    id: "WA-2044",
    name: "Olivia Green",
    company: "Green Accountants",
    phone: "+44 7700 900219",
    message:
      "We need to migrate our old WhatsApp Zap into n8n and keep Zoho task assignment working.",
    source: "WhatsApp",
    deal: "n8n migration",
    owner: "Sales Ops",
    status: "Ready",
    confidence: 94,
    issue: "",
  },
];

const mappings = [
  ["profile.name", "Full Name", "required"],
  ["profile.phone", "Phone", "required"],
  ["message.text", "Lead Source Notes", "required"],
  ["message.intent", "Deal Name", "required"],
  ["routing.owner", "Contact Owner", "required"],
  ["validation.issue", "Review Reason", "optional"],
];

const signoffs = [
  ["Stage 1", "Existing Zapier behavior documented", "done"],
  ["Stage 2", "n8n test workflow rebuild", "active"],
  ["Stage 3", "Zoho sandbox sync", "pending"],
  ["Stage 4", "Client sign-off and handoff notes", "pending"],
];

let activeLead = leads[0];
let runCount = 0;

const leadList = document.querySelector("#leadList");
const leadDetail = document.querySelector("#leadDetail");
const mappingTable = document.querySelector("#mappingTable");
const signoffList = document.querySelector("#signoffList");
const testLog = document.querySelector("#testLog");
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const runValidation = document.querySelector("#runValidation");

function statusClass(status) {
  if (status === "Ready" || status === "done") return "ready";
  if (status === "Review" || status === "active") return "review";
  return "failed";
}

function renderLeads() {
  leadList.innerHTML = leads
    .map(
      (lead) => `
        <article class="lead-row ${lead.id === activeLead.id ? "active" : ""}" data-id="${lead.id}">
          <div class="lead-main">
            <div class="lead-title">
              ${lead.name}
              <span class="badge ${statusClass(lead.status)}">${lead.status}</span>
            </div>
            <div class="lead-message">${lead.message}</div>
          </div>
          <div class="lead-score">${lead.confidence}%</div>
        </article>
      `,
    )
    .join("");

  document.querySelectorAll(".lead-row").forEach((row) => {
    row.addEventListener("click", () => {
      activeLead = leads.find((lead) => lead.id === row.dataset.id) || leads[0];
      renderLeads();
      renderDetail();
    });
  });
}

function renderDetail() {
  const fields = [
    ["Lead ID", activeLead.id, "pass"],
    ["Full Name", activeLead.name, activeLead.name === "Unknown" ? "warn" : "pass"],
    ["Phone", activeLead.phone || "Missing", activeLead.phone ? "pass" : "warn"],
    ["Company", activeLead.company, "pass"],
    ["Deal Name", activeLead.deal, "pass"],
    ["Owner", activeLead.owner, activeLead.owner === "Review Queue" ? "warn" : "pass"],
    ["Zoho Status", activeLead.status === "Ready" ? "Ready to sync" : activeLead.issue, statusClass(activeLead.status)],
  ];

  leadDetail.innerHTML = `
    <div class="payload">
      ${fields
        .map(
          ([name, value, state]) => `
            <div class="field">
              <div class="field-name">${name}</div>
              <div class="field-value">${value}</div>
              <span class="badge ${state}">${state === "pass" ? "OK" : "Review"}</span>
            </div>
          `,
        )
        .join("")}
    </div>
    <div class="actions">
      <button class="primary" type="button">Approve Zoho Sync</button>
      <button type="button">Send to Review</button>
      <button type="button">Export Test Payload</button>
    </div>
  `;
}

function renderMapping() {
  mappingTable.innerHTML = mappings
    .map(
      ([source, target, status]) => `
        <div class="map-row">
          <div class="map-source">
            <span>WhatsApp / n8n</span>
            <strong>${source}</strong>
          </div>
          <div class="map-arrow">→</div>
          <div class="map-target">
            <span>Zoho CRM</span>
            <strong>${target}</strong>
          </div>
          <span class="badge ${status === "required" ? "ready" : "review"}">${status}</span>
        </div>
      `,
    )
    .join("");
}

function renderSignoff() {
  signoffList.innerHTML = signoffs
    .map(
      ([stage, label, state]) => `
        <div class="signoff-row">
          <div>
            <strong>${stage}</strong>
            <div class="field-value">${label}</div>
          </div>
          <span class="badge ${state === "done" ? "pass" : state === "active" ? "warn" : "failed"}">
            ${state === "done" ? "Signed" : state === "active" ? "Testing" : "Pending"}
          </span>
        </div>
      `,
    )
    .join("");
}

function renderLog() {
  const logs = [
    ["09:42", "Webhook received sample WhatsApp payload WA-2041", "pass"],
    ["09:42", "Normalized name, phone and source fields", "pass"],
    ["09:43", "Detected missing phone number on WA-2043", "warn"],
    ["09:44", "Prepared Zoho contact and deal payloads", "pass"],
    ["09:45", "Sandbox sync blocked until client confirms field mapping", "warn"],
  ];
  testLog.innerHTML = logs
    .map(
      ([time, message, state]) => `
        <div class="log-row">
          <div class="log-time">${time}</div>
          <div class="log-message">${message}</div>
          <span class="badge ${state}">${state === "pass" ? "Pass" : "Review"}</span>
        </div>
      `,
    )
    .join("");
}

function refreshMetrics() {
  document.querySelector("#metricLeads").textContent = String(24 + runCount);
  document.querySelector("#metricValid").textContent = String(21 + runCount);
  document.querySelector("#metricReview").textContent = "3";
  document.querySelector("#metricStatus").textContent = runCount ? "Retested" : "Passing";
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((button) => button.classList.remove("active"));
    item.classList.add("active");
    views.forEach((view) => view.classList.toggle("active", view.dataset.panel === item.dataset.view));
  });
});

runValidation.addEventListener("click", () => {
  runCount += 1;
  refreshMetrics();
  runValidation.textContent = "Retested";
  setTimeout(() => {
    runValidation.textContent = "Run Test";
  }, 1200);
});

renderLeads();
renderDetail();
renderMapping();
renderSignoff();
renderLog();
refreshMetrics();

const leads = [
  {
    id: "GM-1184",
    sender: "Maya Chen",
    company: "Northstar Dental",
    subject: "Need intake automation for patient requests",
    message:
      "We receive appointment requests in Gmail. The team manually tags each case before updating a sheet and CRM.",
    route: "Sales",
    priority: "High",
    confidence: 94,
    owner: "Sales Ops",
    sheetStatus: "Ready",
    crmStatus: "Ready",
    reviewReason: "",
  },
  {
    id: "GM-1185",
    sender: "Operations Inbox",
    company: "Helio Commerce",
    subject: "Order export failed again",
    message:
      "The daily export did not reach the spreadsheet and our team cannot reconcile yesterday's orders.",
    route: "Support",
    priority: "High",
    confidence: 88,
    owner: "Operations",
    sheetStatus: "Ready",
    crmStatus: "Task",
    reviewReason: "",
  },
  {
    id: "GM-1186",
    sender: "Accounts Payable",
    company: "FieldWorks",
    subject: "Invoice mismatch for April materials",
    message:
      "The invoice amount does not match the site log. Please check whether the diesel entry was duplicated.",
    route: "Finance",
    priority: "Medium",
    confidence: 76,
    owner: "Finance",
    sheetStatus: "Ready",
    crmStatus: "No CRM sync",
    reviewReason: "",
  },
  {
    id: "GM-1187",
    sender: "Website Contact",
    company: "Unknown",
    subject: "Question about making our process faster",
    message:
      "Can you help us make the process faster? We use spreadsheets and email right now, but I am not sure what we need.",
    route: "Review",
    priority: "Review",
    confidence: 58,
    owner: "Review Queue",
    sheetStatus: "Needs details",
    crmStatus: "Hold",
    reviewReason: "Low confidence and missing workflow details",
  },
];

const rules = [
  ["Sales route", "Buying intent, request for automation, scheduling or CRM wording.", "High confidence"],
  ["Support route", "Failure, blocked workflow, export issue or urgent operational incident.", "High confidence"],
  ["Finance route", "Invoice, payment, reconciliation, duplicate entry or accounting wording.", "Medium confidence"],
  ["Review hold", "Short/vague emails, missing budget, unclear owner or confidence below 70%.", "Manual review"],
];

const mappings = [
  ["gmail.message_id", "Email ID", "required"],
  ["gmail.sender_name", "Contact Name", "required"],
  ["gmail.sender_email", "Email", "required"],
  ["ai.route", "Pipeline / Queue", "required"],
  ["ai.priority", "Priority", "required"],
  ["ai.reason", "AI Reason", "required"],
  ["review.status", "Approval Status", "optional"],
];

let activeLead = leads[0];
let runCount = 0;

const leadList = document.querySelector("#leadList");
const recordDetail = document.querySelector("#recordDetail");
const routeFilter = document.querySelector("#routeFilter");
const runWorkflow = document.querySelector("#runWorkflow");
const rulesList = document.querySelector("#rulesList");
const runLog = document.querySelector("#runLog");
const mappingTable = document.querySelector("#mappingTable");
const reviewQueue = document.querySelector("#reviewQueue");
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");

function routeClass(route) {
  return {
    Sales: "sales",
    Support: "support",
    Finance: "finance",
    Review: "review",
  }[route] || "info";
}

function stateClass(value) {
  if (["Ready", "High confidence", "required", "Approved"].includes(value)) return "pass";
  if (["Task", "Medium confidence", "optional"].includes(value)) return "info";
  if (["Hold", "Needs details", "Review", "Manual review"].includes(value)) return "warn";
  return "ready";
}

function renderLeads() {
  const route = routeFilter.value;
  const visible = leads.filter((lead) => route === "all" || lead.route === route);
  if (!visible.some((lead) => lead.id === activeLead.id) && visible[0]) {
    activeLead = visible[0];
  }

  leadList.innerHTML = visible
    .map(
      (lead) => `
        <article class="lead-row ${lead.id === activeLead.id ? "active" : ""}" data-id="${lead.id}">
          <div class="lead-main">
            <div class="lead-title">
              ${lead.subject}
              <span class="badge ${routeClass(lead.route)}">${lead.route}</span>
              <span class="badge ${lead.confidence < 70 ? "warn" : "pass"}">${lead.priority}</span>
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
    ["Sender", `${activeLead.sender} · ${activeLead.company}`, activeLead.company === "Unknown" ? "warn" : "pass"],
    ["AI Route", activeLead.route, routeClass(activeLead.route)],
    ["Priority", activeLead.priority, activeLead.priority === "Review" ? "warn" : "pass"],
    ["Owner", activeLead.owner, activeLead.owner === "Review Queue" ? "warn" : "pass"],
    ["Google Sheets", activeLead.sheetStatus, stateClass(activeLead.sheetStatus)],
    ["CRM", activeLead.crmStatus, stateClass(activeLead.crmStatus)],
  ];

  recordDetail.innerHTML = `
    <div class="payload">
      ${fields
        .map(
          ([name, value, state]) => `
            <div class="field">
              <div class="field-name">${name}</div>
              <div class="field-value">${value}</div>
              <span class="badge ${state}">${state === "warn" ? "Review" : "OK"}</span>
            </div>
          `,
        )
        .join("")}
    </div>
    <div class="actions">
      <button class="primary" type="button">Approve route</button>
      <button type="button">Send to review</button>
      <button type="button">Export payload</button>
    </div>
  `;
}

function renderRules() {
  rulesList.innerHTML = rules
    .map(
      ([title, body, status]) => `
        <div class="rule-row">
          <div>
            <strong>${title}</strong>
            <div class="rule-body">${body}</div>
          </div>
          <span class="badge ${stateClass(status)}">${status}</span>
        </div>
      `,
    )
    .join("");
}

function renderLog() {
  const logs = [
    ["09:12", "Fetched 128 unread sample emails from Gmail label: Leads", "pass"],
    ["09:13", "Classified route, priority and confidence with AI", "pass"],
    ["09:14", "Prepared Google Sheets row payloads", "pass"],
    ["09:14", "Created CRM payloads for high-confidence leads", "pass"],
    ["09:15", "Held 7 uncertain leads for manual review", "warn"],
  ];

  runLog.innerHTML = logs
    .map(
      ([time, message, status]) => `
        <div class="log-row">
          <div class="log-time">${time}</div>
          <div class="log-message">${message}</div>
          <span class="badge ${status}">${status === "pass" ? "Pass" : "Review"}</span>
        </div>
      `,
    )
    .join("");
}

function renderMapping() {
  mappingTable.innerHTML = mappings
    .map(
      ([source, target, status]) => `
        <div class="map-row">
          <div class="map-source">
            <span>Source field</span>
            <strong>${source}</strong>
          </div>
          <div class="map-arrow">→</div>
          <div class="map-target">
            <span>Output field</span>
            <strong>${target}</strong>
          </div>
          <span class="badge ${stateClass(status)}">${status}</span>
        </div>
      `,
    )
    .join("");
}

function renderReviewQueue() {
  reviewQueue.innerHTML = leads
    .filter((lead) => lead.route === "Review" || lead.confidence < 70)
    .map(
      (lead) => `
        <div class="review-row">
          <div>
            <strong>${lead.subject}</strong>
            <div class="field-value">${lead.reviewReason || "Manual approval required"}</div>
          </div>
          <span class="badge warn">${lead.confidence}%</span>
        </div>
      `,
    )
    .join("");
}

function refreshMetrics() {
  document.querySelector("#metricParsed").textContent = String(128 + runCount * 4);
  document.querySelector("#metricRouted").textContent = runCount ? "86%" : "84%";
  document.querySelector("#metricReview").textContent = runCount ? "5" : "7";
  document.querySelector("#metricHealth").textContent = runCount ? "Retested" : "Passing";
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((button) => button.classList.remove("active"));
    item.classList.add("active");
    views.forEach((view) => view.classList.toggle("active", view.dataset.panel === item.dataset.view));
  });
});

routeFilter.addEventListener("change", () => {
  renderLeads();
  renderDetail();
});

runWorkflow.addEventListener("click", () => {
  runCount += 1;
  refreshMetrics();
  runWorkflow.textContent = "Retested";
  setTimeout(() => {
    runWorkflow.textContent = "Run test";
  }, 1200);
});

renderLeads();
renderDetail();
renderRules();
renderLog();
renderMapping();
renderReviewQueue();
refreshMetrics();

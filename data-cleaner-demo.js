"use strict";

const extraCustomerNames = [
  "Elena Ciobanu", "Radu Munteanu", "Nicoleta Cojocaru", "Pavel Ceban", "Irina Rotaru", "Mihai Lupu",
  "Ana Balan", "Cristian Moraru", "Diana Ursu", "Vlad Sava", "Olesea Rusu", "Sergiu Neagu",
  "Alina Dinu", "Iulian Cazacu", "Marina Toma", "Victor Bors", "Lidia Sandu", "Daniela Muntean",
  "Alexandru Rusu", "Tatiana Pavel", "George Nistor", "Valentina Munteanu", "Nicolae Iacob", "Corina Melnic",
  "Eugenia Popa", "Ion Dragan", "Larisa Cretu", "Dorin Gutu", "Veronica Pascu", "Marius Cojocaru",
  "Elisa Turcanu", "Roman Ceban", "Cristina Vrabie", "Petru Rusu"
];

const extraCustomersBefore = extraCustomerNames.map((name, index) => {
  const number = index + 6;
  const id = `CUS-${String(number).padStart(3, "0")}`;
  const emailName = name.toLowerCase().replace(/ă|â|î|ș|ţ|ț/g, (letter) => ({ ă: "a", â: "a", î: "i", ș: "s", ţ: "t", ț: "t" })[letter]).replace(/\s+/g, ".");
  const digits = String(200000 + number * 137);
  const phone = index % 3 === 0
    ? `069 ${digits.slice(-6, -3)} ${digits.slice(-3)}`
    : index % 3 === 1
      ? `+373 (69) ${digits.slice(-6, -3)}-${digits.slice(-3)}`
      : `069${digits.slice(-6)}`;
  const month = String(2 + (index % 4)).padStart(2, "0");
  const day = String(3 + (index % 24)).padStart(2, "0");
  const rawName = index % 3 === 0 ? ` ${name.toUpperCase()} ` : index % 3 === 1 ? `${name} ` : name.toLowerCase();
  const rawEmail = index % 3 === 0 ? `${emailName.toUpperCase()}@EXAMPLE.COM` : index % 3 === 1 ? ` ${emailName}@example.com ` : `${emailName}@example.com`;
  return [id, rawName, rawEmail, phone, `2026-${month}-${day}`];
});

const extraCustomersAfter = extraCustomerNames.map((name, index) => {
  const number = index + 6;
  const id = `CUS-${String(number).padStart(3, "0")}`;
  const emailName = name.toLowerCase().replace(/ă|â|î|ș|ţ|ț/g, (letter) => ({ ă: "a", â: "a", î: "i", ș: "s", ţ: "t", ț: "t" })[letter]).replace(/\s+/g, ".");
  const digits = String(200000 + number * 137);
  const phone = `+373 69 ${digits.slice(-6, -3)} ${digits.slice(-3)}`;
  const month = String(2 + (index % 4)).padStart(2, "0");
  const day = String(3 + (index % 24)).padStart(2, "0");
  return [id, name, `${emailName}@example.com`, phone, `2026-${month}-${day}`];
});

const extraOrdersBefore = Array.from({ length: 54 }, (_, index) => {
  const number = index + 1006;
  const customers = ["Nord Market", "Atelier 27", "Bloom Studio", "Casa Verde", "Luna Office", "Dacia Trade", "MoldArt", "Urban Cafe"];
  const statuses = ["paid", "PAID ", "pending", "Pending", "paid", "shipped", "pending", "PAID"];
  const amount = (425 + ((index * 173) % 2875)) + ((index % 4) * 0.5);
  const month = String(3 + (index % 4)).padStart(2, "0");
  const day = String(4 + (index % 24)).padStart(2, "0");
  const amountText = `${amount.toFixed(2).replace(".", ",")} €`;
  const customer = customers[index % customers.length];
  const messyCustomer = index % 3 === 0 ? `${customer} ` : index % 3 === 1 ? ` ${customer}` : customer.toUpperCase();
  return [`ORD-${number}`, messyCustomer, amountText, statuses[index % statuses.length], `2026-${month}-${day}`];
});

const extraOrdersAfter = extraOrdersBefore.map(([id, customer, amount, status, orderDate]) => {
  const cleanCustomerNames = ["Nord Market", "Atelier 27", "Bloom Studio", "Casa Verde", "Luna Office", "Dacia Trade", "MoldArt", "Urban Cafe"];
  const orderIndex = Number(id.slice(4)) - 1006;
  const normalizedAmount = amount.replace(" €", " EUR").replace(",", ".");
  return [id, cleanCustomerNames[orderIndex % cleanCustomerNames.length], normalizedAmount, status.trim().toUpperCase(), orderDate];
});

const datasets = {
  customers: {
    title: "Customer contacts",
    columns: ["Customer ID", "Name", "Email", "Phone", "Joined"],
    before: [
      ["CUS-001", "  maria popescu ", "MARIA@EXAMPLE.COM", "069 123 456", "04/02/2026"],
      ["CUS-002", "Andrei Ionescu", "andrei.example.com", "+373 (68) 555-010", "2026-02-07"],
      ["CUS-003", "Sofia Marin", "sofia@example.com", "068777999", "07 Feb 2026"],
      ["CUS-002", "Andrei Ionescu", "andrei.example.com", "+373 (68) 555-010", "2026-02-07"],
      ["CUS-004", " Ioana Rusu", "ioana@sample.org ", "not provided", "2026/02/09"],
      ["CUS-005", "Victor Luca", "victor@example.com", "+37369111222", "11-02-2026"],
      ...extraCustomersBefore
    ],
    after: [
      ["CUS-001", "Maria Popescu", "maria@example.com", "+373 69 123 456", "2026-02-04"],
      ["CUS-002", "Andrei Ionescu", "andrei.example.com", "+373 68 555 010", "2026-02-07"],
      ["CUS-003", "Sofia Marin", "sofia@example.com", "+373 68 777 999", "2026-02-07"],
      ["CUS-004", "Ioana Rusu", "ioana@sample.org", "not provided", "2026-02-09"],
      ["CUS-005", "Victor Luca", "victor@example.com", "+373 69 111 222", "2026-02-11"],
      ...extraCustomersAfter
    ],
    issues: [[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[2,3],[2,4],[3,0],[3,1],[3,2],[3,3],[3,4],[4,1],[4,2],[4,4],[5,3],[5,4]],
    duplicateRows: [3],
    metrics: { Completeness: 96, Validity: 88, Uniqueness: 100, Consistency: 92 },
    score: 93,
    changes: [
      ["1", "Name", "  maria popescu ", "Maria Popescu", "Trimmed spaces and normalized name casing"],
      ["1", "Email", "MARIA@EXAMPLE.COM", "maria@example.com", "Normalized email casing"],
      ["1", "Phone", "069 123 456", "+373 69 123 456", "Normalized phone format"],
      ["1", "Joined", "04/02/2026", "2026-02-04", "Standardized date"],
      ["2", "Phone", "+373 (68) 555-010", "+373 68 555 010", "Removed display punctuation"],
      ["3", "Joined", "07 Feb 2026", "2026-02-07", "Standardized date"],
      ["4", "Entire row", "Duplicate of row 2", "Removed", "Exact duplicate"],
      ["5", "Email", "ioana@sample.org ", "ioana@sample.org", "Trimmed surrounding space"],
      ["6", "Joined", "11-02-2026", "2026-02-11", "Standardized date"]
    ]
  },
  orders: {
    title: "Sales orders",
    columns: ["Order ID", "Customer", "Amount", "Status", "Order date"],
    before: [
      ["ORD-1001", "Nord Market", "1,250.00 EUR", "paid", "2026/03/01"],
      ["ORD-1002", "Atelier 27", "875,50 €", "PAID ", "01-03-2026"],
      ["ORD-1003", "Bloom Studio", "", "pending", "March 2, 2026"],
      ["ORD-1004", "Nord Market ", "-20 EUR", "refnd", "2026-03-02"],
      ["ORD-1005", "Casa Verde", "2 100 EUR", "Pending", "03/03/2026"],
      ["ORD-1005", "Casa Verde", "2 100 EUR", "Pending", "03/03/2026"],
      ...extraOrdersBefore
    ],
    after: [
      ["ORD-1001", "Nord Market", "1250.00 EUR", "PAID", "2026-03-01"],
      ["ORD-1002", "Atelier 27", "875.50 EUR", "PAID", "2026-03-01"],
      ["ORD-1003", "Bloom Studio", "Review required", "PENDING", "2026-03-02"],
      ["ORD-1004", "Nord Market", "-20 EUR", "REVIEW", "2026-03-02"],
      ["ORD-1005", "Casa Verde", "2100.00 EUR", "PENDING", "2026-03-03"],
      ...extraOrdersAfter
    ],
    issues: [[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,2],[2,3],[2,4],[3,1],[3,2],[3,3],[4,2],[4,3],[4,4],[5,0],[5,1],[5,2],[5,3],[5,4]],
    duplicateRows: [5],
    metrics: { Completeness: 97, Validity: 84, Uniqueness: 100, Consistency: 95 },
    score: 92,
    changes: [
      ["1", "Amount", "1,250.00 EUR", "1250.00 EUR", "Standardized currency format"],
      ["1", "Status", "paid", "PAID", "Normalized allowed value"],
      ["1", "Order date", "2026/03/01", "2026-03-01", "Standardized date"],
      ["2", "Amount", "875,50 €", "875.50 EUR", "Standardized decimal and currency"],
      ["3", "Amount", "Empty", "Review required", "Missing amount flagged"],
      ["4", "Customer", "Nord Market ", "Nord Market", "Trimmed surrounding space"],
      ["4", "Status", "refnd", "REVIEW", "Unknown status flagged"],
      ["5", "Amount", "2 100 EUR", "2100.00 EUR", "Standardized currency format"],
      ["6", "Entire row", "Duplicate of row 5", "Removed", "Exact duplicate"]
    ]
  }
};

let activeDataset = "customers";
let activeView = "before";
let hasRun = false;

const table = document.getElementById("data-table");
const runButton = document.getElementById("run-demo");
const resultSection = document.getElementById("results");
const processingState = document.getElementById("processing-state");
const beforeTab = document.getElementById("before-tab");
const afterTab = document.getElementById("after-tab");

function renderTable() {
  const dataset = datasets[activeDataset];
  const rows = dataset[activeView];
  const headRow = document.createElement("tr");
  table.querySelector("thead").replaceChildren();
  table.querySelector("tbody").replaceChildren();

  dataset.columns.forEach((column) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = column;
    headRow.appendChild(th);
  });
  table.querySelector("thead").appendChild(headRow);

  rows.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    const isDuplicate = activeView === "before" && dataset.duplicateRows.includes(rowIndex);
    const cleanedRowIndex = rowIndex - dataset.duplicateRows.filter((duplicateRow) => duplicateRow < rowIndex).length;
    const cleanedRow = dataset.after[cleanedRowIndex];
    const rowHasCleaningIssues = activeView === "before" && !isDuplicate && (
      dataset.issues.some(([r]) => r === rowIndex) ||
      row.some((value, columnIndex) => cleanedRow && value !== cleanedRow[columnIndex])
    );
    tr.className = [rowHasCleaningIssues ? "row-has-issues" : "", isDuplicate ? "row-duplicate" : ""].filter(Boolean).join(" ");
    row.forEach((value, columnIndex) => {
      const td = document.createElement("td");
      td.textContent = value || "—";
      const cellHasCleaningIssue = activeView === "before" && !isDuplicate && (
        dataset.issues.some(([r, c]) => r === rowIndex && c === columnIndex) ||
        Boolean(cleanedRow && value !== cleanedRow[columnIndex])
      );
      if (cellHasCleaningIssue) td.className = "cell-issue";
      if (activeView === "after" && value !== "Review required" && value !== "REVIEW") td.className = "cell-fixed";
      td.title = value || "Missing value";
      tr.appendChild(td);
    });
    table.querySelector("tbody").appendChild(tr);
  });

  table.querySelector("caption").textContent = `Synthetic ${dataset.title} data ${activeView} cleaning`;
  document.getElementById("data-panel").setAttribute("aria-labelledby", `${activeView}-tab`);
}

function selectView(view) {
  if (view === "after" && !hasRun) return;
  activeView = view;
  [beforeTab, afterTab].forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.view === view)));
  renderTable();
}

function renderResults() {
  const dataset = datasets[activeDataset];
  document.getElementById("overall-score").textContent = dataset.score;
  document.getElementById("hero-score").textContent = dataset.score;
  const metrics = document.getElementById("metric-cards");
  metrics.replaceChildren();
  Object.entries(dataset.metrics).forEach(([name, score]) => {
    const card = document.createElement("article");
    card.className = "metric-card";
    const top = document.createElement("div");
    top.className = "metric-top";
    const label = document.createElement("span"); label.textContent = name;
    const value = document.createElement("strong"); value.textContent = `${score}%`;
    top.append(label, value);
    const bar = document.createElement("div"); bar.className = "metric-bar";
    const fill = document.createElement("span"); fill.style.setProperty("--metric", `${score}%`); bar.appendChild(fill);
    const note = document.createElement("small"); note.textContent = score >= 95 ? "Strong" : score >= 88 ? "Improved" : "Review items remain";
    card.append(top, bar, note); metrics.appendChild(card);
  });

  const changeBody = document.querySelector("#change-table tbody");
  changeBody.replaceChildren();
  dataset.changes.forEach((change) => {
    const tr = document.createElement("tr");
    change.forEach((value, index) => {
      const td = document.createElement("td");
      td.textContent = value;
      if (index === 2) td.className = "cell-issue";
      if (index === 3) td.className = "cell-fixed";
      tr.appendChild(td);
    });
    changeBody.appendChild(tr);
  });
  document.getElementById("change-count").textContent = `${dataset.changes.length} changes`;
}

function resetDemo(datasetKey) {
  activeDataset = datasetKey;
  activeView = "before";
  hasRun = false;
  const dataset = datasets[activeDataset];
  document.getElementById("dataset-title").textContent = dataset.title;
  document.getElementById("before-count").textContent = `${dataset.before.length} rows`;
  document.getElementById("after-count").textContent = `${dataset.after.length} rows`;
  beforeTab.setAttribute("aria-selected", "true");
  afterTab.setAttribute("aria-selected", "false");
  afterTab.disabled = true;
  resultSection.hidden = true;
  processingState.textContent = "";
  processingState.className = "processing-state";
  renderTable();
}

document.querySelectorAll(".dataset-card").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".dataset-card").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-checked", String(selected));
    });
    resetDemo(button.dataset.dataset);
  });
});

[beforeTab, afterTab].forEach((tab) => tab.addEventListener("click", () => selectView(tab.dataset.view)));

runButton.addEventListener("click", () => {
  runButton.disabled = true;
  processingState.className = "processing-state is-processing";
  processingState.textContent = "Checking formats, duplicates and review items…";
  window.setTimeout(() => {
    hasRun = true;
    afterTab.disabled = false;
    renderResults();
    resultSection.hidden = false;
    selectView("after");
    processingState.textContent = "Demo complete — review the cleaned preview and audit trail below.";
    runButton.disabled = false;
  }, 650);
});

resetDemo(activeDataset);

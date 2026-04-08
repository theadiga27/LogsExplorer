// assets/js/app.js

let appliedFilters = {
  applicationName: "",
  interfaceName: "",
  dateFrom: "",
  dateTo: "",
  search: ""
};

let currentFilteredLogs = [];
let currentPage = 1;
let pageSize = 10;

function getFilterValues() {
  return {
    applicationName: document.getElementById("applicationName").value.trim(),
    interfaceName: document.getElementById("interfaceName").value.trim(),
    dateFrom: document.getElementById("dateFrom").value,
    dateTo: document.getElementById("dateTo").value,
    search: document.getElementById("globalSearch").value.trim()
  };
}

function populateSelect(selectEl, items, placeholder) {
  selectEl.innerHTML = `<option value="">${placeholder}</option>`;

  items.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    selectEl.appendChild(option);
  });
}

function loadApplications() {
  populateSelect(
    document.getElementById("applicationName"),
    getApplications(),
    "All Applications"
  );
}

function loadInterfaces(applicationName = "") {
  populateSelect(
    document.getElementById("interfaceName"),
    getInterfaces(applicationName),
    "All Interfaces"
  );
}

function clearFilters() {
  document.getElementById("filterForm").reset();
  document.getElementById("applicationName").value = "";
  document.getElementById("interfaceName").value = "";
  document.getElementById("dateFrom").value = "";
  document.getElementById("dateTo").value = "";
  document.getElementById("recentRange").value = "";
  document.getElementById("globalSearch").value = "";
}

function applyRecentRange() {
  const mins = parseInt(document.getElementById("recentRange").value, 10);
  if (!mins) return;

  const end = new Date();
  const start = new Date(end.getTime() - mins * 60000);

  const pad = n => String(n).padStart(2, "0");
  const format = d =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

  document.getElementById("dateFrom").value = format(start);
  document.getElementById("dateTo").value = format(end);
}

function ensurePageSizeControl() {
  const tableBottom = document.querySelector(".table-bottom");
  if (!tableBottom || document.getElementById("pageSizeControl")) return;

  const control = document.createElement("div");
  control.className = "page-size-control";
  control.id = "pageSizeControl";
  control.innerHTML = `
    <label class="page-size-label" for="pageSizeSelect">Rows per page</label>
    <select id="pageSizeSelect" class="form-select form-select-sm page-size-select">
      <option value="10">10</option>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </select>
  `;

  tableBottom.prepend(control);

  const select = document.getElementById("pageSizeSelect");
  select.value = String(pageSize);

  select.addEventListener("change", (e) => {
    pageSize = parseInt(e.target.value, 10) || 10;
    currentPage = 1;
    renderCurrentPage();
  });
}

function getTotalPages() {
  return currentFilteredLogs.length > 0
    ? Math.ceil(currentFilteredLogs.length / pageSize)
    : 0;
}

function goToPage(page) {
  currentPage = page;
  renderCurrentPage();
}

function renderCurrentPage() {
  const total = currentFilteredLogs.length;
  const totalPages = getTotalPages();

  if (totalPages > 0) {
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);
  } else {
    currentPage = 1;
  }

  const startIndex = total > 0 ? (currentPage - 1) * pageSize : 0;
  const endIndex = total > 0 ? Math.min(startIndex + pageSize, total) : 0;
  const pageData = total > 0 ? currentFilteredLogs.slice(startIndex, endIndex) : [];

  refreshTable(pageData);

  if (total > 0) {
    updateEntriesText(startIndex + 1, endIndex, total);
  } else {
    updateEntriesText(0, 0, 0);
  }

  renderPager(currentPage, totalPages, goToPage);
}

function refreshLogs() {
  currentFilteredLogs = getFilteredLogs(appliedFilters);
  currentPage = 1;
  renderCurrentPage();
}

function applyFiltersFromUI() {
  appliedFilters = getFilterValues();
  refreshLogs();
}

function applyLiveSearch() {
  appliedFilters.search = document.getElementById("globalSearch").value.trim();
  refreshLogs();
}

document.addEventListener("DOMContentLoaded", () => {
  loadApplications();
  loadInterfaces();

  initLogsTable([]);
  ensurePageSizeControl();
  refreshLogs();

  document.getElementById("submitBtn").addEventListener("click", (e) => {
    e.preventDefault();
    applyFiltersFromUI();
  });

  document.getElementById("globalSearch").addEventListener("input", () => {
    applyLiveSearch();
  });

  document.getElementById("clearBtn").addEventListener("click", () => {
    clearFilters();
    appliedFilters = {
      applicationName: "",
      interfaceName: "",
      dateFrom: "",
      dateTo: "",
      search: ""
    };
    currentPage = 1;
    refreshLogs();
  });

  document.getElementById("recentRange").addEventListener("change", () => {
    applyRecentRange();
  });

  document.getElementById("applicationName").addEventListener("change", (e) => {
    loadInterfaces(e.target.value);
  });

  document.getElementById("dateFrom").addEventListener("change", () => {
    document.getElementById("recentRange").value = "";
  });

  document.getElementById("dateTo").addEventListener("change", () => {
    document.getElementById("recentRange").value = "";
  });
});
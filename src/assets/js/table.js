// assets/js/table.js

let logsTable = null;

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function stageBadge(stage) {
  if (stage.type === "success") {
    return `<span class="badge-soft-success">${stage.text}</span>`;
  }
  if (stage.type === "danger") {
    return `<span class="badge-soft-danger">${stage.text}</span>`;
  }
  return `<span class="badge-soft-warning">${stage.text}</span>`;
}

function renderRows(data) {
  return data.map(item => ([
    escapeHtml(item.sequenceId),
    escapeHtml(item.interfaceCode),
    escapeHtml(item.applicationCode),
    escapeHtml(item.transactionId),
    stageBadge(item.loggingStage),
    escapeHtml(item.targetService),
    escapeHtml(item.logTime),
    escapeHtml(item.loggedMessage),
    escapeHtml(item.recordStatus),
    escapeHtml(item.createdBy),
    escapeHtml(item.createdDate),
    escapeHtml(item.modifiedBy),
    escapeHtml(item.modifiedDate)
  ]));
}

function initLogsTable(initialData = []) {
  logsTable = new DataTable("#logsTable", {
    data: renderRows(initialData),
    columns: [
      { title: "SEQUENCE_ID" },
      { title: "INTERFACE_CODE" },
      { title: "APPLICATION_CODE" },
      { title: "TRANSACTION_ID" },
      { title: "LOGGING_STAGE" },
      { title: "TARGET_SERVICE" },
      { title: "LOGTIME" },
      { title: "LOGGED_MESSAGE" },
      { title: "RECORD_STATUS" },
      { title: "CREATED_BY" },
      { title: "CREATED_DATE" },
      { title: "MODIFIED_BY" },
      { title: "MODIFIED_DATE" }
    ],
    paging: false,
    searching: false,
    info: false,
    ordering: false,
    responsive: true
  });

  return logsTable;
}

function refreshTable(data) {
  logsTable.clear();
  logsTable.rows.add(renderRows(data));
  logsTable.draw();
}

function updateEntriesText(start, end, total) {
  const el = document.getElementById("entriesText");
  if (!el) return;

  if (!total) {
    el.textContent = "Showing 0-0 of 0 entries";
  } else {
    el.textContent = `Showing ${start}-${end} of ${total} entries`;
  }
}

function renderPager(currentPage, totalPages, onPageChange) {
  const pager = document.getElementById("pager");
  if (!pager) return;

  pager.innerHTML = "";

  const createBtn = (label, page, disabled = false, active = false) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.disabled = disabled;
    if (active) btn.classList.add("active");

    if (!disabled) {
      btn.onclick = () => onPageChange(page);
    }

    pager.appendChild(btn);
  };

  createBtn("Prev", currentPage - 1, currentPage === 1);

  for (let i = 1; i <= totalPages; i++) {
    createBtn(i, i, false, i === currentPage);
  }

  createBtn("Next", currentPage + 1, currentPage === totalPages);
}
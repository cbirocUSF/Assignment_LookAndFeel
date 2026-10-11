/* ==========================================================================
   scholarships.js - mock CRUD for the scholarship catalog
   Mountainview Institute of Technology Scholarship Portal
   Author: Christopher Biroc  |  ISM 6225 Assignment 1

   Implements all four CRUD operations against an in-memory array:
     CREATE  - the form adds a new record when no record is being edited
     READ    - the table renders the array, with search and category filters
     UPDATE  - the Edit button loads a record into the form and saves changes
     DELETE  - the Delete button removes a record after a confirmation modal

   The data lives only in browser memory, so refreshing the page restores the
   original sample catalog. That is intentional: this is the static "mock" of
   a data-driven site, with no server or database behind it yet.
   ========================================================================== */

/* Working copy of the catalog. Starts as a deep copy of the shared sample
   data so that editing here never mutates the original array in data.js. */
var catalog = JSON.parse(JSON.stringify(SCHOLARSHIPS));

/* Holds the id of the record currently loaded into the form.
   null means the form is in "add new" mode. */
var editingId = null;

/* Holds the id queued for deletion while the confirmation modal is open. */
var pendingDeleteId = null;

/* Cached references to elements used on every render. */
var form, tableBody, searchBox, categoryFilter, statusFilter;
var formTitle, submitButton, cancelButton, alertBox, recordCount;
var deleteModal;

document.addEventListener('DOMContentLoaded', function () {
  // Grab the elements once rather than querying on every keystroke.
  form = document.getElementById('scholarshipForm');
  tableBody = document.getElementById('scholarshipTableBody');
  searchBox = document.getElementById('searchBox');
  categoryFilter = document.getElementById('categoryFilter');
  statusFilter = document.getElementById('statusFilter');
  formTitle = document.getElementById('formTitle');
  submitButton = document.getElementById('submitButton');
  cancelButton = document.getElementById('cancelButton');
  alertBox = document.getElementById('alertBox');
  recordCount = document.getElementById('recordCount');

  buildCategoryOptions();
  wireUpEvents();
  renderTable();
});

/* --------------------------------------------------------------------------
   Setup
   -------------------------------------------------------------------------- */

/**
 * Fills both the form dropdown and the filter dropdown from CATEGORIES,
 * so a new category only has to be added in one place (data.js).
 */
function buildCategoryOptions() {
  var formSelect = document.getElementById('category');

  for (var i = 0; i < CATEGORIES.length; i++) {
    var formOption = document.createElement('option');
    formOption.value = CATEGORIES[i];
    formOption.textContent = CATEGORIES[i];
    formSelect.appendChild(formOption);

    var filterOption = document.createElement('option');
    filterOption.value = CATEGORIES[i];
    filterOption.textContent = CATEGORIES[i];
    categoryFilter.appendChild(filterOption);
  }
}

function wireUpEvents() {
  form.addEventListener('submit', handleFormSubmit);
  cancelButton.addEventListener('click', resetForm);

  searchBox.addEventListener('input', renderTable);
  categoryFilter.addEventListener('change', renderTable);
  statusFilter.addEventListener('change', renderTable);

  document.getElementById('resetDataButton').addEventListener('click', resetSampleData);
  document.getElementById('confirmDeleteButton').addEventListener('click', confirmDelete);

  // Bootstrap's modal object, created once and reused.
  deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
}

/* --------------------------------------------------------------------------
   READ - render the table
   -------------------------------------------------------------------------- */

/**
 * Applies the search box and both dropdown filters, then redraws the table.
 */
function renderTable() {
  var searchText = searchBox.value.trim().toLowerCase();
  var chosenCategory = categoryFilter.value;
  var chosenStatus = statusFilter.value;

  // Clear whatever is currently in the table.
  tableBody.innerHTML = '';

  var shown = 0;

  for (var i = 0; i < catalog.length; i++) {
    var record = catalog[i];

    // Filter: search text must appear in the name or the category.
    var haystack = (record.name + ' ' + record.category).toLowerCase();
    if (searchText !== '' && haystack.indexOf(searchText) === -1) {
      continue;
    }

    // Filter: category dropdown ("All" passes everything).
    if (chosenCategory !== 'All' && record.category !== chosenCategory) {
      continue;
    }

    // Filter: status dropdown.
    if (chosenStatus !== 'All' && record.status !== chosenStatus) {
      continue;
    }

    tableBody.appendChild(buildTableRow(record));
    shown = shown + 1;
  }

  // Friendly empty state instead of a blank table.
  if (shown === 0) {
    var emptyRow = document.createElement('tr');
    var emptyCell = document.createElement('td');
    emptyCell.setAttribute('colspan', '8');
    emptyCell.className = 'text-center text-muted py-4';
    emptyCell.textContent = 'No scholarships match the current filters.';
    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
  }

  recordCount.textContent = shown + ' of ' + catalog.length + ' programs shown';
}

/**
 * Builds one <tr> for a single scholarship record.
 */
function buildTableRow(record) {
  var row = document.createElement('tr');

  // Highlight the row that is currently open in the form.
  if (record.id === editingId) {
    row.className = 'row-editing';
  }

  row.appendChild(makeCell(record.name, 'fw-semibold'));
  row.appendChild(makeCell(record.category));
  row.appendChild(makeCell(formatCurrency(record.amount), 'text-end'));
  row.appendChild(makeCell(String(record.awards), 'text-end'));
  row.appendChild(makeCell(formatDate(record.deadline)));
  row.appendChild(makeCell(record.minGpa.toFixed(1), 'text-end'));

  // Status pill
  var statusCell = document.createElement('td');
  var statusPill = document.createElement('span');
  statusPill.className = 'pill ' + (record.status === 'Open' ? 'pill-open' : 'pill-closed');
  statusPill.textContent = record.status;
  statusCell.appendChild(statusPill);
  row.appendChild(statusCell);

  // Action buttons
  var actionCell = document.createElement('td');
  actionCell.className = 'text-nowrap';

  var editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'btn btn-sm btn-outline-secondary btn-icon me-1';
  editButton.textContent = 'Edit';
  editButton.setAttribute('aria-label', 'Edit ' + record.name);
  // An IIFE-free closure: capture the id on the element itself.
  editButton.dataset.id = record.id;
  editButton.addEventListener('click', function () {
    startEdit(parseInt(this.dataset.id, 10));
  });

  var deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'btn btn-sm btn-outline-danger btn-icon';
  deleteButton.textContent = 'Delete';
  deleteButton.setAttribute('aria-label', 'Delete ' + record.name);
  deleteButton.dataset.id = record.id;
  deleteButton.addEventListener('click', function () {
    askToDelete(parseInt(this.dataset.id, 10));
  });

  actionCell.appendChild(editButton);
  actionCell.appendChild(deleteButton);
  row.appendChild(actionCell);

  return row;
}

/**
 * Small helper that builds a <td> with text and an optional class.
 */
function makeCell(text, className) {
  var cell = document.createElement('td');
  cell.textContent = text;

  if (className) {
    cell.className = className;
  }

  return cell;
}

/* --------------------------------------------------------------------------
   CREATE and UPDATE - one form handles both
   -------------------------------------------------------------------------- */

function handleFormSubmit(event) {
  event.preventDefault();

  // Let Bootstrap show its validation styling if anything is missing.
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  var values = readFormValues();

  if (editingId === null) {
    // CREATE
    values.id = nextId();
    catalog.push(values);
    showAlert('success', 'Added "' + values.name + '" to the catalog.');
  } else {
    // UPDATE
    var index = findIndexById(editingId);

    if (index === -1) {
      showAlert('danger', 'That record no longer exists.');
      resetForm();
      return;
    }

    values.id = editingId;
    catalog[index] = values;
    showAlert('success', 'Saved changes to "' + values.name + '".');
  }

  resetForm();
  renderTable();
}

/**
 * Reads every field out of the form into a plain record object.
 */
function readFormValues() {
  return {
    id: null,
    name: document.getElementById('name').value.trim(),
    category: document.getElementById('category').value,
    amount: parseInt(document.getElementById('amount').value, 10),
    awards: parseInt(document.getElementById('awards').value, 10),
    deadline: document.getElementById('deadline').value,
    minGpa: parseFloat(document.getElementById('minGpa').value),
    status: document.getElementById('status').value
  };
}

/**
 * Loads an existing record into the form and switches to update mode.
 */
function startEdit(id) {
  var index = findIndexById(id);

  if (index === -1) {
    return;
  }

  var record = catalog[index];

  document.getElementById('name').value = record.name;
  document.getElementById('category').value = record.category;
  document.getElementById('amount').value = record.amount;
  document.getElementById('awards').value = record.awards;
  document.getElementById('deadline').value = record.deadline;
  document.getElementById('minGpa').value = record.minGpa;
  document.getElementById('status').value = record.status;

  editingId = id;
  formTitle.textContent = 'Update Scholarship';
  submitButton.textContent = 'Save Changes';
  cancelButton.classList.remove('d-none');

  renderTable();

  // Bring the form into view on a phone, where it sits above the table.
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Clears the form and returns it to "add new" mode.
 */
function resetForm() {
  form.reset();
  form.classList.remove('was-validated');

  editingId = null;
  formTitle.textContent = 'Add New Scholarship';
  submitButton.textContent = 'Add Scholarship';
  cancelButton.classList.add('d-none');

  renderTable();
}

/* --------------------------------------------------------------------------
   DELETE - confirmed through a Bootstrap modal
   -------------------------------------------------------------------------- */

function askToDelete(id) {
  var index = findIndexById(id);

  if (index === -1) {
    return;
  }

  pendingDeleteId = id;
  document.getElementById('deleteTargetName').textContent = catalog[index].name;
  deleteModal.show();
}

function confirmDelete() {
  var index = findIndexById(pendingDeleteId);

  if (index !== -1) {
    var removedName = catalog[index].name;
    catalog.splice(index, 1);
    showAlert('success', 'Deleted "' + removedName + '" from the catalog.');

    // If the deleted record was open in the form, clear the form too.
    if (editingId === pendingDeleteId) {
      resetForm();
    }
  }

  pendingDeleteId = null;
  deleteModal.hide();
  renderTable();
}

/* --------------------------------------------------------------------------
   Utilities
   -------------------------------------------------------------------------- */

/**
 * Returns the array position of a record, or -1 if it is not in the catalog.
 */
function findIndexById(id) {
  for (var i = 0; i < catalog.length; i++) {
    if (catalog[i].id === id) {
      return i;
    }
  }

  return -1;
}

/**
 * Produces an id one higher than the largest currently in use, so ids stay
 * unique even after records have been deleted.
 */
function nextId() {
  var highest = 0;

  for (var i = 0; i < catalog.length; i++) {
    if (catalog[i].id > highest) {
      highest = catalog[i].id;
    }
  }

  return highest + 1;
}

/**
 * Restores the original sample catalog.
 */
function resetSampleData() {
  catalog = JSON.parse(JSON.stringify(SCHOLARSHIPS));
  searchBox.value = '';
  categoryFilter.value = 'All';
  statusFilter.value = 'All';
  resetForm();
  showAlert('info', 'Sample catalog restored.');
}

/**
 * Shows a dismissible Bootstrap alert above the table.
 */
function showAlert(type, message) {
  alertBox.innerHTML =
    '<div class="alert alert-' + type + ' alert-dismissible fade show mb-3" role="alert">' +
    message +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
    '</div>';
}

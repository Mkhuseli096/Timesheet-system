// Get the form and table body
const timesheetForm = document.getElementById('timesheetForm');
const timesheetTableBody = document.querySelector('#timesheetTable tbody');

// Firebase Database reference
const db = firebase.database();

// Add project button click handler
document.getElementById('addProjectBtn').addEventListener('click', function () {
  const hoursWorked = document.getElementById('hoursWorked').value.trim();
  const dateWorked = document.getElementById('dateWorked').value.trim();
  const category = document.getElementById('category').value;
  const project = document.getElementById('project').value.trim();
  const description = document.getElementById('description').value.trim();
  const status = document.getElementById('status').value;

  if (!hoursWorked || !dateWorked || !project || !description) {
    alert("Please fill out all required fields.");
    return;
  }

  const entry = {
    hoursWorked,
    dateWorked,
    category,
    project,
    description,
    status
  };

  addTimesheetToTable(entry);
  clearForm();
});

// Add a new row to the preview table
function addTimesheetToTable(entry) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${entry.hoursWorked}</td>
    <td>${entry.dateWorked}</td>
    <td>${entry.category}</td>
    <td>${entry.project}</td>
    <td>${entry.description}</td>
    <td>${entry.status}</td>
  `;
  timesheetTableBody.appendChild(row);
}

// Clear form inputs
function clearForm() {
  timesheetForm.reset();
}

// Clear the table on page load
window.onload = function () {
  timesheetTableBody.innerHTML = '';
};

// Submit all rows to Firebase
document.getElementById('submitBtn').addEventListener('click', function () {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const email = loggedInUser?.email || "unknown";

  const rows = document.querySelectorAll("#timesheetTable tbody tr");

  if (rows.length === 0) {
    alert("No timesheet entries to submit.");
    return;
  }

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");

    const timesheetEntry = {
      email: email,
      hoursWorked: cells[0].innerText,
      dateWorked: cells[1].innerText,
      category: cells[2].innerText,
      project: cells[3].innerText,
      description: cells[4].innerText,
      status: cells[5].innerText
    };

    // Push to Firebase under "timesheets"
    db.ref("timesheets").push(timesheetEntry);
  });

  alert("Timesheet(s) submitted successfully to the cloud!");
  timesheetTableBody.innerHTML = '';
  clearForm();
});

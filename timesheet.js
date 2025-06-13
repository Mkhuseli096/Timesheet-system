// Get the form and table body
const timesheetForm = document.getElementById('timesheetForm');
const timesheetTableBody = document.querySelector('#timesheetTable tbody');

// Add project button click handler
document.getElementById('addProjectBtn').addEventListener('click', function () {
  const hoursWorked = document.getElementById('hoursWorked').value.trim();
  const dateWorked = document.getElementById('dateWorked').value.trim();
  const category = document.getElementById('category').value;
  const project = document.getElementById('project').value.trim();
  const description = document.getElementById('description').value.trim();
  const status = document.getElementById('status').value;

  // Validate input
  if (!hoursWorked || !dateWorked || !project || !description) {
    alert("Please fill out all required fields.");
    return;
  }

  const timesheetEntry = {
    hoursWorked,
    dateWorked,
    category,
    project,
    description,
    status
  };

  // Add the entry to the table for preview
  addTimesheetToTable(timesheetEntry);
  clearForm();
});

// Add row to the table
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

// Clear form
function clearForm() {
  timesheetForm.reset();
}

// On page load, clear the table
window.onload = function () {
  timesheetTableBody.innerHTML = '';
};

// Submit all rows to localStorage with email
document.getElementById('submitBtn').addEventListener('click', function () {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const email = loggedInUser?.email || "unknown";

  const rows = document.querySelectorAll("#timesheetTable tbody tr");
  const savedTimesheets = JSON.parse(localStorage.getItem("timesheets")) || [];

  rows.forEach(row => {
    const cells = row.querySelectorAll("td");

    const timesheetEntry = {
      email: email, // ✅ Include email here
      hoursWorked: cells[0].innerText,
      dateWorked: cells[1].innerText,
      category: cells[2].innerText,
      project: cells[3].innerText,
      description: cells[4].innerText,
      status: cells[5].innerText
    };

    savedTimesheets.push(timesheetEntry);
  });

  localStorage.setItem("timesheets", JSON.stringify(savedTimesheets));
  alert("Timesheet(s) submitted successfully!");
  timesheetTableBody.innerHTML = '';
  clearForm();
});

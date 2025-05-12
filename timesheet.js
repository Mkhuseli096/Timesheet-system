// Get the form elements and the table body
const timesheetForm = document.getElementById('timesheetForm');
const timesheetTableBody = document.querySelector('#timesheetTable tbody');

// Function to add a new project (timesheet entry)
document.getElementById('addProjectBtn').addEventListener('click', function () {
  const employeeEmail = document.getElementById('employeeId').value.trim();
  const hoursWorked = document.getElementById('hoursWorked').value.trim();
  const dateWorked = document.getElementById('dateWorked').value.trim();
  const category = document.getElementById('category').value;
  const project = document.getElementById('project').value.trim();
  const description = document.getElementById('description').value.trim();
  const status = document.getElementById('status').value;

  // Validate form input
  if (!employeeEmail || !hoursWorked || !dateWorked || !project || !description) {
    alert("Please fill out all fields.");
    return;
  }

  // Create a new timesheet entry object
  const timesheetEntry = {
    email: employeeEmail,
    hoursWorked,
    dateWorked,
    category,
    project,
    description,
    status
  };

  // Get existing timesheets from localStorage
  let timesheets = JSON.parse(localStorage.getItem('timesheets')) || [];

  // Add the new entry to the array
  timesheets.push(timesheetEntry);

  // Save the updated timesheets back to localStorage
  localStorage.setItem('timesheets', JSON.stringify(timesheets));

  // Add the new entry to the table
  addTimesheetToTable(timesheetEntry);
  clearForm();
});

// Function to add a timesheet entry to the table
function addTimesheetToTable(entry) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${entry.email}</td>
    <td>${entry.hoursWorked}</td>
    <td>${entry.dateWorked}</td>
    <td>${entry.category}</td>
    <td>${entry.project}</td>
    <td>${entry.description}</td>
    <td>${entry.status}</td>
  `;
  timesheetTableBody.appendChild(row);
}

// Function to clear the form fields
function clearForm() {
  timesheetForm.reset();
}

// Display all saved timesheets on page load
window.onload = function () {
  const savedTimesheets = JSON.parse(localStorage.getItem('timesheets')) || [];
  savedTimesheets.forEach(entry => {
    addTimesheetToTable(entry);
  });
};

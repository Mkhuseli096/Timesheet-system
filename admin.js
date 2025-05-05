// admin.js

document.addEventListener("DOMContentLoaded", function () {
    const timesheets = JSON.parse(localStorage.getItem("timesheets")) || [];
    const timesheetTable = document.getElementById("adminTimesheetTable").getElementsByTagName('tbody')[0];
    const employeeFilter = document.getElementById("employeeFilter");

    // Function to render the timesheets
    function renderTimesheets(filteredTimesheets) {
        // Clear the table first
        timesheetTable.innerHTML = '';

        filteredTimesheets.forEach((timesheet) => {
            const row = timesheetTable.insertRow();
            row.insertCell(0).textContent = timesheet.email;
            row.insertCell(1).textContent = timesheet.hours;
            row.insertCell(2).textContent = timesheet.date;
            row.insertCell(3).textContent = timesheet.category;
            row.insertCell(4).textContent = timesheet.project;
            row.insertCell(5).textContent = timesheet.description;
            row.insertCell(6).textContent = timesheet.status;
        });
    }

    // Function to populate the employee filter dropdown
    function populateEmployeeFilter() {
        const employeeEmails = [...new Set(timesheets.map(ts => ts.email))]; // Get unique emails
        employeeFilter.innerHTML = '<option value="all">All Employees</option>'; // Reset the filter

        employeeEmails.forEach(email => {
            const option = document.createElement("option");
            option.value = email;
            option.textContent = email;
            employeeFilter.appendChild(option);
        });
    }

    // Event listener for filtering timesheets by employee
    employeeFilter.addEventListener("change", function () {
        const selectedEmail = employeeFilter.value;

        if (selectedEmail === "all") {
            renderTimesheets(timesheets); // Show all timesheets
        } else {
            const filteredTimesheets = timesheets.filter(ts => ts.email === selectedEmail);
            renderTimesheets(filteredTimesheets); // Show filtered timesheets
        }
    });

    // Initial setup
    populateEmployeeFilter(); // Populate the filter dropdown on page load
    renderTimesheets(timesheets); // Show all timesheets initially
});

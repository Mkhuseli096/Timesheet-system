// admin.js
const db = window.firebaseDatabase; // use the Firebase database initialized in HTML

// Load Employees
const employeeTableBody = document.querySelector("#employeeTable tbody");

db.ref("employees").get()
  .then(snapshot => {
    console.log("Employees snapshot:", snapshot.val()); // <-- Check here
    if (snapshot.exists()) {
      const employees = snapshot.val();
      document.getElementById("totalEmployees").textContent = Object.keys(employees).length;
      employeeTableBody.innerHTML = "";
      Object.values(employees).forEach(emp => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${emp.email}</td><td>${emp.registeredOn}</td>`;
        employeeTableBody.appendChild(row);
      });
    } else {
      employeeTableBody.innerHTML = "<tr><td colspan='2'>No employees found.</td></tr>";
    }
  })
  .catch(err => console.error(err));

// Load Timesheets
const allTimesheetBody = document.getElementById("adminTimesheetBody");
const monthlyContainer = document.getElementById("monthlyTimesheetContainer");

db.ref("timesheets").get()
  .then(snapshot => {
    console.log("Timesheets snapshot:", snapshot.val()); // <-- Check here
    if (snapshot.exists()) {
      const timesheets = snapshot.val();
      const timesheetArray = Object.values(timesheets);
      document.getElementById("totalTimesheets").textContent = timesheetArray.length;

      // Fill All Timesheets
      allTimesheetBody.innerHTML = "";
      timesheetArray.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${entry.email}</td>
          <td>${entry.dateWorked}</td>
          <td>${entry.hoursWorked}</td>
          <td>${entry.category}</td>
          <td>${entry.project}</td>
          <td>${entry.description}</td>
          <td>${entry.status}</td>
        `;
        allTimesheetBody.appendChild(row);
      });

    } else {
      allTimesheetBody.innerHTML = "<tr><td colspan='7'>No timesheets submitted.</td></tr>";
    }
  })
  .catch(err => console.error(err));

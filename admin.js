// admin.js
import { db, ref, get, child } from "./firebaseConfig.js";

// Select table bodies and containers
const employeeTable = document.querySelector("#employeeTable tbody");
const allTableBody = document.getElementById("adminTimesheetBody");
const monthlyContainer = document.getElementById("monthlyTimesheetContainer");

// --- Load Employees ---
get(child(ref(db), "employees")).then((snapshot) => {
  if (snapshot.exists()) {
    const employees = snapshot.val();
    document.getElementById("totalEmployees").textContent = Object.keys(employees).length;
    employeeTable.innerHTML = "";
    Object.values(employees).forEach(emp => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${emp.email}</td><td>${emp.registeredOn}</td>`;
      employeeTable.appendChild(row);
    });
  } else {
    employeeTable.innerHTML = "<tr><td colspan='2'>No employees found.</td></tr>";
  }
}).catch(err => console.error("Error fetching employees:", err));

// --- Load Timesheets ---
get(child(ref(db), "timesheets")).then((snapshot) => {
  if (snapshot.exists()) {
    const timesheets = snapshot.val();
    const timesheetArray = Object.values(timesheets);
    document.getElementById("totalTimesheets").textContent = timesheetArray.length;

    // Fill All Timesheets Table
    allTableBody.innerHTML = "";
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
      allTableBody.appendChild(row);
    });

    // Group and show Monthly Timesheets
    const grouped = {};
    timesheetArray.forEach(entry => {
      const date = new Date(entry.dateWorked);
      const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
      if (!grouped[entry.email]) grouped[entry.email] = {};
      if (!grouped[entry.email][monthYear]) grouped[entry.email][monthYear] = [];
      grouped[entry.email][monthYear].push(entry);
    });

    monthlyContainer.innerHTML = "";
    for (let email in grouped) {
      const userSection = document.createElement("div");
      userSection.style.marginBottom = "40px";

      const userHeading = document.createElement("h3");
      userHeading.textContent = email;
      userSection.appendChild(userHeading);

      for (let month in grouped[email]) {
        const monthSection = document.createElement("div");
        monthSection.style.marginBottom = "20px";

        const heading = document.createElement("h4");
        heading.textContent = month;
        monthSection.appendChild(heading);

        const table = document.createElement("table");
        table.innerHTML = `
          <thead>
            <tr>
              <th>Date</th>
              <th>Hours</th>
              <th>Category</th>
              <th>Project</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${grouped[email][month].map(entry => `
              <tr>
                <td>${new Date(entry.dateWorked).toLocaleDateString("en-ZA")}</td>
                <td>${entry.hoursWorked}</td>
                <td>${entry.category}</td>
                <td>${entry.project}</td>
                <td>${entry.description}</td>
                <td>${entry.status}</td>
              </tr>
            `).join('')}
          </tbody>
        `;
        monthSection.appendChild(table);
        userSection.appendChild(monthSection);
      }
      monthlyContainer.appendChild(userSection);
    }
  } else {
    allTableBody.innerHTML = "<tr><td colspan='7'>No timesheets found.</td></tr>";
  }
}).catch(err => console.error("Error fetching timesheets:", err));

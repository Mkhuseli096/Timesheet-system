import { db, ref, get, child } from "./firebaseConfig.js";

// Load Employees
const employeeTable = document.querySelector("#employeeTable tbody");
const employeeRef = ref(db);

get(child(employeeRef, "employees")).then((snapshot) => {
  if (snapshot.exists()) {
    const employees = snapshot.val();
    document.getElementById("totalEmployees").textContent = Object.keys(employees).length;
    employeeTable.innerHTML = "";
    Object.values(employees).forEach(emp => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${emp.email}</td><td>${emp.registeredOn}</td>`;
      employeeTable.appendChild(row);
    });
  }
});

// Load Timesheets
const allTableBody = document.getElementById("adminTimesheetBody");
const monthlyContainer = document.getElementById("monthlyTimesheetContainer");
const timesheetRef = ref(db);

get(child(timesheetRef, "timesheets")).then((snapshot) => {
  if (snapshot.exists()) {
    const timesheets = snapshot.val();
    const timesheetArray = Object.values(timesheets);
    document.getElementById("totalTimesheets").textContent = timesheetArray.length;

    // Fill All Timesheets
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

    // Group and Fill Monthly Timesheets
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
      userHeading.style.marginBottom = "10px";
      userSection.appendChild(userHeading);

      for (let month in grouped[email]) {
        const monthSection = document.createElement("div");
        monthSection.style.marginBottom = "20px";

        const heading = document.createElement("h4");
        heading.textContent = `${month}`;
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
                <td>${entry.dateWorked}</td>
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
  }
});

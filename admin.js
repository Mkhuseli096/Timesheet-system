import { db, ref, get, child } from "./firebaseConfig.js";

// ===================== LOAD EMPLOYEES =====================
const employeeTable = document.querySelector("#employeeTable tbody");

get(child(ref(db), "employees"))
  .then((snapshot) => {
    console.log("Employees:", snapshot.val());

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
      console.log("No employees found");
    }
  })
  .catch((error) => {
    console.error("Employee error:", error);
  });


// ===================== LOAD TIMESHEETS =====================
const allTableBody = document.getElementById("adminTimesheetBody");
const monthlyContainer = document.getElementById("monthlyTimesheetContainer");

get(child(ref(db), "timesheets"))
  .then((snapshot) => {
    console.log("Timesheets:", snapshot.val()); // 🔥 DEBUG

    if (!snapshot.exists()) {
      allTableBody.innerHTML = "<tr><td colspan='7'>No timesheets found in Firebase</td></tr>";
      return;
    }

    const timesheets = snapshot.val();
    const timesheetArray = Object.values(timesheets);

    document.getElementById("totalTimesheets").textContent = timesheetArray.length;

    // ===================== ALL TIMESHEETS =====================
    allTableBody.innerHTML = "";

    timesheetArray.forEach(entry => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${entry.email || ""}</td>
        <td>${entry.dateWorked || ""}</td>
        <td>${entry.hoursWorked || ""}</td>
        <td>${entry.category || ""}</td>
        <td>${entry.project || ""}</td>
        <td>${entry.description || ""}</td>
        <td>${entry.status || ""}</td>
      `;
      allTableBody.appendChild(row);
    });

    // ===================== MONTHLY GROUP =====================
    const grouped = {};

    timesheetArray.forEach(entry => {
      const date = new Date(entry.dateWorked);

      if (isNaN(date)) return; // skip bad dates

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
  })
  .catch((error) => {
    console.error("Timesheet error:", error); // 🔥 VERY IMPORTANT
  });

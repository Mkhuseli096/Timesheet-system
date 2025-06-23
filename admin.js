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
      userSection.appendChild(userHeading);

      for (let month in grouped[email]) {
        const monthSection = document.createElement("div");
        monthSection.style.marginBottom = "20px";

        const heading = document.createElement("h4");
        heading.textContent = `${month}`;
        monthSection.appendChild(heading);

        const tableId = `table-${email.replace(/[^a-zA-Z0-9]/g, '')}-${month.replace(/\s/g, '')}`;
        const table = document.createElement("table");
        table.setAttribute("id", tableId);
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

        // ✅ Updated Download Button with Proper Excel Formatting
        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = `Download for ${email}`;
        downloadBtn.classList.add("btn-download");

        downloadBtn.addEventListener("click", () => {
          const data = grouped[email][month].map(entry => {
            const date = new Date(entry.dateWorked);
            const formattedDate = !isNaN(date) ? date.toISOString().split("T")[0] : "";
            return {
              "Date": formattedDate,
              "Hours": entry.hoursWorked,
              "Category": entry.category,
              "Project": entry.project,
              "Description": entry.description,
              "Status": entry.status
            };
          });

          const ws = XLSX.utils.json_to_sheet(data);
          ws["!cols"] = [
            { wch: 15 },
            { wch: 10 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 },
            { wch: 15 },
          ];

          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, `${month}`);
          XLSX.writeFile(wb, `${email}-${month}-Timesheet.xlsx`);
        });

        monthSection.appendChild(downloadBtn);
        userSection.appendChild(monthSection);
      }

      monthlyContainer.appendChild(userSection);
    }
  }
});

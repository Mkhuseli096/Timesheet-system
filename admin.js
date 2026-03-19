// admin.js

// Use the Firebase Database initialized in HTML
const db = window.firebaseDatabase;

// Elements
const employeeTableBody = document.querySelector("#employeeTable tbody");
const allTimesheetBody = document.getElementById("adminTimesheetBody");
const monthlyContainer = document.getElementById("monthlyTimesheetContainer");

// --- Load Employees ---
db.ref("employees").get()
  .then(snapshot => {
    const employees = snapshot.val();
    if (employees) {
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
  .catch(err => console.error("Error fetching employees:", err));

// --- Load Timesheets ---
db.ref("timesheets").get()
  .then(snapshot => {
    const timesheets = snapshot.val();
    if (!timesheets) {
      allTimesheetBody.innerHTML = "<tr><td colspan='7'>No timesheets submitted.</td></tr>";
      return;
    }

    const timesheetArray = Object.values(timesheets);
    document.getElementById("totalTimesheets").textContent = timesheetArray.length;

    // Fill All Timesheets Table
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

    // Group Timesheets by Email & Month
    const grouped = {};
    timesheetArray.forEach(entry => {
      const date = new Date(entry.dateWorked);
      const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
      if (!grouped[entry.email]) grouped[entry.email] = {};
      if (!grouped[entry.email][monthYear]) grouped[entry.email][monthYear] = [];
      grouped[entry.email][monthYear].push(entry);
    });

    // Fill Monthly Timesheets
    monthlyContainer.innerHTML = "";
    for (const email in grouped) {
      const userSection = document.createElement("div");
      userSection.style.marginBottom = "40px";

      const userHeading = document.createElement("h3");
      userHeading.textContent = email;
      userSection.appendChild(userHeading);

      for (const month in grouped[email]) {
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

        // Download Monthly Excel
        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = `Download for ${email} (${month})`;
        downloadBtn.classList.add("btn-download");
        downloadBtn.addEventListener("click", () => {
          const data = grouped[email][month].map(entry => ({
            "Date": new Date(entry.dateWorked).toISOString().split("T")[0],
            "Hours": entry.hoursWorked,
            "Category": entry.category,
            "Project": entry.project,
            "Description": entry.description,
            "Status": entry.status
          }));
          const ws = XLSX.utils.json_to_sheet(data);
          ws["!cols"] = [
            { wch: 15 }, { wch: 10 }, { wch: 20 },
            { wch: 20 }, { wch: 30 }, { wch: 15 }
          ];
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, month);
          XLSX.writeFile(wb, `${email}-${month}-Timesheet.xlsx`);
        });
        monthSection.appendChild(downloadBtn);

        userSection.appendChild(monthSection);
      }

      monthlyContainer.appendChild(userSection);
    }

  })
  .catch(err => console.error("Error fetching timesheets:", err));

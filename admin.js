// Load data
const employees = JSON.parse(localStorage.getItem("employees")) || [];
const timesheets = JSON.parse(localStorage.getItem("timesheets")) || [];

// DASHBOARD
document.getElementById("totalEmployees").textContent = employees.length;
document.getElementById("totalTimesheets").textContent = timesheets.length;

// ALL TIMESHEETS
const allTableBody = document.getElementById("adminTimesheetBody");
allTableBody.innerHTML = "";
timesheets.forEach(entry => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${entry.dateWorked}</td>
    <td>${entry.hoursWorked}</td>
    <td>${entry.category}</td>
    <td>${entry.project}</td>
    <td>${entry.description}</td>
    <td>${entry.status}</td>
  `;
  allTableBody.appendChild(row);
});

// REGISTERED EMPLOYEES
const employeeTable = document.querySelector("#employeeTable tbody");
employeeTable.innerHTML = "";
employees.forEach(emp => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${emp.email}</td>
    <td>${emp.registeredOn}</td>
  `;
  employeeTable.appendChild(row);
});

// MONTHLY TIMESHEETS (Grouped by employee and month)
const monthlyContainer = document.getElementById("monthlyTimesheetContainer");
monthlyContainer.innerHTML = "";

const grouped = {};
timesheets.forEach(entry => {
  const date = new Date(entry.dateWorked);
  const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
  if (!grouped[entry.email]) grouped[entry.email] = {};
  if (!grouped[entry.email][monthYear]) grouped[entry.email][monthYear] = [];
  grouped[entry.email][monthYear].push(entry);
});

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

    const btn = document.createElement("button");
    btn.className = "btn-download";
    btn.textContent = `Download ${email.split('@')[0]}'s ${month} Excel`;
    btn.onclick = () => downloadEmployeeMonthExcel(email, month, grouped[email][month]);
    monthSection.appendChild(btn);

    userSection.appendChild(monthSection);
  }

  monthlyContainer.appendChild(userSection);
}

// Download Excel for individual employee and month
function downloadEmployeeMonthExcel(email, month, data) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  const cleanName = `${email.split('@')[0]}_${month.replace(/\s/g, "_")}`;
  XLSX.utils.book_append_sheet(wb, ws, cleanName);
  XLSX.writeFile(wb, `${cleanName}_Timesheet.xlsx`);
}

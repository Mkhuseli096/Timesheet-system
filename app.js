document.addEventListener("DOMContentLoaded", function () {
    const addBtn = document.getElementById("addProjectBtn");
  
    addBtn.addEventListener("click", function () {
      let timesheets = JSON.parse(localStorage.getItem("timesheets")) || [];
  
      const newEntry = {
        email: document.getElementById("employeeId").value,
        hours: document.getElementById("hoursWorked").value,
        date: document.getElementById("dateWorked").value,
        category: document.getElementById("category").value,
        project: document.getElementById("project").value,
        description: document.getElementById("description").value,
        status: document.getElementById("status").value
      };
  
      timesheets.push(newEntry);
      localStorage.setItem("timesheets", JSON.stringify(timesheets));
  
      displayEntry(newEntry); // 🔴 Call function to show entry on the page
  
      document.getElementById("timesheetForm").reset(); // Optional: clears the form
    });
  
    // 🔁 Show all existing timesheets when page loads
    const storedTimesheets = JSON.parse(localStorage.getItem("timesheets")) || [];
    storedTimesheets.forEach(displayEntry);
  });
  
  function displayEntry(entry) {
    const tableBody = document.querySelector("#timesheetTable tbody");
    const row = document.createElement("tr");
  
    row.innerHTML = `
      <td>${entry.email}</td>
      <td>${entry.hours}</td>
      <td>${entry.date}</td>
      <td>${entry.category}</td>
      <td>${entry.project}</td>
      <td>${entry.description}</td>
      <td>${entry.status}</td>
    `;
  
    tableBody.appendChild(row);
  }
  document.addEventListener("DOMContentLoaded", function () {
    // ... your existing code ...
  
    // Handle Submit Timesheets button
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.addEventListener("click", function () {
      // Optional: you could also do something with the data here, like send it to a server
  
      // Clear the table
      document.querySelector("#timesheetTable tbody").innerHTML = "";
  
      // Optionally clear localStorage too
      localStorage.removeItem("timesheets");
  
      alert("Timesheets submitted and cleared!");
    });
  });
    
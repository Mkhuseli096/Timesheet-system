// admin.js

// Function to populate the table (fetching the data from localStorage)
function loadTimesheets() {
    const timesheets = JSON.parse(localStorage.getItem("timesheets")) || [];
    const tableBody = document.querySelector("#adminTimesheetTable tbody");

    // Clear existing rows
    tableBody.innerHTML = "";

    timesheets.forEach(timesheet => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${timesheet.email}</td>
            <td>${timesheet.hoursWorked}</td>
            <td>${timesheet.dateWorked}</td>
            <td>${timesheet.category}</td>
            <td>${timesheet.project}</td>
            <td>${timesheet.description}</td>
            <td>${timesheet.status}</td>
        `;

        tableBody.appendChild(row);
    });

    // Debugging log to confirm table is populated
    console.log("Loaded timesheets:", timesheets);
}

// Function to generate the PDF and download it
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get table data from the DOM
    const table = document.getElementById('adminTimesheetTable');
    const rows = table.querySelectorAll('tr');

    let yPosition = 20; // Start y position for text in PDF

    // Title
    doc.setFontSize(20);
    doc.text('Submitted Timesheets', 105, yPosition, null, null, 'center');
    yPosition += 20;

    // Table header
    doc.setFontSize(12);
    const headers = ['Email', 'Hours Worked', 'Date', 'Category', 'Project', 'Description', 'Status'];
    
    // Debugging log to confirm rows are being selected
    console.log("Table rows:", rows);

    // Convert table data into an array format for jsPDF
    const tableData = Array.from(rows).slice(1).map(row => {
        return Array.from(row.children).map(cell => cell.innerText);
    });

    // Debugging log to confirm table data is extracted correctly
    console.log("Table data to be added to PDF:", tableData);

    // Generate PDF with the table data
    doc.autoTable({
        head: [headers],
        body: tableData,
        startY: yPosition,
        theme: 'striped',
        headStyles: {
            fillColor: [255, 0, 0], // Red header
            textColor: [255, 255, 255], // White text
        },
        styles: {
            fontSize: 10,
        }
    });

    // Save the generated PDF
    doc.save('timesheets.pdf');
}

// Load timesheet data when the admin panel loads
window.onload = loadTimesheets;

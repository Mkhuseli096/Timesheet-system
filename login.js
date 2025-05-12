document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    const employeeEmail = "enquiries@projectized.co.za";
    const employeePassword = "Projectized096";
    const adminEmail = "Mkhuseli@projectized.co.za";
    const adminPassword = "Projectized096";
  
    if (email === employeeEmail && password === employeePassword) {
      localStorage.setItem("role", "employee");
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("loggedInUser", email);
      window.location.href = "timesheet.html";
    } else if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("role", "admin");
      localStorage.setItem("loggedIn", "true");
      window.location.href = "admin.html";
    } else {
      alert("Invalid login credentials. Please try again.");
    }
  });
  
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting normally
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Here, we are just checking if the email and password are filled (no real backend yet)
    if (email && password) {
      // Save login to localStorage (for now)
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userType", "employee");
  
      // Redirect to the employee timesheet page
      window.location.href = "employee.html"; // or whatever your employee page is called
    } else {
      alert("Please enter email and password!");
    }
  });
  

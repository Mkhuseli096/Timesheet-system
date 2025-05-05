// Check if users exist in localStorage, if not, create default admin
const existingUsers = JSON.parse(localStorage.getItem('users'));

if (!existingUsers || existingUsers.length === 0) {
  const defaultAdmin = {
    email: "admin@projectized.co.za", // ✅ Corrected Email
    password: "admin123",              // Password
    userType: "admin"
  };

  localStorage.setItem('users', JSON.stringify([defaultAdmin]));
}

function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }
  
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
  
    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
  
    if (existingUser) {
      alert('User with this email already exists. Please login.');
      window.location.href = "login.html";
    } else {
      // Add new user
      users.push({ email: email, password: password, userType: "employee" }); // Always registering as employee
      localStorage.setItem('users', JSON.stringify(users));
  
      alert('Registration successful! You can now login.');
      window.location.href = "login.html";
    }
  }
  
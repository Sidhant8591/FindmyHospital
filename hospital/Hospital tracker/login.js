// Sample user data (replace with real data and server-side validation)
const validEmail = "akshat1683.be23@chitkara.edu.in";
const validPassword = "password123"; // For login validation
const users = []; // Array to hold registered users (for demonstration)

document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('signupForm').classList.remove('active');
});

document.getElementById('signupBtn').addEventListener('click', function() {
    document.getElementById('signupForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
});

// Handle Forgot Password
document.querySelector('.forgot-password').addEventListener('click', function(event) {
    event.preventDefault();
    const email = prompt("Please enter your email address to reset your password:");
    if (email) {
        alert(`A password reset link has been sent to ${email}.`);
    } else {
        alert("Email not entered.");
    }
});

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    const email = event.target[0].value; // Get email input value
    const password = event.target[1].value; // Get password input value

    // Check credentials
    if (email === validEmail && password === validPassword) {
        alert("Login successful!");
        window.location.href = "index.html"; // Redirect to index page on success
    } else {
        alert("Invalid email or password.");
    }
}

// Handle sign-up form submission
function handleSignUp(event) {
    event.preventDefault();
    const username = event.target[0].value; // Get username input value
    const email = event.target[1].value; // Get email input value
    const password = event.target[2].value; // Get password input value

    // Store user information (for demonstration purposes)
    users.push({ username, email, password });
    
    alert("Sign up successful! You can now log in.");
    window.location.href = "index.html"; // Redirect to the main website after signing up
}

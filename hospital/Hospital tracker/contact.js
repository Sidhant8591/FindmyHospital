// Form Validation and Submission
function validateForm() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const confirmationMessage = document.getElementById("confirmationMessage");

    // Simple Validation (could add more)
    if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return false;
    }

    // Form Submission Simulation
    confirmationMessage.innerHTML = `Thank you, ${name}. Your message has been sent!`;
    confirmationMessage.classList.remove("hidden");

    // Optionally reset form after submission
    document.getElementById("contactForm").reset();

    // Prevent form from submitting (for demo)
    return false;
}
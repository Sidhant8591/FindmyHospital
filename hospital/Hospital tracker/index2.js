document.getElementById('appointment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Getting form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const message = document.getElementById('message').value;

    // Here you would normally send the data to your server for processing
    // For now, we will just display a confirmation message

    document.getElementById('confirmation-message').innerText = `Thank you, ${name}. Your appointment on ${date} at ${time} has been scheduled!`;
    
    // Optionally, you could clear the form after submission
    document.getElementById('appointment-form').reset();
});

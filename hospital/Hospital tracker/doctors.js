const doctors = [
    { id: 1, name: "Dr. Archit Grover", specialty: "Cardiologist", available: true, image: "ArchitGrover.jpg"},
    { id: 2, name: "Dr. Sk Gupta", specialty: "Dermatologist", available: false, image: "SkGupta.jpeg" },
    { id: 3, name: "Dr. Anushka Aggarwal", specialty: "Pediatrician", available: true, image: "Anushka.jpg" },
    { id: 4, name: "Dr. Aditya", specialty: "Orthopedic", available: true, image: "aditya.jpeg" },
    { id: 5, name: "Dr. Anjana", specialty: "Neurologist", available: false, image: "anjana.webp" },
    { id: 6, name: "Dr. Rajesh", specialty: "General Practitioner", available: true, image: "Rajesh.jpg" },
    { id: 7, name: "Dr. Seema", specialty: "Endocrinologist", available: true, image: "Seema.jpeg" },
    { id: 8, name: "Dr. Neha", specialty: "Gynecologist", available: true, image: "Neha.jpeg" },
];

const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", 
    "1:00 PM", "2:00 PM", "3:00 PM", 
    "4:00 PM", "5:00 PM"
];

const doctorList = document.getElementById("doctor-list");
const appointmentModal = document.getElementById("appointment-modal");
const doctorInfo = document.getElementById("doctor-info");
const appointmentTimeSelect = document.getElementById("appointment-time");
const closeModal = document.querySelector(".close");
const confirmAppointment = document.getElementById("confirm-appointment");
const confirmationMessage = document.getElementById("confirmation-message");

const chatModal = document.getElementById("chat-modal");
const closeChatModal = document.querySelector(".close-chat");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendChat = document.getElementById("send-chat");

function renderDoctors() {
    doctorList.innerHTML = ''; // Clear the existing list
    doctors.forEach(doctor => {
        const card = document.createElement("div");
        card.className = "doctor-card";
        card.innerHTML = `
            <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image">
            <h3>${doctor.name}</h3>
            <p>Specialty: ${doctor.specialty}</p>
            <p>Status: ${doctor.available ? "Available" : "Not Available"}</p>
            <button onclick="bookAppointment(${doctor.id})" ${doctor.available ? "" : "disabled"}>Book Appointment</button>
            <button onclick="startChat(${doctor.id})">Chat</button>
        `;
        doctorList.appendChild(card);
    });
}

function bookAppointment(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
        doctorInfo.innerText = `You are about to book an appointment with ${doctor.name}.`;
        appointmentModal.style.display = "block";

        appointmentTimeSelect.innerHTML = "";
        timeSlots.forEach(time => {
            const option = document.createElement("option");
            option.value = time;
            option.innerText = time;
            appointmentTimeSelect.appendChild(option);
        });
    }
}

function startChat(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
        chatBox.innerHTML = `<p>Chatting with  ${doctor.name}</p>`;
        chatModal.style.display = "block";
    }
}

sendChat.onclick = function() {
    const message = chatInput.value;
    if (message.trim()) {
        chatBox.innerHTML += `<p>You: ${message}</p>`;
        chatInput.value = "";

        // Simulating doctor's response
        setTimeout(() => {
            chatBox.innerHTML += `<p>Doctor: I'll get back to you shortly.</p>`;
        }, 1000);
    }
}

closeChatModal.onclick = function() {
    chatModal.style.display = "none";
};

function updateAvailability() {
    // Simulate backend availability change
    doctors.forEach(doctor => {
        doctor.available = Math.random() < 0.5; // 50% chance of being available
    });
    renderDoctors(); // Re-render the doctor list
}

// Simulate fetching availability updates from the server every 10 seconds
setInterval(updateAvailability, 10000);

closeModal.onclick = function() {
    appointmentModal.style.display = "none";
};

confirmAppointment.onclick = function() {
    const selectedTime = appointmentTimeSelect.value;
    const appointmentDetails = {
        doctor: doctorInfo.innerText,
        time: selectedTime,
        date: new Date().toLocaleString()
    };

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(appointmentDetails),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        saveAppointment(appointmentDetails);
        confirmationMessage.innerText = `Appointment with ${appointmentDetails.doctor} at ${appointmentDetails.time} confirmed!`;
        appointmentModal.style.display = "none";
    })
    .catch((error) => {
        console.error('Error:', error);
        confirmationMessage.innerText = 'There was an error confirming your appointment. Please try again.';
    });
};

function saveAppointment(details) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(details);
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    if (appointments.length > 0) {
        confirmationMessage.innerHTML += '<h3>Your Appointments:</h3>';
        appointments.forEach(appointment => {
            confirmationMessage.innerHTML += `<p>${appointment.date}: ${appointment.doctor} at ${appointment.time}</p>`;
        });
    }
}

window.onclick = function(event) {
    if (event.target === appointmentModal) {
        appointmentModal.style.display = "none";
    } else if (event.target === chatModal) {
        chatModal.style.display = "none";
    }
};

// Load existing appointments on page load
loadAppointments();

renderDoctors();

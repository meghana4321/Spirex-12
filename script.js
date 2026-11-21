
const doctors = [
    {
        id: 1,
        name: "Dr. Ananya Sharma",
        specialty: "General Medicine",
        experience: "8 years experience",
        fee: 500,
        icon: "👩‍⚕️"
    },
    {
        id: 2,
        name: "Dr. Rahul Verma",
        specialty: "Cardiology",
        experience: "12 years experience",
        fee: 800,
        icon: "👨‍⚕️"
    },
    {
        id: 3,
        name: "Dr. Priya Reddy",
        specialty: "Neurology",
        experience: "10 years experience",
        fee: 700,
        icon: "👩‍⚕️"
    },
    {
        id: 4,
        name: "Dr. Arjun Rao",
        specialty: "Orthopedics",
        experience: "9 years experience",
        fee: 600,
        icon: "👨‍⚕️"
    },
    {
        id: 5,
        name: "Dr. Sneha Kapoor",
        specialty: "Pediatrics",
        experience: "7 years experience",
        fee: 550,
        icon: "👩‍⚕️"
    },
    {
        id: 6,
        name: "Dr. Kiran Kumar",
        specialty: "Dermatology",
        experience: "11 years experience",
        fee: 650,
        icon: "👨‍⚕️"
    }
];

const doctorList = document.getElementById("doctorList");
const doctorSelect = document.getElementById("doctorSelect");
const appointmentForm = document.getElementById("appointmentForm");
const appointmentList = document.getElementById("appointmentList");
const bookingMessage = document.getElementById("bookingMessage");
const appointmentDate = document.getElementById("appointmentDate");

// Set minimum appointment date to today
function getLocalDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

appointmentDate.min = getLocalDateString();

// Load appointments from Local Storage
let appointments = [];

try {
    const savedAppointments =
        JSON.parse(localStorage.getItem("hospitalAppointments"));

    appointments = Array.isArray(savedAppointments)
        ? savedAppointments
        : [];
} catch (error) {
    appointments = [];
}

// Display doctors
function displayDoctors() {
    doctorList.innerHTML = "";

    doctors.forEach(doctor => {
        const card = document.createElement("div");
        card.className = "doctor-card";

        card.innerHTML = `
            <div class="doctor-icon">${doctor.icon}</div>
            <h3>${doctor.name}</h3>
            <p class="specialty">${doctor.specialty}</p>
            <p>${doctor.experience}</p>
            <p>Consultation Fee: ₹${doctor.fee}</p>
            <button data-doctor-id="${doctor.id}">
                Book Appointment
            </button>
        `;

        doctorList.appendChild(card);

        const option = document.createElement("option");
        option.value = doctor.id;
        option.textContent = `${doctor.name} - ${doctor.specialty}`;

        doctorSelect.appendChild(option);
    });
}

// Display appointments
function displayAppointments() {
    appointmentList.innerHTML = "";

    if (appointments.length === 0) {
        appointmentList.innerHTML =
            '<p class="no-appointments">No appointments booked yet.</p>';
        return;
    }

    appointments.forEach(appointment => {
        const card = document.createElement("div");
        card.className = "appointment-card";

        card.innerHTML = `
            <h3>Appointment #${appointment.id}</h3>
            <p><strong>Patient:</strong> ${appointment.patientName}</p>
            <p><strong>Email:</strong> ${appointment.email}</p>
            <p><strong>Phone:</strong> ${appointment.phone}</p>
            <p><strong>Doctor:</strong> ${appointment.doctorName}</p>
            <p><strong>Specialty:</strong> ${appointment.specialty}</p>
            <p><strong>Date:</strong> ${appointment.date}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            <p><strong>Fee:</strong> ₹${appointment.fee}</p>

            <button class="cancel-btn"
                data-appointment-id="${appointment.id}">
                Cancel Appointment
            </button>
        `;

        appointmentList.appendChild(card);
    });
}

// Save appointments
function saveAppointments() {
    localStorage.setItem(
        "hospitalAppointments",
        JSON.stringify(appointments)
    );

    displayAppointments();
}

// Select doctor from doctor cards
doctorList.addEventListener("click", function(event) {
    const button = event.target.closest("[data-doctor-id]");

    if (!button) return;

    doctorSelect.value = button.dataset.doctorId;

    document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
    });
});

// Book appointment
appointmentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    bookingMessage.textContent = "";

    const patientName =
        document.getElementById("patientName").value.trim();

    const email =
        document.getElementById("patientEmail").value.trim();

    const phone =
        document.getElementById("patientPhone").value.trim();

    const doctorId = Number(doctorSelect.value);

    const date = appointmentDate.value;

    const time =
        document.getElementById("appointmentTime").value;

    const doctor = doctors.find(item => item.id === doctorId);

    if (!doctor) {
        bookingMessage.textContent = "Please select a valid doctor.";
        return;
    }

    // Prevent past-date bookings
    if (date < getLocalDateString()) {
        bookingMessage.textContent =
            "Please select today or a future date.";
        return;
    }

    // Prevent booking the same doctor and slot twice
    const slotBooked = appointments.some(appointment =>
        appointment.doctorId === doctorId &&
        appointment.date === date &&
        appointment.time === time
    );

    if (slotBooked) {
        bookingMessage.textContent =
            "This demo slot is already booked. Please choose another time.";
        return;
    }

    const appointment = {
        id: Date.now(),
        patientName,
        email,
        phone,
        doctorId,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        fee: doctor.fee,
        date,
        time
    };

    appointments.push(appointment);

    saveAppointments();

    bookingMessage.textContent =
        "Appointment booked successfully! Your booking details are below.";

    appointmentForm.reset();

    // Reset minimum date after form reset
    appointmentDate.min = getLocalDateString();
});

// Cancel appointment
appointmentList.addEventListener("click", function(event) {
    const button = event.target.closest("[data-appointment-id]");

    if (!button) return;

    const id = Number(button.dataset.appointmentId);

    appointments = appointments.filter(
        appointment => appointment.id !== id
    );

    saveAppointments();
});

// Initial display
displayDoctors();
displayAppointments();

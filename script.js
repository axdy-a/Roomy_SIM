class Booking {
    constructor(room, user, timeslot, promo_code = null) {
        this.room = room;
        this.user = user;
        this.timeslot = timeslot;
        this.promo_code = promo_code;
        this.price = this.calculatePrice();
    }

    calculatePrice() {
        let price = this.room.price;
        if (this.promo_code && this.room.promo_codes.includes(this.promo_code)) {
            price *= 0.9; // Apply 10% discount if promo code is valid
        }
        return price;
    }
}

class User {
    constructor(name, email, pw) {
        this.name = name;
        this.email = email;
        this.password = pw;
        this.bookedRooms = []; // New property to store bookings
    }

    getName() {
        return this.name;
    }

    getEmail() {
        return this.email;
    }

    getPassword() {
        return this.password;
    }

    getBookedRooms() {
        return this.bookedRooms;  // Corrected getter method name (should be getBookedRooms, not getbookedRooms)
    }
}

class Student extends User {
    constructor(name, email, password) {
        super(name, email, password);
        this.login_status = false;
    }

    login() {
        this.login_status = true;
    }
}

class Room {
    constructor(room_name, building, timeslots, price, capacity, launch_status = false, promo_codes = []) {
        this.room_name = room_name;
        this.building = building;
        this.slots = timeslots;
        this.launch_status = launch_status;
        this.price = price;
        this.capacity = capacity;
        this.promo_codes = promo_codes;
    }

    setLaunchStatus(status) {
        this.launch_status = status;
    }

    getRoomname() {
        return this.room_name;
    }

    getLaunch() {
        return this.launch_status;
    }

    getTimeslots() {
        return this.slots;
    }

    getBuilding() {
        return this.building;
    }
}

class Calendar {
    constructor(year) {
        this.year = year;
        this.dates = {}; // Stores booked timeslots by date
    }

    addBooking(date, timeslot, room, user) {
        if (!this.dates[date]) {
            this.dates[date] = {};
        }
        if (!this.dates[date][room]) {
            this.dates[date][room] = [];
        }

        if (this.dates[date][room].includes(timeslot)) {
            console.log(`Timeslot ${timeslot} on ${date} is already booked for ${room.getRoomname()}`);
            return false;
        } else {
            // Create a new Booking instance and add it to the user's bookedRooms
            const booking = new Booking(room, user, timeslot);
            this.dates[date][room].push(timeslot);
            user.getBookedRooms().push(booking); // Add booking to the user's list of bookings
            console.log(`Booking successful: ${timeslot} on ${date} for ${room.getRoomname()}`);
            return true;
        }
    }

    getAvailableTimeslots(date, room) {
        const roomBookings = (this.dates[date] && this.dates[date][room]) || [];
        const allTimeslots = room.getTimeslots();
        return allTimeslots.filter(slot => !roomBookings.includes(slot));
    }

    isSlotBooked(date, timeslot, roomName) {
        return this.dates[date] && this.dates[date][roomName] && this.dates[date][roomName].includes(timeslot);
    }
}

// Default timeslots
const default_timeslots = [
    "8:00 AM<br>9:00 AM",
    "9:00 AM<br>10:00 AM",
    "10:00 AM<br>11:00 AM",
    "11:00 AM<br>12:00 PM",
    "12:00 PM<br>1:00 PM",
    "1:00 PM<br>2:00 PM",
    "2:00 PM<br>3:00 PM",
    "3:00 PM<br>4:00 PM",
    "4:00 PM<br>5:00 PM",
    "5:00 PM<br>6:00 PM"
];

// Create rooms
const rooms = [
    new Room("A-L2-101", "SIM Campus - Block A", default_timeslots, 2, 4, true, ["10OFF"]),
    new Room("A-L2-102", "SIM Campus - Block A", default_timeslots, 2, 4, true, ["10OFF"]),
    new Room("A-L2-103", "SIM Campus - Block A", default_timeslots, 2, 4, true, ["10OFF"]),
    new Room("A-L2-104", "SIM Campus - Block A", default_timeslots, 2, 4, true, ["10OFF"]),
    new Room("B-L3-211", "SIM Campus - Block B", default_timeslots, 2, 6, true, ["10OFF"]),
    new Room("B-L3-212", "SIM Campus - Block B", default_timeslots, 2, 6, true, ["10OFF"]),
    new Room("B-L3-213", "SIM Campus - Block B", default_timeslots, 2, 8, true, ["10OFF"]),
    new Room("B-L3-214", "SIM Campus - Block B", default_timeslots, 2, 8, true, ["10OFF"])
];

// Sample accounts
const staff_acc = new Staff("John", "admin@uow.edu.au", "Staff!");
const student_acc = new Student("Chris", "chris@uow.edu.au", "Uowstudent!");
const account_list = [staff_acc, student_acc];

const calendar = new Calendar(2024);

// DOM elements
const reg_section = document.getElementById('register-container');
const login_section = document.getElementById('login-container');
const booking_section = document.getElementById('booking-container');
const payment_section = document.getElementById('booking-cfm-container');
const cfmed_section = document.getElementById('cfmed-bookings');

const nav_onlogin = document.getElementsByClassName('onlogin');
const nav_offlogin = document.getElementsByClassName('offlogin');

var current_account;

function openLogin() {
    login_section.style.display = 'flex';
    booking_section.style.display = 'none';
    reg_section.style.display = 'none';
    login_status = document.querySelector(".far-right");
    login_status.textContent = "";
}

function openBooking() {
    login_section.style.display = 'none';
    reg_section.style.display = 'none';
    booking_section.style.display = 'flex';

    Array.from(nav_onlogin).forEach((nav) => {
        nav.style.display = 'inline';
    });

    Array.from(nav_offlogin).forEach((nav) => {
        nav.style.display = 'none';
    });
}

function openRegister() {
    reg_section.style.display = 'flex';
    login_section.style.display = 'none';
}

function openPayment() {
    payment_section.style.display = 'flex';
}

function openConfirmed() {
    payment_section.style.display = 'none';
    booking_section.style.display = 'none';
    cfmed_section.style.display = "flex";
    displayBookedRooms();
}

function login() {
    const email = document.querySelector('input[title="email"]').value.trim();
    const password = document.querySelector('input[title="password"]').value.trim();
    var status = 0;

    for (i = 0; i < account_list.length; i++) {
        if (account_list[i].getEmail() == email && account_list[i].getPassword() == password && account_list[i] instanceof Student) {
            console.log("success");
            status = 1;
            account_list[i].login();
            loginDisplay(account_list[i]);
            openBooking();
        } else if (account_list[i].getEmail() == email && account_list[i].getPassword() == password && account_list[i] instanceof Staff) {
            /* Staff */
            status = 1;
            console.log("staff");
        }
    }
    if (status == 0) {
        msgBox = document.getElementById('error');
        msgBox.innerText = "Incorrect Email or Password !";
    }
}

function loginDisplay(acc) {
    const element = document.querySelector(".far-right");
    if (!element) {
        container = document.querySelector("ul[class='nav-menu']");
        newLi = document.createElement('li');
        newLi.classList.add('nav-item');
        newLi.classList.add('far-right');
        newLi.textContent = `Logged in as ${acc.getName()}`;
        container.appendChild(newLi);
        current_account = acc;
    } else {
        element.textContent = `Logged in as ${acc.getName()}`;
    }
}

function register() {
    reg_name = document.querySelector('input[title="reg-name"').value.trim();
    reg_email = document.querySelector('input[title="reg-email"').value.trim();
    reg_password = document.querySelector('input[title="reg-password"').value.trim();
    reg_cfmpassword = document.querySelector('input[title="reg-cfmpassword"').value.trim();
    msgBox = document.getElementById('error');

    if (reg_name === "" || reg_email === "" || reg_password === "" || reg_cfmpassword === "") {
        msgBox.innerText = "All fields must be filled!";
    } else if (!emailRegex.test(reg_email)) {
        msgBox.innerText = "Invalid Email!";
    } else if (reg_password != reg_cfmpassword) {
        msgBox.innerText = "Passwords do not match!";
    } else {
        newStudent = new Student(reg_name, reg_email, reg_password);
        account_list.push(newStudent);
        openLogin();
        console.log("successfully registered");
    }
}

function generateRooms(date) {
    var roomContainer = document.getElementById('rooms');
    roomContainer.innerHTML = ""; // Clear previous rooms
    rooms.forEach(room => {
        if (room.getLaunch()) {
            const availableSlots = calendar.getAvailableTimeslots(date, room);
            if (availableSlots.length > 0) {
                const roomElement = document.createElement("div");
                roomElement.classList.add("room");
                roomElement.innerHTML = `
                    <h3>${room.getRoomname()}</h3>
                    <p>${room.getBuilding()}</p>
                    <ul>
                        ${availableSlots.map(slot => `<li>${slot}</li>`).join('')}
                    </ul>`;
                roomContainer.appendChild(roomElement);
            }
        }
    });
}

function bookRoom(room, date, timeslot) {
    if (current_account instanceof Student) {
        const bookingSuccess = calendar.addBooking(date, timeslot, room, current_account);
        if (bookingSuccess) {
            openPayment();
        }
    } else {
        alert("Only students can make bookings.");
    }
}

function displayBookedRooms() {
    const bookedRooms = current_account.getBookedRooms(); // Use the correct getter method
    const bookedContainer = document.getElementById('booked-rooms');
    bookedContainer.innerHTML = bookedRooms.map(booking => `
        <div>
            <p>${booking.room.getRoomname()} on ${booking.timeslot}</p>
        </div>
    `).join('');
}

document.getElementById("logout-btn").addEventListener('click', () => {
    current_account = null;
    window.location.reload();
});
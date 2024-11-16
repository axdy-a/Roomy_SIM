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

const staff_acc = new Staff("John", "admin@uow.edu.au", "Staffuow!");
const student_acc = new Student("Chris", "chris@uow.edu.au", "Uowstudent!");
const account_list = [staff_acc, student_acc];

const calendar = new Calendar(2024);

const reg_section = document.getElementById('register-container')
const login_section = document.getElementById('login-container')
const booking_section = document.getElementById('booking-container')
const payment_section = document.getElementById('booking-cfm-container')
const cfmed_section = document.getElementById('cfmed-bookings')


const nav_onlogin = document.getElementsByClassName('onlogin')
const nav_offlogin = document.getElementsByClassName('offlogin')

var current_account;
let currentBooking = null;

function openLogin(){
    login_section.style.display = 'flex'
    booking_section.style.display = 'none'
    reg_section.style.display = 'none'
    login_status = document.querySelector(".far-right")
    login_status.textContent = ""
}

function openBooking(){
    login_section.style.display = 'none'
    reg_section.style.display = 'none'
    cfmed_section.style.display = 'none'
    booking_section.style.display = 'flex'

    Array.from(nav_onlogin).forEach((nav) => {
        nav.style.display = 'inline'
    })

    Array.from(nav_offlogin).forEach((nav) => {
        nav.style.display = 'none'
    })
}

function openRegister(){
    reg_section.style.display = 'flex'
    login_section.style.display = 'none'
}

function openPayment(){
    payment_section.style.display = 'flex'
}

function openConfirmed(){
    payment_section.style.display = 'none'
    booking_section.style.display = 'none'
    cfmed_section.style.display = "flex"
    displayBookedRooms()
}

function login(){
    const email = document.querySelector('input[title="email"]').value.trim()
    const password = document.querySelector('input[title="password"]').value.trim()
    var status = 0

    for (i=0;i<account_list.length;i++){
        if (account_list[i].getEmail() == email && account_list[i].getPassword() == password && account_list[i] instanceof Student){
            console.log("success")
            status = 1
            account_list[i].login()
            loginDisplay(account_list[i])
            openBooking()
        }
        else if (account_list[i].getEmail() == email && account_list[i].getPassword() == password && account_list[i] instanceof Staff){
            /* Staff */
            status = 1
            console.log("staff")
        }
    }
    if (status == 0) {
        msgBox = document.getElementById('error')
        msgBox.innerText = "Incorrect Email or Password !"
    }  
}

function loginDisplay(acc){
    const element = document.querySelector(".far-right")
    if (!element) {
        container = document.querySelector("ul[class='nav-menu']")
        newLi = document.createElement('li')
        newLi.classList.add('nav-item')
        newLi.classList.add('far-right')
        newLi.textContent = `Logged in as ${acc.getName()}`
        container.appendChild(newLi)
        current_account = acc
    } 
    else {
        element.textContent = `Logged in as ${acc.getName()}`
    }
}


function register(){
    reg_name = document.querySelector('input[title="reg-name"').value.trim()
    reg_email = document.querySelector('input[title="reg-email"').value.trim()
    reg_password = document.querySelector('input[id="reg-pw"').value.trim()
    reg_cfmpassword = document.querySelector('input[id="reg-cfmpw"').value.trim()
    inputs = [reg_name,reg_email,reg_password,reg_cfmpassword]
    emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (inputs.some(item => item == "")){
        msgBox = document.getElementById('reg_error')
        msgBox.innerText = "Missing input in fields"
    }

    /* password check */
    else if (reg_password === reg_cfmpassword) {
        hasCapital = /[A-Z]/.test(reg_password);
        hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(reg_password)
        pw_length = reg_password.length
        if (hasCapital && hasSymbol && pw_length >= 8){
            /* passed */
            if (emailRegex.test(reg_email) == true) {
                /* create acc */
                account_list.push(new Student(reg_name,reg_email,reg_cfmpassword))
                account_list[account_list.length - 1].login()
                loginDisplay(account_list[account_list.length - 1])
                openBooking()
            }
            else {
                msgBox = document.getElementById('reg_error')
                msgBox.innerText = "Email is invalid"
            }
        }
        else {
            /* error */
            msgBox = document.getElementById('reg_error')
            msgBox.innerText = "Password should contain a symbol and capital letter and have 8 at least characters!"
        }
    }
    else {
        msgBox = document.getElementById('reg_error')
        msgBox.innerText = "Password does not match with Confirm Password"        
    }
}


// Options for the observer (observe the style attribute)
const config = { attributes: true, attributeFilter: ['style'] };

// Create a MutationObserver instance
const observer = new MutationObserver(onDisplayChange);

// Start observing the `booking_section`
observer.observe(booking_section, config);

function onDisplayChange(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            // Log the current display value
            const displayValue = window.getComputedStyle(mutation.target).display;
            console.log('Observed display change:', displayValue);  // Debugging log

            if (displayValue === 'flex') {
                console.log('Display is now flex! Generating rooms...'); // Debugging log
                generateRooms();
            }
        }
    }
}

function generateRooms(date) {
    const container = document.getElementById('room-container');
    container.innerHTML = ''; // Clear previous room data

    rooms.forEach((room) => {
        if (room.getLaunch() === true) {
            const newDiv = document.createElement('div');
            newDiv.classList.add('room');

            const roomNameContainer = document.createElement('div');
            roomNameContainer.classList.add('room-info');
            roomNameContainer.innerHTML = `<img class='meeting-icon' alt='room' src='resources/meeting_room.svg'></img>`;

            const roomBuilding = document.createElement('span');
            const roomName = document.createElement('span');
            roomBuilding.innerHTML = `${room.getBuilding()}`;
            roomName.innerHTML = `Room No: ${room.getRoomname()}`;
            roomName.setAttribute('style', 'font-size:small;');

            roomNameContainer.appendChild(roomBuilding);
            roomNameContainer.appendChild(roomName);
            newDiv.appendChild(roomNameContainer);

            const newBtnContainer = document.createElement('div');
            newBtnContainer.classList.add('button-container');
            newDiv.appendChild(newBtnContainer);

            // Get available slots for the room and date
            const availableSlots = calendar.getAvailableTimeslots(date, room);
            availableSlots.forEach((slot) => {
                const btn = document.createElement('button');
                btn.classList.add('slotbtn');
                btn.innerHTML = slot;

                // Check if the slot is already booked
                if (calendar.isSlotBooked(date, slot, room.getRoomname())) {
                    btn.style.color = 'grey';
                    btn.style.backgroundColor = 'lightgrey';
                    btn.disabled = true;
                } else {
                    btn.onclick = function() {
                        bookRoom(date, slot, room, student_acc, this);
                    };
                }

                newBtnContainer.appendChild(btn);
            });

            container.appendChild(newDiv);
        }
    });
}



function bookRoom(date, timeslot, room, user, element = null) {
    const error = document.getElementById('date_err');

    // Check if date is missing
    if (!date) {
        error.style.display = 'block';
        error.innerHTML = 'Missing Date!';
        return; // Don't proceed if the date is invalid
    }

    // Check if timeslot is missing
    if (!timeslot) {
        error.style.display = 'block';
        error.innerHTML = 'Missing Timeslot!';
        return;
    }

    // Create booking instance
    const booking = new Booking(room, user, timeslot, date);

    // Check if this room is already booked for this date and timeslot
    if (user.getbookedRooms().some(b => b.room === room && b.date === date && b.timeslot === timeslot)) {
        error.style.display = 'block';
        error.innerHTML = 'Room already booked for this date and timeslot!';
        return; // Prevent booking if duplicate
    }

    // Check if the room is available for this date and timeslot
    if (calendar.addBooking(date, timeslot, room.getRoomname(), user)) {
        user.bookedRooms.push(booking); // Add booking to the user’s booked rooms
        currentBooking = booking; // Update currentBooking
        openPayment();

        if (element) {
            element.style.color = 'grey';
            element.style.backgroundColor = 'lightgrey';
            element.disabled = true;
        }
    } else {
        error.style.display = 'block';
        error.innerHTML = 'Room is booked by another student!';
    }
}

Calendar.prototype.isSlotBooked = function(date, timeslot, roomName) {
    return this.dates[date] && this.dates[date][roomName] && this.dates[date][roomName].includes(timeslot);
};



/* Testing */
function handleDateChange(event) {
    const selectedDate = event.target.value; // Get selected date as 'YYYY-MM-DD'
    generateRooms(selectedDate);
}


// Hardcode some pre-existing bookings for 2024-11-20
const hardcodedDate = '2024-11-20';

// Hardcoded bookings
const hardcodedBookings = [
    { roomIndex: 0, timeslot: "9:00 AM<br>10:00 AM" },  // Room A-L2-101 at 9:00 AM
    { roomIndex: 2, timeslot: "10:00 AM<br>11:00 AM" }, // Room A-L2-103 at 10:00 AM
    { roomIndex: 4, timeslot: "1:00 PM<br>2:00 PM" },   // Room B-L3-211 at 1:00 PM
    { roomIndex: 6, timeslot: "2:00 PM<br>3:00 PM" },   // Room B-L3-213 at 2:00 PM
    { roomIndex: 7, timeslot: "4:00 PM<br>5:00 PM" }    // Room B-L3-214 at 4:00 PM
];

// Manually mark these rooms as booked for the specified date
hardcodedBookings.forEach(booking => {
    const room = rooms[booking.roomIndex];  // Get the room based on the index
    calendar.addBooking(hardcodedDate, booking.timeslot, room.getRoomname());  // Mark as booked
});


document.querySelector('.submit-btn').addEventListener('click', function(event) {
    // Prevent the default form submission (if any)
    event.preventDefault();

    // Get input values
    const cardNumber = document.querySelector('input[placeholder="Card Number"]').value.trim();
    const expiryDate = document.querySelector('input[placeholder="Expiry Date"]').value.trim();
    const cvv = document.querySelector('input[placeholder="CVV"]').value.trim();
    const promoCode = document.querySelector('input[placeholder="Promo Code"]').value.trim();

    // Validate the card number (basic validation)
    const cardNumberRegex = /^[0-9]{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/(2[3-9]|[3-9][0-9])$/; // MM/YY format
    const cvvRegex = /^[0-9]{3}$/; // CVV should be 3 digits

    let errorMessage = '';
    
    // Check if card number is valid
    if (!cardNumberRegex.test(cardNumber)) {
        errorMessage += 'Invalid card number. It should be 16 digits.\n';
    }
    
    // Check if expiry date is valid
    if (!expiryDateRegex.test(expiryDate)) {
        errorMessage += 'Invalid expiry date. Please use MM/YY format.\n';
    }
    
    // Check if CVV is valid
    if (!cvvRegex.test(cvv)) {
        errorMessage += 'Invalid CVV. It should be 3 digits.\n';
    }

    // If there's an error, show it
    if (errorMessage !== '') {
        alert(errorMessage);
        return;  // Stop the function here if there are errors
    }

    // If all inputs are valid, run the next function
    onPaymentSuccess(cardNumber, expiryDate, cvv, promoCode);
});

// Function that runs when payment data is valid
function onPaymentSuccess(cardNumber, expiryDate, cvv, promoCode) {
    if (!currentBooking) {
        alert('No booking found.');
        return;
    }

    // Use currentBooking to get the room and apply the promo code
    const selectedRoom = currentBooking.room; // The selected room for booking

    // Check if the promo code is valid for the selected room
    if (promoCode && !selectedRoom.isPromoCodeValid(promoCode)) {
        alert('Invalid promo code for this room.');
        return; // Stop if the promo code is invalid
    }

    // Apply discount if the promo code is valid
    let discountAmount = 0;
    if (promoCode && selectedRoom.isPromoCodeValid(promoCode)) {
        // Assuming the promo code gives a 10% discount (can be changed as needed)
        const discountRate = 0.10; // Example: 10% discount
        discountAmount = selectedRoom.price * discountRate;
        selectedRoom.price -= discountAmount;  // Apply the discount to the room price
        alert(`Promo code applied! You saved $${discountAmount.toFixed(2)}.`);
    }

    // Display the final price after discount (if any)
    console.log('Final Price after promo code:', selectedRoom.price.toFixed(2));

    // Continue with the payment processing
    console.log('Payment Data:', {
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv,
        promoCode: promoCode,
        finalPrice: selectedRoom.price.toFixed(2) // Updated room price after discount
    });

    // Proceed with payment...
    alert('Payment successful!');
    openConfirmed();  // Show the confirmation page after payment
}

function displayBookedRooms() {
    // Check if current_account exists and has booked rooms
    if (!current_account || !current_account.getbookedRooms() || current_account.getbookedRooms().length === 0) {
        document.getElementById("cfmed-bookings").innerHTML = "<p>No rooms booked yet.</p>";
        return;
    }

    const bookingsContainer = document.getElementById("cfmed-bookings");
    bookingsContainer.innerHTML = ""; // Clear any existing content

    current_account.getbookedRooms().forEach((booking, index) => {
        // Ensure the booking has a valid date and timeslot
        if (!(booking instanceof Booking) || !booking.date || !booking.timeslot) {
            console.error(`Invalid booking entry at index ${index}`);
            return; // Skip invalid bookings
        }

        const roomDiv = document.createElement("div");
        roomDiv.className = "booked-room";
        roomDiv.innerHTML = `
            <p>Room: ${booking.room.getRoomname()}</p>
            <p>Building: ${booking.room.getBuilding()}</p>
            <p>Date: ${booking.date}</p>
            <p>Time: ${booking.timeslot}</p>
        `;

        bookingsContainer.appendChild(roomDiv);
    });
}

function applyPromoCode() {
    const promoCodeInput = document.querySelector('input[placeholder="Promo Code"]').value.trim();
    const selectedRoom = currentBooking.room; // The selected room for booking

    if (selectedRoom.isPromoCodeValid(promoCodeInput)) {
        // Apply discount
        const discountRate = 0.10; // Example: 10% discount
        const discountAmount = selectedRoom.price * discountRate;
        selectedRoom.price -= discountAmount;
        alert(`Promo code applied! You saved $${discountAmount.toFixed(2)}.`);
        console.log('Final Price after promo code:', selectedRoom.price.toFixed(2));
    } else {
        alert('Invalid promo code for this room.');
    }
}
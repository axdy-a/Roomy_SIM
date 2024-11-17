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
const cfmed_section = document.getElementById('cfmed-container')
const staff_section = document.getElementById('staff-container')


const nav_onlogin = document.getElementsByClassName('onlogin')
const nav_offlogin = document.getElementsByClassName('offlogin')
const nav_onstaff = document.getElementsByClassName('onstaff')

var current_account;
let currentBooking = null;
var btn_element;
let currentDate = null;

function openStaff(){
    staff_section.style.display = 'flex'
    login_section.style.display = 'none'
    Array.from(nav_onstaff).forEach((nav) => {
        nav.style.display = 'inline'
    })
    Array.from(nav_offlogin).forEach((nav) => {
        nav.style.display = 'none'
    })
}

function openLogin(){
    login_section.style.display = 'flex'
    booking_section.style.display = 'none'
    reg_section.style.display = 'none'
    cfmed_section.style.display = 'none'
    staff_section.style.display = 'none'
    login_status = document.querySelector(".far-right")
    login_status.textContent = ""
}

function openBooking(){
    login_section.style.display = 'none'
    reg_section.style.display = 'none'
    cfmed_section.style.display = 'none'
    payment_section.style.display = 'none'
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
            loginDisplay(account_list[i])
            openStaff()
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
        current_account = acc
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

const observer = new MutationObserver(onDisplayChange);

// Start observing the `booking_section`
observer.observe(booking_section, config);

function onDisplayChange(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const displayValue = window.getComputedStyle(mutation.target).display;
            console.log('Observed display change:', displayValue);  // Debugging log

            if (displayValue === 'flex') {
                console.log('Display is now flex! Generating rooms...');
                if (currentDate) {
                    generateRooms(currentDate);  // Generate rooms based on the currently selected date
                }
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
            roomName.innerHTML = `Room No: ${room.getRoomname()}<br>Capacity: ${room.getCapacity()}<br>Price: $${room.getPrice()}`;
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
    if (currentBooking) {
        console.log('Booking already in progress. Resetting currentBooking.');
        currentBooking = null;
    }

    const error = document.getElementById('date_err');
    console.log(date);
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

    // Check if this room is already booked for this date and timeslot
    if (user.getbookedRooms().some(b => b.room === room && b.date === date && b.timeslot === timeslot)) {
        error.style.display = 'block';
        error.innerHTML = 'Room already booked for this date and timeslot!';
        return; // Prevent booking if duplicate
    }

    // Check if the room is available for this date and timeslot
    if (calendar.addBooking(date, timeslot, room.getRoomname(), user)) {
        // Create the booking instance but don't finalize it yet
        currentBooking = new Booking(room, user, timeslot, date); // This sets currentBooking properly
        console.log('Booking created:', currentBooking);
        btn_element = element;  // Capture the button element for later use

        const displayRoom = document.querySelector('span[id="room-info-payment"]')
        var timeslot_text = timeslot.trim().split("<br>")
        displayRoom.innerHTML = `Your Selected Room: <br><br> ${timeslot_text[0]} to ${timeslot_text[1]} <br> on  ${date} <br> at ${room.getBuilding()}, ${room.getRoomname()} <br> Price: $${room.getPrice()}`;

        openPayment();  // Proceed to payment section
    } else {
        error.style.display = 'block';
        error.innerHTML = 'Room is booked by another student!';
    }
}

Calendar.prototype.isSlotBooked = function(date, timeslot, roomName) {
    return this.dates[date] && this.dates[date][roomName] && this.dates[date][roomName].includes(timeslot);
};

Calendar.prototype.removeBooking = function(date, timeslot, roomName) {
    console.log('hi')
    if (this.dates[date] && this.dates[date][roomName]) {
        const index = this.dates[date][roomName].indexOf(timeslot);
        if (index !== -1) {
            this.dates[date][roomName].splice(index, 1);  // Remove the booking
        }
    }
};


/* Testing */
function handleDateChange(event) {
    const selectedDate = event.target.value; // Get selected date as 'YYYY-MM-DD'
    currentDate = selectedDate;  // Store the selected date
    generateRooms(selectedDate);  // Generate rooms based on the selected date
}




document.querySelector('.submitpay-btn').addEventListener('click', function(event) {
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
    if (btn_element) {
        btn_element.style.color = 'grey';
        btn_element.style.backgroundColor = 'lightgrey';
        btn_element.disabled = true;
    }
    onPaymentSuccess(cardNumber, expiryDate, cvv, promoCode);
});

// Function that runs when payment data is valid
function onPaymentSuccess(cardNumber, expiryDate, cvv, promoCode) {
    if (!currentBooking) {
        alert('No booking found.');
        return;
    }

    const selectedRoom = currentBooking.room; // The selected room for booking

    // Check if the promo code is valid for the selected room
    if (promoCode && !selectedRoom.isPromoCodeValid(promoCode)) {
        alert('Invalid promo code for this room.');
        return; // Stop if the promo code is invalid
    }

    // Apply discount if the promo code is valid
    let discountAmount = 0;
    if (promoCode && selectedRoom.isPromoCodeValid(promoCode)) {
        const discountRate = 0.10; // Example: 10% discount
        discountAmount = selectedRoom.price * discountRate;
        selectedRoom.price -= discountAmount;  // Apply the discount to the room price
        alert(`Promo code applied! You saved $${discountAmount.toFixed(2)}.`);
    }

    // Final price after discount (if any)
    console.log('Final Price after promo code:', selectedRoom.price.toFixed(2));

    // Proceed with payment...
    console.log('Payment Data:', {
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv,
        promoCode: promoCode,
        finalPrice: selectedRoom.price.toFixed(2)
    });

    // Now that payment is successful, add the booking to the user's booked rooms
    currentBooking.user.bookedRooms.push(currentBooking); // Add to bookedRooms after payment
    alert('Payment successful!');
    openConfirmed();  // Show the confirmation page after payment
}

function displayBookedRooms() {
    // Check if current_account exists and has booked rooms
    if (!current_account || !current_account.getbookedRooms() || current_account.getbookedRooms().length === 0) {
        document.getElementById("cfmed-bookings").innerHTML = "<p>No rooms booked yet.</p>";
        console.log(current_account)
        return;
    }

    const bookingsContainer = document.getElementById("cfmed-bookings");
    bookingsContainer.innerHTML = ""; // Clear any existing content
    var invalid; 
    current_account.getbookedRooms().forEach((booking, index) => {
        // Ensure the booking has a valid date, timeslot, and is an instance of Booking
        if (!(booking instanceof Booking) || !booking.date || !booking.timeslot) {
            console.error(`Invalid booking entry at index ${index}`, booking);
            // Skip invalid bookings
            invalid = index
            return;
        }
        
        timeslot_text = booking.timeslot.trim().split('<br>')
        const roomDiv = document.createElement("div");
        roomDiv.className = "booked-room";
        roomDiv.innerHTML = `
            <p id="cfmed-room-name" data-room-name="${booking.room.getRoomname()}">Room: ${booking.room.getRoomname()}</p>
            <p id="cfmed-building" data-building-name="${booking.room.getBuilding()}">Building: ${booking.room.getBuilding()}</p>
            <p id="cfmed-date" data-date="${booking.date}">Date: ${booking.date}</p>
            <p id="cfmed-slot" data-timeslot="${booking.timeslot}">Time: ${timeslot_text[0]} to ${timeslot_text[1]}</p>
            <div style="display:flex;">
                <button class="modifyBooking" onclick="modifyBooking(this)">Modify</button>
                <button class="cancelBooking" style="background-color:red" onclick="cancelCfmBooking(this)">Cancel</button>
            </div>
        `;
        
        bookingsContainer.appendChild(roomDiv);
        
    });
    current_account.getbookedRooms().splice(invalid,1)
}

function cancelBooking() {
    if (!currentBooking) {
        alert('No booking to cancel.');
        return;
    }

    const { room, date, timeslot } = currentBooking;
    
    // Remove booking from the calendar
    calendar.removeBooking(date, timeslot, room.getRoomname());

    // Reset the current booking
    currentBooking = null;
    
    alert('Booking cancelled.');

    // After cancellation, update the date (could be the current date or last selected date)
    if (currentDate) {
        generateRooms(currentDate);  // Re-render rooms based on the selected date
    }

    openBooking();  // Return to booking section
}

function toggleDropdown() {
    const dropdown = document.getElementById('dropdownList');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

let selected = [];

function updateSelected() {
    const checkboxes = document.querySelectorAll('#dropdownList input[type="checkbox"]');
    const selected_text = [];
    
    checkboxes.forEach((checkbox) => {
        const checkboxValue = checkbox.value;
        const checkboxText = checkbox.parentElement.innerText.trim();
        
        if (checkbox.checked) {
            // Add value to selected if checked
            if (!selected.includes(checkboxValue)) {
                selected.push(checkboxValue);
            }
            // Also update the text for display
            selected_text.push(checkboxText);
        } else {
            // Remove value from selected if unchecked
            const index = selected.indexOf(checkboxValue);
            if (index !== -1) {
                selected.splice(index, 1);  // Remove the unchecked value
            }
        }
    });

    // Update the display of selected options
    document.getElementById('selectedOptions').innerHTML = selected_text.join('<br>');
}

// Close the dropdown when clicking outside
document.addEventListener('click', function(event) {
    const multiselectContainer = document.querySelector('.multiselect-container');
    if (!multiselectContainer.contains(event.target)) {
        document.getElementById('dropdownList').style.display = 'none';
    }
});

// Create Room function
function createRoom(event) {
    event.preventDefault();  // Prevent form submission

    // Get form field values
    const roomName = document.getElementById('room-name').value;
    const building = document.getElementById('building-name').value;
    const capacity = parseInt(document.getElementById('capacity').value);
    const price = parseFloat(document.getElementById('room-price').value);
    const promoCodesText = document.getElementById('promo-codes').value;

    // Get the value of the Launch Status checkbox
    const launchStatus = document.getElementById('launch-status').checked;  // This will be true or false

    // Convert promo codes to an array (if any)
    const promoCodes = promoCodesText ? promoCodesText.split(',').map(code => code.trim()) : [];

    // Create a new room and add it to the global 'room' array
    const newRoom = new Room(roomName, building, selected, price, capacity, launchStatus, promoCodes);
    rooms.push(newRoom);

    // Log the newly created room to the console
    console.log(newRoom);  // This will log the room object to the browser console

    // Optionally, clear the form after submission (if required)
    document.getElementById('create-room-form').reset();
    document.getElementById('selectedOptions').innerHTML = '';  // Clear the selected timeslots
    alert("Room has been created!")
}

function logout() {
    // Reset the current account
    current_account = null;

    // Hide user-related sections
    Array.from(nav_onlogin).forEach((nav) => {
        nav.style.display = 'none';
    });

    // Show login and register sections
    Array.from(nav_offlogin).forEach((nav) => {
        nav.style.display = 'inline';
    });

    // Open the login screen after logging out
    openLogin();
}


function cancelCfmBooking(element){
    
    cfmedRooms = currentBooking.user.bookedRooms
    console.log(cfmedRooms)
    grandparent_element = element.parentElement.parentElement;
    room_name = grandparent_element.querySelector("#cfmed-room-name").dataset.roomName
    building = grandparent_element.querySelector("#cfmed-building").dataset.buildingName
    slot = grandparent_element.querySelector("#cfmed-slot").dataset.timeslot
    date = grandparent_element.querySelector("#cfmed-date").dataset.date
    cfmedRooms.forEach( (booking,index) => {
        console.log(booking.room.getRoomname())
        console.log(room_name)
        if (booking.room.getRoomname() == room_name && booking.date == date && booking.timeslot == slot){
            calendar.removeBooking(date, slot, room_name);
            currentBooking.user.bookedRooms.splice(index,1)
        }

    });
    displayBookedRooms()
}


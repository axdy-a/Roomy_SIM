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

const staff_acc = new Staff("John", "admin@uow.edu.au", "Staff!");
const student_acc = new Student("Chris", "chris@uow.edu.au", "Uowstudent!");
const account_list = [staff_acc, student_acc];

const calendar = new Calendar(2024);

const reg_section = document.getElementById('register-container')
const login_section = document.getElementById('login-container')
const booking_section = document.getElementById('booking-container')


const nav_onlogin = document.getElementsByClassName('onlogin')
const nav_offlogin = document.getElementsByClassName('offlogin')

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

function openConfirmed(){
    //
}

function openStaff(){
    //
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
                btn.onclick = () => bookRoom(date, slot, room, student_acc); // Attach booking logic
                newBtnContainer.appendChild(btn);
            });

            container.appendChild(newDiv);
        }
    });
}


function bookRoom(date, timeslot, room, user) {
    const booking = new Booking(room, user, timeslot);
    if (calendar.addBooking(date, timeslot, room.getRoomname())) {
        console.log(`Booking confirmed for ${user.getName()} on ${date} at ${timeslot} in ${room.getRoomname()}`);
    } else {
        console.log(`Failed to book ${timeslot} on ${date} for ${room.getRoomname()}`);
    }
}

function handleDateChange(event) {
    const selectedDate = event.target.value; // Get selected date as 'YYYY-MM-DD'
    generateRooms(selectedDate);
}
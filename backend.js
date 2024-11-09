class User {
    constructor(name, email, pw) {
      this.name = name
      this.email = email
      this.password = pw
    }
    getName(){
        return this.name
    }
  
    getEmail(){
        return this.email
    }
    
    getPassword(){
        return this.password
    }
  }
  
  // Subclass Student extending User
  class Student extends User {
    constructor(name, email, password) {
      super(name, email, password); // Calls the constructor of the User class
    }
  
  }
  
  // Subclass Staff extending User
  class Staff extends User {
    constructor(name, email, password) {
      super(name, email, password); // Calls the constructor of the User class
    }
  
}

class Room {
    constructor(room_name, timeslots, price, capacity, launch_status=false, promo_codes=[]){
        this.room_name = room_name
        this.slots = timeslots
        this.launch_status = launch_status
        this.price = price
        this.capacity = capacity
        this.promo_codes = promo_codes
    }

    setLaunchstatus(status){
        if (status === true){
            this.launch_status = true
        } else {
            this.launch_status = false
        }
    }

    setStatus(status){
        this.status = status
    }

    getRoomname(){
        return this.room_name
    }

    getLaunch(){
        return this.launch_status
    }
}

class Booking {
    constructor(room, user, timeslot, promo_code = null){
        this.room = room
        this.user = user
        this.timeslot = timeslot
        this.promo_code = promo_code
        this.price = this.calculatePrice()
    }

    calculatePrice(){
        let price = this.room.price
        if (this.promo_code && this.room.promo_codes.includes(this.promo_code)) {
            price *= 0.9; // Apply 10% discount if promo code is valid
        }
        return price;
    }
    
}

const reg_section = document.getElementById('register-container')
const login_section = document.getElementById('login-container')
const booking_section = document.getElementById('booking-container')
const staff_acc = new Staff("John", "admin@uow.edu.au", "Staff!")
const student_acc = new Student("Chris","chris@uow.edu.au", "Uowstudent!")
var account_list = [staff_acc, student_acc]

function openLogin(){
    login_section.style.display = 'flex'
    booking_section.style.display = 'none'
    reg_section.style.display = 'none'
}

function openBooking(){
    login_section.style.display = 'none'
    reg_section.style.display = 'none'
    booking_section.style.display = 'flex'
}

function login(){
    const email = document.querySelector('input[title="email"]').value.trim()
    const password = document.querySelector('input[title="password"]').value.trim()

    if (account_list.some(acc => acc.getEmail() == email && acc.getPassword() == password && acc instanceof Student)){
        console.log("success")
        openBooking()
    }
    else if (account_list.some(acc => acc.getEmail() == email && acc.getPassword() == password && acc instanceof Staff)){
        /* Staff */
        console.log("staff")
    }

    else {
        msgBox = document.getElementById('error')
        msgBox.innerText = "Incorrect Email or Password !"
    }
}

function openRegister(){
    reg_section.style.display = 'flex'
    login_section.style.display = 'none'
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
        if (hasCapital && hasSymbol){
            /* passed */
            if (emailRegex.test(reg_email) == true) {
                /* create acc */
                account_list.push(new Student(reg_name,reg_email,reg_cfmpassword))
                reg_section.style.display = 'none'
                booking_section.style.display = 'flex'
                console.log(account_list)
            }
            else {
                msgBox = document.getElementById('reg_error')
                msgBox.innerText = "Email is invalid"
            }
        }
        else {
            /* error */
            msgBox = document.getElementById('reg_error')
            msgBox.innerText = "Password should contain a symbol and capital letter"
        }
    }
    else {
        msgBox = document.getElementById('reg_error')
        msgBox.innerText = "Password does not match with Confirm Password"        
    }
}

default_timeslots = [
                    "0800 - 0900",
                    "0900 - 1000",
                    "1000 - 1100",
                    "1100 - 1200",
                    "1200 - 1300",
                    "1300 - 1400",
                    "1400 - 1500",
                    "1500 - 1600",
                    "1600 - 1700",
                    "1700 - 1800"
                ]

rooms = [
    new Room("A-L2-101", default_timeslots, 2, 4, true, promo_codes=["10OFF"]),
    new Room("A-L2-102", default_timeslots, 2, 4, true, promo_codes=["10OFF"]),
    new Room("A-L2-103", default_timeslots, 2, 4, true, promo_codes=["10OFF"]),
    new Room("A-L2-104", default_timeslots, 2, 4, true, promo_codes=["10OFF"]),
    new Room("B-L3-211", default_timeslots, 2, 6, true, promo_codes=["10OFF"]),
    new Room("B-L3-212", default_timeslots, 2, 6, true, promo_codes=["10OFF"]),
    new Room("B-L3-213", default_timeslots, 2, 8, true, promo_codes=["10OFF"]),
    new Room("B-L3-214", default_timeslots, 2, 8, true, promo_codes=["10OFF"])
]



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

function generateRooms() {
    const container = document.getElementById('room-container');
    console.log('Generating rooms...'); // Debugging log
    
    // Ensure `rooms` is an array and properly structured
    rooms.forEach((room) => {
        // Make sure room.getLaunch is a boolean or a method that returns true/false
        if (room.getLaunch() == true) {
            const newDiv = document.createElement('div');
            newDiv.textContent = room.getRoomname();  // Ensure this is a valid method/property
            newDiv.classList.add('room');
            container.appendChild(newDiv);
        } else {
            console.log('Room is not launched, skipping...');  // Debugging log
        }
    });
}
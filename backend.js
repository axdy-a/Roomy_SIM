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
    constructor(name, email, password, studentID) {
      super(name, email, password); // Calls the constructor of the User class
      this.studentID = studentID;
    }
  
  }
  
  // Subclass Staff extending User
  class Staff extends User {
    constructor(name, email, password, staffID) {
      super(name, email, password); // Calls the constructor of the User class
      this.staffID = staffID;
    }
  
}

class Room {
    constructor(room_name, timeslots, price, capacity, promo_codes=[]){
        this.room_name = room_name
        this.slots = timeslots
        this.launch_status = false
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


const staff_acc = new Staff("John", "johndoe@gmail.com", "uowstaffpassword", "13259123")
const student_acc = new Student("Chris","chris@uow.edu.au", "uowstudentpassword", "78517231")

function login(){
    const email = document.querySelector('input[title="email"]').value

    const password = document.querySelector('input[title="password"]').value

    if (email == student_acc.getEmail() && password == student_acc.getPassword()){
        console.log("success")
        window.location.href = 'index.html';
    }
}
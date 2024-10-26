class User {
    constructor(name, email) {
      this.name = name;
      this.email = email;
    }
    getName(){
        return this.name
    }
  
    login(){

    }
    
    register(){

    }
  }
  
  // Subclass Student extending User
  class Student extends User {
    constructor(name, email, studentID) {
      super(name, email); // Calls the constructor of the User class
      this.studentID = studentID;
    }
  
  }
  
  // Subclass Staff extending User
  class Staff extends User {
    constructor(name, email, staffID) {
      super(name, email); // Calls the constructor of the User class
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

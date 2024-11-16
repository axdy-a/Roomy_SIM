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

    getbookedRooms() {
        return this.bookedRooms;
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

class Staff extends User {
    constructor(name, email, password) {
        super(name, email, password);
    }
}
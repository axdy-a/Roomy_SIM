class User {
    constructor(name, email, pw) {
        this.name = name;
        this.email = email;
        this.password = pw;
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
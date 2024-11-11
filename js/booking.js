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
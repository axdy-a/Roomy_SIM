class Booking {
    constructor(room, user, timeslot, date) {
        this.room = room;
        this.user = user;
        this.timeslot = timeslot;
        this.date = date;
        this.price = room.getPrice(); // Set initial price from room
    }

    setPrice(newPrice) {
        this.price = newPrice; // Update the price in the booking
    }
}
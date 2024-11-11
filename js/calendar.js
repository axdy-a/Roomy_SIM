class Calendar {
    constructor(year) {
        this.year = year;
        this.dates = {}; // Stores booked timeslots by date
    }

    addBooking(date, timeslot, room) {
        if (!this.dates[date]) {
            this.dates[date] = {};
        }
        if (!this.dates[date][room]) {
            this.dates[date][room] = [];
        }

        if (this.dates[date][room].includes(timeslot)) {
            console.log(`Timeslot ${timeslot} on ${date} is already booked for ${room}`);
            return false;
        } else {
            this.dates[date][room].push(timeslot);
            console.log(`Booking successful: ${timeslot} on ${date} for ${room}`);
            return true;
        }
    }

    getAvailableTimeslots(date, room) {
        const roomBookings = (this.dates[date] && this.dates[date][room]) || [];
        const allTimeslots = room.getTimeslots();
        return allTimeslots.filter(slot => !roomBookings.includes(slot));
    }
}
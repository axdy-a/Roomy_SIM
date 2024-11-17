class Calendar {
    constructor(year) {
        this.year = year;
        this.dates = {}; // Stores booked timeslots by date
    }

    addBooking(date, timeslot, roomName, user) {
        if (!this.dates[date]) {
            this.dates[date] = {};
        }
        if (!this.dates[date][roomName]) {
            this.dates[date][roomName] = [];
        }
    
        if (this.dates[date][roomName].includes(timeslot)) {
            console.log(`Timeslot ${timeslot} on ${date} is already booked for ${roomName}`);
            return false;
        } else {
            // Create a new Booking instance
            const booking = new Booking(rooms.find(r => r.getRoomname() === roomName), user, timeslot);
    
            // Add the booking to the date and room
            this.dates[date][roomName].push(timeslot);
    
            // Ensure user exists and has a getbookedRooms method
            if (user && typeof user.getbookedRooms === 'function') {
                user.getbookedRooms().push(booking);
            } else {
                console.log('User object is not valid or does not have getbookedRooms method');
            }
    

            return true;
        }
    }

    getAvailableTimeslots(date, room) {
        const roomBookings = (this.dates[date] && this.dates[date][room]) || [];
        const allTimeslots = room.getTimeslots();
        return allTimeslots.filter(slot => !roomBookings.includes(slot));
    }

    isSlotBooked(date, timeslot, roomName) {
        return this.dates[date] && this.dates[date][roomName] && this.dates[date][roomName].includes(timeslot);
    }
}
class Room {
    constructor(room_name, building, timeslots, price, capacity, launch_status=false, promo_codes=[]) {
        this.room_name = room_name;
        this.building = building;
        this.slots = timeslots;
        this.launch_status = launch_status;
        this.price = price;
        this.capacity = capacity;
        this.promo_codes = promo_codes;
    }

    setLaunchStatus(status) {
        this.launch_status = status;
    }

    getRoomname() {
        return this.room_name;
    }

    getLaunch() {
        return this.launch_status;
    }

    getTimeslots() {
        return this.slots;
    }

    getBuilding() {
        return this.building;
    }
}
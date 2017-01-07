var claimerModule = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let flag = Game.flags['ClaimFlag'];
        if (flag) {
            if (creep.pos.roomName === flag.pos.roomName) {
                let room_controller = creep.room.controller;
                if (room_controller) {
                    // let outcome = creep.claimController(room_controller);
                    let outcome = creep.reserveController(room_controller);
                    if (outcome === ERR_NOT_IN_RANGE) {
                        creep.moveTo(room_controller);
                    }
                }
                else {
                    console.log('There is no target to claim');
                }
            }
            else {
                creep.moveTo(flag)
            }
        }
	}
}

module.exports = claimerModule;

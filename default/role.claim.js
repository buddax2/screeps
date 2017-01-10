var claimerModule = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if (creep.room.name != creep.memory.targetRoom) {
            var exitDir = creep.room.findExitTo(Game.rooms[creep.memory.targetRoom]);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            console.log(creep.name + ' going to claim something');
            return;
        }

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

        // let flag = Game.flags['ClaimFlag'];
        // if (flag) {
        //     if (creep.pos.roomName === flag.pos.roomName) {
        //         let room_controller = creep.room.controller;
        //         if (room_controller) {
        //             // let outcome = creep.claimController(room_controller);
        //             let outcome = creep.reserveController(room_controller);
        //             if (outcome === ERR_NOT_IN_RANGE) {
        //                 creep.moveTo(room_controller);
        //             }
        //         }
        //         else {
        //             console.log('There is no target to claim');
        //         }
        //     }
        //     else {
        //         creep.moveTo(flag)
        //     }
        // }
	}
}

module.exports = claimerModule;

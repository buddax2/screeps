var tankTrooperModule = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let flag = Game.flags['AttackFlag'];
        if (flag) {
            if (creep.pos.roomName === flag.pos.roomName) {
                // let spawn = creep.room.find(FIND_HOSTILE_SPAWNS)[0];
                // let tower = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                //     filter: (structure) => {
                //         return structure.structureType == STRUCTURE_TOWER;
                //     }
                // });
                // let wall = Game.getObjectById('5864c6b5ca3270043f06f737');
                // // let wall = Game.getObjectById('5863f33a55409cfe421ca68'); //false wall
                
                // let extension = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                //     filter: (structure) => {
                //         return structure.structureType == STRUCTURE_EXTENSION;
                //     }
                // });
                // let spawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
                let hostile_creeps = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

                let target = hostile_creeps;

                // if (wall) {
                //     target = wall;
                // }
                // else if (tower) {
                //     target = tower;
                // }
                // else if (extension) {
                //     target = extension;
                // }
                // else if (spawn) {
                //     target = spawn;
                // }
                // else if (hostile_creeps) {
                //     target = hostile_creeps;
                // }
                
                if (target) {
                    let outcome = creep.attack(target);
                    console.log('ATTACK ' + target);
                    if (outcome === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                        console.log('go ATTACK');
                    }
                }
                else {
                    creep.moveTo(flag)
                    // console.log('There is no target to attack');
                }
            }
            else {
                creep.moveTo(flag)
            }
        }
	}
}

module.exports = tankTrooperModule;

var remoteBuilderModule = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // // If creep is dying it needs to deliver its energy before it passed away
        // if (creep.ticksToLive <= 20 && creep.carry.energy > 0) {
        //     deliverEnergy(creep);
        //     return;
        // }

	    if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	    }

	    if(creep.memory.working) {
	       let flag = Game.flags['RemoteBuilding'];
            if (flag) {
                if (creep.pos.roomName === flag.pos.roomName) {
                    var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                    if(target) {
                        if(creep.build(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                }
                else {
                  creep.moveTo(flag);
                }
            }
	    }
	    else {
	        var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.energy > 0;
                }
            });

            if(container) {
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
            else {
                var nearestSource = creep.pos.findClosestByRange(FIND_SOURCES);
                if(creep.harvest(nearestSource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearestSource);
                }
            }
	    }
	}
};

/** @param {Creep} creep **/
function deliverEnergy(creep) {
    var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.energy < structure.storeCapacity;
        }
    });
    if (container) {
        if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
        }
    }
}

module.exports = remoteBuilderModule;

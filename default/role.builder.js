var builderModule = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // // If creep is dying it needs to deliver its energy before it passed away
        // if (creep.ticksToLive <= 20 && creep.carry.energy > 0) {
        //     deliverEnergy(creep);
        //     return;
        // }

        if (creep.room.name != creep.memory.targetRoom) {
            var exitDir = creep.room.findExitTo(Game.rooms[creep.memory.targetRoom]);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            return;
        }

	    if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	    }

	    if(creep.memory.working) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            var walls = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_WALL;
                }
            });
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {
                creep.moveTo(19, 32);
            }
	    }
	    else {
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.energy > creep.carryCapacity;
                }
            });

            if(containers.length > 0) {
                if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0]);
                }
            }
            else {
                var target = creep.pos.findClosestByRange(FIND_SOURCES, {
                    filter: (structure) => {
                        return structure.energy > 0;
                    }
                });
                if (target) {
                    if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
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

module.exports = builderModule;

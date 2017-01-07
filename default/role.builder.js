var builderModule = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // If creep is dying it needs to deliver its energy before it passed away
        if (creep.ticksToLive <= 20 && creep.carry.energy > 0) {
            deliverEnergy(creep);
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
          // if (walls.length > 0) {
          //   if(creep.build(walls[0]) == ERR_NOT_IN_RANGE) {
          //       creep.moveTo(walls[0]);
          //   }
          // }
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
          // else if (targets.length > 0) {
          //   if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          //       creep.moveTo(targets[0]);
          //   }
          // }
            else {
                creep.moveTo(19, 32);
            }
	    }
	    else {
	        // var sources = creep.room.find(FIND_SOURCES);
          // var nearestSource = creep.pos.findClosestByRange(FIND_SOURCES);
          // if(creep.harvest(nearestSource) == ERR_NOT_IN_RANGE) {
          //     creep.moveTo(nearestSource);
          // }
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

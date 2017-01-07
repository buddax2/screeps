var transporterModule = {

    /** @param {Creep} creep **/
    run: function(creep) {

         // If creep is dying it needs to deliver its energy before it passed away
        if (creep.ticksToLive <= 5 && creep.carry.energy > 0) {
            deliverEnergy(creep);
            return;
        }

        if (creep.room.energyAvailable == creep.room.energyCapacityAvailable) {
            storeEnergy(creep);
            return;
        }

      if(creep.memory.transporting && creep.carry.energy == 0) {
          creep.memory.transporting = false;
          creep.say('transporting');
      }
      else if(!creep.memory.transporting && creep.carry.energy == creep.carryCapacity) {
          creep.memory.transporting = true;
      }

      if (creep.memory.transporting == true) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                  structure.structureType == STRUCTURE_SPAWN ||
                  structure.structureType == STRUCTURE_TOWER) &&
                  structure.energy < structure.energyCapacity;
            }
        });
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
        }
      }
      else {
        // var containers = creep.room.find(FIND_STRUCTURES, {
        //     filter: (structure) => {
        //         return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.energy > 0;
        //     }
        // });

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
      }
	}
}

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

/** @param {Creep} creep **/
function storeEnergy(creep) {
    if (creep.room.energyAvailable == creep.room.energyCapacityAvailable) {
        if (creep.carry.energy < creep.carryCapacity) {
                var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 0;
                    }
                });
                if(container) {
                    if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
        }
        else {
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_STORAGE && structure.store.energy < structure.storeCapacity;
                }
            });
            if (container) {
                if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
        }
    }
}

module.exports = transporterModule;

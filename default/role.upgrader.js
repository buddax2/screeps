var upgraderModule = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // If creep is dying it needs to deliver its energy before it passed away
        if (creep.ticksToLive <= 10 && creep.carry.energy > 0) {
            deliverEnergy(creep);
            return;
        }

      if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
      }
      else if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
          creep.memory.upgrading = true;
          creep.say('upgrading');
      }

      if (creep.memory.upgrading) {
          if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
              creep.moveTo(creep.room.controller);
          }
      }
      else {
          var containers = creep.room.find(FIND_STRUCTURES, {
              filter: (structure) => {
                  return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.energy > 0;
              }
          });

        //   var sources = creep.room.find(FIND_SOURCES);
        containers.sort((a,b) => creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b));
        var target = containers[0];
        if (target) {
              if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(target);
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

module.exports = upgraderModule;

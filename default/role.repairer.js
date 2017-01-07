var repairerModule = {

    /** @param {Creep, Structure} creep **/
    run: function(creep) {

        // // If creep is dying it needs to deliver its energy before it passed away
        // if (creep.ticksToLive <= 20 && creep.carry.energy > 0) {
        //     deliverEnergy(creep);
        //     return;
        // }

      if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('harvesting');
      }
      else if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
          creep.memory.repairing = true;
          creep.say('repairing');
      }

      if (creep.memory.repairing) {
            let structureType = creep.memory.structureType;
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == structureType && structure.hits < structure.hitsMax;
                }
            });
            if (target) {
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });

                targets.sort((a,b) => a.hits - b.hits);
                if(targets.length > 0) {
                    console.log('There is no target ' + structureType + ' to repair')
                    console.log('Going to repair ' + targets[0]);
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
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

module.exports = repairerModule;

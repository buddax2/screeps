// This is a role for remote harvester

// creep.room.findExitTo(creep.memory.home)

var truckerModule = {

    /** @param {Creep} creep **/
    run: function(creep) {

    //   var sources = creep.room.find(FIND_SOURCES).map(function(source){
    //       return source.id;
    //   });
    //   var harvesters = _.filter(Game.creeps, (ccreep) => {
    //       return ccreep.memory.role == 'harvester';
    //   });

    //   for (var s in roomSources) {
    //     var source_harvesters = _.filter(harvesters, (ccreep) => {
    //         return ccreep.memory.targetSource == s;
    //     });
    //     if (source_harvesters.length < roomSources[s]) {
    //         creep.memory.targetSource = s;
    //     }
    //   }


      if(creep.memory.working && creep.carry.energy == creep.carryCapacity) {
          creep.memory.working = false;
      }
      else if(!creep.memory.working && creep.carry.energy == 0) {
          creep.memory.working = true;
      }

      if (creep.memory.working == true) {
          
          
          if (creep.room.name != creep.memory.targetRoom) {
              var exitDir = creep.room.findExitTo(Game.rooms[creep.memory.targetRoom]);
              var exit = creep.pos.findClosestByRange(exitDir);

            if (!exit) {
                let flag = Game.flags['waitingZone'];
                if (flag) {
                    creep.moveTo(flag);
                }
            }
            else {
                creep.moveTo(exit);
            }
          }
          else {
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    // return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.energy > 1000; //Fix this
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 1000; //Fix this
                }
            });

            if (!container) {
                container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        // return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.energy > 0;
                        return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 0;
                    }
                });
            }

            if (container) {
                let outcome = creep.withdraw(container, RESOURCE_ENERGY);
                if (outcome == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
          }
      }
      else {
        if (creep.room.name != creep.memory.homeRoom) {
            var exitDir = creep.room.findExitTo(Game.rooms[creep.memory.homeRoom]);
            var exit = creep.pos.findClosestByRange(exitDir);

            if (!exit) {
                let flag = Game.flags['waitingZone'];
                if (flag) {
                    creep.moveTo(flag);
                }
            }
            else {
                creep.moveTo(exit);
            }
        }
        else {
            deliverEnergy(creep);
        }
      }
    }
}

/** @param {Creep} creep **/
function deliverEnergy(creep) {

    var container = undefined;
    if (creep.memory.target) {
        container = Game.getObjectById(creep.memory.target);
    }
    else {
        container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) &&
                    structure.energy < structure.energyCapacity;
            }
        });   
        if (!container) {
            container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_STORAGE && structure.store.energy < structure.storeCapacity;
                }
            });
            
            if (creep.room.terminal) {
                let distanceToTerminal = creep.pos.getRangeTo(creep.room.terminal);
                let distanceToStorage = creep.pos.getRangeTo(container);
                
                if (distanceToTerminal < distanceToStorage) {
                    container = creep.room.terminal;
                }
            }
        }
    }

    if (container) {
        creep.memory.target = container.id;
        let outcome = creep.transfer(container, RESOURCE_ENERGY);
        if(outcome == ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
        }
        else if (outcome == 0) {
            console.log(creep.name + ' deleted targed: ' + creep.memory.target);
            delete creep.memory.target;
        }
        else {
            delete creep.memory.target;
        }
    }
}

module.exports = truckerModule;

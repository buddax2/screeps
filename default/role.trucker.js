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
          
          if (Game.spawns.Phobos.room.name != creep.room.name) {
            var exitDir = creep.room.findExitTo(Game.spawns.Phobos.room);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
          }
          else {
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.energy > 0;
                }
            });

            if (container) {
                let outcome = creep.withdraw(container, RESOURCE_ENERGY);
                if (outcome == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
          }
      }
      else {
        if (Game.spawns.MainBase.room.name != creep.room.name) {
            var exitDir = creep.room.findExitTo(Game.spawns.MainBase.room);
            var exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
        }
        else {
            deliverEnergy(creep);
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

module.exports = truckerModule;

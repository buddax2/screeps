// This is a role for remote harvester

// creep.room.findExitTo(creep.memory.home)

var remoteHarvesterModule = {

    /** @param {Creep} creep **/
    run: function(creep) {

      if(creep.memory.working && creep.carry.energy == 0) {
          creep.memory.working = false;
      }
      else if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
          creep.memory.working = true;
      }

      if (creep.memory.working == true) {
        var container = Game.spawns.MainBase.pos.findClosestByRange(FIND_MY_STRUCTURES, {
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
      else {
        let flag = Game.flags['RemoteHarvesting'];
        if (flag) {
            if (creep.pos.roomName === flag.pos.roomName) {
                var target = creep.pos.findClosestByRange(FIND_SOURCES);
                if (target) {
                let outcome = creep.harvest(target);

                if (outcome == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                else if (outcome == 0) {
                    // Let's try to drop the harvested energy if a container is near
                    var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.energy < structure.storeCapacity;
                        }
                    });
                    if (container && creep.pos.isNearTo(container)) {
                        creep.transfer(container, RESOURCE_ENERGY);
                    }
                }
            }
              // var target = creep.pos.findClosestByRange(FIND_STRUCTURES,
	            //    {filter: {structureType: STRUCTURE_CONTAINER}
              //  });
              // if (target) {
              //   let outcome = creep.withdraw(target, RESOURCE_ENERGY);
              //   if (outcome == ERR_NOT_IN_RANGE) {
              //     creep.moveTo(target);
              //   }
              //   else {
              //     console.log('err: '+outcome);
              //   }
              // }
            }
            else {
              creep.moveTo(flag);
            }
        }
      }
    }
}

module.exports = remoteHarvesterModule;

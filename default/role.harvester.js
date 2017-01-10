const roomSources = {
    "E73N71": {'5836b8af8b8b9619519f26bc':2, '5836b8af8b8b9619519f26bd':2},
    "E72N71": {'5836b89b8b8b9619519f24bf':3, '5836b89b8b8b9619519f24bd':1 },
    "E73N72": {'5836b8af8b8b9619519f26b9':3 }
};

var harvesterModule = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // // If creep is dying it needs to deliver its energy before it passed away
        // if (creep.ticksToLive <= 10 && creep.carry.energy > 0) {
        //     deliverEnergy(creep);
        //     return;
        // }
        
        if (creep.room.name != creep.memory.targetRoom) {
            // if(!creep.memory.path) {
                var exitDir = creep.room.findExitTo(Game.rooms[creep.memory.targetRoom]);
                var exit = creep.pos.findClosestByRange(exitDir);
            //     creep.memory.path = creep.pos.findPathTo(target);
            // }
            // creep.moveByPath(creep.memory.path);
            
            if (!exit) {
                let flag = Game.flags['waitingZone'];
                if (flag) {
                    creep.moveTo(flag);
                }
            }
            else {
                creep.moveTo(exit);
            }
            
            return;
        }

        if (!creep.memory.targetSource) {
            // Get all harvesters
            var harvesters = _.filter(Game.creeps, (ccreep) => {
                return ccreep.memory.role == 'harvester';
            });

            for (var s in roomSources[creep.memory.targetRoom]) {
                // Get all harvesters for the current source
                var free_harvesters = _.filter(harvesters, (ccreep) => {
                    return ccreep.memory.targetRoom == creep.memory.targetRoom && !ccreep.memory.targetSource;
                });

                var harvestersForThisSource = _.filter(harvesters, (ccreep) => {
                    return ccreep.memory.targetRoom == creep.memory.targetRoom && ccreep.memory.targetSource == s;
                });

                // If there are less harvesters assigned to the current source
                // We can assign current creep to this source
                // console.log(s + ' has ' + roomSources[creep.memory.targetRoom][s] + ' and assigned h:' + free_harvesters);
                if (harvestersForThisSource.length < roomSources[creep.memory.targetRoom][s] && free_harvesters.length > 0) {
                    creep.memory.targetSource = s;
                    console.log('assigned creep ' + creep.name + ' to the source ' + s);
                    break;
                }
            }
        }

        if(creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = false;
        }
        else if(!creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
                let source = Game.getObjectById(creep.memory.targetSource);

                if (source) {
                    let outcome = creep.harvest(source);
                    if(outcome == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                    else if (outcome == 0) {
                        var container = Game.getObjectById(creep.memory.target);
                        if (!container) {
                            // Let's try to drop the harvested energy if a container is near
                            container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.energy < structure.storeCapacity;
                                }
                            });
                            if (container) {
                                creep.memory.target = container.id;
                            }
                        }
                        if (container && creep.pos.isNearTo(container)) {
                            creep.transfer(container, RESOURCE_ENERGY);
                        }
                    }
                    else if (outcome == ERR_NOT_ENOUGH_RESOURCES) {
                        creep.memory.working = false;
                        deliverEnergy(creep);
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
        else {
            deliverEnergy(creep);

            // // This is for remote harvesting
            // if (creep.room.name != creep.memory.homeRoom) {
            //     var exitDir = creep.room.findExitTo(Game.rooms[creep.memory.homeRoom]);
            //     var exit = creep.pos.findClosestByRange(exitDir);
            //     creep.moveTo(exit);
            // }
            // else {
            //     deliverEnergy(creep);
            // }
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

module.exports = harvesterModule;

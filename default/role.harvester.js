const roomSources = {
    "MainBase": {'5836b8af8b8b9619519f26bc':2, '5836b8af8b8b9619519f26bd':2},
    "Phobos": {'5836b89b8b8b9619519f24bf':3, '5836b89b8b8b9619519f24bd':1 }
};

var harvesterModule = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // // If creep is dying it needs to deliver its energy before it passed away
        // if (creep.ticksToLive <= 10 && creep.carry.energy > 0) {
        //     deliverEnergy(creep);
        //     return;
        // }
        
        // Get all sources in this room
        var sources = creep.room.find(FIND_SOURCES).map(function(source){
            return source.id;
        });
        
        // Get all harvesters
        var harvesters = _.filter(Game.creeps, (ccreep) => {
            return ccreep.memory.role == 'harvester';
        });
        if (harvesters.length > 0) {
            for (var s in roomSources[creep.memory.home]) {
                // Get all harvesters for the current source
                var source_harvesters = _.filter(harvesters, (ccreep) => {
                    return ccreep.memory.targetSource == s;
                });

                // If there are less harvesters assigned to the current source
                // We can assign current creep to this source
                if (source_harvesters.length < roomSources[creep.memory.home][s]) {
                    creep.memory.targetSource = s;
                    console.log('assigned creep ' + creep.name + ' to the source ' + s);
                    // break;
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
            // var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.energy < structure.storeCapacity;
            //     }
            // });
            // if (container) {
            //     if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(container);
            //     }
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

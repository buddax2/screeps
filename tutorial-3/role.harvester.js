var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

    	function transferTo(creep, targets, idx) {
    	    if (targets.length == idx) {
    	        return;
    	    }
    	    
    	    if (targets[idx].energy < 50) {
                if(creep.transfer(targets[idx], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[idx]);
                }
            }
            else {
                idx += 1;
                transferTo(creep, targets, idx);
            }
    	}

	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    var isExtension = structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN;
                    var isFull = structure.energy < structure.carryCapacity;
                    return isExtension;
                }
            })
            
            if (targets.length > 0) {
                transferTo(creep, targets, 0);
            }
            else {
                console.log('no targets');
            }
        }
	}
};

module.exports = roleHarvester;
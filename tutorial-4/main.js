var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

var harvesterIndex = 0;

module.exports.loop = function () {

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    var harvesters = _.filter(Game.creeps, (creep) => { 
        return creep.memory.role == 'harvester'
    })
    console.log('Harvesters:' + harvesters);

    if (harvesters.length < 2) {
        let name = 'Harvester' + harvesterIndex++;
        Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], name, {role: 'harvester'});
        console.log('Welcome, ' + name + '!');
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}
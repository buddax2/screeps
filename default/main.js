let harvesterModule = require('role.harvester');
let transporterModule = require('role.transporter')
let upgraderModule = require('role.upgrader');
let builderModule = require('role.builder');
let repairerModule = require('role.repairer');
let trooperModule = require('role.trooper');
let trooperTankModule = require('role.tank');
let claimerModule = require('role.claim');
let truckerModule = require('role.trucker');
let remoteHarvesterModule = require('role.remoteHarvester');
let defenderModule = require('role.defender');
let remoteBuilderModule = require('role.remoteBuilder');

const Role = {
    Harvester: "harvester",
    Transporter: "transporter",
    Upgrader: "Upgrader",
    Builder: "builder",
    RemoteBuilder: "remoteBuilder",
    Repairer: "repairer",
    Trooper: "trooper",
    Tank: "tank",
    Claimer: "claimer",
    Trucker: "trucker",
    RemoteHarvester: "remoteHarvester",
    Defender: "defender"
}

let RoomConfigs = {
    "E73N71": { //MainBase
        harvesters: 4,
        roadRepairers: 2,
        containerRepairers: 1,
        transporters: 3,
        upgraders: 1,
        builders: 1,
        truckers: 1
    },
    "E73N72": { //Top room
        truckers: 5,
        harvesters: 2,
        containerRepairers: 1,
        claimers: 1,
        builders: 0
    },
    "E72N71": { //Phobos
        truckers: 5,
        harvesters: 4,
        roadRepairers: 1,
        containerRepairers: 1,
        transporters: 1,
        upgraders: 2
    }
};


let Population = {
    "MainBase": {
        // Harvestes: 4,
        RemoteHarvesters: 0,
        // Transporters: 3,
        Builders: 0,
        RemoteBuilders: 1,
        Upgraders: 5,
        // Repairs: 0,
        RoadRepairs: 2,
        ContainerRepairers: 1,
        Troopers: 0,
        Tanks: 1,
        Claimers: 1,
        // Truckers: 5,
        Defenders: 0
    },
    "Phobos": {
        // Harvestes: 4,
        RemoteHarvesters: 0,
        // Transporters: 1,
        Builders: 0,
        RemoteBuilders: 0,
        Upgraders: 3,
        // Repairs: 0,
        RoadRepairs: 1,
        ContainerRepairers: 1,
        Troopers: 0,
        Tanks: 0,
        Claimers: 0,
        // Truckers: 0,
        Defenders: 0
    }

}

module.exports.loop = function () {

    console.log('=== New cycle ===');

    setBuildersCount(Game.spawns.MainBase);
    setBuildersCount(Game.spawns.Phobos);

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    createCreeps(Game.spawns.MainBase, Population.MainBase);
    createCreeps(Game.spawns.Phobos, Population.Phobos);

    for (var roomConfig in RoomConfigs) {
        
        //Claimer
        let claimersToCreate = RoomConfigs[roomConfig].claimers;
        if (claimersToCreate > 0) {
            let claimers = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Claimer && creep.memory.targetRoom == roomConfig);

            if (claimers.length < claimersToCreate) {
                let outcome = Game.spawns.MainBase.createCreep([CLAIM, CLAIM, MOVE], undefined, {role: Role.Claimer, homeRoom: roomConfig, targetRoom: roomConfig});

                if (outcome < 0) {
                    Game.spawns.MainBase.createCreep([CLAIM, MOVE], undefined, {role: Role.Claimer, homeRoom: roomConfig, targetRoom: roomConfig});
                }
            }
        }

        //Harvester
        let harvestersToCreate = RoomConfigs[roomConfig].harvesters;
        if (harvestersToCreate > 0) {
            let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Harvester && creep.memory.targetRoom == roomConfig);

            if (harvesters.length < harvestersToCreate) {
                let creep = Game.spawns.MainBase.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], undefined, { role: Role.Harvester, home: Game.spawns.MainBase.name, homeRoom: Game.spawns.MainBase.room.name, targetRoom: roomConfig });

                // Create a small harvester
                // If there is not enough money for such big harvester
                if (creep < 0) {
                    let creep = Game.spawns.MainBase.createCreep([WORK, CARRY, MOVE], undefined, { role: Role.Harvester, home: Game.spawns.MainBase.name, homeRoom: Game.spawns.MainBase.room.name, targetRoom: roomConfig });
                }
            }
        }

        //Trucker
        let truckersToCreate = RoomConfigs[roomConfig].truckers;
        if (truckersToCreate > 0) {
            let truckers = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Trucker && creep.memory.targetRoom == roomConfig);
            if (truckers.length < truckersToCreate) {
                let creep = Game.spawns.MainBase.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], undefined, { role: Role.Trucker, homeRoom: Game.spawns.MainBase.room.name, targetRoom: roomConfig });
            }
        }

        //Repairer
        let repairersToCreate = RoomConfigs[roomConfig].repairers;
        if (repairersToCreate > 0) {
            let repairers = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Repairer && creep.memory.targetRoom == roomConfig);
            if (repairers.length < repairersToCreate) {
                let creep = Game.spawns.MainBase.createCreep([WORK, CARRY, MOVE], undefined, { role: Role.Repairer, homeRoom: roomConfig, targetRoom: roomConfig });
            }
        }

        //Road Repairer
        let roadRepairersToCreate = RoomConfigs[roomConfig].roadRepairers;
        if (roadRepairersToCreate > 0) {
            var roadRepairers = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Repairer && creep.memory.targetRoom == roomConfig && creep.memory.structureType == STRUCTURE_ROAD);
            if (roadRepairers.length < roadRepairersToCreate) {
                let creep = Game.spawns.MainBase.createCreep([WORK, CARRY, MOVE], undefined, { role: Role.Repairer, structureType: STRUCTURE_ROAD, homeRoom: roomConfig, targetRoom: roomConfig });
            }
        }

        //Container Repairer
        let containerRepairersToCreate = RoomConfigs[roomConfig].containerRepairers;
        if (containerRepairersToCreate > 0) {
            var containerRepairers = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Repairer && creep.memory.targetRoom == roomConfig && creep.memory.structureType == STRUCTURE_CONTAINER);
            if (containerRepairers.length < containerRepairersToCreate) {
                let creep = Game.spawns.MainBase.createCreep([WORK, CARRY, MOVE], undefined, { role: Role.Repairer, structureType: STRUCTURE_CONTAINER, homeRoom: roomConfig, targetRoom: roomConfig });
            }
        }

        //Transporter
        let transportersToCreate = RoomConfigs[roomConfig].transporters;
        if (transportersToCreate > 0) {
            var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Transporter && creep.memory.targetRoom == roomConfig);
            if (transporters.length < transportersToCreate) {
                let creep = Game.spawns.MainBase.createCreep([CARRY, MOVE], undefined, { role: Role.Transporter, homeRoom: roomConfig, targetRoom: roomConfig });
            }
        }

        //Upgrader
        let upgradersToCreate = RoomConfigs[roomConfig].upgraders;
        if (upgradersToCreate > 0) {
            var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Upgrader && creep.memory.targetRoom == roomConfig);
            if (upgraders.length < upgradersToCreate) {
                let creep = Game.spawns.MainBase.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], undefined, { role: Role.Upgrader, homeRoom: roomConfig, targetRoom: roomConfig });

                if (creep < 0) {
                    let creep = Game.spawns.MainBase.createCreep([WORK, CARRY, MOVE], undefined, { role: Role.Upgrader, homeRoom: roomConfig, targetRoom: roomConfig });
                }
            }
        }

        //Builder
        let buildersToCreate = RoomConfigs[roomConfig].builders;
        if (buildersToCreate > 0) {
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Builder && creep.memory.targetRoom == roomConfig);
            if (builders.length < buildersToCreate) {
                Game.spawns.MainBase.createCreep([WORK, CARRY, MOVE], undefined, { role: Role.Builder, homeRoom: roomConfig, targetRoom: roomConfig });
                // let creep = Game.spawns.MainBase.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], undefined, { role: Role.Builder, homeRoom: roomConfig, targetRoom: roomConfig });
                // if (creep < 0) {
                //     Game.spawns.MainBase.createCreep([WORK, CARRY, MOVE], undefined, { role: Role.Builder, homeRoom: roomConfig, targetRoom: roomConfig });
                // }
            }
        }
    }

    setRoles();
    setDefendersPopulation();
    towerTurn();
}

function createCreeps(spawn, populationRoom) {
    let sname = spawn.name;

    // var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Harvester && creep.memory.home == spawn.name);
    // let remoteHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == Role.RemoteHarvester && creep.memory.home == spawn.name);
    // var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Transporter && creep.memory.home == spawn.name);
    // var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Upgrader && creep.memory.home == spawn.name);
    // var builders = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Builder && creep.memory.home == spawn.name);
    // var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Repairer && !creep.memory.structureType && creep.memory.home == spawn.name);
    // var roadRepairers = _.filter(Game.creeps, (creep) => { return creep.memory.role == Role.Repairer && creep.memory.structureType == STRUCTURE_ROAD && creep.memory.home == spawn.name; });
    // var containerRepairers = _.filter(Game.creeps, (creep) => { return creep.memory.role == Role.Repairer && creep.memory.structureType == STRUCTURE_CONTAINER && creep.memory.home == spawn.name; });
    // var troopers = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Trooper && creep.memory.home == spawn.name);
    // var tanks = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Tank && creep.memory.home == spawn.name);
    // var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Claimer && creep.memory.home == spawn.name);
    // let truckers = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Trucker && creep.memory.home == spawn.name);
    let defenders = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Defender && creep.memory.home == spawn.name);
    // let remoteBuilders = _.filter(Game.creeps, (creep) => creep.memory.role == Role.RemoteBuilder && creep.memory.home == spawn.name);

    // if (harvesters.length > 0) console.log(sname + ' ' + 'Total harvesters:' + harvesters.length);
    // if (remoteHarvesters.length > 0) console.log(sname + ' ' + 'Total remote harvesters:' + remoteHarvesters.length);
    // if (transporters.length > 0) console.log(sname + ' ' + 'Total transporters:' + transporters.length);
    // if (upgraders.length > 0) console.log(sname + ' ' + 'Total upgraders:' + upgraders.length);
    // if (builders.length > 0) console.log(sname + ' ' + 'Total builders:' + builders.length);
    // if (repairers.length > 0) console.log(sname + ' ' + 'Total repairers:' + repairers.length);
    // if (roadRepairers.length > 0) console.log(sname + ' ' + 'Total road repairers:' + roadRepairers.length);
    // if (containerRepairers.length > 0) console.log(sname + ' ' + 'Total container repairers:' + containerRepairers.length);
    // if (troopers.length > 0) console.log(sname + ' ' + 'Total troopers:' + troopers.length);
    // if (tanks.length > 0) console.log(sname + ' ' + 'Total tanks:' + tanks.length);
    // if (claimers.length > 0) console.log(sname + ' ' + 'Total claimers:' + claimers.length);
    // if (truckers.length > 0) console.log(sname + ' ' + 'Total truckers:' + truckers.length);
    // if (defenders.length > 0) console.log(sname + ' ' + 'Total defenders:' + defenders.length);
    // if (remoteBuilders.length > 0) console.log(sname + ' ' + 'Total remote builders:' + remoteBuilders.length);

    // Harvesters should have the most high priority while creating a new creep
    // if (harvesters.length < Population[sname].Harvestes) {
    //     // let name = 'Harvester' + harvesterIndex++;
    //     // let creep = spawn.createCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], undefined, {role: Role.Harvester, home: spawn.name});
    //     let creep = spawn.createCreep([WORK, WORK, WORK, CARRY, MOVE], undefined, {role: Role.Harvester, home: spawn.name, homeRoom: spawn.room.name});

    //     // Create a small harvester
    //     // If there is not enough money for such big harvester
    //     if (creep < 0) {
    //         let creep = spawn.createCreep([WORK, CARRY, MOVE], undefined, {role: Role.Harvester, home: spawn.name, homeRoom: spawn.room.name});
    //     }
    // }
    // if (transporters.length < Population[sname].Transporters) {
    //     // let name = 'Harvester' + harvesterIndex++;
    //     let creep = spawn.createCreep([CARRY, MOVE], undefined, { role: Role.Transporter, home: spawn.name });

    //     // Create a small harvester
    //     // If there is not enough money for such big harvester
    //     if (creep < 0) {
    //         let creep = spawn.createCreep([CARRY, MOVE], undefined, { role: Role.Transporter, home: spawn.name });
    //     }
    // }
    // if (remoteHarvesters.length < Population[sname].RemoteHarvesters) {
    //     let creep = spawn.createCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, { role: Role.RemoteHarvester, home: spawn.name })
    // }
    // if (truckers.length < Population[sname].Truckers) {
    //   let creep = spawn.createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], undefined, {role: Role.Trucker, home: spawn.name});
    // }
    // if (upgraders.length < Population[sname].Upgraders) {
    //     // let name = 'Upgrader' + upgraderIndex++;
        // let creep = spawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], undefined, { role: Role.Upgrader, home: spawn.name });

        // if (creep < 0) {
        //     let creep = spawn.createCreep([WORK, CARRY, MOVE], undefined, { role: Role.Upgrader, home: spawn.name });
        // }
    // }
    // if (builders.length < Population[sname].Builders) {
    //     // let name = 'Builder' + builderIndex;
        // let creep = spawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], undefined, { role: Role.Builder, home: spawn.name });
        // if (creep < 0) {
        //     let creep = spawn.createCreep([WORK, CARRY, MOVE], undefined, { role: Role.Builder, home: spawn.name });
        // }
    // }
    // if (remoteBuilders.length < Population[sname].RemoteBuilders) {
    //     let creep = spawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], undefined, { role: Role.RemoteBuilder, home: spawn.name });
    // }
    // if (repairers.length < Population[sname].Repairs) {
    //     let creep = spawn.createCreep([WORK, CARRY, MOVE], undefined, {role: Role.Repairer, home: spawn.name});
    // }
    // if (roadRepairers.length < Population[sname].RoadRepairs) {
    //     let creep = spawn.createCreep([WORK, CARRY, MOVE], undefined, {role: Role.Repairer, structureType: STRUCTURE_ROAD, home: spawn.name});
    // }
    // if (containerRepairers.length < Population[sname].ContainerRepairers) {
    //     let creep = spawn.createCreep([WORK, CARRY, MOVE], undefined, {role: Role.Repairer, structureType: STRUCTURE_CONTAINER, targetRoom: spawn.room.name, homeRoom: spawn.room.name});
    // }
    // if (troopers.length < Population[sname].Troopers) {
    //     // let creep = Game.spawns.MainBase.createCreep([ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE], undefined, {role: Role.Trooper});
    //     let creep = spawn.createCreep([RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE], undefined, { role: Role.Trooper, home: spawn.name });
    // }
    // if (tanks.length < Population[sname].Tanks) {
    //     let creep = Game.spawns.MainBase.createCreep([ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE], undefined, {role: Role.Tank});
    //     // let lightTank = spawn.createCreep([ATTACK, MOVE], undefined, { role: Role.Tank, home: spawn.name });
    // }
    // if (claimers.length < Population[sname].Claimers) {
    //     let creep = spawn.createCreep([CLAIM, CLAIM, MOVE], undefined, { role: Role.Claimer, home: spawn.name });
    // }
    if (defenders.length < Population[sname].Defenders) {
        let creep = spawn.createCreep([ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE], undefined, { role: Role.Defender, home: spawn.name });
        if (creep < 0) {
            let creep = spawn.createCreep([ATTACK, ATTACK, MOVE], undefined, { role: Role.Defender, home: spawn.name });
        }
    }
}

function setRoles() {

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        findAndPickupNearestDroppedResource(creep);

        if (creep.memory.role == Role.Harvester) {
            harvesterModule.run(creep);
        }
        if (creep.memory.role == Role.RemoteHarvester) {
            remoteHarvesterModule.run(creep);
        }
        if (creep.memory.role == Role.Transporter) {
            transporterModule.run(creep);
        }
        if (creep.memory.role == Role.Upgrader) {
            upgraderModule.run(creep);
        }
        if (creep.memory.role == Role.Builder) {
            builderModule.run(creep);
        }
        if (creep.memory.role == Role.RemoteBuilder) {
            remoteBuilderModule.run(creep);
        }
        if (creep.memory.role == Role.Repairer) {
            repairerModule.run(creep);
        }
        if (creep.memory.role == Role.Trooper) {
            trooperModule.run(creep);
        }
        if (creep.memory.role == Role.Tank) {
            trooperTankModule.run(creep);
        }
        if (creep.memory.role == Role.Claimer) {
            claimerModule.run(creep);
        }
        if (creep.memory.role == Role.Trucker) {
            truckerModule.run(creep);
        }
        if (creep.memory.role == Role.Defender) {
            defenderModule.run(creep);
        }
    }
}

function findAndPickupNearestDroppedResource(creep) {
    var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
    if (target) {
        if (creep.pos.inRangeTo(target, 5)) {
            creep.moveTo(target);
            if (creep.pickup(target) == 0) {
                console.log(creep.name + ' just picked up ' + target.amount + ' energy')
            }
        }
    }
}

function setBuildersCount(spawn) {
    let construction_sites = spawn.room.find(FIND_CONSTRUCTION_SITES);
    let buildersPopulation = 0;
    if (construction_sites.length > 0) {
        if (construction_sites.length > 5) buildersPopulation = 4;
        else buildersPopulation = 2;
    }
    else {
        buildersPopulation = 0;
    }
    let sname = spawn.name;
    Population[sname].Builders = buildersPopulation;
}

function setDefendersPopulation() {
    let hostileCreeps = Game.spawns.MainBase.room.find(FIND_HOSTILE_CREEPS);

    if (hostileCreeps.length > 0) {
        maxDefenders = hostileCreeps.length * 2;
    }
    else {
        maxDefenders = 0;
    }
}

function towerTurn() {
    let towers = Game.spawns.MainBase.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_TOWER
    });
    towers.forEach((tower) => {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            // Uncomment when we will have enough energy
            // tower.repair(closestDamagedStructure);
        }

        var hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if (hostile) {
            tower.attack(hostile);
        }
    });
}

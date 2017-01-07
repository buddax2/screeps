var defenderModule = {

    /** @param {Creep} creep **/
    run: function(creep) {
      var hostileCreeps = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if(hostileCreeps) {
          if(creep.attack(hostileCreeps) == ERR_NOT_IN_RANGE) {
              creep.moveTo(hostileCreeps);
              creep.attack(hostileCreeps);
          }
      }
      else {
        creep.moveTo(12, 18);
      }
	}
}

module.exports = defenderModule;

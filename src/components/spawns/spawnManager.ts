import { Config } from './../../config/config';

export namespace SpawnManager {

  export let spawns: Spawn[];
  export let spawnNames: string[] = [];
  export let spawnCount: number = 0;

  export function loadSpawns(room: Room) {
    spawns = room.find<Spawn>(FIND_MY_SPAWNS);
    spawnCount = _.size(spawns);

    _loadSpawnNames();

    if (Config.VERBOSE) {
      console.log('[SpawnManager] ' + spawnCount + ' spawns in room.');
    }
  }

  export function getFirstSpawn(): Spawn {
    return spawns[spawnNames[0]];
  }

  /**
   * Spawns a new creep.
   *
   * @export
   * @param {Spawn} spawn
   * @param {string[]} body
   * @param {{ [key: string]: any }} properties
   * @returns {(number | string)}
   */
  export function spawnCreep(spawn: Spawn, body: string[], properties: { [key: string]: any }): number | string {
    let status = spawn.canCreateCreep(body, null);

    if (status == OK) {
      if (Config.VERBOSE) {
        console.log('[SpawnManager] Started creating new creep');
      }
      return spawn.createCreep(body, null, properties);
    } else {
      if (Config.VERBOSE) {
        console.log('[SpawnManager] Failed creating new creep: ' + status);
      }
      return status;
    }
  }

  function _loadSpawnNames() {
    for (let spawnName in spawns) {
      if (spawns.hasOwnProperty(spawnName)) {
        spawnNames.push(spawnName);
      }
    }
  }

}

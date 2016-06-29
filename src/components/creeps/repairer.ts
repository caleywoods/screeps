import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';
import { ControllerManager } from './../controllers/controllerManager';
import { StructureManager } from './../structures/structureManager';
import { RoomManager } from './../rooms/roomManager';

export interface IRepairer {

  targetStructure: Structure;
  energyStation: Storage | Spawn;
  _minHitsBeforeNeedsRepair: number;

  isBagEmpty(): boolean;
  isBagFull(): boolean;
  askForEnergy();
  moveToAskEnergy(): void;
  tryRepair(): number;
  moveToRepair(): void;

  action(): boolean;

}

export class Repairer extends CreepAction implements IRepairer, ICreepAction {

  public targetStructure: Structure = null;
  public energyStation: Spawn = null;

  public _minHitsBeforeNeedsRepair: number = Config.DEFAULT_MIN_HITS_BEFORE_NEEDS_REPAIR;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetStructure = <Structure>Game.getObjectById(this.creep.memory.target_repair_site_id);
    this.energyStation = <Spawn>Game.getObjectById(this.creep.memory.target_energy_station_id);
  }

  public isBagEmpty(): boolean {
    return this.creep.carry.energy == 0;
  }

  public isBagFull(): boolean {
    return this.creep.carry.energy == this.creep.carryCapacity;
  }

  public askForEnergy() {
    return this.energyStation.transferEnergy(this.creep);
  }

  public moveToAskEnergy(): void {
    if (this.askForEnergy() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.energyStation);
    }
  }

  public tryRepair(): number {
    return this.creep.repair(this.targetStructure);
  }

  public moveToRepair(): void {
    if (this.tryRepair() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetStructure);
    }
  }

  public action(): boolean {
    if (this.creep.memory.repairing && this.isBagEmpty()) {
      this.creep.memory.repairing = false;
    }
    if (!this.creep.memory.repairing && this.isBagFull()) {
      this.creep.memory.repairing = true;
    }

    if (this.creep.memory.repairing) {
      this.moveToRepair();
    } else {
      this.moveToAskEnergy();
    }

    return true;
  }

}
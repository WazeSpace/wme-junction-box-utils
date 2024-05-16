import { Turn } from '@/@waze/Waze/Model/turn';
import { BigJunctionAddress } from '../interfaces';
import { uniqBy } from '@/utils';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { getBigJunctionTurns } from '@/utils/wme-entities/big-junction-turns';
import { convertWMEAddressToBigJunctionAddress } from '../utils';

export class BigJunctionBackup {
  private _name: string;
  private _address: BigJunctionAddress;
  private _turns: Turn[];
  private _originalBigJunction: BigJunctionDataModel;

  static fromBigJunction(bigJunction: BigJunctionDataModel): BigJunctionBackup {
    const backup = new BigJunctionBackup();
    backup._originalBigJunction = bigJunction;
    backup._name = bigJunction.getAttribute('name');
    const rawAddress = bigJunction.getAddress(bigJunction.model);
    backup._address = convertWMEAddressToBigJunctionAddress(rawAddress);
    backup._turns = getBigJunctionTurns(bigJunction);
    return backup;
  }

  getEntranceSegmentIds() {
    // segments are counted as entrances only if they are linked to far turns
    const turns = this.getFarTurns();
    const entranceSegmentIds = turns.map((turn) =>
      turn.fromVertex.getSegmentID(),
    );
    return uniqBy(entranceSegmentIds, (id) => id);
  }

  getExitSegmentIds() {
    // segments are counted as exits only if they are linked to far turns
    const turns = this.getFarTurns();
    const exitSegmentIds = turns.map((turn) => turn.toVertex.getSegmentID());
    return uniqBy(exitSegmentIds, (id) => id);
  }

  getName() {
    return this._name;
  }

  getAddress() {
    return this._address;
  }

  getTurns() {
    return this._turns;
  }

  getFarTurns() {
    return this._turns.filter((turn) => turn.isFarTurn());
  }

  getOriginalBigJunction() {
    return this._originalBigJunction;
  }
}

import { DataModel } from '@/@waze/Waze/DataModels/DataModel';

export class Action<P = any> {
  protected shouldSerialize: boolean;
  protected actionName: string;

  private _timestamp: number;
  private _description: string;
  private _actionId: number;

  constructor(props?: P);
  getID(): number;
  isLeaf(): boolean;
  accept(dataModel: any): void;
  doAction(dataModel: any): boolean;
  undoSupported(): boolean;
  flat(): Action<P>[];
  getBounds(): null;
  getAffectedUniqueIds(dataModel: any): number[];
  getFocusFeatures(dataModel: any): DataModel;
  getTimestamp(): number;
  generateDescription(dataModel: any): void;
  getDescription(): string;
  isSerializable(): boolean;
  getActionName(): string;
}
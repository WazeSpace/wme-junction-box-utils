import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { Vertex } from '@/@waze/Waze/Vertex';

export class UnresolvableRoundaboutTurns extends Error {
  private _dataModel: any;
  private _vertex: Vertex;
  private _reason: string;

  static _messageFactory(vertex: Vertex, reason?: string) {
    const header = `Unable to get available roundabuot turns for vertex ${vertex.getID()}`;
    if (!reason) return header;

    return `${header}. ${reason}`;
  }

  constructor(vertex: Vertex, dataModel: any, reason?: string) {
    super(UnresolvableRoundaboutTurns._messageFactory(vertex, reason));

    this._dataModel;
    this._vertex = vertex;
    this._reason = reason;
  }

  get segment(): SegmentDataModel {
    return this._dataModel.segments.getById(this._vertex.getSegmentID());
  }

  get direction(): 'forward' | 'reverse' {
    switch (this._vertex.direction) {
      case 'fwd':
        return 'forward';
      case 'rev':
        return 'reverse';
      default:
        throw new Error('Unsupported direction: ' + this._vertex.direction);
    }
  }

  get vertex() {
    return this._vertex;
  }
}

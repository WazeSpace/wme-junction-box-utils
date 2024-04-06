import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { compareArrays } from '@/utils/array-utils';
import {
  getEntranceSegmentsByBigJunction,
  getExitSegmentsByBigJunction,
} from '@/utils/wme-entities/big-junction';

export class BigJunctionSignature {
  private _entranceSegments: SegmentDataModel[];
  private _exitSegments: SegmentDataModel[];
  private _containedSegments: SegmentDataModel[];

  constructor(
    entranceSegments: SegmentDataModel[],
    exitSegments: SegmentDataModel[],
    containedSegments: SegmentDataModel[],
  ) {
    this._entranceSegments = entranceSegments;
    this._exitSegments = exitSegments;
    this._containedSegments = containedSegments;
  }

  static fromBigJunction(
    bigJunction: BigJunctionDataModel,
  ): BigJunctionSignature {
    const entranceSegments = getEntranceSegmentsByBigJunction(bigJunction);
    const exitSegments = getExitSegmentsByBigJunction(bigJunction);
    const innerSegments = bigJunction.getShortSegments(bigJunction.model);
    return new BigJunctionSignature(
      entranceSegments,
      exitSegments,
      innerSegments,
    );
  }

  compareTo(signature: BigJunctionSignature): boolean {
    return (
      this.compareEntranceSegmentsTo(signature) &&
      this.compareExitSegmentsTo(signature) &&
      this.compareContainedSegmentsTo(signature)
    );
  }
  compareEntranceSegmentsTo(signature: BigJunctionSignature): boolean {
    return compareArrays(
      this._entranceSegments,
      signature._entranceSegments,
      (segment) => segment.getAttribute('id'),
    );
  }
  compareExitSegmentsTo(signature: BigJunctionSignature): boolean {
    return compareArrays(
      this._exitSegments,
      signature._exitSegments,
      (segment) => segment.getAttribute('id'),
    );
  }
  compareContainedSegmentsTo(signature: BigJunctionSignature): boolean {
    return compareArrays(
      this._containedSegments,
      signature._containedSegments,
      (segment) => segment.getAttribute('id'),
    );
  }

  getEntranceSegments(): ReadonlyArray<SegmentDataModel> {
    return this._entranceSegments;
  }

  getExitSegments(): ReadonlyArray<SegmentDataModel> {
    return this._exitSegments;
  }

  getContainedSegments(): ReadonlyArray<SegmentDataModel> {
    return this._containedSegments;
  }
}

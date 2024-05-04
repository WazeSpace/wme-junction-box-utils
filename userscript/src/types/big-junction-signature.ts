import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { compareArrays } from '@/utils/array-utils';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import {
  createIdChangelist,
  findTargetIdByIdChangelist,
} from '@/utils/split-merge-objects';
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

  upgradeSignatureSegmentsLineage(): BigJunctionSignature {
    const segmentsLineage = createIdChangelist(
      getWazeMapEditorWindow().W.model.segments.getObjectArray() as SegmentDataModel[],
      (segment) => segment.getAttribute('id'),
      (segment) => segment.getAttribute('origIDs'),
    );

    const updateOldSegmentsReferenceList = (segmentIds: number[]) => {
      return segmentIds.flatMap((segmentId) =>
        findTargetIdByIdChangelist(segmentId, segmentsLineage),
      );
    };

    const upgradedContainedSegments = this._containedSegments
      .flatMap((segment) => {
        const segmentId = segment.getAttribute('id');
        const newSegmentIds = updateOldSegmentsReferenceList([segmentId]);
        return getWazeMapEditorWindow().W.model.segments.getByIds(
          newSegmentIds,
        );
      })
      .filter((item, pos, arr) => pos === 0 || arr.indexOf(item) === pos);

    return new BigJunctionSignature(
      this._entranceSegments,
      this._exitSegments,
      upgradedContainedSegments,
    );
  }
}

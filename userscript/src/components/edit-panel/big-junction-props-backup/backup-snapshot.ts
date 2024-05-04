import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { Turn } from '@/@waze/Waze/Model/turn';
import { BigJunctionSignature } from '@/types/big-junction-signature';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import {
  createIdChangelist,
  findTargetIdByIdChangelist,
} from '@/utils/split-merge-objects';
import { createVertexFromSegment } from '@/utils/wme-entities/segment-vertex';

export interface BigJunctionBackupSnapshotAddress {
  city?: string;
  state?: string;
  country: string;
}
export interface BigJunctionBackupSnapshot {
  address: BigJunctionBackupSnapshotAddress;
  name?: string;
  turns: Turn[];
  signature: BigJunctionSignature;
  isRestored: boolean;
  createdFrom: BigJunctionDataModel;
}

export function createBackupSnapshotFromBigJunction(
  bigJunction: BigJunctionDataModel,
): BigJunctionBackupSnapshot {
  const address = bigJunction.getAddress(bigJunction.model);

  const bjSignature = BigJunctionSignature.fromBigJunction(bigJunction);

  return {
    address: {
      city: address.getCity().isEmpty() ? null : address.getCityName(),
      state: address.hasState() ? address.getStateName() : null,
      country: address.getCountryName(),
    },
    name: bigJunction.getAttribute('name'),
    turns: bjSignature.getEntranceSegments().flatMap((entranceSegment) => {
      const entranceDirection = entranceSegment
        .getAttribute('toCrossroads')
        .includes(bigJunction.getAttribute('id'))
        ? 'forward'
        : 'reverse';
      return bigJunction.getTurnsFrom(
        bigJunction.model,
        createVertexFromSegment(entranceSegment, entranceDirection),
      );
    }),
    signature: bjSignature,
    isRestored: false,
    createdFrom: bigJunction,
  };
}

export function updateSnapshotWithSegmentLineage(
  snapshot: BigJunctionBackupSnapshot,
): BigJunctionBackupSnapshot {
  // create segments lineage list
  const segmentsLineage = createIdChangelist(
    getWazeMapEditorWindow().W.model.segments.getObjectArray() as SegmentDataModel[],
    (segment) => segment.getAttribute('id'),
    (segment) => segment.getAttribute('origIDs'),
  );

  const updateOldSegmentsReferenceList = (segmentIds: number[]) => {
    return segmentIds
      .flatMap((segmentId) =>
        findTargetIdByIdChangelist(segmentId, segmentsLineage),
      )
      .filter((item, pos, arr) => pos === 0 || item !== arr[pos - 1]);
  };

  // update turn paths with segments lineage
  const turns = snapshot.turns.map((turn) => {
    const turnData = turn.getTurnData();
    if (!turnData.hasSegmentPath()) return turn;
    const originalSegmentPath = turnData.getSegmentPath();
    const updatedSegmentPath =
      updateOldSegmentsReferenceList(originalSegmentPath);

    const updatedTurnData = turnData.withSegmentPath(updatedSegmentPath);
    return turn.withTurnData(updatedTurnData);
  });

  return {
    ...snapshot,
    signature: snapshot.signature.upgradeSignatureSegmentsLineage(),
    turns,
  };
}

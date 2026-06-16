import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import {
  SegmentDataModel,
  SegmentDataModelAttributes,
} from '@/@waze/Waze/DataModels/SegmentDataModel';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

function getBigJunctionFromSegment(
  segment: SegmentDataModel,
  attributeName: keyof SegmentDataModelAttributes,
): BigJunctionDataModel {
  const bigJunctions = segment.getAttribute(attributeName);
  if (
    !bigJunctions ||
    !Array.isArray(bigJunctions) ||
    bigJunctions.length === 0
  ) {
    return null;
  }

  const bigJunctionId = bigJunctions[0];
  if (typeof bigJunctionId !== 'number') return null;

  const bigJunctionRepo = getWazeMapEditorWindow().W.model.getRepository(
    WazeMapEditorEntityType.BigJunction,
  );
  return bigJunctionRepo.getObjectById(bigJunctionId);
}
export function getToBigJunctionFromSegment(segment: SegmentDataModel) {
  return getBigJunctionFromSegment(segment, 'toCrossroads');
}

export function getFromBigJunctionFromSegment(segment: SegmentDataModel) {
  return getBigJunctionFromSegment(segment, 'fromCrossroads');
}

export function getBigJunctionFromSegmentAndDirection(
  segment: SegmentDataModel,
  direction: 'forward' | 'reverse',
) {
  const fn =
    direction === 'forward'
      ? getToBigJunctionFromSegment
      : getFromBigJunctionFromSegment;

  return fn(segment);
}

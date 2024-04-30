import { JunctionDataModel } from '@/@waze/Waze/DataModels/JunctionDataModel';
import { JunctionNodeDataModel } from '@/@waze/Waze/DataModels/JunctionNodeDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';

export function getRoundaboutByNode(
  node: JunctionNodeDataModel,
): JunctionDataModel {
  const segIDs = node.getSegmentIds();
  const segments: SegmentDataModel[] = node.model.segments.getByIds(segIDs);
  const roundaboutSegment = segments.find((seg) => seg.isInRoundabout());
  const roundaboutId = roundaboutSegment.getAttribute('junctionID');
  return roundaboutSegment.model.junctions.getObjectById(roundaboutId);
}

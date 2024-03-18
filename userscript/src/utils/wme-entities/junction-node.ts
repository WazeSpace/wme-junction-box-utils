import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { JunctionNodeDataModel } from '@/@waze/Waze/DataModels/JunctionNodeDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';

export function isJunctionNodePartOfRoundabout(node: JunctionNodeDataModel) {
  const segmentIds = node.getSegmentIds();
  const segmentRepository = node.model.getRepository(
    WazeMapEditorEntityType.Segment,
  );
  const segments: SegmentDataModel[] = segmentRepository.getByIds(segmentIds);
  return segments.some((segment) => segment.isInRoundabout());
}

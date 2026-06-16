import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { JunctionNodeDataModel } from '@/@waze/Waze/DataModels/JunctionNodeDataModel';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';

export function isJunctionNodePartOfRoundabout(node: JunctionNodeDataModel) {
  const segmentIds = node.getSegmentIds();
  const segmentRepository = getWazeMapEditorWindow().W.model.getRepository(
    WazeMapEditorEntityType.Segment,
  );
  const segments: SegmentDataModel[] = segmentRepository.getByIds(segmentIds);
  return segments.some((segment) => segment.isInRoundabout());
}

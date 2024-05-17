import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { Turn } from '@/@waze/Waze/Model/turn';
import { Vertex } from '@/@waze/Waze/Vertex';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import {
  WzCaption,
  WzCard,
  WzLabel,
  WzList,
} from '@wazespace/wme-react-components';
import { TurnListViewEntry } from './TurnListViewEntry';
import { TurnsRenderer } from '@/classes';

function getSegmentByVertex(segmentVertex: Vertex): SegmentDataModel {
  const dataModel = getWazeMapEditorWindow().W.model;
  const segmentId = segmentVertex.getSegmentID();
  const segment: SegmentDataModel = dataModel.segments.getObjectById(segmentId);
  if (!segment) throw new Error('Could not find segment in dataModel');
  return segment;
}

function getStreetNameBySegment(segment: SegmentDataModel): string {
  const address = segment.getAddress();
  if (!address) return '';
  return address.getStreetName();
}

function getStreetNameByVertex(segmentVertex: Vertex): string {
  const segment = getSegmentByVertex(segmentVertex);
  return getStreetNameBySegment(segment);
}

interface TurnsListViewProps {
  title: string;
  description?: string;
  turns: Turn[];
  showFromStreet?: boolean;
  turnsHighlightRenderer: TurnsRenderer;
}
export function TurnsListView({
  title,
  description,
  turns,
  showFromStreet = false,
  turnsHighlightRenderer,
}: TurnsListViewProps) {
  const onEntryMouseOver = (turn: Turn) => {
    turnsHighlightRenderer.highlightTurn(turn);
  };
  const onEntryMouseOut = () => {
    turnsHighlightRenderer.clearHighlightedTurns();
  };

  return (
    <div className="far-turn-list-view">
      <WzLabel>{title}</WzLabel>
      {description && <WzCaption>{description}</WzCaption>}
      <WzCard>
        <WzList>
          {turns.map((turn) => (
            <TurnListViewEntry
              key={turn.getID()}
              isTurnAllowed={turn.getTurnData().isAllowed()}
              fromStreetName={getStreetNameByVertex(turn.getFromVertex())}
              toStreetName={getStreetNameByVertex(turn.getToVertex())}
              showFromStreet={showFromStreet}
              onMouseOver={() => onEntryMouseOver(turn)}
              onMouseOut={() => onEntryMouseOut()}
            />
          ))}
        </WzList>
      </WzCard>
    </div>
  );
}

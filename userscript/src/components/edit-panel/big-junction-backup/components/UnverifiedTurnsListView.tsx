import { useRestoreContext } from '../contexts';
import { TurnsListView } from './TurnsListView';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { useMemo } from 'react';
import { TurnsRenderer } from '@/classes';

export function UnverifiedTurnsListView() {
  const { unverifiedTurns } = useRestoreContext();
  const map = getWazeMapEditorWindow().W.map;
  const dataModel = getWazeMapEditorWindow().W.model;
  const turnsHighlightLayer = map.farTurnPathHighlightLayer;
  const turnsHighlightRenderer = useMemo(() => {
    return new TurnsRenderer(dataModel, map, turnsHighlightLayer);
  }, [dataModel, map, turnsHighlightLayer]);

  if (!unverifiedTurns.length) return null;

  return (
    <TurnsListView
      title="Unverified turns"
      description="These turns couldn't be restored and must be manually validated"
      turns={unverifiedTurns}
      showFromStreet
      turnsHighlightRenderer={turnsHighlightRenderer}
    />
  );
}

import { useRestoreContext } from '../contexts';
import { TurnsListView } from './TurnsListView';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { useMemo } from 'react';
import { TurnsRenderer } from '@/classes';
import { useTranslate } from '@/hooks';

export function UnverifiedTurnsListView() {
  const t = useTranslate(
    'jb_utils.big_junction.backup_restore.unverified_turns',
  );
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
      title={t('title')}
      description={t('description')}
      turns={unverifiedTurns}
      showFromStreet
      turnsHighlightRenderer={turnsHighlightRenderer}
    />
  );
}

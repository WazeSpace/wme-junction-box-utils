import { usePreference } from '@/hooks';
import { useNewActionHandler } from '../hooks';
import { isAddBigJunctionAction } from '@/@waze/Waze/actions';
import { BigJunctionBackupTemplate } from '@/components/edit-panel/big-junction-backup';
import { compareJunctionToBackup, restoreBigJunctionBackup } from '@/components/edit-panel/big-junction-backup/utils';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { gtag } from '@/google-analytics';
import { createChangedIds } from '@/utils';
import { AUTOMATICALLY_RESTORED_SYMBOL } from '@/components/edit-panel/big-junction-backup/constants/meta-symbols';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { Logger } from '@/logger';

export function AutoRestoreBigJunction() {
  const [isEnabled] = usePreference('auto_backup');

  useNewActionHandler(
    (action) => {
      // this action handler should only run for new big junctions
      if (!isAddBigJunctionAction(action)) return;

      // if the user decided to disable the preference altogether
      if (!isEnabled) return;

      // assert we have a backup available
      const backup = BigJunctionBackupTemplate.backup;
      if (!backup) return;

      // ensure we are working on the same big junction
      if (!compareJunctionToBackup(action.bigJunction, backup)) return;

      const segmentChangedIds = createChangedIds(
        getWazeMapEditorWindow().W.model.segments.getObjectArray() as SegmentDataModel[],
        (segment) => segment.getAttribute('id'),
        (segment) => segment.getAttribute('origIDs'),
        (ids) => ids.join(','),
      );

      (async () => {
        try {
          await restoreBigJunctionBackup(
            action.bigJunction,
            backup,
            segmentChangedIds,
          );
          Reflect.defineMetadata(
            AUTOMATICALLY_RESTORED_SYMBOL,
            true,
            action.bigJunction,
          );
          gtag('event', 'restore_backup', {
            event_category: 'big_junction_backup',
            method: 'auto',
          });
        } catch (error) {
          Logger.error('Failed to auto-restore big junction:', error);
        }
      })();
    },
    [isEnabled],
  );

  return null;
}

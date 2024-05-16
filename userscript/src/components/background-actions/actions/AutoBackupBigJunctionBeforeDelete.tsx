import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { Action, isDeleteBigJunctionAction } from '@/@waze/Waze/actions';
import { ConfirmMapBalloon } from '@/components/ConfirmMapBalloon';
import {
  BigJunctionBackup,
  BigJunctionBackupTemplate,
} from '@/components/edit-panel/big-junction-backup';
import { usePreference, useTranslate } from '@/hooks';
import { Logger } from '@/logger';
import { ManualMethodInvocationInterceptor } from '@/method-interceptor';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { useEffect, useMemo, useState } from 'react';
import { useEventCallback } from 'usehooks-ts';

export function AutoBackupBigJunctionBeforeDelete() {
  const t = useTranslate();
  const [autoBackupPrefState] = usePreference('auto_backup');
  const [confirmBalloonCallback, setConfirmBalloonCallback] = useState<{
    attributes: {
      bigJunction: BigJunctionDataModel;
    };
    resolve(): void;
    reject(): void;
  }>(null);

  const backupBigJunction = (bigJunction: BigJunctionDataModel) => {
    const backup = BigJunctionBackup.fromBigJunction(bigJunction);
    BigJunctionBackupTemplate.backup = backup;
    Logger.info('Big Junction snapshot has been created and saved');
  };

  const onBeforeActionAdded = useEventCallback(
    (addAction: (action: Action) => void, action: Action) => {
      if (!autoBackupPrefState) return addAction(action);
      if (!isDeleteBigJunctionAction(action)) return addAction(action);

      Logger.info('Automatic big junction backup script running...');

      const storedSnapshot = BigJunctionBackupTemplate.backup;
      const snapshotSignatureMatch =
        storedSnapshot &&
        storedSnapshot.getOriginalBigJunction()?.getAttribute('id') ===
          action.bigJunction.getAttribute('id');

      if (!storedSnapshot) {
        Logger.info('Has no snapshot stored, backing up...');
        backupBigJunction(action.bigJunction);
        addAction(action);
      } else if (snapshotSignatureMatch) {
        Logger.info('Big Junction and Snapshot signatures matches, skipping');
        addAction(action);
      } else {
        Logger.info('Asking the user to override the snapshot');
        new Promise<void>((resolve, reject) => {
          setConfirmBalloonCallback({
            attributes: { bigJunction: action.bigJunction },
            resolve,
            reject,
          });
        })
          .then(() => {
            Logger.info('User confirmed, overriding');
            backupBigJunction(action.bigJunction);
          })
          .catch(() => {
            Logger.info('User rejected, adding action w/o backup');
          })
          .finally(() => {
            addAction(action);
            setConfirmBalloonCallback(null);
          });
      }
    },
  );

  const beforeActionAddedInterceptor = useMemo(
    () =>
      new ManualMethodInvocationInterceptor(
        getWazeMapEditorWindow().W.model.actionManager,
        'add',
        onBeforeActionAdded,
      ),
    [onBeforeActionAdded],
  );

  useEffect(() => {
    beforeActionAddedInterceptor.enable();
    return () => beforeActionAddedInterceptor.disable();
  }, [beforeActionAddedInterceptor]);

  if (!confirmBalloonCallback) return null;
  return (
    <ConfirmMapBalloon
      alarming
      disableDontShowAgainCheckbox
      mapEntity={confirmBalloonCallback.attributes.bigJunction}
      title={t(
        'jb_utils.big_junction.backup_restore.confirm_overwrite_backup.title',
      )}
      details={t(
        'jb_utils.big_junction.backup_restore.confirm_overwrite_backup.details',
      )}
      confirmButtonText={t(
        'jb_utils.big_junction.backup_restore.confirm_overwrite_backup.backup_btn',
      )}
      cancelButtonText={t(
        'jb_utils.big_junction.backup_restore.confirm_overwrite_backup.ignore_btn',
      )}
      onConfirmClick={confirmBalloonCallback.resolve}
      onCancelClick={confirmBalloonCallback.reject}
    />
  );
}

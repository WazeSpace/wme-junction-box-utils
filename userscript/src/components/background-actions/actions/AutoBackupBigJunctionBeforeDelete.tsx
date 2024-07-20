import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { Action, isDeleteBigJunctionAction } from '@/@waze/Waze/actions';
import { ConfirmMapBalloon } from '@/components/ConfirmMapBalloon';
import {
  BigJunctionBackup,
  BigJunctionBackupTemplate,
} from '@/components/edit-panel/big-junction-backup';
import { gtag } from '@/google-analytics';
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
    BigJunctionBackupTemplate.storeBackup(backup);
    Logger.info('Big Junction snapshot has been created and saved');
  };

  const onBeforeActionAdded = useEventCallback(
    (addAction: (action: Action) => void, action: Action) => {
      if (!autoBackupPrefState) return addAction(action);
      if (!isDeleteBigJunctionAction(action)) return addAction(action);

      Logger.info('Automatic big junction backup script running...');

      const snapshotSignatureMatch = BigJunctionBackupTemplate.backups.some(
        (snapshot) =>
          snapshot.getOriginalBigJunction()?.getAttribute('id') ===
          action.bigJunction.getAttribute('id'),
      );

      if (BigJunctionBackupTemplate.canStoreMoreBackups()) {
        Logger.info('Has free snapshot slot, backing up...');
        gtag('event', 'auto_backup', { event_category: 'big_junction_backup' });
        backupBigJunction(action.bigJunction);
        addAction(action);
      } else if (snapshotSignatureMatch) {
        Logger.info('Big Junction and Snapshot signatures matches, skipping');
        addAction(action);
      } else {
        Logger.info('Asking the user to override the oldest snapshot');
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
            gtag('event', 'auto_backup', {
              event_category: 'big_junction_backup',
              user_confirmed: true,
            });
          })
          .catch(() => {
            Logger.info('User rejected, adding action w/o backup');
            gtag('event', 'auto_backup_rejected', {
              event_category: 'big_junction_backup',
              user_confirmed: true,
            });
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
        'jb_utils.big_junction.backup_restore.confirm_overwrite_backup.title_oldest',
      )}
      details={t(
        'jb_utils.big_junction.backup_restore.confirm_overwrite_backup.details_oldest',
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

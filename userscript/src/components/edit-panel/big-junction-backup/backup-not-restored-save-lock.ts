import { SaveLock } from '@/utils/save-lock';
import { WAS_RESTORED_METADATA_SYMBOL } from './constants/meta-symbols';
import { BigJunctionBackup } from './models';
import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { BigJunctionBackupTemplate } from './template';

let isSaveLockSet: boolean = false;

function isBackupRestored(backup: BigJunctionBackup): boolean {
  return Reflect.getMetadata(WAS_RESTORED_METADATA_SYMBOL, backup);
}

function isBackupBigJunctionDeleted(backup: BigJunctionBackup): boolean {
  const originalBigJunction = backup.getOriginalBigJunction();
  if (!originalBigJunction) return false;

  const originalBigJunctionId = originalBigJunction.getAttribute('id');
  const activeDataModel = getWazeMapEditorWindow().W.model;

  return (
    originalBigJunction.state === 'DELETE' &&
    activeDataModel.bigJunctions.getObjectById(originalBigJunctionId)
  );
}

function setSaveLock() {
  if (isSaveLockSet) return;

  SaveLock.addSoftLock(
    {
      code: 'jbu101',
    },
    () => {
      const backup = BigJunctionBackupTemplate.backup;
      return (
        backup &&
        !isBackupRestored(backup) &&
        isBackupBigJunctionDeleted(backup)
      );
    },
  );
  isSaveLockSet = true;
}

export const backupNotRestoredSaveLock = {
  set: () => setSaveLock(),
};

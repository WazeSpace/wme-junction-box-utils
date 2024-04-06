import { SaveLock } from '@/utils/save-lock';
import { BigJunctionBackupSnapshot } from '../backup-snapshot';
import { BigJunctionBackupStrategy } from './big-junction-backup-strategy';
import { WAS_RESTORED_METADATA_SYMBOL } from '../consts';

export class InMemoryBigJunctionBackupStrategy
  implements BigJunctionBackupStrategy
{
  _storedSnapshot: BigJunctionBackupSnapshot = null;
  _unrestoredSnapshotSaveLockSet: boolean = false;

  private _setUnrestoredSnapshotSaveLock() {
    if (this._unrestoredSnapshotSaveLockSet) return;

    SaveLock.addSoftLock(
      {
        code: 'jbu101',
      },
      () =>
        this._storedSnapshot.createdFrom?.state === 'DELETE' &&
        !Reflect.getMetadata(
          WAS_RESTORED_METADATA_SYMBOL,
          this._storedSnapshot,
        ),
    );
    this._unrestoredSnapshotSaveLockSet = true;
  }

  canSaveSnapshot(): boolean {
    return true;
  }

  saveSnapshot(snapshot: BigJunctionBackupSnapshot): void {
    this._storedSnapshot = snapshot;
    this._setUnrestoredSnapshotSaveLock();
  }

  getSnapshot(): BigJunctionBackupSnapshot {
    return this._storedSnapshot;
  }
}

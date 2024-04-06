import { BigJunctionBackupSnapshot } from '../backup-snapshot';
import { BigJunctionBackupStrategy } from './big-junction-backup-strategy';

export class InMemoryBigJunctionBackupStrategy
  implements BigJunctionBackupStrategy
{
  static _storedSnapshot: BigJunctionBackupSnapshot = null;

  canSaveSnapshot(): boolean {
    return true;
  }

  saveSnapshot(snapshot: BigJunctionBackupSnapshot): void {
    InMemoryBigJunctionBackupStrategy._storedSnapshot = snapshot;
  }

  getSnapshot(): BigJunctionBackupSnapshot {
    return InMemoryBigJunctionBackupStrategy._storedSnapshot;
  }
}

import { BigJunctionBackupSnapshot } from '@/components/edit-panel/big-junction-props-backup/backup-snapshot';

export interface BigJunctionBackupStrategy {
  canSaveSnapshot(snapshot: BigJunctionBackupSnapshot): boolean;
  saveSnapshot(snapshot: BigJunctionBackupSnapshot): void;
  getSnapshot(): BigJunctionBackupSnapshot;
}

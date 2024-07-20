import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { compareJunctionToBackup } from '@/components/edit-panel/big-junction-backup/utils';
import { EditPanelTemplate } from '@/components/edit-panel/edit-panel-template';
import { ReactNode } from 'react';
import { BackupContextProvider, RestoreContextProvider } from './contexts';
import { EnrollBackupButton, RestoreBackupButton } from './components';
import {
  BigJunctionActionsPortal,
  NewBigJunctionFormGroupPortal,
} from './portals';
import { BigJunctionBackup } from './models';
import { backupNotRestoredSaveLock } from './backup-not-restored-save-lock';
import { UnverifiedTurnsListView } from './components/UnverifiedTurnsListView';

export const BigJunctionBackupTemplate = class implements EditPanelTemplate {
  static backups: BigJunctionBackup[] = [];
  static MAX_BACKUPS = 10;

  subjectBigJunction: BigJunctionDataModel;

  constructor(bigJunctions: BigJunctionDataModel[]) {
    backupNotRestoredSaveLock.set();
    this.subjectBigJunction = bigJunctions[0];
  }

  static getSupportedElementTypes(): WazeMapEditorEntityType[] {
    return [WazeMapEditorEntityType.BigJunction];
  }

  static isEnabledForElements(): boolean {
    return true;
  }

  static canStoreMoreBackups() {
    return this.backups.length < this.MAX_BACKUPS;
  }

  static storeBackup(backup: BigJunctionBackup) {
    if (!this.canStoreMoreBackups()) this.backups.shift();
    this.backups.push(backup);
  }

  static getBackupForBigJunction(
    bigJunction: BigJunctionDataModel,
  ): BigJunctionBackup {
    return this.backups.findLast((backup) =>
      compareJunctionToBackup(bigJunction, backup),
    );
  }

  getTargetElement(): HTMLElement {
    return document.createElement('div');
  }

  render(): ReactNode {
    return (
      <BackupContextProvider
        initialBackup={BigJunctionBackupTemplate.getBackupForBigJunction(
          this.subjectBigJunction,
        )}
        onBackupChanged={(backup) =>
          BigJunctionBackupTemplate.storeBackup(backup)
        }
      >
        <RestoreContextProvider>
          <NewBigJunctionFormGroupPortal>
            <UnverifiedTurnsListView />
          </NewBigJunctionFormGroupPortal>
          <BigJunctionActionsPortal>
            <EnrollBackupButton />
            <RestoreBackupButton />
          </BigJunctionActionsPortal>
        </RestoreContextProvider>
      </BackupContextProvider>
    );
  }
};

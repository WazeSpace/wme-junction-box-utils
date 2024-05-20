import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
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
  static backup: BigJunctionBackup = null;

  constructor() {
    backupNotRestoredSaveLock.set();
  }

  static getSupportedElementTypes(): WazeMapEditorEntityType[] {
    return [WazeMapEditorEntityType.BigJunction];
  }

  static isEnabledForElements(): boolean {
    return true;
  }

  getTargetElement(): HTMLElement {
    return document.createElement('div');
  }

  render(): ReactNode {
    return (
      <BackupContextProvider
        initialBackup={BigJunctionBackupTemplate.backup}
        onBackupChanged={(backup) =>
          (BigJunctionBackupTemplate.backup = backup)
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

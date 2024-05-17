import { WazeMapEditorEntityType } from '@/@waze/Waze/consts';
import { EditPanelTemplate } from '@/components/edit-panel/edit-panel-template';
import { ReactNode, createElement } from 'react';
import {
  BackupContextProvider,
  RestoreContextProvider,
  useRestoreContext,
} from './contexts';
import { EnrollBackupButton, RestoreBackupButton } from './components';
import {
  BigJunctionActionsPortal,
  BigJunctionAlertsPortal,
  NewBigJunctionFormGroupPortal,
} from './portals';
import { BigJunctionBackup } from './models';
import { backupNotRestoredSaveLock } from './backup-not-restored-save-lock';
import { WzAlert } from '@wazespace/wme-react-components';
import { useTranslate } from '@/hooks';
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
          <BigJunctionAlertsPortal>
            {createElement(() => {
              const { isBackupRestored, hasJunctionNewTurns } =
                useRestoreContext();
              const t = useTranslate();

              if (!isBackupRestored || !hasJunctionNewTurns) return null;
              return (
                <WzAlert level="page" variant="warning">
                  {t(
                    'jb_utils.big_junction.backup_restore.mistmatch_signature_snapshot_restored_alert',
                  )}
                </WzAlert>
              );
            })}
          </BigJunctionAlertsPortal>
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

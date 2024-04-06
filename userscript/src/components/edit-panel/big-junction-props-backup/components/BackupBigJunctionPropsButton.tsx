import { BigJunctionEditPanelButton } from '@/components/edit-panel/BigJunctionEditPanelButton';
import { useTranslate } from '@/hooks';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { useBigJunctionBackupContext } from '../contexts';
import { createBackupSnapshotFromBigJunction } from '../backup-snapshot';

interface BackupBigJunctionPropsButton {
  bigJunction: BigJunctionDataModel;
}
export function BackupBigJunctionPropsButton(
  props: BackupBigJunctionPropsButton,
) {
  const t = useTranslate();
  const backupStrategy = useBigJunctionBackupContext();
  const hasBackup = backupStrategy.get() !== null;
  const shouldAskForUserConfirmation = hasBackup;

  const handleButtonClick = () => {
    if (shouldAskForUserConfirmation && !confirm('Confirm?')) return;

    const backup = createBackupSnapshotFromBigJunction(props.bigJunction);
    backupStrategy.set(backup);
  };

  return (
    <BigJunctionEditPanelButton onClick={handleButtonClick}>
      {t('jb_utils.big_junction.actions.backup_props')}
    </BigJunctionEditPanelButton>
  );
}

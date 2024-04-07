import { BigJunctionEditPanelButton } from '@/components/edit-panel/BigJunctionEditPanelButton';
import { useTranslate } from '@/hooks';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { useBigJunctionBackupContext } from '../contexts';
import { createBackupSnapshotFromBigJunction } from '../backup-snapshot';
import { useRef, useState } from 'react';
import { ConfirmBalloon } from '@/components/ConfirmBalloon';
import { TippyModal } from '@/components/tippy';

interface BackupBigJunctionPropsButtonProps {
  bigJunction: BigJunctionDataModel;
}
export function BackupBigJunctionPropsButton(
  props: BackupBigJunctionPropsButtonProps,
) {
  const buttonRef = useRef<HTMLButtonElement>();
  const t = useTranslate();
  const backupStrategy = useBigJunctionBackupContext();
  const [overrideConfirmationShown, setOverrideConfirmationShown] =
    useState(false);

  const hasBackup = backupStrategy.get() !== null;
  const shouldAskForUserConfirmation = hasBackup;

  const backupCurrentBigJunction = () => {
    const backup = createBackupSnapshotFromBigJunction(props.bigJunction);
    backupStrategy.set(backup);
    setOverrideConfirmationShown(false);
  };

  const handleButtonClick = () => {
    if (shouldAskForUserConfirmation) {
      setOverrideConfirmationShown(true);
      return;
    }

    backupCurrentBigJunction();
  };

  return (
    <>
      <BigJunctionEditPanelButton onClick={handleButtonClick} ref={buttonRef}>
        {t('jb_utils.big_junction.actions.backup_props')}
      </BigJunctionEditPanelButton>
      {overrideConfirmationShown && (
        <ConfirmBalloon
          TippyComponent={TippyModal}
          tippyProps={{
            getReferenceClientRect: () =>
              buttonRef.current.getBoundingClientRect(),
            theme: 'light-border',
          }}
          alarming
          disableDontShowAgainCheckbox
          title={t(
            'jb_utils.big_junction.backup_restore.confirm_overwrite_backup.title',
          )}
          details={t(
            'jb_utils.big_junction.backup_restore.confirm_overwrite_backup.details',
          )}
          onConfirmClick={backupCurrentBigJunction}
          onCancelClick={() => setOverrideConfirmationShown(false)}
        />
      )}
    </>
  );
}

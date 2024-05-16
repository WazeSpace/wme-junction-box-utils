import { useSelectedDataModelsContext } from '@/contexts/SelectedDataModelsContext';
import { BigJunctionEditPanelButton } from '../../BigJunctionEditPanelButton';
import { useBackupContext } from '../contexts';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { BigJunctionBackup } from '../models';
import { useTranslate } from '@/hooks';
import { MouseEventHandler, useRef, useState } from 'react';
import { ConfirmBalloon } from '@/components/ConfirmBalloon';
import { TippyModal } from '@/components/tippy';

export function EntrollBackupButton() {
  const buttonRef = useRef<HTMLButtonElement>();
  const { isBackupAvailable, setBackup } = useBackupContext();
  const [bigJunction] = useSelectedDataModelsContext<BigJunctionDataModel>();
  const [showOverrideConfirmation, setShowOverrideConfirmation] =
    useState(false);
  const t = useTranslate();

  const backupBigJunction = () => {
    const backup = BigJunctionBackup.fromBigJunction(bigJunction);
    setBackup(backup);
  };

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur();
    if (isBackupAvailable) {
      setShowOverrideConfirmation(true);
      return;
    }

    backupBigJunction();
  };

  return (
    <>
      <BigJunctionEditPanelButton onClick={handleButtonClick} ref={buttonRef}>
        {t('jb_utils.big_junction.actions.backup_props')}
      </BigJunctionEditPanelButton>
      {showOverrideConfirmation && (
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
          onConfirmClick={() => {
            backupBigJunction();
            setShowOverrideConfirmation(false);
          }}
          onCancelClick={() => setShowOverrideConfirmation(false)}
        />
      )}
    </>
  );
}

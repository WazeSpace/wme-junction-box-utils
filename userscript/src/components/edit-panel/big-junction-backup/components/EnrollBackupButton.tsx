import { useSelectedDataModelsContext } from '@/contexts/SelectedDataModelsContext';
import { BigJunctionEditPanelButton } from '../../BigJunctionEditPanelButton';
import { useBackupContext } from '../contexts';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { BigJunctionBackup } from '../models';
import { useTranslate } from '@/hooks';
import { MouseEventHandler, useRef, useState } from 'react';
import { ConfirmBalloon } from '@/components/ConfirmBalloon';
import { TippyModal } from '@/components/tippy';
import { gtag } from '@/google-analytics';

export function EnrollBackupButton() {
  const buttonRef = useRef<HTMLButtonElement>();
  const { canStoreMoreBackups, setBackup } = useBackupContext();
  const [bigJunction] = useSelectedDataModelsContext<BigJunctionDataModel>();
  const [showOverrideConfirmation, setShowOverrideConfirmation] =
    useState(false);
  const t = useTranslate();

  const backupBigJunction = () => {
    const backup = BigJunctionBackup.fromBigJunction(bigJunction);
    setBackup(backup);
    gtag('event', 'create_backup', { event_category: 'big_junction_backup' , method: 'manual'});
  };

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur();
    gtag('event', 'click_create_backup', { event_category: 'big_junction_backup' });
    if (!canStoreMoreBackups()) {
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
            'jb_utils.big_junction.backup_restore.confirm_overwrite_backup.title_oldest',
          )}
          details={t(
            'jb_utils.big_junction.backup_restore.confirm_overwrite_backup.details_oldest',
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

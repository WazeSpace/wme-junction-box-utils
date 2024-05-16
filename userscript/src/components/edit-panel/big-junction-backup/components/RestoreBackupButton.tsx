import { BigJunctionEditPanelButton } from '../../BigJunctionEditPanelButton';
import { useTranslate } from '@/hooks';
import { useBackupContext, useRestoreContext } from '../contexts';
import { MouseEventHandler } from 'react';
import { useSelectedDataModelsContext } from '@/contexts/SelectedDataModelsContext';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import {
  isAllowedToEditBigJunction,
  isAllowedToEditBigJunctionTurnGuidance,
} from '../utils';
import { Logger } from '@/logger';
import { ConditionalTooltip } from '@/components/ConditionalTooltip';

export function RestoreBackupButton() {
  const t = useTranslate();
  const { isBackupAvailable } = useBackupContext();
  const restoreContext = useRestoreContext();
  const [targetBigJunction] =
    useSelectedDataModelsContext<BigJunctionDataModel>();

  const allowRestoration = (() => {
    if (!isBackupAvailable) return { allowed: false };

    if (!restoreContext.isSameJunction)
      return { allowed: false, messageKey: 'BIG_JUNCTION_MISMATCH' };

    if (!isAllowedToEditBigJunction(targetBigJunction))
      return { allowed: false, messageKey: 'BIG_JUNCTION_EDITING_DISALLOWED' };

    if (!isAllowedToEditBigJunctionTurnGuidance(targetBigJunction))
      return { allowed: false, messageKey: 'TURN_GUIDANCE_EDITING_DISALLOWED' };

    return { allowed: true };
  })();

  if (!allowRestoration.allowed) {
    Logger.log(
      'Big Junction restoration is forbidden: ',
      allowRestoration.messageKey,
    );
  }

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur();
    restoreContext.restore();
  };

  return (
    <ConditionalTooltip
      show={!allowRestoration.allowed && !!allowRestoration.messageKey}
      tooltipContent={t(
        `jb_utils.big_junction.backup_restore.restoration_disabled_reasons.${allowRestoration?.messageKey}`,
      )}
    >
      <BigJunctionEditPanelButton
        disabled={!allowRestoration.allowed}
        onClick={handleButtonClick}
      >
        {t('jb_utils.big_junction.actions.restore_props')}
      </BigJunctionEditPanelButton>
    </ConditionalTooltip>
  );
}

import { BigJunctionEditPanelButton } from '../../BigJunctionEditPanelButton';
import { usePreference, useTranslate } from '@/hooks';
import { useBackupContext, useRestoreContext } from '../contexts';
import { MouseEventHandler, useLayoutEffect, useRef, useState } from 'react';
import { useSelectedDataModelsContext } from '@/contexts/SelectedDataModelsContext';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import {
  isAllowedToEditBigJunction,
  isAllowedToEditBigJunctionTurnGuidance,
} from '../utils';
import { Logger } from '@/logger';
import { ConditionalTooltip } from '@/components/ConditionalTooltip';
import { gtag } from '@/google-analytics';
import { FeatureDiscoverTooltip } from '@/components/FeatureDiscoverTooltip';
import { AUTOMATICALLY_RESTORED_SYMBOL } from '../constants/meta-symbols';

export function RestoreBackupButton() {
  const t = useTranslate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showFeatureDiscover, setShowFeatureDiscover] = useState(false);
  const { isBackupAvailable } = useBackupContext();
  const restoreContext = useRestoreContext();
  const [targetBigJunction] =
    useSelectedDataModelsContext<BigJunctionDataModel>();
  const [autoRestoreDiscovered, setAutoRestoreDiscovered] = usePreference(
    'feat_discovers.auto_restore',
  );

  useLayoutEffect(() => {
    const isAutomaticallyRestored = (bigJunction: BigJunctionDataModel) => {
      return (
        Reflect.getMetadata(AUTOMATICALLY_RESTORED_SYMBOL, bigJunction) === true
      );
    };
    const timeoutId = setTimeout(() => {
      if (autoRestoreDiscovered) return;
      const bigJunction = restoreContext.targetBigJunction;
      if (isAutomaticallyRestored(bigJunction)) {
        setShowFeatureDiscover(true);
      }
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [
    autoRestoreDiscovered,
    restoreContext.targetBigJunction,
    setAutoRestoreDiscovered,
  ]);

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
    gtag('event', 'restore_clicked', { event_category: 'big_junction_backup' });
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
        ref={buttonRef}
      >
        {t('jb_utils.big_junction.actions.restore_props')}
      </BigJunctionEditPanelButton>

      {showFeatureDiscover && (
        <FeatureDiscoverTooltip
          target={buttonRef}
          placement="right-start"
          headline={t(
            'jb_utils.big_jucntion.backup_restore.auto_feat_discover.title',
          )}
          body={t(
            'jb_utils.big_jucntion.backup_restore.auto_feat_discover.body',
          )}
          primaryButtonText={t(
            'jb_utils.big_jucntion.backup_restore.auto_feat_discover.button',
          )}
          onPrimaryButtonClick={() => {
            setShowFeatureDiscover(false);
            setAutoRestoreDiscovered(true);
          }}
        />
      )}
    </ConditionalTooltip>
  );
}

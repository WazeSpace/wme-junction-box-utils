import { BigJunctionEditPanelButton } from '@/components/edit-panel/BigJunctionEditPanelButton';
import { useTranslate } from '@/hooks';
import { useBigJunctionBackupContext } from '../contexts';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { ConditionalTooltip } from '@/components/ConditionalTooltip';
import { useBigJunctionRestorer } from '../hooks';
import { createPortal } from 'react-dom';
import { WzAlert } from '@wazespace/wme-react-components';

interface RestoreBigJunctionPropsButtonProps {
  bigJunction: BigJunctionDataModel;
}
export function RestoreBigJunctionPropsButton(
  props: RestoreBigJunctionPropsButtonProps,
) {
  const t = useTranslate();
  const backupStrategy = useBigJunctionBackupContext();
  const snapshot = backupStrategy.get();
  const restorer = useBigJunctionRestorer(props.bigJunction, snapshot);
  const hasRestoredMistmatchingSig =
    restorer.isRestored && !restorer.isBigJunctionSignatureMatch;

  return (
    <>
      {hasRestoredMistmatchingSig &&
        createPortal(
          <WzAlert level="page" variant="warning">
            {t(
              'jb_utils.big_junction.backup_restore.mistmatch_signature_snapshot_restored_alert',
            )}
          </WzAlert>,
          document
            .getElementById('edit-panel')
            .querySelector('.big-junction .tab-content wz-alerts-group'),
        )}
      <ConditionalTooltip
        show={restorer.available && !!restorer.restorationUnavailableReason}
        tooltipContent={t(
          `jb_utils.big_junction.backup_restore.restoration_disabled_reasons.${restorer?.restorationUnavailableReason}`,
        )}
      >
        <BigJunctionEditPanelButton
          disabled={
            !restorer.available || !!restorer.restorationUnavailableReason
          }
          onClick={() => restorer.restore()}
        >
          {t('jb_utils.big_junction.actions.restore_props')}
        </BigJunctionEditPanelButton>
      </ConditionalTooltip>
    </>
  );
}

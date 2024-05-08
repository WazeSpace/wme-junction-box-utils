import { BigJunctionEditPanelButton } from '@/components/edit-panel/BigJunctionEditPanelButton';
import { useTranslate } from '@/hooks';
import { useBigJunctionBackupContext } from '../contexts';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { ConditionalTooltip } from '@/components/ConditionalTooltip';
import { useBigJunctionRestorer } from '../hooks';

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

  return (
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
  );
}

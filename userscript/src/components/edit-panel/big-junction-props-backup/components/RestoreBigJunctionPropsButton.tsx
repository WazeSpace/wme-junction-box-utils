import { BigJunctionEditPanelButton } from '@/components/edit-panel/BigJunctionEditPanelButton';
import { useTranslate } from '@/hooks';
import { useBigJunctionBackupContext } from '../contexts';
import { useMemo } from 'react';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { BigJunctionRestorer } from '../big-junction-restorer';
import { ConditionalTooltip } from '@/components/ConditionalTooltip';

interface RestoreBigJunctionPropsButtonProps {
  bigJunction: BigJunctionDataModel;
}
export function RestoreBigJunctionPropsButton(
  props: RestoreBigJunctionPropsButtonProps,
) {
  const t = useTranslate();
  const backupStrategy = useBigJunctionBackupContext();
  const snapshot = backupStrategy.get();
  const restorer = useMemo(() => {
    if (!snapshot) return null;
    const bigJunction = props.bigJunction;
    return new BigJunctionRestorer(bigJunction, snapshot, bigJunction.model);
  }, [props.bigJunction, snapshot]);

  return (
    <ConditionalTooltip
      show={restorer && !!restorer.getRestorationUnavailableReason()}
      tooltipContent={t(
        `jb_utils.big_junction.restoration_disabled_reasons.${restorer?.getRestorationUnavailableReason()}`,
      )}
    >
      <BigJunctionEditPanelButton
        disabled={!restorer || !!restorer.getRestorationUnavailableReason()}
        onClick={() => restorer.restore()}
      >
        {t('jb_utils.big_junction.actions.restore_props')}
      </BigJunctionEditPanelButton>
    </ConditionalTooltip>
  );
}

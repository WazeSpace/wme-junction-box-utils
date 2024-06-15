import { useTranslate } from '@/hooks';
import { WzButton } from '@wazespace/wme-react-components';
import { createPortal } from 'react-dom';
import { useLaneGuidanceControl, useFarTurnsControlLabel } from '../hooks';
import { setControlTurnArrows } from '../utils';
import { SyntheticEvent } from 'react';

interface SetTurnArrowsButtonProps {
  lanesDirection: 'fwd' | 'rev';
}
export function SetTurnArrowsButton({
  lanesDirection,
}: SetTurnArrowsButtonProps) {
  const laneGuidanceControl = useLaneGuidanceControl(lanesDirection);
  const controlLabel = useFarTurnsControlLabel(lanesDirection);
  const t = useTranslate('jb_utils.lanes');

  const setTurnArrows = (e: SyntheticEvent) => {
    setControlTurnArrows(laneGuidanceControl);
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.blur();
  };

  if (!controlLabel) return null;
  return createPortal(
    <WzButton
      style={{ verticalAlign: 'middle', marginLeft: 8 }}
      onClick={setTurnArrows}
      size="sm"
      color="secondary"
    >
      <i className="w-icon w-icon-themes" />
      {t('set_turn_arrows')}
    </WzButton>,
    controlLabel,
  );
}

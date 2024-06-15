import { usePreference, useTranslate } from '@/hooks';
import { WzButton } from '@wazespace/wme-react-components';
import { createPortal } from 'react-dom';
import { useLaneGuidanceControl, useFarTurnsControlLabel } from '../hooks';
import { setControlTurnArrows } from '../utils';
import { SyntheticEvent, useEffect, useRef } from 'react';
import { SetTurnArrowsEvent } from '../events';

interface SetTurnArrowsButtonProps {
  lanesDirection: 'fwd' | 'rev';
  onTurnArrowsSetAutomatically?(event: SetTurnArrowsEvent): void;
}
export function SetTurnArrowsButton({
  lanesDirection,
  onTurnArrowsSetAutomatically,
}: SetTurnArrowsButtonProps) {
  const [autoSetTurnArrows] = usePreference(
    'auto_set_roundabuot_lane_guidance_turn_arrows',
  );
  const laneGuidanceControl = useLaneGuidanceControl(lanesDirection);
  const controlLabel = useFarTurnsControlLabel(lanesDirection);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslate('jb_utils.lanes');

  useEffect(() => {
    if (autoSetTurnArrows && controlLabel && buttonRef.current) {
      const event = new SetTurnArrowsEvent({
        associatedButton: buttonRef.current,
      });
      onTurnArrowsSetAutomatically?.(event);
      if (!event.defaultPrevented) setControlTurnArrows(laneGuidanceControl);
    }
  }, [
    autoSetTurnArrows,
    controlLabel,
    laneGuidanceControl,
    onTurnArrowsSetAutomatically,
  ]);

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
      ref={buttonRef}
    >
      <i className="w-icon w-icon-themes" />
      {t('set_turn_arrows')}
    </WzButton>,
    controlLabel,
  );
}

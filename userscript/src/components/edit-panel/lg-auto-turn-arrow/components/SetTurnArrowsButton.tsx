import { usePreference, useTranslate } from '@/hooks';
import { Logger } from '@/logger';
import { WzButton } from '@wazespace/wme-react-components';
import { createPortal } from 'react-dom';
import { useLaneGuidanceControl, useFarTurnsControlLabel } from '../hooks';
import { setControlTurnArrows } from '../utils';
import { SyntheticEvent, useCallback } from 'react';
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
    'auto_set_roundabout_lane_guidance_turn_arrows',
  );
  const laneGuidanceControl = useLaneGuidanceControl(lanesDirection);
  const controlLabel = useFarTurnsControlLabel(lanesDirection);
  const buttonRef = useCallback(
    (button: HTMLButtonElement) => {
      if (autoSetTurnArrows && button && laneGuidanceControl) {
        Logger.log('setting turn arrows');
        const event = new SetTurnArrowsEvent({
          associatedButton: button,
        });
        onTurnArrowsSetAutomatically?.(event);
        if (!event.defaultPrevented) setControlTurnArrows(laneGuidanceControl);
      }
    },
    [autoSetTurnArrows, laneGuidanceControl, onTurnArrowsSetAutomatically],
  );
  const t = useTranslate('jb_utils.lanes');

  const setTurnArrows = (e: SyntheticEvent) => {
    setControlTurnArrows(laneGuidanceControl);
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.blur();
  };

  if (!controlLabel || !laneGuidanceControl) return null;
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

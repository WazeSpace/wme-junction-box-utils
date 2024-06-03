import { useTurnArrowTooltips } from '../../hooks/useTurnArrowTooltips';
import { useMemo } from 'react';

export function useImmediateTurnTooltip() {
  const turnArrowTooltips = useTurnArrowTooltips();
  return useMemo(
    () =>
      turnArrowTooltips.find(
        (turnArrowTooltip) => !turnArrowTooltip.turnArrow.getTurn().isFarTurn(),
      ),
    [turnArrowTooltips],
  );
}

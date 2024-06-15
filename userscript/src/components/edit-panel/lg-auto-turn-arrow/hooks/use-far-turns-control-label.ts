import { useState } from 'react';
import { useMutationObserver } from '@/hooks';
import { useLaneGuidanceControlElement } from './use-lane-guidance-control';
import { isElementNode } from '@/utils/dom-node';

export function useFarTurnsControlLabel(direction: 'fwd' | 'rev'): Element {
  const [lanesControlLabel, setLanesControlLabel] = useState<Element>(null);
  const laneGuidanceControlElement = useLaneGuidanceControlElement(direction);
  useMutationObserver(
    laneGuidanceControlElement,
    ([mutation]) => {
      if (!isElementNode(mutation.target)) return;
      const label = Array.prototype.at.call(
        mutation.target.querySelectorAll('.form-group.turns > label'),
        -1,
      );
      setLanesControlLabel(label);
    },
    { childList: true },
  );

  return lanesControlLabel;
}

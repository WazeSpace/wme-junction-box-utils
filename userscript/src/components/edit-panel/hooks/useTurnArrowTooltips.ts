import { useMutationObserver } from '@/hooks';
import {
  findFiberParentNode,
  getReactFiberNode,
  isReactProviderNode,
} from '@/utils/react-fiber';
import { useReducer } from 'react';

type OpenTurnArrow = { element: HTMLDivElement; turnArrow: any };

export function useTurnArrowTooltips(): ReadonlyArray<OpenTurnArrow> {
  const [openTurnArrows, setOpenTurnArrowContainers] = useReducer(
    (_prevState: OpenTurnArrow[], newTooltipContainers: HTMLDivElement[]) => {
      return newTooltipContainers.map((tooltipContainer): OpenTurnArrow => {
        const fiberNode = getReactFiberNode(tooltipContainer);
        if (!fiberNode) throw new Error('Fiber node not found');
        const turnArrowProviderNode = findFiberParentNode(
          fiberNode,
          (node) =>
            isReactProviderNode(node) &&
            typeof node.memoizedProps.value === 'object' &&
            node.memoizedProps.value.hasOwnProperty('turnArrow'),
        );
        if (!isReactProviderNode(turnArrowProviderNode)) return null;
        const turnArrow = turnArrowProviderNode.memoizedProps.value.turnArrow;
        return { element: tooltipContainer, turnArrow };
      });
    },
    [] as OpenTurnArrow[],
  );
  useMutationObserver(
    document.body,
    () => {
      const turnArrowTooltips = document.body.querySelectorAll<HTMLDivElement>(
        '& > [data-tippy-root] div.turn-arrow-tooltip',
      );
      setOpenTurnArrowContainers(Array.from(turnArrowTooltips));
    },
    { childList: true },
  );

  return openTurnArrows;
}

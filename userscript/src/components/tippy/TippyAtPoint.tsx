import { getWazeMapEditorWindow } from '@/utils/get-wme-window';
import { getClientRectByPoint } from '@/utils/map';
import Tippy from '@tippyjs/react';
import { Point } from '@turf/helpers';
import { ComponentProps, useCallback } from 'react';
import { createTippyDisplayName } from './create-tippy-display-name';
import { TippyModal } from './TippyModal';

interface TippyAtPointProps extends ComponentProps<typeof Tippy> {
  point: Point | (() => Point);
  map?: any;
}

export function TippyAtPoint(props: TippyAtPointProps) {
  const { point, map = getWazeMapEditorWindow().W.map, ...restProps } = props;

  const getRefClientRect = useCallback(() => {
    const mapViewportEl: Element = map.getViewport();
    const mapBoundingRect = mapViewportEl.getBoundingClientRect();
    const rectangle = getClientRectByPoint(
      typeof point === 'function' ? point() : point,
      map,
    );

    return {
      ...rectangle.toJSON(),
      left: rectangle.left + mapBoundingRect.x,
      top: rectangle.top + mapBoundingRect.y,
    };
  }, [map, point]);

  return (
    <TippyModal getReferenceClientRect={getRefClientRect} {...restProps} />
  );
}
TippyAtPoint.displayName = createTippyDisplayName('AtPoint');

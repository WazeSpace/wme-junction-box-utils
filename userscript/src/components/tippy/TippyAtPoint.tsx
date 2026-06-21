import { getClientRectByPoint } from '@/utils/map';
import Tippy from '@tippyjs/react';
import { Point } from '@turf/helpers';
import { ComponentProps, useCallback } from 'react';
import { createTippyDisplayName } from './create-tippy-display-name';
import { TippyModal } from './TippyModal';

interface TippyAtPointProps extends ComponentProps<typeof Tippy> {
  point: Point | (() => Point);
}

export function TippyAtPoint(props: TippyAtPointProps) {
  const { point, ...restProps } = props;

  const getRefClientRect = useCallback(() => {
    return getClientRectByPoint(typeof point === 'function' ? point() : point);
  }, [point]);

  return (
    <TippyModal getReferenceClientRect={getRefClientRect} {...restProps} />
  );
}
TippyAtPoint.displayName = createTippyDisplayName('AtPoint');

import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { Geometry } from '@turf/helpers'
import centerOfMass from '@turf/center-of-mass';
import center from '@turf/center';
import { ComponentProps, useCallback } from 'react';
import { TippyAtPoint } from './TippyAtPoint';
import { createTippyDisplayName } from './create-tippy-display-name';

interface TippyAtMapEntityProps
  extends Omit<ComponentProps<typeof TippyAtPoint>, 'point'> {
  entity: DataModel<DataModelAttributes & { geoJSONGeometry: Geometry }>;
  centerType?: 'normal' | 'mass';
  map?: any;
}

export function TippyAtMapEntity(props: TippyAtMapEntityProps) {
  const { entity, centerType = 'mass', ...restProps } = props;

  const getCenterFn = {
    mass: centerOfMass,
    normal: center,
  }[centerType];

  const getEntityCenterPoint = useCallback(() => {
    const geometry = entity.getAttribute('geoJSONGeometry');
    return getCenterFn(geometry).geometry;
  }, [entity, getCenterFn]);

  return <TippyAtPoint point={getEntityCenterPoint} {...restProps} />;
}
TippyAtMapEntity.displayName = createTippyDisplayName('AtMapEntity');

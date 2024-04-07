import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { Geometry } from '@turf/turf';
import * as turf from '@turf/turf';
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
    mass: turf.centerOfMass,
    normal: turf.center,
  }[centerType];

  const getEntityCenterPoint = useCallback(() => {
    const geometry = entity.getAttribute('geoJSONGeometry');
    return getCenterFn(geometry).geometry;
  }, [entity, getCenterFn]);

  return <TippyAtPoint point={getEntityCenterPoint} {...restProps} />;
}
TippyAtMapEntity.displayName = createTippyDisplayName('AtMapEntity');

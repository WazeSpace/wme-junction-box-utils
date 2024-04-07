import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { Geometry } from '@turf/helpers';
import { TippyAtMapEntity } from './tippy';
import { ConfirmBalloon, ConfirmBalloonProps } from './ConfirmBalloon';

interface ConfirmMapBalloonProps extends ConfirmBalloonProps {
  mapEntity: DataModel<DataModelAttributes & { geoJSONGeometry: Geometry }>;
}
export function ConfirmMapBalloon(props: ConfirmMapBalloonProps) {
  const { mapEntity, ...restProps } = props;

  return (
    <ConfirmBalloon
      TippyComponent={TippyAtMapEntity}
      tippyProps={{
        entity: mapEntity,
      }}
      {...restProps}
    />
  );
}

import { Polygon } from '@turf/helpers';
import { wmeSdk } from '@/utils/wme-sdk';

export function drawBigJunction(polygon: Polygon) {
  wmeSdk.DataModel.BigJunctions.addBigJunction({
    geometry: polygon,
  });
}

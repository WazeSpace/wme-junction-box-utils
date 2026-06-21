import { Point } from '@turf/helpers';
import { WmeSDK } from 'wme-sdk-typings';
import { wmeSdk } from '../wme-sdk';

export function getClientRectByPoint(
  coords: Point,
  sdk: WmeSDK = wmeSdk,
): DOMRect {
  const [lon, lat] = coords.coordinates;
  const pixel = sdk.Map.getPixelFromLonLat({
    lonLat: {
      lat,
      lon,
    },
  });
  return new DOMRect(pixel.x, pixel.y, 1, 1);
}

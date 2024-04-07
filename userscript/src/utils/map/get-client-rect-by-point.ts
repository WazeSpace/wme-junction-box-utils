import { Point } from '@turf/turf';
import { getWazeMapEditorWindow } from '../get-wme-window';

export function getClientRectByPoint(
  coords: Point,
  map = getWazeMapEditorWindow().W.map,
): DOMRect {
  const [lon, lat] = coords.coordinates;
  const pixel = map.getPixelFromLonLat({ lon, lat });
  return new DOMRect(pixel.x, pixel.y, 1, 1);
}

import { Polygon } from '@turf/helpers';
import getBigJunctionDrawCallback from './draw-callback-impl';

function createDrawAttributes(polygon: Polygon) {
  return {
    getGeometry() {
      return polygon;
    },
  };
}

export function drawBigJunction(polygon: Polygon) {
  const drawAttributes = createDrawAttributes(polygon);
  const drawCallback = getBigJunctionDrawCallback();
  drawCallback(drawAttributes);
}

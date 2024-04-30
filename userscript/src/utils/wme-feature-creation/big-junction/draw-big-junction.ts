import { Polygon } from '@turf/helpers';
import { getDrawBigJunctionHandler } from './get-draw-big-junction-handler';

function createDrawAttributes(polygon: Polygon) {
  return {
    getGeometry() {
      return polygon;
    },
  };
}

export function drawBigJunction(polygon: Polygon) {
  const drawAttributes = createDrawAttributes(polygon);
  const drawHandler = getDrawBigJunctionHandler();
  drawHandler(drawAttributes);
}

import { LineString } from '@turf/helpers';

export class DriveRenderer {
  layer: any;
  map: any;

  constructor(layer: any, map: any);

  /**
   * Draws a path with a green color (like the one used for a "drive" selected from the navigation history). Can be used for drawing allowed paths.
   * @param geometries The line strings to draw
   */
  drawUserDrives(geometries: LineString[]): void;

  /**
   * Draws a path with a red color to indicate a path is disallowed
   * @param geometries The line strings to draw
   */
  drawDisallowedPaths(geometries: LineString[]): void;

  /**
   * Draws a path with a purple color (used internally for "Suggested routes" in Update Requests)
   * @param geometries The line strings to draw
   */
  drawSuggestedRoute(geometries: LineString[]): void;

  /** Clears the entire layer from any paths */
  clear(): void;
}

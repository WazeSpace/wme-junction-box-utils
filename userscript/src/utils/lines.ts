import { rad2deg } from '@/utils/math';

export interface Line {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function getLineDirectionInDegrees(line: Line): number {
  const deltaX = line.endX - line.startX;
  const deltaY = line.endY - line.startY;

  const directionInRadians = Math.atan2(deltaY, deltaX);
  return rad2deg(directionInRadians);
}

export function getAngleBetweenLinesInDegrees(
  line1: Line,
  line2: Line,
): number {
  const line1Direction = getLineDirectionInDegrees(line1);
  const line2Direction = getLineDirectionInDegrees(line2);
  const relativeAngle = line1Direction - line2Direction;

  // Handle negative angles to ensure a 0 to 360 degree range
  if (relativeAngle < 0) {
    // Step 1: Calculate the absolute value of the negative angle
    const absoluteAngle = Math.abs(relativeAngle);

    // Step 2: Find the number of whole rotations (360 degrees) needed to make the angle non-negative
    const rotations = Math.floor(absoluteAngle / 360) + 1;

    // Step 3: Correct the angle by adding the number of rotations multiplied by a full circle (360 degrees)
    return relativeAngle + rotations * 360;
  }

  return relativeAngle;
}

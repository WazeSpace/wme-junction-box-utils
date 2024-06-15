const DIRECTION_TO_CLASS_MAP = {
  fwd: 'fwd-lanes',
  rev: 'rev-lanes',
};

export function findLaneGuidanceContainerByDirection(
  direction: 'fwd' | 'rev',
): Element {
  return document
    .getElementById('edit-panel')
    .querySelector(
      `.lanes .direction-lanes.${DIRECTION_TO_CLASS_MAP[direction]}`,
    );
}

export function findLaneGuidanceEditRegionContainer(root: Element): Element {
  return root.getElementsByClassName('edit-region')[0];
}

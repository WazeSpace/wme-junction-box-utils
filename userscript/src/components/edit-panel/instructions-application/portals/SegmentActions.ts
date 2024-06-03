import { createReactPortal } from '@/utils';

export const SegmentActionsPortal = createReactPortal(() =>
  document.querySelector(
    '.segment-edit-section #segment-edit-general div:has(wz-button.edit-house-numbers)',
  ),
);

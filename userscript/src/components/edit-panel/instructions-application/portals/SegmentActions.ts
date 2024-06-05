import { createReactPortal } from '@/utils';

export const SegmentActionsPortal = createReactPortal(() =>
  [
    document.querySelector('#segment-edit-general .form-group.more-actions'),
    document.querySelector(
      '.segment-edit-section #segment-edit-general div:has(+ form)',
    ),
  ].find(Boolean),
);

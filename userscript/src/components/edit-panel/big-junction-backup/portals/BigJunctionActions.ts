import { createReactPortal } from '@/utils/create-react-portal';

export const BigJunctionActionsPortal = createReactPortal(() =>
  document.querySelector(
    '#edit-panel .big-junction.sidebar-column .tab-content .form-group .controls.junction-actions',
  ),
);

import { createReactPortal } from '@/utils';

export const BigJunctionAlertsPortal = createReactPortal(() =>
  document.querySelector(
    '#edit-panel .big-junction.sidebar-column .tab-content wz-alerts-group',
  ),
);

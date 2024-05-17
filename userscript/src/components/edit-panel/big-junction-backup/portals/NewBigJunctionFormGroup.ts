import { createReactPortal } from '@/utils';

export const NewBigJunctionFormGroupPortal = createReactPortal(() => {
  const firstFormGroup = document.querySelector(
    '#edit-panel .big-junction.sidebar-column .tab-content #big-junction-edit-general > .form-group',
  );
  const newFormGroup = document.createElement('div');
  newFormGroup.className = 'form-group side-panel-section';
  firstFormGroup.after(newFormGroup);
  return newFormGroup;
});

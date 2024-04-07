import Tippy from '@tippyjs/react';
import { ComponentProps } from 'react';
import { createTippyDisplayName } from './create-tippy-display-name';

type TippyModalProps = Omit<ComponentProps<typeof Tippy>, 'content'>;

export function TippyModal({ children, ...rest }: TippyModalProps) {
  return <Tippy content={children} {...rest} />;
}
TippyModal.displayName = createTippyDisplayName('Modal');

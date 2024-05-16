import { ComponentType, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  portalKey?: string;
}
export function createReactPortal(
  container: () => Element | DocumentFragment,
): ComponentType<PortalProps> {
  return ({ children, portalKey }: PortalProps) => {
    return createPortal(children, container(), portalKey);
  };
}

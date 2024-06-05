import { Logger } from '@/logger';
import { ComponentType, ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  portalKey?: string;
}
export function createReactPortal(
  getContainer: () => Element | DocumentFragment,
): ComponentType<PortalProps> {
  return ({ children, portalKey }: PortalProps) => {
    const container = useMemo(() => getContainer(), []);
    if (!container) {
      Logger.error(
        '[createReactPortal] Unable to resolve to a container from a retriever function',
        getContainer,
      );
      return null;
    }
    return createPortal(children, container, portalKey);
  };
}

import { Logger } from '@/logger';
import { ComponentType, ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  portalKey?: string;
}
export function createReactPortal<P extends object = Record<string, never>>(
  getContainer: (props: P) => Element | DocumentFragment,
): ComponentType<PortalProps & P> {
  return ({ children, portalKey, ...rest }: PortalProps & P) => {
    const container = useMemo(() => getContainer(rest as P), [rest]);
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

import { DetailedHTMLProps, HTMLAttributes } from 'react';

type WzIntrinsicElement<T extends string> = `wz-${T}`;

type BaseHTMLProps<
  Element = HTMLElement,
  Attributes extends HTMLAttributes<Element> = HTMLAttributes<Element>,
> = Omit<DetailedHTMLProps<Attributes, Element>, 'className'> & {
  class?: string;
};

declare type WzIntrinsicElements = {
  [K: WzIntrinsicElement<any>]: BaseHTMLProps;
};

declare global {
  namespace JSX {
    interface IntrinsicElements extends WzIntrinsicElements {}
  }
}

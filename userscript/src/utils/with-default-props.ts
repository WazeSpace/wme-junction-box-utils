import {
  ComponentType,
  createElement,
  forwardRef,
  ForwardRefExoticComponent,
  ForwardRefRenderFunction,
  PropsWithChildren,
} from 'react';

export function withDefaultProps<P, DP extends Partial<P>>(
  component: ComponentType<PropsWithChildren<P>>,
  defaultProps: DP,
): ForwardRefExoticComponent<Omit<P, keyof DP> & Partial<DP>> {
  const ComponentWithDefaultProps: ForwardRefRenderFunction<
    P extends { ref: infer U } ? U : never,
    Omit<P, keyof DP> & Partial<DP>
  > = (props, ref) => {
    // Merge the provided props with the default props
    const mergedProps = { ...defaultProps, ...props } as P;
    (mergedProps as any).ref = ref;
    // Render the original component with the merged props
    return createElement(component, mergedProps);
  };

  // Set display name for the new component
  const componentName =
    component.displayName ||
    component.name ||
    (component as any).render?.displayName ||
    (component as any).render?.name ||
    'Component';
  ComponentWithDefaultProps.displayName = `WithDefaultProps(${componentName})`;

  return forwardRef(ComponentWithDefaultProps) as any;
}

import {
  ComponentType,
  createElement,
  FunctionComponent,
  PropsWithChildren,
} from 'react';

export function withDefaultProps<P, DP extends Partial<P>>(
  component: ComponentType<PropsWithChildren<P>>,
  defaultProps: DP,
): FunctionComponent<Omit<P, keyof DP> & Partial<DP>> {
  const ComponentWithDefaultProps: FunctionComponent<
    Omit<P, keyof DP> & Partial<DP>
  > = (props) => {
    // Merge the provided props with the default props
    const mergedProps = { ...defaultProps, ...props } as P;
    // Render the original component with the merged props
    return createElement(component, mergedProps);
  };

  // Set display name for the new component
  const componentName = component.displayName || component.name || 'Component';
  ComponentWithDefaultProps.displayName = `WithDefaultProps(${componentName})`;

  return ComponentWithDefaultProps;
}

import { WzTooltip } from '@wazespace/wme-react-components';
import { ComponentProps } from 'react';

interface ConditionalTooltipProps extends ComponentProps<typeof WzTooltip> {
  show: boolean;
}

export function ConditionalTooltip({
  show,
  children,
  ...rest
}: ConditionalTooltipProps) {
  if (!show) return <>{children}</>;
  return <WzTooltip {...rest}>{children}</WzTooltip>;
}

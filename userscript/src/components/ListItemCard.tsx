import { WzCard } from '@wazespace/wme-react-components';
import clsx from 'clsx';
import { ComponentProps, CSSProperties, ReactNode } from 'react';

interface ListItemCardProps
  extends Omit<
    ComponentProps<typeof WzCard>,
    'elevationOnHover' | 'className'
  > {
  leftIcon: string;
  rightIcon?: string;
  rightIconStyle?: CSSProperties;
  children: ReactNode;
}
export function ListItemCard({
  leftIcon,
  rightIcon,
  rightIconStyle,
  children,
  ...rest
}: ListItemCardProps) {
  return (
    <WzCard elevationOnHover={4} className="list-item-card" {...rest}>
      <div className="list-item-card-layout">
        {getIconElement(leftIcon)}
        <div className="list-item-card-info">{children}</div>
        {getIconElement(rightIcon, rightIconStyle)}
      </div>
    </WzCard>
  );
}

function getIconElement(iconName: string, iconStyles?: CSSProperties) {
  if (!iconName) return undefined;

  const iconClassName = clsx('w-icon', `w-icon-${iconName}`);

  return (
    <div className="list-item-card-icon" style={iconStyles}>
      <i className={iconClassName} />
    </div>
  );
}

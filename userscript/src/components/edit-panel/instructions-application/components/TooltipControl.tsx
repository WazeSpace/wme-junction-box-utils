import { useVersionDependantConfig } from '@/hooks';
import { WzLabel } from '@wazespace/wme-react-components';
import { ReactNode } from 'react';

interface TooltipControlProps {
  label: string;
  children: ReactNode;
}
export function TooltipControl({ label, children }: TooltipControlProps) {
  const { LabelComponent } = useVersionDependantConfig([
    { v: null, LabelComponent: 'label' },
    { v: { M: 2, m: 229 }, LabelComponent: WzLabel },
  ]);
  return (
    <div className="tooltip-control">
      <LabelComponent>{label}</LabelComponent>
      {children}
    </div>
  );
}

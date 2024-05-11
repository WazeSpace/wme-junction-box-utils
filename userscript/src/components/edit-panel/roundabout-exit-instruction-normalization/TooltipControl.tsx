import { ReactNode } from 'react';

interface TooltipControlProps {
  label: string;
  children: ReactNode;
}
export function TooltipControl({ label, children }: TooltipControlProps) {
  return (
    <div className="tooltip-control">
      <label>{label}</label>
      {children}
    </div>
  );
}

import { ReactNode } from 'react';

export interface DisabledComponentProps {
  children?: ReactNode;
  name?: string;
  description?: string;
  className?: string;
}

export function DisabledComponentPlaceholder({
  children,
  name = 'Component',
  description = 'This component is currently disabled in the development environment.',
  className = '',
}: DisabledComponentProps) {
  return (
    <div
      className={`relative p-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
    >
      <div className="text-center">
        <div className="text-gray-500 text-sm mb-2">🚫 {name}</div>
        <div className="text-gray-400 text-xs">{description}</div>
        {children && <div className="mt-4 opacity-50">{children}</div>}
      </div>
    </div>
  );
}

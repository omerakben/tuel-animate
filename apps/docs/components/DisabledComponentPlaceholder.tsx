import React from 'react';

interface DisabledComponentPlaceholderProps {
  componentName: string;
  reason?: string;
  children?: React.ReactNode;
}

export function DisabledComponentPlaceholder({
  componentName,
  reason = 'React 19 compatibility issues',
  children,
}: DisabledComponentPlaceholderProps) {
  return (
    <div className="p-6 border-2 border-dashed border-gray-400 rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {componentName} - Temporarily Disabled
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{reason}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          This component will be re-enabled once Three.js ecosystem fully supports React 19
        </p>
        {children && (
          <div className="mt-4 p-3 bg-gray-200 dark:bg-gray-700 rounded text-xs">
            <details>
              <summary className="cursor-pointer">View original props</summary>
              <pre className="mt-2 text-left overflow-auto">
                {typeof children === 'string' ? children : 'Original component props were passed'}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

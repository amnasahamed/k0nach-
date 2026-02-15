import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  action, 
  onClick,
  variant = 'default',
  hover = true
}) => {
  const variantStyles = {
    default: "bg-white rounded-apple-lg shadow-ios",
    elevated: "bg-white rounded-apple-lg shadow-ios-lg",
    outlined: "bg-white rounded-apple-lg border border-secondary-200"
  };

  const interactiveStyles = onClick && hover ? 'active:scale-[0.98] cursor-pointer hover:shadow-ios-md transition-all duration-200' : '';

  return (
    <div
      onClick={onClick}
      className={`${variantStyles[variant]} flex flex-col transition-all duration-200 ease-apple ${interactiveStyles} ${className}`}
    >
      {(title || action) && (
        <div className="px-5 py-4 border-b border-secondary-100/50 flex justify-between items-center flex-shrink-0">
          {title && <h3 className="text-lg font-semibold text-secondary-900 tracking-tight">{title}</h3>}
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-5 flex-1 min-h-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Card;

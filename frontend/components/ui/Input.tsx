import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    success?: string;
    hint?: string;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    success,
    hint,
    className = '',
    fullWidth = false,
    leftIcon,
    rightIcon,
    ...props
}) => {
    const hasError = !!error;
    const hasSuccess = !!success;

    return (
        <div className={`${fullWidth ? 'w-full' : ''} space-y-1.5`}>
            {label && (
                <label className="block text-xs font-semibold text-secondary-600 uppercase tracking-wide">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 flex-shrink-0">
                        {leftIcon}
                    </div>
                )}
                <input
                    className={`
            block px-4 py-3 
            bg-secondary-50 border border-secondary-200 rounded-apple 
            text-secondary-900 placeholder-secondary-400
            focus:ring-2 focus:ring-primary-500/20 focus:bg-white focus:border-primary-400
            transition-all duration-200 ease-apple
            disabled:opacity-50 disabled:bg-secondary-100 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${hasError ? 'ring-2 ring-danger-500/30 border-danger-300 bg-danger-50 focus:ring-danger-500/40' : ''}
            ${hasSuccess ? 'ring-2 ring-success-500/30 border-success-300 bg-success-50 focus:ring-success-500/40' : ''}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 flex-shrink-0">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-xs text-danger-600 font-medium">{error}</p>
            )}
            {success && (
                <p className="text-xs text-success-600 font-medium">{success}</p>
            )}
            {hint && !error && !success && (
                <p className="text-xs text-secondary-500">{hint}</p>
            )}
        </div>
    );
};

export default Input;

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // You can integrate with Sentry, LogRocket, etc. here
      console.error('Production error:', { error, errorInfo });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-apple-lg shadow-ios-lg p-8 max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-center w-16 h-16 bg-danger-100 rounded-2xl mx-auto mb-4 shadow-ios">
              <svg className="w-8 h-8 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 text-center mb-2 tracking-tight">
              Something went wrong
            </h1>
            <p className="text-secondary-600 text-center text-sm mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support if the issue persists.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 p-3 bg-danger-50 border border-danger-200 rounded-apple">
                <summary className="cursor-pointer text-xs font-semibold text-danger-700 mb-2 select-none">
                  Error details (Development Only)
                </summary>
                <pre className="text-xs text-danger-600 overflow-auto font-mono whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-apple font-medium hover:bg-primary-700 active:scale-95 transition-all duration-200 shadow-ios hover:shadow-ios-md"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  this.handleReset();
                  window.location.href = '/';
                }}
                className="flex-1 px-4 py-3 bg-secondary-100 text-secondary-900 rounded-apple font-medium hover:bg-secondary-200 active:scale-95 transition-all duration-200"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


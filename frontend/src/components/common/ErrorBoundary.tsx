import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">Something went wrong</h2>
              <p className="text-sm text-slate-600">
                The application encountered an unexpected error while rendering this page.
              </p>
              {this.state.error?.message && (
                <div className="bg-slate-100 p-3 rounded text-left text-xs font-mono text-red-700 overflow-x-auto">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-setu-blue text-white hover:bg-setu-blue-dark transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

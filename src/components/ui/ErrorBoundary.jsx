import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-on-surface p-10 flex flex-col items-center justify-center">
          <div className="bg-error/20 border border-error p-8 rounded-xl max-w-4xl w-full">
            <h1 className="text-3xl text-error mb-4">Something went wrong.</h1>
            <p className="text-white/80 mb-4">An error occurred while rendering this page. This is usually caused by a bug in the component logic.</p>
            <details className="whitespace-pre-wrap text-sm font-mono bg-black/50 p-4 rounded overflow-auto max-h-[500px]">
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="mt-6 bg-primary text-background px-6 py-2 rounded font-bold hover:bg-primary/90"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

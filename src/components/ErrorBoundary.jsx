import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.group('🔴 APP CRASH DETECTED');
    console.error('Error:', error);
    console.error('Info:', errorInfo);
    console.groupEnd();
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 text-center">
          <div className="bg-slate-900 border border-red-500/30 p-8 rounded-3xl max-w-lg shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <span className="text-4xl text-red-500 font-black">!</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Application Crash</h1>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              CrowdFlow encountered a fatal rendering error. This usually happens due to missing data or a logic conflict.
            </p>
            
            <div className="bg-slate-950 p-4 rounded-xl text-left border border-slate-800 mb-6 overflow-x-auto">
              <p className="text-red-400 font-mono text-[10px] whitespace-pre-wrap">
                {this.state.error && this.state.error.toString()}
              </p>
              {this.state.errorInfo && (
                <p className="text-slate-600 font-mono text-[9px] mt-2 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </p>
              )}
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-500 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all"
            >
              Restart Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

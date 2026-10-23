import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('FORTY_DAY_CHALLENGE_STATE_V1');
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070c18] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0c162e] border border-amber-500/40 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-rose-400" />
            </div>

            <h2 className="text-xl font-bold mb-2 text-white">
              কিছু একটা সমস্যা হয়েছে
            </h2>
            <p className="text-sm text-slate-300 mb-6">
              অ্যাপ্লিকেশনটি লোড করার সময় একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। পেজটি রিলোড দিন অথবা ডেটা রিসেট করুন।
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>পেজ রিলোড দিন</span>
              </button>

              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <span>ক্লিয়ার ও রিসেট</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

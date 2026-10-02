/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Plato Económico error atrapado:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-100 dark:bg-stone-950 p-6 flex items-center justify-center">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-400 dark:border-stone-700 rounded-3xl p-6 max-w-md w-full shadow-lg text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-stone-950 dark:text-white">
              Ocurrió un inconveniente al mostrar la pantalla
            </h2>
            <p className="text-base text-stone-700 dark:text-stone-300">
              No te preocupes: tus ingredientes y listas guardadas siguen a salvo. Tocá el botón para continuar.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full min-h-[52px] px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Volver a cargar la app</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('AppErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'Inter, system-ui, sans-serif',
            background: '#ffffff',
            color: '#111827',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              width: '100%',
              background: '#fff1f2',
              border: '1px solid #fecaca',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
          >
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 800,
                marginBottom: '12px',
                color: '#9f1239',
              }}
            >
              Хатогӣ рӯй дод
            </h1>

            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.6,
                marginBottom: '20px',
                color: '#be123c',
              }}
            >
              Дар барнома хатогии техникӣ пайдо шуд. Лутфан саҳифаро аз нав бор кунед.
            </p>

            {this.state.error?.message && (
              <div
                style={{
                  marginBottom: '20px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '1px solid #fecaca',
                  fontSize: '12px',
                  color: '#7f1d1d',
                  wordBreak: 'break-word',
                }}
              >
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReload}
              style={{
                background: '#e11d48',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Навсозии саҳифа
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
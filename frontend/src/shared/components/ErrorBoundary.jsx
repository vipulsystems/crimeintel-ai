import React from "react";
import "../../styles/errorBoundary.css";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🔥 ErrorBoundary caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen">

          {/* CORE BOX */}
          <div className="error-box">

            <div className="error-code">
              SYSTEM FAILURE
            </div>

            <h2 className="error-title">
              Intelligence Module Crash
            </h2>

            <p className="error-desc">
              An unexpected fault occurred while processing system data.
              Recovery action is required.
            </p>

            {/* DEV DEBUG */}
            {import.meta.env.DEV && (
              <pre className="error-debug">
                {this.state.error?.toString()}
              </pre>
            )}

            <button
              className="error-btn"
              onClick={this.handleReload}
            >
              Reinitialize System
            </button>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
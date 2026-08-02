import React from 'react';
import ServerError500 from '../pages/ServerError500';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an uncaught rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ServerError500 />;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

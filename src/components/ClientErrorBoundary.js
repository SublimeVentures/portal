import { Component } from "react";
import Sentry from "@sentry/nextjs";

export default class ClientErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }

    static getDerivedStateFromError(_error) {
        return { error: true };
    }

    componentDidCatch(error, errorInfo) {
        Sentry.captureException(error, {
            event_id: errorInfo.digest,
            extra: errorInfo.componentStack,
        });
        console.error(error);
    }

    render() {
        return this.props.children;
    }
}

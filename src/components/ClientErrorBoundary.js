import { Component } from "react";
import * as Sentry from "@sentry/nextjs";

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
        });
        console.error(error);
    }

    render() {
        return this.props.children;
    }
}

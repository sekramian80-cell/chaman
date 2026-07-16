import { Component } from 'react';
import { AlertCircle } from 'lucide-react';
import { reportError } from '../utils/monitoring.js';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, message: '' };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            message: error?.message || 'خطای غیرمنتظره رخ داد.',
        };
    }

    componentDidCatch(error, info) {
        reportError(error, {
            source: 'ErrorBoundary',
            componentStack: info?.componentStack,
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary" role="alert">
                    <AlertCircle size={28} aria-hidden="true" />
                    <h1>مشکلی در نمایش صفحه پیش آمد</h1>
                    <p>لطفاً صفحه را تازه‌سازی کنید. اگر مشکل ادامه داشت با ما تماس بگیرید.</p>
                    <div className="error-boundary__actions">
                        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
                            تازه‌سازی صفحه
                        </button>
                        <a className="btn btn--ghost" href="/">
                            بازگشت به خانه
                        </a>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

import logoUrl from "../assets/logo-faraz-mark.png";

export function LoadingSpinner({ message = "در حال آماده‌سازی صفحه" }) {
    return (
        <div className="site-loader" role="status" aria-live="polite" aria-label={message}>
            <div className="site-loader__field" aria-hidden="true" />
            <div className="site-loader__stage">
                <div className="site-loader__mark" aria-hidden="true">
                    <span />
                    <img src={logoUrl} alt="" decoding="async" />
                </div>
                <strong>فراز چمن</strong>
                <p>{message}</p>
                <div className="site-loader__progress" aria-hidden="true">
                    <span />
                </div>
            </div>
        </div>
    );
}

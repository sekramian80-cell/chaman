import logoUrl from "../assets/logo-faraz-mark.png";

export function LoadingSpinner({ message = "در حال بارگذاری" }) {
    return (
        <div className="site-loader" role="status" aria-live="polite" aria-label={message}>
            <div className="site-loader__mark" aria-hidden="true">
                <span className="site-loader__ring" />
                <span className="site-loader__glow" />
                <img src={logoUrl} alt="" decoding="async" />
            </div>
        </div>
    );
}

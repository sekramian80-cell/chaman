import logoUrl from "../assets/logo-faraz-mark.png";
import fieldImage from "../assets/hero-football-field.jpg";

export function LoadingSpinner({ message = "در حال بارگذاری" }) {
    return (
        <div
            className="site-loader"
            role="status"
            aria-live="polite"
            aria-label={message}
            style={{ "--loader-image": `url(${fieldImage})` }}
        >
            <div className="site-loader__field" aria-hidden="true" />
            <div className="site-loader__mark" aria-hidden="true">
                <span className="site-loader__ring" />
                <img src={logoUrl} alt="" decoding="async" />
            </div>
        </div>
    );
}

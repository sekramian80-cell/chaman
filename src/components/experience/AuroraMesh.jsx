export function AuroraMesh({ className = '' }) {
    return (
        <div className={`exp-aurora ${className}`.trim()} aria-hidden="true">
            <div className="exp-aurora__mesh" />
            <div className="exp-aurora__blob exp-aurora__blob--1" />
            <div className="exp-aurora__blob exp-aurora__blob--2" />
            <div className="exp-aurora__blob exp-aurora__blob--3" />
            <div className="exp-aurora__noise" />
        </div>
    );
}

export function TiltSurface({ children, className = '', float = true, style = {} }) {
    return (
        <div
            className={`exp-tilt ${float ? 'exp-tilt--float' : ''} ${className}`.trim()}
            style={style}
        >
            <span className="exp-tilt__sheen" aria-hidden="true" />
            <span className="exp-tilt__edge" aria-hidden="true" />
            {children}
        </div>
    );
}

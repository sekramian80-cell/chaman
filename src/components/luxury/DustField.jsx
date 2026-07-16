import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

export function DustField({ density = 28 }) {
    const canvasRef = useRef(null);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced) return undefined;

        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const ctx = canvas.getContext('2d');
        let frame;
        let width = 0;
        let height = 0;

        const particles = Array.from({ length: density }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 1.6 + 0.4,
            s: Math.random() * 0.18 + 0.05,
            a: Math.random() * 0.35 + 0.1,
        }));

        const resize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p) => {
                p.y -= p.s * 0.0018;
                p.x += Math.sin(p.y * 12) * 0.00025;
                if (p.y < -0.02) {
                    p.y = 1.02;
                    p.x = Math.random();
                }
                ctx.beginPath();
                ctx.fillStyle = `rgba(198, 255, 168, ${p.a})`;
                ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
                ctx.fill();
            });
            frame = requestAnimationFrame(draw);
        };

        resize();
        draw();
        window.addEventListener('resize', resize);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', resize);
        };
    }, [density, reduced]);

    if (reduced) return null;

    return <canvas className="lux-dust" ref={canvasRef} aria-hidden="true" />;
}

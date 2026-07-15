import { useEffect, useRef, useState } from 'react';

/**
 * @param {'up'|'scale'|'left'|'right'} [variant]
 */
export function ScrollReveal({ children, className = '', delay = 0, variant = 'up' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentElement = ref.current;
    if (!currentElement) return undefined;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(currentElement);

    return () => {
      observer.unobserve(currentElement);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal reveal--${variant} ${isVisible ? 'reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

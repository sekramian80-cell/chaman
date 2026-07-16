import { useEffect } from 'react';
import { useLiteExperience } from '../../hooks/useLiteExperience.js';

export function ExperienceShell({ children }) {
    const lite = useLiteExperience();

    useEffect(() => {
        document.body.classList.add('exp-mode');
        document.documentElement.classList.toggle('exp-lite', lite);
        return () => {
            document.body.classList.remove('exp-mode');
            document.documentElement.classList.remove('exp-lite');
        };
    }, [lite]);

    return (
        <div className="exp-root">
            {!lite ? <div className="exp-atmosphere exp-atmosphere--static" aria-hidden="true" /> : null}
            {children}
        </div>
    );
}

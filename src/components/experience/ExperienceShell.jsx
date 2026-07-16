import { useEffect } from 'react';
import { AuroraMesh } from './AuroraMesh.jsx';
import { CustomCursor } from './CustomCursor.jsx';

export function ExperienceShell({ children }) {
    useEffect(() => {
        document.body.classList.add('exp-mode');
        return () => document.body.classList.remove('exp-mode');
    }, []);

    return (
        <div className="exp-root">
            <AuroraMesh className="exp-aurora--global" />
            <CustomCursor />
            {children}
        </div>
    );
}

import { useEffect } from 'react';
import { AuroraMesh } from './AuroraMesh.jsx';
import { CustomCursor } from './CustomCursor.jsx';
import { JourneyProgress } from './JourneyProgress.jsx';
import { ScrollAtmosphere } from './ScrollAtmosphere.jsx';

export function ExperienceShell({ children }) {
    useEffect(() => {
        document.body.classList.add('exp-mode');
        return () => document.body.classList.remove('exp-mode');
    }, []);

    return (
        <div className="exp-root">
            <ScrollAtmosphere />
            <AuroraMesh className="exp-aurora--global" />
            <JourneyProgress />
            <CustomCursor />
            {children}
        </div>
    );
}

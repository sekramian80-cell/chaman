/**
 * ContentProvider
 * Stale-While-Revalidate: کش فوری نمایش داده می‌شود و در پس‌زمینه تازه می‌شود.
 */
import { useEffect, useState } from 'react';
import { ContentContext } from './ContentContext.jsx';
import { CONFIG } from '../config/index.js';
import { fetchSiteContent, getCachedSiteContent, getLocalContent } from '../services/contentService.js';
import { reportError } from '../utils/monitoring.js';

function ContentSyncBar({ visible }) {
    if (!visible) return null;

    return (
        <div className="content-sync-bar" role="status" aria-live="polite" aria-label="در حال به‌روزرسانی محتوا">
            <span className="content-sync-bar__track" aria-hidden="true" />
        </div>
    );
}

function getInitialValue() {
    if (!CONFIG.USE_API) {
        return {
            ...getLocalContent(),
            loading: false,
            error: null,
            isFromAPI: false,
        };
    }

    const cached = getCachedSiteContent({ allowStale: true });

    if (cached?.content) {
        return {
            ...cached.content,
            loading: false,
            error: null,
            isFromAPI: true,
        };
    }

    return {
        ...getLocalContent(),
        loading: true,
        error: null,
        isFromAPI: false,
    };
}

export function ContentProvider({ children }) {
    const [value, setValue] = useState(getInitialValue);

    useEffect(() => {
        if (!CONFIG.USE_API) return undefined;

        let isMounted = true;
        const hadCache = Boolean(getCachedSiteContent({ allowStale: true }));

        if (!hadCache) {
            setValue((prev) => ({ ...prev, loading: true }));
        }

        fetchSiteContent({
            force: true,
            // آپدیت زودهنگام محصولات (بدون انتظار برای بخش‌های کند)
            onPartial: (partial) => {
                if (!isMounted) return;
                setValue({ ...partial, loading: true, error: null, isFromAPI: true });
            },
        })
            .then((content) => {
                if (!isMounted) return;

                setValue({
                    ...content,
                    loading: false,
                    error: null,
                    isFromAPI: true,
                });
            })
            .catch((error) => {
                if (!isMounted) return;

                reportError(error, { source: 'ContentProvider.fetchSiteContent' });

                setValue((prev) => ({
                    ...prev,
                    loading: false,
                    error: error.message || 'خطا در دریافت اطلاعات',
                    isFromAPI: prev.isFromAPI,
                }));
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <ContentContext.Provider value={value}>
            <ContentSyncBar visible={value.loading} />
            {children}
        </ContentContext.Provider>
    );
}

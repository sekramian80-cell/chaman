/**
 * ContentProvider
 * Provider که داده‌ها را از طریق Context در اختیار کل اپلیکیشن قرار می‌دهد
 *
 * وقتی CONFIG.USE_API = false باشد، مستقیماً از داده‌های محلی استفاده می‌شود.
 * وقتی API فعال است، محتوای محلی فوراً نمایش داده می‌شود و در پس‌زمینه hydrate می‌شود.
 * اگر کش session تازه باشد، همان دادهٔ API بدون درخواست شبکه استفاده می‌شود.
 */
import { useEffect, useState } from 'react';
import { ContentContext } from './ContentContext.jsx';
import { CONFIG } from '../config/index.js';
import { fetchSiteContent, getCachedSiteContent, getLocalContent } from '../services/contentService.js';

function ContentSyncBar({ visible }) {
    if (!visible) return null;

    return (
        <div className="content-sync-bar" role="status" aria-live="polite" aria-label="در حال به‌روزرسانی محتوا">
            <span className="content-sync-bar__track" aria-hidden="true" />
        </div>
    );
}

function getInitialValue() {
    const cached = CONFIG.USE_API ? getCachedSiteContent() : null;

    if (cached) {
        return {
            ...cached,
            loading: false,
            error: null,
            isFromAPI: true,
        };
    }

    return {
        ...getLocalContent(),
        loading: CONFIG.USE_API,
        error: null,
        isFromAPI: false,
    };
}

export function ContentProvider({ children }) {
    const [value, setValue] = useState(getInitialValue);

    useEffect(() => {
        if (!CONFIG.USE_API) return undefined;

        // کش تازه → نیازی به شبکه نیست
        if (!value.loading && value.isFromAPI) return undefined;

        let isMounted = true;

        fetchSiteContent()
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

                setValue((prev) => ({
                    ...prev,
                    loading: false,
                    error: error.message || 'خطا در دریافت اطلاعات',
                    isFromAPI: false,
                }));
            });

        return () => {
            isMounted = false;
        };
        // فقط یک‌بار در mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ContentContext.Provider value={value}>
            <ContentSyncBar visible={value.loading} />
            {children}
        </ContentContext.Provider>
    );
}

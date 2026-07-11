/**
 * ContentProvider
 * Provider که داده‌ها را از طریق Context در اختیار کل اپلیکیشن قرار می‌دهد
 *
 * وقتی CONFIG.USE_API = false باشد، مستقیماً از داده‌های محلی استفاده می‌شود
 */
import { useEffect, useState } from 'react';
import { ContentContext } from './ContentContext.jsx';
import { CONFIG } from '../config/index.js';
import { fetchSiteContent, getLocalContent } from '../services/contentService.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';

export function ContentProvider({ children }) {
    const [value, setValue] = useState(() => ({
        ...getLocalContent(),
        loading: CONFIG.USE_API,
        error: null,
        isFromAPI: false,
    }));

    useEffect(() => {
        if (!CONFIG.USE_API) return;

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

                setValue({
                    ...getLocalContent(),
                    loading: false,
                    error: error.message || 'خطا در دریافت اطلاعات از وردپرس',
                    isFromAPI: false,
                });
            });

        return () => {
            isMounted = false;
        };
    }, []);

    if (value.loading) {
        return <LoadingSpinner message="در حال دریافت محتوا از وردپرس" />;
    }

    return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

import { useContext } from 'react';
import { ContentContext } from '../context/ContentContext.jsx';
import { getLocalContent } from '../services/contentService.js';

/**
 * دسترسی به محتوای سایت (وردپرس یا fallback محلی)
 */
export function useSiteContent() {
    const context = useContext(ContentContext);
    return context ?? { ...getLocalContent(), loading: false, error: null, isFromAPI: false };
}

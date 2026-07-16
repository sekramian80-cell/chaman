/**
 * مانیتورینگ سبک سمت‌کلاینت (بدون وابستگی خارجی)
 * خطاها در session نگه داشته می‌شوند و در صورت تنظیم endpoint ارسال می‌شوند.
 */
import { CONFIG } from '../config/index.js';

const STORAGE_KEY = 'faraz-client-errors-v1';
const MAX_EVENTS = 30;

function readEvents() {
    if (typeof sessionStorage === 'undefined') return [];

    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeEvents(events) {
    if (typeof sessionStorage === 'undefined') return;

    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
    } catch {
        // ignore
    }
}

function normalizeError(error, context = {}) {
    if (!error) {
        return {
            message: 'Unknown error',
            ...context,
            at: new Date().toISOString(),
        };
    }

    if (typeof error === 'string') {
        return {
            message: error,
            ...context,
            at: new Date().toISOString(),
        };
    }

    return {
        message: error.message || String(error),
        name: error.name,
        stack: error.stack,
        ...context,
        at: new Date().toISOString(),
    };
}

async function postEvent(event) {
    const endpoint = CONFIG.MONITORING?.ENDPOINT;
    if (!endpoint) return;

    try {
        await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
            keepalive: true,
        });
    } catch {
        // silent
    }
}

export function reportError(error, context = {}) {
    const event = normalizeError(error, context);
    const events = readEvents();
    events.push(event);
    writeEvents(events);

    if (CONFIG.MONITORING?.LOG_TO_CONSOLE !== false) {
        console.error('[faraz]', event.message, event);
    }

    void postEvent(event);
    return event;
}

export function getReportedErrors() {
    return readEvents();
}

export function initClientMonitoring() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
        reportError(event.error || event.message, {
            source: 'window.error',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        reportError(event.reason, { source: 'unhandledrejection' });
    });
}

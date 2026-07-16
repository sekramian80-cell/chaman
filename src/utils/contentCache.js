import { CONFIG } from '../config/index.js';

const CACHE_KEY = 'faraz-site-api-v1';
const memory = {
    entry: null,
};

function isEnabled() {
    return Boolean(CONFIG.CACHE?.ENABLED);
}

function getTtl() {
    return Number(CONFIG.CACHE?.TTL) || 5 * 60 * 1000;
}

function isFresh(entry, now = Date.now()) {
    return Boolean(entry?.savedAt) && now - entry.savedAt < getTtl();
}

function readSession() {
    if (typeof sessionStorage === 'undefined') return null;

    try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function writeSession(entry) {
    if (typeof sessionStorage === 'undefined') return;

    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch {
        // quota / private mode — ignore
    }
}

function resolveEntry() {
    if (memory.entry) return memory.entry;

    const sessionEntry = readSession();
    if (sessionEntry) {
        memory.entry = sessionEntry;
        return sessionEntry;
    }

    return null;
}

/**
 * خواندن کش خام پاسخ‌های API
 * @param {{ allowStale?: boolean }} [options]
 * @returns {{ savedAt: number, payload: object, fresh: boolean } | null}
 */
export function getCachedApiBundle(options = {}) {
    if (!isEnabled()) return null;

    const allowStale = Boolean(options.allowStale);
    const entry = resolveEntry();
    if (!entry?.payload) return null;

    const fresh = isFresh(entry);
    if (!fresh && !allowStale) return null;

    return { ...entry, fresh };
}

/**
 * ذخیره پاسخ‌های خام API
 * @param {object} payload
 */
export function setCachedApiBundle(payload) {
    if (!isEnabled() || !payload) return;

    const entry = {
        savedAt: Date.now(),
        payload,
    };

    memory.entry = entry;
    writeSession(entry);
}

export function clearCachedApiBundle() {
    memory.entry = null;

    if (typeof sessionStorage === 'undefined') return;

    try {
        sessionStorage.removeItem(CACHE_KEY);
    } catch {
        // ignore
    }
}

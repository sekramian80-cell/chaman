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

/**
 * خواندن کش خام پاسخ‌های API (قابل serialize)
 * @returns {{ savedAt: number, payload: object } | null}
 */
export function getCachedApiBundle() {
    if (!isEnabled()) return null;

    if (isFresh(memory.entry)) {
        return memory.entry;
    }

    const sessionEntry = readSession();
    if (isFresh(sessionEntry)) {
        memory.entry = sessionEntry;
        return sessionEntry;
    }

    return null;
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

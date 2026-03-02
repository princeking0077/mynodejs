import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for auto-saving form data
 * @param {Object} data - The data to auto-save
 * @param {string} key - Unique key for localStorage
 * @param {number} delay - Debounce delay in ms (default: 2000)
 */
export const useAutosave = (data, key, delay = 2000) => {
    const timeoutRef = useRef(null);
    const lastSavedRef = useRef(null);

    const save = useCallback(() => {
        try {
            const dataString = JSON.stringify(data);
            // Only save if data has changed
            if (dataString !== lastSavedRef.current) {
                localStorage.setItem(key, dataString);
                localStorage.setItem(`${key}_timestamp`, new Date().toISOString());
                lastSavedRef.current = dataString;
                console.log(`[Autosave] Saved to ${key}`);
            }
        } catch (error) {
            console.error('[Autosave] Failed to save:', error);
        }
    }, [data, key]);

    useEffect(() => {
        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for debounced save
        timeoutRef.current = setTimeout(save, delay);

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, delay, save]);

    const clearDraft = useCallback(() => {
        try {
            localStorage.removeItem(key);
            localStorage.removeItem(`${key}_timestamp`);
            lastSavedRef.current = null;
            console.log(`[Autosave] Cleared draft ${key}`);
        } catch (error) {
            console.error('[Autosave] Failed to clear:', error);
        }
    }, [key]);

    const loadDraft = useCallback(() => {
        try {
            const saved = localStorage.getItem(key);
            const timestamp = localStorage.getItem(`${key}_timestamp`);

            if (saved) {
                return {
                    data: JSON.parse(saved),
                    timestamp: timestamp ? new Date(timestamp) : null
                };
            }
            return null;
        } catch (error) {
            console.error('[Autosave] Failed to load:', error);
            return null;
        }
    }, [key]);

    return { clearDraft, loadDraft };
};

export default useAutosave;

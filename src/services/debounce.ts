import {useCallback, useEffect, useState} from 'react';


// Type definition for the debounce hook
type DebouncedFunction<T extends (...args: never[]) => void> = (...args: Parameters<T>) => void;

function useDebounce<T extends (...args: never[]) => void>(
    callback: T,
    delay: number
): DebouncedFunction<T> {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return useCallback(
        (...args: Parameters<T>) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            const newTimeoutId = setTimeout(() => {
                callback(...args);
            }, delay);

            setTimeoutId(newTimeoutId);
        },
        [callback, delay, timeoutId]
    );
}

export default useDebounce;
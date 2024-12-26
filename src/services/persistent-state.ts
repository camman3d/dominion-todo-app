import { useState, useEffect } from 'react';

function usePersistentState<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
    const [state, setState] = useState<T>(() => {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
}

export default usePersistentState;
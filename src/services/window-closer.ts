

export default function windowCloser(fn: () => void): () => void {
    window.addEventListener('click', fn);

    const keyListener = (e: KeyboardEvent) => {
        if (e.key === 'Escape') fn();
    }
    window.addEventListener('keydown', keyListener);

    return () => {
        window.removeEventListener('click', fn);
        window.removeEventListener('keydown', keyListener);
    }
}
import { useEffect, useRef } from 'react';

const KONAMI_SEQUENCE: readonly string[] = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a'
];

interface UseKonamiCodeOptions {
  enabled?: boolean;
  ignoreInputs?: boolean;
}

export function useKonamiCode(
  onSuccess: () => void,
  options: UseKonamiCodeOptions = {}
) {
  const { enabled = true, ignoreInputs = true } = options;
  const inputBufferRef = useRef<string[]>([]);
  const callbackRef = useRef(onSuccess);

  useEffect(() => {
    callbackRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (ignoreInputs) {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable)
        ) {
          return;
        }
      }

      const key = e.key.toLowerCase();
      const current = [...inputBufferRef.current, key];

      // Keep only up to the sequence length
      if (current.length > KONAMI_SEQUENCE.length) {
        current.shift();
      }
      inputBufferRef.current = current;

      // Check for match
      if (
        current.length === KONAMI_SEQUENCE.length &&
        current.every((k, idx) => k === KONAMI_SEQUENCE[idx])
      ) {
        inputBufferRef.current = [];
        callbackRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, ignoreInputs]);
}

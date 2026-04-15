// services/pingServer.ts
import axios from 'axios';
import { normalizedBaseUrl } from './api';

/**
 * Module-level singleton — ensures the health-check only runs ONCE per app
 * session, no matter how many times pingUntilAlive() is called concurrently
 * or sequentially (e.g. from repeated auth-state events).
 */
let _pingPromise: Promise<boolean> | null = null;

/**
 * Pings the backend /health endpoint to wake it up from Render cold start.
 * All callers share a single in-flight promise; if the server was already
 * confirmed alive, the resolved value is returned immediately.
 *
 * @param maxRetries   Number of attempts before giving up (default: 6)
 * @param delayMs      Wait time between retries in ms (default: 8000)
 * @param onRetry      Optional callback to notify UI of each retry attempt
 */
export function pingUntilAlive(
  maxRetries = 6,
  delayMs = 8000,
  onRetry?: (attempt: number, max: number) => void
): Promise<boolean> {
  // Return the existing promise if a ping is already in-flight or completed.
  if (_pingPromise) return _pingPromise;

  _pingPromise = (async (): Promise<boolean> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await axios.get(`${normalizedBaseUrl}/health`, { timeout: 8000 });
        console.log('✅ Server is awake');
        return true;
      } catch {
        console.log(`⏳ Server waking up... attempt ${i + 1}/${maxRetries}`);
        onRetry?.(i + 1, maxRetries);

        // Don't wait after the last attempt
        if (i < maxRetries - 1) {
          await new Promise<void>((res) => setTimeout(res, delayMs));
        }
      }
    }

    console.warn('❌ Server did not respond after max retries');
    // Reset so a manual retry (e.g. pull-to-refresh) can try again.
    _pingPromise = null;
    return false;
  })();

  return _pingPromise;
}

/** Call this when you want to force a fresh ping (e.g. after logout). */
export function resetPingSingleton(): void {
  _pingPromise = null;
}
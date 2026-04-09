// services/pingServer.ts
import axios from 'axios';
import { normalizedBaseUrl } from './api';

/**
 * Pings the backend /health endpoint to wake it up from Render cold start.
 * Uses the ROOT base URL (not /api/v1) since /health is a root-level route.
 *
 * @param maxRetries   Number of attempts before giving up (default: 6)
 * @param delayMs      Wait time between retries in ms (default: 8000)
 * @param onRetry      Optional callback to notify UI of each retry attempt
 */
export async function pingUntilAlive(
  maxRetries = 6,
  delayMs = 8000,
  onRetry?: (attempt: number, max: number) => void
): Promise<boolean> {
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
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }

  console.warn('❌ Server did not respond after max retries');
  return false;
}
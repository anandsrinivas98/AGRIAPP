'use client';

import { useEffect } from 'react';

const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Pings the backend /health endpoint from the browser every 10 minutes.
 * This sends real external HTTP traffic to Render, preventing the free-tier
 * instance from sleeping (which happens after 15 minutes of inactivity).
 *
 * Self-pings from the server itself don't count — only external requests do.
 */
export default function KeepAliveProvider() {
  useEffect(() => {
    const ping = async () => {
      try {
        await fetch(`${API_URL}/health`, { method: 'GET', cache: 'no-store' });
        console.log('🏓 Keep-alive ping sent');
      } catch {
        // silently ignore — server may be waking up
      }
    };

    // Ping immediately on mount, then every 10 minutes
    ping();
    const interval = setInterval(ping, PING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return null;
}

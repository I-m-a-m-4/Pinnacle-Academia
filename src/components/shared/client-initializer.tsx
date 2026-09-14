
'use client';

import * as React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ConsoleGuard } from './console-guard';

export function ClientSideInitializer() {
  const [isMounted, setIsMounted] = React.useState(false);
  
  React.useEffect(() => {
    setIsMounted(true);
    
    // Cache buster for normal users who have the broken unstyled PWA cached
    const CURRENT_VERSION = '1.0.1'; // Update this to force cache clear
    const userVersion = localStorage.getItem('app_version');
    
    if (userVersion !== CURRENT_VERSION) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for(let registration of registrations) {
            registration.unregister();
          }
        });
      }
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach(name => {
            caches.delete(name);
          })
        });
      }
      localStorage.setItem('app_version', CURRENT_VERSION);
      // Give a tiny delay before reload to ensure unregister goes through
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, []);

  if (!isMounted) return <ConsoleGuard />;

  const isTauri = typeof window !== 'undefined' && !!(window as any).__TAURI_INTERNALS__;

  return (
    <>
      {!isTauri && <Analytics />}
      <ConsoleGuard />
    </>
  );
}

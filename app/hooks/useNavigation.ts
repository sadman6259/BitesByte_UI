// hooks/useNavigationLoading.ts
"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '../context/LoadingContext';

export const useNavigationLoading = () => {
  const pathname = usePathname();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    console.log('Setting up navigation listeners for pathname:', pathname);

    let pendingNavigation = false;
    let timeoutId: NodeJS.Timeout;

    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a');
      if (!anchor) return;

      // Skip if it's a different origin, hash link, or has a target
      if (anchor.target || anchor.href.includes('#') || !anchor.href.startsWith(window.location.origin)) {
        return;
      }

      console.log('Valid link click detected, starting loading');
      pendingNavigation = true;
      startLoading();
      
      // Fallback in case navigation stalls
      timeoutId = setTimeout(() => {
        if (pendingNavigation) {
          console.warn('Navigation timeout, stopping loading');
          pendingNavigation = false;
          stopLoading();
        }
      }, 5000); // 10 second timeout
    };

    const handleComplete = () => {
      if (pendingNavigation) {
        console.log('Navigation complete, stopping loading');
        pendingNavigation = false;
        clearTimeout(timeoutId);
        stopLoading();
      }
    };

    // Set up event listeners
    document.addEventListener('click', handleAnchorClick, true);
    window.addEventListener('DOMContentLoaded', handleComplete);
    window.addEventListener('load', handleComplete);

    return () => {
      console.log('Cleaning up navigation listeners');
      document.removeEventListener('click', handleAnchorClick, true);
      window.removeEventListener('DOMContentLoaded', handleComplete);
      window.removeEventListener('load', handleComplete);
      clearTimeout(timeoutId);
    };
  }, [pathname, startLoading, stopLoading]);
};
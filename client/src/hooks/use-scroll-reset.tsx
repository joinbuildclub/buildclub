import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook that resets scroll position to top when location/route changes
 */
export function useScrollReset() {
  // Get the current location from wouter
  const [location] = useLocation();

  // Effect runs when location changes
  useEffect(() => {
    // Scroll to top of the page with smooth behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // Using 'auto' instead of 'smooth' for immediate reset
    });
  }, [location]); // Re-run when location changes

  return null;
}
import { useState, useEffect } from 'react';

/**
 * Custom hook to track responsive view state
 * Returns true for mobile view (width <= 768px), false for web view
 */
export const useResponsiveView = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobileView;
};

export default useResponsiveView;

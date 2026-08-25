import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();
  const prevPathnameRef = useRef(location.pathname);

  useEffect(() => {
    const isSamePage = prevPathnameRef.current === location.pathname;
    prevPathnameRef.current = location.pathname;

    // 1. Home page should always scroll instantly
    if (location.pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
      return;
    }

    // 2. Same-page navigation (e.g. click Contact Us navbar while on Contact Us) scrolls smoothly
    if (isSamePage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // 3. Page transition (different page) scrolls instantly
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    }
  }, [location]);

  return null;
};

export default ScrollToTop;

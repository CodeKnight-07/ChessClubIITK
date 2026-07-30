import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const ScrollToTopButton = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToFooter, setShowScrollToFooter] = useState(false);
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  // Toggle visibility of scroll buttons based on position
  const toggleVisibility = () => {
    const scrollY = window.scrollY;
    if (scrollY > 300) {
      setShowScrollToTop(true);
      setShowScrollToFooter(false);
    } else {
      setShowScrollToTop(false);
      setShowScrollToFooter(isHomepage);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToFooter = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      {showScrollToTop && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-[#3c2f00] shadow-2xl hover:scale-110 hover:bg-primary-fixed transition-transform focus:outline-none border border-primary/20 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl font-bold">
            arrow_upward
          </span>
        </motion.button>
      )}

      {showScrollToFooter && (
        <motion.button
          key="scroll-to-footer"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={scrollToFooter}
          type="button"
          aria-label="Scroll to footer"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-[#3c2f00] shadow-2xl hover:scale-110 hover:bg-primary-fixed transition-transform focus:outline-none border border-primary/20 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl font-bold">
            arrow_downward
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;

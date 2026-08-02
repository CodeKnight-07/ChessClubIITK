import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/chessclubiitklogo.jpeg';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Events', path: '/events' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Previous Teams', path: '/previous-teams' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/15 px-4 md:px-8 py-4 flex items-center justify-between"
    >
      {/* Left: Logo */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75, delay: 0.18, ease: "easeOut" }}
      >
        <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
          <img
            alt="Chess Club IITK Seal"
            className="w-10 h-10 rounded-full border border-primary-container/20 group-hover:border-primary transition-all duration-300 shadow-md object-cover"
            src={logo}
          />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-headline text-primary leading-none">Chess Club IITK</span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60 font-bold">IIT Kanpur</span>
          </div>
        </Link>
      </motion.div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `text-xs font-label uppercase tracking-[0.2em] transition-all duration-300 ${isActive
                ? 'text-primary font-bold border-b-2 border-primary pb-1'
                : 'text-on-surface-variant/70 hover:text-primary font-medium px-1'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={handleAuthClick}
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all duration-300 ${isLoggedIn
            ? 'bg-surface-container border border-outline-variant/30 hover:bg-error/10 hover:text-error hover:border-error/30'
            : 'bg-primary text-on-primary hover:scale-105 shadow-lg shadow-primary/10'
            }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isLoggedIn ? 'logout' : 'login'}
          </span>
          <span className="hidden sm:inline">{isLoggedIn ? 'Log Out' : 'Login'}</span>
        </button>

        {isLoggedIn && (
          <Link to="/user" className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container border border-outline-variant/30 hover:border-primary transition-all">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </Link>
        )}

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden items-center justify-center w-9 h-9 rounded-full bg-surface-container border border-outline-variant/30 hover:border-primary text-on-surface-variant hover:text-primary transition-all focus:outline-none"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-surface/95 backdrop-blur-lg border-b border-outline-variant/15 flex flex-col px-8 py-6 gap-4 md:hidden z-40"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-label uppercase tracking-[0.2em] py-2 transition-all duration-300 ${isActive
                    ? 'text-primary font-bold pl-2 border-l-2 border-primary'
                    : 'text-on-surface-variant/70 hover:text-primary font-medium px-2'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

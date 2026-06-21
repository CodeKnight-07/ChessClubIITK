import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/chessclubiitklogo.jpeg';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

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
  ];

  return (
    <nav className="bg-surface border-b border-outline-variant/15 px-8 py-6 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-4 group">
          <img 
            alt="Chess Club IITK Seal" 
            className="w-10 h-10 rounded-full border border-primary-container/20 group-hover:border-primary transition-all duration-300 shadow-md object-cover" 
            src={logo} 
          />
          <div className="flex flex-col">
            <span className="text-xl font-headline italic text-primary leading-none">Chess Club IITK</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/60 font-bold">IIT Kanpur</span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path}
              className={({ isActive }) => 
                `text-xs font-label uppercase tracking-[0.2em] transition-all duration-300 ${
                  isActive 
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
        {/*<div className="flex items-center gap-6">
          <button 
            onClick={handleAuthClick}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-300 ${
              isLoggedIn 
              ? 'bg-surface-container border border-outline-variant/30 hover:bg-error/10 hover:text-error hover:border-error/30' 
              : 'bg-primary text-on-primary hover:scale-105 shadow-lg shadow-primary/10'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isLoggedIn ? 'logout' : 'login'}
            </span>
            <span>{isLoggedIn ? 'Log Out' : 'Login'}</span>
          </button>

          {isLoggedIn && (
            <Link to="/user" className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container border border-outline-variant/30 hover:border-primary transition-all">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            </Link>
          )}
        </div>*/}

      </div>
    </nav>
  );
};

export default Navbar;

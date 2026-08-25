import { Link } from 'react-router-dom';

const TopAppBar = () => {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-[#131313]/70 backdrop-blur-xl border-b border-[#4d4635]/15 flex justify-between items-center px-12 h-20">
      <div className="flex items-center gap-8">
        <span className="text-lg font-serif text-[#e5e2e1] tracking-tight">Chess Club</span>
      </div>

    </header>
  );
};

export default TopAppBar;

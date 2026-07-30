import React from 'react';
import Footer from '../components/Footer';

const PreviousTeams = () => {
  return (
    <div>
      <div className="px-4 sm:px-6 md:px-12 pb-20 max-w-7xl mx-auto min-h-[60vh]">
        <section className="mb-20 mt-12">
          <div className="flex flex-col items-center mb-12 text-center">
            <h3 className="text-xs font-label uppercase tracking-[0.2em] text-primary mb-2">Our Legacy</h3>
            <h2 className="text-5xl font-serif font-bold tracking-tighter text-on-surface">Previous Teams</h2>
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            {['25-26 Team', '24-25 Team', '23-24 Team', '22-23 Team', '21-22 Team'].map((team, index) => (
              <button
                key={index}
                className="w-full max-w-sm px-8 py-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-sm font-bold uppercase tracking-widest text-on-surface transition-all duration-300 hover:bg-primary hover:text-on-primary hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 hover:border-primary group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-[18px] opacity-70 group-hover:opacity-100 transition-opacity">group</span>
                  {team}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-container/0 via-primary-container/30 to-primary-container/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              </button>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PreviousTeams;

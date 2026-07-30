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
          <div className="text-center text-on-surface-variant text-lg">
            <p>Information about previous teams will be updated soon.</p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PreviousTeams;

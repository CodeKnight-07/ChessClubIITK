import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import profileImg from '../assets/profile_image.webp'; // Using existing image as placeholder

// Dummy data structure, will be replaced by user's data
const TEAMS_DATA = {
  '25-26 Team': [
    { name: "Akshat Srivastava", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 25-26 team." },
    { name: "Kushagra Shukla", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 25-26 team." },
    { name: "Pulkit Kumar Gajipara", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 25-26 team." },
    { name: "Tanmay Kavikumar Sahare", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 25-26 team." }
  ],
  '24-25 Team': [
    { name: "Abhishek Kumar", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 24-25 team." },
    { name: "Parv Goyal", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 24-25 team." },
    { name: "Prajeet Singh Rawat", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 24-25 team." }
  ],
  '23-24 Team': [
    { name: "Abhijeet Verma", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 23-24 team." },
    { name: "Ayush Yadav", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 23-24 team." },
    { name: "Navankur Shrotriya", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 23-24 team." },
    { name: "Tejas Goyal", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 23-24 team." }
  ],
  '22-23 Team': [
    { name: "Himanshu Beniwal", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 22-23 team." },
    { name: "Pranshu Gaur", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 22-23 team." },
    { name: "Prem Milind Gujrathi", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 22-23 team." },
    { name: "Vaibhav Waghmare", email: "placeholder@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 22-23 team." }
  ]
};

const TEAMS = ['25-26 Team', '24-25 Team', '23-24 Team', '22-23 Team'];

const MemberCard = ({ person }) => (
  <div className="group relative bg-surface-container-low rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(242,202,80,0.15)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border border-outline-variant/5 hover:border-primary/30 cursor-pointer">
    <div className="relative h-64 overflow-hidden flex-shrink-0">
      <img
        alt={person.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
        src={person.image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent transition-opacity duration-500 opacity-90 group-hover:opacity-60"></div>
      
      <div className="absolute bottom-0 left-0 w-full p-4 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
        <h5 className="text-xl font-serif font-bold text-on-surface mb-1 drop-shadow-md group-hover:text-primary transition-colors duration-300">{person.name}</h5>
        <a href={`mailto:${person.email}`} className="text-[10px] font-mono text-primary hover:text-primary/70 transition-colors tracking-wider block opacity-0 group-hover:opacity-100 duration-500 delay-100 ease-out">{person.email}</a>
      </div>
    </div>
  </div>
);

const PreviousTeams = () => {
  const [activeTeam, setActiveTeam] = useState(TEAMS[0]);

  return (
    <div>
      <div className="px-4 sm:px-6 md:px-12 pb-20 max-w-7xl mx-auto min-h-[70vh]">
        <section className="mb-20 mt-12">
          <div className="flex flex-col items-center mb-12 text-center">
            <h3 className="text-xs font-label uppercase tracking-[0.2em] text-primary mb-2">Our Legacy</h3>
            <h2 className="text-5xl font-serif font-bold tracking-tighter text-on-surface">Previous Teams</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-12 mt-8">
            {/* Left Column: Navigation Buttons */}
            <div className="w-full md:w-1/4 flex flex-col gap-4">
              {TEAMS.map((team) => (
                <button
                  key={team}
                  onClick={() => setActiveTeam(team)}
                  className={`w-full px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden flex items-center justify-between group
                    ${activeTeam === team 
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/30 border-none' 
                      : 'bg-surface-container-low border border-outline-variant/30 text-on-surface hover:border-primary hover:text-primary'
                    }`}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] opacity-80">
                      group
                    </span>
                    {team}
                  </span>
                  {activeTeam === team && (
                    <span className="material-symbols-outlined relative z-10 text-[18px]">
                      chevron_right
                    </span>
                  )}
                  {/* Subtle hover effect for inactive buttons */}
                  {activeTeam !== team && (
                    <div className="absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500 ease-out"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Right Column: Team Members Grid */}
            <div className="w-full md:w-3/4">
              <div className="mb-6 flex items-center justify-center border-b border-outline-variant/20 pb-4 text-center">
                <h3 className="text-4xl font-serif font-bold text-on-surface">
                  Coordinators
                </h3>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTeam}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6"
                >
                  {TEAMS_DATA[activeTeam].map((person, idx) => (
                    <MemberCard key={`${activeTeam}-${idx}`} person={person} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PreviousTeams;

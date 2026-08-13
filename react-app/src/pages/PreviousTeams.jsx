import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import profileImg from '../assets/profile_image.webp'; // Using existing image as placeholder
import tanmayImg from "../assets/exCoordinators/tanmay.jpg";
import akshatImg from "../assets/exCoordinators/akshat.png";
import kushagraImg from "../assets/exCoordinators/kushagra.jpg";
import pulkitImg from "../assets/exCoordinators/pulkit.jpg";
import abhishekImg from "../assets/exCoordinators/Abhishek.jpg";
import prajeetImg from "../assets/exCoordinators/Prajeet.jpg";
import premImg from "../assets/exCoordinators/Prem.png";
import parvImg from "../assets/exCoordinators/parv.jpg";
import navankurImg from "../assets/exCoordinators/navankur.jpg";
import abhijeetImg from "../assets/exCoordinators/abhijeet.jpg";

// 25-26 Secretaries imports
import secArjit from '../assets/secretaries_25_26/arjit.jpg';
import secAshmil from '../assets/secretaries_25_26/ashmil.jpg';
import secInesh from '../assets/secretaries_25_26/inesh.jpg';
import secIqra from '../assets/secretaries_25_26/iqra_240466.jpg';
import secJayaraman from '../assets/secretaries_25_26/jayaraman.jpg';
import secLaksh from '../assets/secretaries_25_26/laksh.jpg';
import secManish from '../assets/secretaries_25_26/manish.jpg';
import secPratik from '../assets/secretaries_25_26/ore_wa_pratik.jpg';
import secPrakhar from '../assets/secretaries_25_26/prakhar.jpg';
import secPrithvijeet from '../assets/secretaries_25_26/prithvijeet.jpg';
import secRishi from '../assets/secretaries_25_26/rishi.jpg';
import secRozAnandan from '../assets/secretaries_25_26/roz_anandan.jpg';
import secRudra from '../assets/secretaries_25_26/rudra.jpg';
import secShaurya from '../assets/secretaries_25_26/shaurya.jpg';

// Coordinators data structure
const TEAMS_DATA = {
  '25-26 Team': [
    { name: "Akshat Srivastava", email: "akshatsri23@iitk.ac.in", image: akshatImg, funnyDescription: "Placeholder description for 25-26 team." },
    { name: "Kushagra Shukla", email: "kushagra23@iitk.ac.in", image: kushagraImg, funnyDescription: "Placeholder description for 25-26 team." },
    { name: "Pulkit Kumar Gajipara", email: "pulkitku23@iitk.ac.in", image: pulkitImg, funnyDescription: "Placeholder description for 25-26 team." },
    { name: "Tanmay Kavikumar Sahare", email: "tanmayka23@iitk.ac.in", image: tanmayImg, funnyDescription: "Placeholder description for 25-26 team." }
  ],
  '24-25 Team': [
    { name: "Abhishek Kumar", email: "placeholder@iitk.ac.in", image: abhishekImg, funnyDescription: "Placeholder description for 24-25 team." },
    { name: "Parv Goyal", email: "parvgoyal22@iitk.ac.in", image: parvImg, funnyDescription: "Placeholder description for 24-25 team." },
    { name: "Prajeet Singh Rawat", email: "prajeetsr22@iitk.ac.in", image: prajeetImg, funnyDescription: "Placeholder description for 24-25 team." }
  ],
  '23-24 Team': [
    { name: "Abhijeet Verma", email: "abhiteet21@iitk.ac.in", image: abhijeetImg, funnyDescription: "Placeholder description for 23-24 team." },
    { name: "Ayush Yadav", email: "ayushy21@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 23-24 team." },
    { name: "Navankur Shrotriya", email: "navankurs21@iitk.ac.in", image: navankurImg, funnyDescription: "Placeholder description for 23-24 team." },
    { name: "Tejas Goyal", email: "tejasg21@iitk.ac.in", image: profileImg, funnyDescription: "Placeholder description for 23-24 team." }
  ],
  '22-23 Team': [
    { name: "Himanshu Beniwal", email: "‎ ", image: profileImg, funnyDescription: "Placeholder description for 22-23 team." },
    { name: "Pranshu Gaur", email: "‎ ", image: profileImg, funnyDescription: "Placeholder description for 22-23 team." },
    { name: "Prem Milind Gujrathi", email: "‎ ", image: premImg, funnyDescription: "Placeholder description for 22-23 team." },
    { name: "Vaibhav Waghmare", email: "‎ ", image: profileImg, funnyDescription: "Placeholder description for 22-23 team." }
  ]
};

// Secretaries data structure
const SECRETARIES_DATA = {
  '25-26 Team': [
    { name: "Arjit", role: "Secretary", image: secArjit },
    { name: "Ashmil", role: "Secretary", image: secAshmil },
    { name: "Inesh", role: "Secretary", image: secInesh },
    { name: "Iqra", role: "Secretary", image: secIqra },
    { name: "Jayaraman", role: "Secretary", image: secJayaraman },
    { name: "Laksh", role: "Secretary", image: secLaksh },
    { name: "Manish", role: "Secretary", image: secManish },
    { name: "Pratik", role: "Secretary", image: secPratik },
    { name: "Prakhar", role: "Secretary", image: secPrakhar },
    { name: "Prithvijeet", role: "Secretary", image: secPrithvijeet },
    { name: "Rishi", role: "Secretary", image: secRishi },
    { name: "Roz Anandan", role: "Secretary", image: secRozAnandan },
    { name: "Rudra", role: "Secretary", image: secRudra },
    { name: "Shaurya", role: "Secretary", image: secShaurya }
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
      
      <div className="absolute bottom-0 left-0 w-full p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
        <h5 className="text-xl font-serif font-bold text-on-surface mb-1 drop-shadow-md group-hover:text-primary transition-colors duration-300">{person.name}</h5>
        {person.email && (
          <a href={`mailto:${person.email}`} className="text-[10px] font-mono text-primary hover:text-primary/70 transition-colors tracking-wider block opacity-0 group-hover:opacity-100 duration-500 delay-100 ease-out">{person.email}</a>
        )}
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
          <div className="flex flex-col items-center mb-10 text-center max-w-3xl mx-auto">
            <p className="text-xs font-label uppercase tracking-[0.3em] text-primary mb-3">Our Legacy</p>
            <h1 className="text-4xl font-serif leading-tight text-on-surface sm:text-5xl">Previous Teams</h1>
            <p className="mt-3 text-sm font-light leading-relaxed text-on-surface-variant/80 sm:text-base">
              Honoring the coordinators and team members who built and shaped the IITK Chess Community.
            </p>
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

            {/* Right Column: Team Members Sections */}
            <div className="w-full md:w-3/4">
              <div key={activeTeam} className="space-y-12">
                {/* Coordinators Section */}
                <div>
                  <div className="mb-6 border-b border-outline-variant/20 pb-4">
                    <h3 className="text-3xl sm:text-4xl font-serif font-bold text-on-surface">
                      Coordinators
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                    {TEAMS_DATA[activeTeam].map((person, idx) => (
                      <MemberCard key={`coord-${activeTeam}-${idx}`} person={person} />
                    ))}
                  </div>
                </div>

                {/* Secretaries Section (for 25-26 or any team with secretaries) */}
                {SECRETARIES_DATA[activeTeam] && SECRETARIES_DATA[activeTeam].length > 0 && (
                  <div>
                    <div className="mb-6 border-b border-outline-variant/20 pb-4">
                      <h3 className="text-3xl sm:text-4xl font-serif font-bold text-on-surface">
                        Secretaries
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                      {SECRETARIES_DATA[activeTeam].map((person, idx) => (
                        <MemberCard key={`sec-${activeTeam}-${idx}`} person={person} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PreviousTeams;

import React from 'react';
import { motion } from 'framer-motion';
import profileImg from '../assets/profile_image.webp';
import Footer from '../components/Footer';

const COORDINATORS = [
  {
    id: 'coord-0',
    name: "Inesh Aggarwal",
    role: "Coordinator",
    funnyDescription: `"Placeholder funny quote or description goes here. Maybe they like cats or play e4 exclusively?"`,
    email: `ineshag24@iitk.ac.in`,
    image: profileImg
  },
  {
    id: 'coord-1',
    name: "Laksh Dhir",
    role: "Coordinator",
    funnyDescription: `"Placeholder funny quote or description goes here. Maybe they like cats or play e4 exclusively?"`,
    email: `laksh24@iitk.ac.in`,
    image: profileImg
  },
  {
    id: 'coord-2',
    name: "Rishi Gupta",
    role: "Coordinator",
    funnyDescription: `"Placeholder funny quote or description goes here. Maybe they like cats or play e4 exclusively?"`,
    email: `rishi24@iitk.ac.in`,
    image: profileImg
  },
  {
    id: 'coord-3',
    name: "Rudra Dwivedi",
    role: "Coordinator",
    funnyDescription: `"Placeholder funny quote or description goes here. Maybe they like cats or play e4 exclusively?"`,
    email: `rudra24@iitk.ac.in`,
    image: profileImg
  },
  {
    id: 'coord-4',
    name: "Shaurya Vats",
    role: "Coordinator",
    funnyDescription: `"Placeholder funny quote or description goes here. Maybe they like cats or play e4 exclusively?"`,
    email: `shaurya24@iitk.ac.in`,
    image: profileImg
  }
];

const SECRETARIES = Array.from({ length: 26 }, (_, i) => ({
  id: `sec-${i}`,
  name: `Secretary Name ${i + 1}`,
  role: "Secretary",
  funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
  email: `sec${i + 1}@iitk.ac.in`,
  image: profileImg
}));
  /*[{
    id: 'sec-0',
    name: 'Aarush Waghmare',
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email: `sec0@iitk.ac.in`,
    image: profileImg
  },
  {
    id:
    name: 'Aditya Dum',
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name: 'Akshat Joshi',
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name: 'Arham Nadeem',
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name: 'Arush Jain',
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name: 'Aryan Kurade',
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name: 'Chaitanya Malhotra',
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name: 'Dipin Pandey',
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name: 'Divyesh Bhattacharya',
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name: 
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name: 
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name: 
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },
  {
    id:
    name:
    role: "Secretary",
    funnyDescription: `"A very funny description placeholder highlighting their quirk."`,
    email:
    image: profileImg
  },

 
]
*/

const ContactCard = ({ person, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay: (index % 5) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    className="group relative bg-surface-container-low rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(242,202,80,0.15)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border border-outline-variant/5 hover:border-primary/30 cursor-pointer"
  >
    <div className="relative h-72 overflow-hidden flex-shrink-0">
      <img
        alt={person.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110 grayscale-[0.6] group-hover:grayscale-0"
        src={person.image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent transition-opacity duration-500 opacity-90 group-hover:opacity-60"></div>

      <div className="absolute top-4 left-4 z-20">
        <span className="bg-surface-container-highest/80 backdrop-blur-md border border-outline-variant/20 px-3 py-1 text-[9px] font-bold tracking-[0.2em] uppercase text-on-surface rounded-full shadow-lg transition-colors group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary">{person.role}</span>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
        <h5 className="text-2xl font-serif font-bold text-on-surface mb-1 drop-shadow-md group-hover:text-primary transition-colors duration-300">{person.name}</h5>
        <a href={`mailto:${person.email}`} className="text-[11px] font-mono text-primary hover:text-primary/70 transition-colors tracking-wider block opacity-0 group-hover:opacity-100 duration-500 delay-100 ease-out">{person.email}</a>
      </div>
    </div>

    <div className="p-6 pt-5 bg-surface-container-lowest flex-grow flex flex-col justify-between relative overflow-hidden border-t border-outline-variant/10">
      {/* Subtle decorative quote mark */}
      <span className="absolute -bottom-8 -right-4 text-9xl font-serif text-on-surface-variant/5 select-none group-hover:text-primary/5 transition-colors duration-500">"</span>
      <p className="text-sm text-on-surface-variant leading-relaxed relative z-10 group-hover:text-on-surface/90 transition-colors duration-500">
        {person.funnyDescription}
      </p>
    </div>
  </motion.div>
);

const Contact = () => {
  return (
    <div>
    <div className="px-12 pb-20 max-w-7xl mx-auto">
      {/* Coordinators Section */}
      <section className="mb-20 mt-12">
        <div className="flex flex-col items-center mb-12 text-center">
          <h3 className="text-xs font-label uppercase tracking-[0.2em] text-primary mb-2">The Leadership</h3>
          <h2 className="text-5xl font-serif font-bold tracking-tighter text-on-surface">Coordinators</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {COORDINATORS.map((person, idx) => (
            <ContactCard key={person.id} person={person} index={idx} />
          ))}
        </div>
      </section>

      {/* Secretaries Section */}
      <section className="mb-20">
        <div className="flex flex-col items-center mb-12 text-center">
          <h3 className="text-xs font-label uppercase tracking-[0.2em] text-primary mb-2">The Core Team</h3>
          <h2 className="text-5xl font-serif font-bold tracking-tighter text-on-surface">Secretaries</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {SECRETARIES.map((person, idx) => (
            <ContactCard key={person.id} person={person} index={idx} />
          ))}
        </div>
      </section>

      {/* Footer matching Blogs.jsx */}
     


    </div>
      <Footer />

</div>
  );
}

export default Contact;

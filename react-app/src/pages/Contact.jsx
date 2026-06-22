import React from 'react';
import profileImg from '../assets/profile_image.webp';

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

const ContactCard = ({ person }) => (
  <div className="group relative bg-surface-container-low rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(242,202,80,0.15)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border border-outline-variant/5 hover:border-primary/30 cursor-pointer">
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
  </div>
);

const Contact = () => {
  return (
    <div className="px-12 pb-20 max-w-7xl mx-auto">
      {/* Coordinators Section */}
      <section className="mb-20 mt-12">
        <div className="flex flex-col items-center mb-12 text-center">
          <h3 className="text-xs font-label uppercase tracking-[0.2em] text-primary mb-2">The Leadership</h3>
          <h2 className="text-5xl font-serif font-bold tracking-tighter text-on-surface">Coordinators</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {COORDINATORS.map(person => (
            <ContactCard key={person.id} person={person} />
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
          {SECRETARIES.map(person => (
            <ContactCard key={person.id} person={person} />
          ))}
        </div>
      </section>

      {/* Footer matching Blogs.jsx */}
      <footer className="w-full border-t border-outline-variant/10 bg-surface-container-lowest">
  <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 md:px-10 lg:px-12">
    <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
      <div className="max-w-md">
        <h6 className="m-0 text-xl font-serif text-primary sm:text-2xl">
          Chess Club IITK
        </h6>
        <p className="mt-4 m-0 max-w-sm text-sm leading-relaxed text-on-surface-variant">
          The official intellectual repository and match-log of the Chess Club at
          the Indian Institute of Technology, Kanpur. Founded for the love of the
          game, sustained by the pursuit of logic.
        </p>
      </div>

      <div className="w-full md:ml-auto md:w-auto md:min-w-[360px]">
        <p className="m-0 text-[10px] font-label uppercase tracking-widest text-primary">
          Connect
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href="https://www.instagram.com/chessiitk/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-full items-center justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
          >
            Instagram
          </a>

          <a
            href="mailto:chessclub@iitk.ac.in"
            className="inline-flex h-9 w-full items-center justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
          >
            Email
          </a>

          <a
            href="https://x.com/chessiitk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-full items-center justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
          >
            X
          </a>

          <a
            href="https://www.linkedin.com/company/chess-iitk/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-full items-center justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
          >
            LinkedIn
          </a>

          <a
            href="https://www.facebook.com/chessclubiitk/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-full items-center justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
          >
            Facebook
          </a>

          <a
            href="https://www.chess.com/club/iitk-chess-club"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-full items-center justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
          >
            Chess.com
          </a>

          <a
            href="https://www.threads.com/@chessiitk?xmt=AQG0WclpAXcX0l6MVRZkMQ6ltp7AQi8X1H4vyrFo6qXNahU"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-full items-center justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary sm:col-span-2"
          >
            Threads
          </a>
        </div>
      </div>
    </div>

    <div className="mt-12 flex flex-col gap-3 border-t border-outline-variant/10 pt-6 text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50 sm:flex-row sm:items-center sm:justify-between">
      <span>© 2026 Chess Club IITK. Intellectual Property Reserved.</span>
      <span>Est. 1960</span>
    </div>
  </div>
</footer>


    </div>
  );
}

export default Contact;

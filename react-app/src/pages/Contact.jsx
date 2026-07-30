import React from 'react';
import { motion } from 'framer-motion';
import profileImg from '../assets/profile_image.webp';
import ineshImg from "../assets/coordinators/inesh.jpeg";
import lakshImg from "../assets/coordinators/laksh.jpeg";
import rishiImg from "../assets/coordinators/rishi.jpeg";
import rudraImg from "../assets/coordinators/rudra.jpeg";
import shauryaImg from "../assets/coordinators/shaurya.jpeg";
import aarushWaghImg from "../assets/secretaries/aarush_wagh.jpg";
import adityaImg from "../assets/secretaries/aditya.jpg";
import akshatImg from "../assets/secretaries/akshat.jpeg";
import anantImg from "../assets/secretaries/anant.jpeg";
import arhamImg from "../assets/secretaries/arham.jpeg";
import arushImg from "../assets/secretaries/arush.jpg";
import aryanImg from "../assets/secretaries/aryan.jpeg";
import chaitanyaImg from "../assets/secretaries/chaitanya.jpg";
import divyeshImg from "../assets/secretaries/divyesh.jpeg";
import furzaanImg from "../assets/secretaries/furzaan.png";
import hariomImg from "../assets/secretaries/hariom.jpg";
import kratagyaImg from "../assets/secretaries/kratagya.jpg";
import madhavImg from "../assets/secretaries/madhav.jpg";
import mayankBhakhandImg from "../assets/secretaries/mayank_bhakhand.jpeg";
import mayankGautamImg from "../assets/secretaries/mayank_gautam.webp";
import mishthyImg from "../assets/secretaries/mishthy.jpg";
import nishantImg from "../assets/secretaries/nishant.jpg";
import piyushImg from "../assets/secretaries/piyush.jpg";
import prajwalImg from "../assets/secretaries/prajwal.jpeg";
import pratikImg from "../assets/secretaries/pratik.jpg";
import swayamImg from "../assets/secretaries/swayam.JPG";
import siddhantImg from "../assets/secretaries/siddhant.jpg";
import shaoniImg from "../assets/secretaries/shaoni.jpg";
import dipinImg from "../assets/secretaries/dipin.jpg";
import lakshyaImg from "../assets/secretaries/lakshya.jpg";
import Footer from '../components/Footer';
const COORDINATORS = [
  {
    id: 'coord-1',
    name: "Inesh Aggarwal",
    role: "Coordinator",
    funnyDescription: "I wake up and eat parathas with samosational level of enthusiasm",
    email: "ineshag24@iitk.ac.in",
    image: ineshImg

  },
  {
    id: 'coord-1',
    name: "Laksh Dhir",
    role: "Coordinator",
    funnyDescription: "If you find a bottle or ID card at random places on campus, there’s a decent chance it’s mine..",
    email: "laksh24@iitk.ac.in",
    image: lakshImg
  },
  {
    id: 'coord-2',
    name: "Rishi Gupta",
    role: "Coordinator",
     funnyDescription: `"Achievement:
 Got a 1-month Diamond membership on Samay’s stream after Guki became the World Champ!
"`,
    email: "rishi24@iitk.ac.in",
    image: rishiImg
  },
  {
    id: 'coord-3',
    name: "Rudra Dwivedi",
    role: "Coordinator",
    funnyDescription: `"I look strict to juniors. Then I start talking...
It gets worse."`,
    email: "rudra24@iitk.ac.in",
    image: rudraImg
  },
  {
    id: 'coord-4',
    name: "Shaurya Vats",
    role: "Coordinator",
    funnyDescription: `"Running on chewing gum and the annual 'this is DC's year' agenda."`,
    email: `shaurya24@iitk.ac.in`,
    image: shauryaImg
  }
];

const SECRETARIES = [
  {
    id: "sec-0",
    name: "Aarush Waghmare",
    role: "Secretary",
    funnyDescription: `"En croissant"`,

    image: aarushWaghImg,
  },
  {
    id: "sec-1",
    name: "Aditya Dum",
    role: "Secretary",
    funnyDescription: `"I am high on chess,let's play and enjoy this addiction!!"`,

    image: adityaImg,
  },
  {
    id: "sec-2",
    name: "Akshat Joshi",
    role: "Secretary",
    funnyDescription: `"The plan was perfect until I played it"`,

    image: akshatImg,
  },
  {
    id: "sec-3",
    name: "Anant Singh",
    role: "Secretary",
    funnyDescription: `"Still looking for the best move"`,

    image: anantImg,
  },
  {
    id: "sec-4",
    name: "Arham Nadeem",
    role: "Secretary",
    funnyDescription: `"After every blunder, there is a great move !"`,

    image: arhamImg,
  },
  {
    id: "sec-5",
    name: "Arush Jain",
    role: "Secretary",
    funnyDescription: `"My opening preparation lasts longer than my actual games."`,

    image: arushImg,
  },
  {
    id: "sec-6",
    name: "Aryan Kurade",
    role: "Secretary",
    funnyDescription: `"My opponents fear my unpredictability, so do I."`,

    image: aryanImg,
  },
  {
    id: "sec-7",
    name: "B Madhav Krishna",
    role: "Secretary",
    funnyDescription: `"Chess is my number one priority"`,

    image: madhavImg,
  },
  {
    id: "sec-8",
    name: "Chaitanya Malhotra",
    role: "Secretary",
    funnyDescription: `"Everything was satisfying until a bishop ruined my smoothered mate :-("`,

    image: chaitanyaImg,
  },
  {
    id: "sec-9",
    name: "Dipin Pandey",
    role: "Secretary",
    funnyDescription: `"In my defence, the knight jumped out of nowhere."`,

    image: dipinImg,
  },
  {
    id: "sec-10",
    name: "Divyesh Bhattacharyya",
    role: "Secretary",
    funnyDescription: `"Arguing with idiots is like playing chess with a pigeon. No matter how good you are the bird is going to shit on the board"`,

    image: divyeshImg,
  },
  {
    id: "sec-11",
    name: "Furzaan S. Ullah",
    role: "Secretary",
    funnyDescription: `"Every game is a new puzzle to solve."`,

    image: furzaanImg,
  },
  {
    id: "sec-12",
    name: "Hariom Mishra",
    role: "Secretary",
    funnyDescription: `"Chess taught me patience. My clock says otherwise"`,

    image: hariomImg,
  },
  {
    id: "sec-14",
    name: "Kratagya Jain",
    role: "Secretary",
    funnyDescription: `"Discovering creative ways not to win at chess"`,

    image: kratagyaImg,
  },
  
  {
    id: "sec-16",
    name: "Mayank Bhakhand",
    role: "Secretary",
    funnyDescription: `"it is always better to sacrifice your opponent's pieces"`,

    image: mayankBhakhandImg,
  },
  {
    id: "sec-17",
    name: "Mayank Gautam",
    role: "Secretary",
    funnyDescription: `"I can spot tactics instantly—after the game."`,

    image: mayankGautamImg,
  },
  {
    id: "sec-18",
    name: "Mishthy Khatwa",
    role: "Secretary",
    funnyDescription: `"My pieces have trust issues with me"`,

    image: mishthyImg,
  },
  {
    id: "sec-19",
    name: "Nishant",
    role: "Secretary",
    funnyDescription: `"Chess has made me redefine beauty!"`,

    image: nishantImg,
  },
  {
    id: "sec-20",
    name: "Piyush Agarwal",
    role: "Secretary",
    funnyDescription: `"The only thing I calculate accurately is how much rating I'm about to lose."`,

    image: piyushImg,
  },
  {
    id: "sec-21",
    name: "Prajwal Ravi Rai",
    role: "Secretary",
    funnyDescription: `"I am better than magnus carlsen"`,

    image: prajwalImg,
  },
  {
    id: "sec-22",
    name: "Pratik Dhanuka",
    role: "Secretary",
    funnyDescription: `"I enjoy playing chess, chess enjoys playing with my emotions."`,

    image: pratikImg,
  },
  {
    id: "sec-23",
    name: "Shaoni Mukherjee",
    role: "Secretary",
    funnyDescription: `"Life is like chess. I don't know how to play chess."`,

    image: shaoniImg,
  },
  {
    id: "sec-24",
    name: "Siddhant Ghate",
    role: "Secretary",
    funnyDescription: `"My favourite chess opening is the one where my opponent doesn't show up."`,

    image: siddhantImg,
  },
  {
    id: "sec-25",
    name: "Swayam Krishna Manohari",
    role: "Secretary",
    funnyDescription: `"I’m not a bad chess player, I’m the biggest philanthropist in the community. I generously donate my pieces to needy opponents every single game."`,

    image: swayamImg,
  }
];
const ContactCard = ({ person }) => (
  <div
    className="group relative bg-surface-container-low rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(242,202,80,0.15)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border border-outline-variant/5 hover:border-primary/30 cursor-pointer"
  >
    <div className="relative h-72 overflow-hidden flex-shrink-0">
      <img
        alt={person.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
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
    <div>
      <div className="px-4 sm:px-6 md:px-12 pb-20 max-w-7xl mx-auto">
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
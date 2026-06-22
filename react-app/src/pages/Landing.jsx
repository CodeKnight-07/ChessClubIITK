import fresherImg from '../assets/fresher_league_recap_1775765383248.png';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import SliderMaskText from '../components/SliderMaskText';
import chessboardImg from '../assets/chessboard.jpg';
import homePgBg from './home-pg-bg.png';

const Landing = () => {
  const { isLoggedIn } = useAuth();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  return (
    <>
      {/* Section 1: Brand Intro */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center px-6 md:px-12 lg:px-20 overflow-hidden bg-[#131313] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(19, 19, 19, 0.12) 0%, rgba(19, 19, 19, 0.55) 62%, rgba(0, 0, 0, 0.86) 100%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0.56) 55%, rgba(0, 0, 0, 0.84) 100%),
            url(${homePgBg})
          `,
        }}
      >
        {/* Cinematic golden dust & lighting beam effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-radial from-yellow-600/10 via-yellow-900/5 to-transparent blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[200px] bg-radial from-yellow-600/5 to-transparent blur-[160px] pointer-events-none z-0"></div>

        {/* Elegant chess board subtle border line frame around the hero */}
        {/* {<div className="absolute inset-x-8 md:inset-x-12 lg:inset-x-20 top-8 bottom-0 border-x border-t border-zinc-800/40 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#d4af37]"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#d4af37]"></div>
        </div>} */}

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="relative z-10 w-full text-center flex flex-col items-center justify-center mt-12"
        >
          {/* Displaying Chess Club IITK in elite scale */}
          <div className="relative py-8 px-4 md:px-12 border border-zinc-800/25 bg-transparent rounded-2xl max-w-5xl mx-auto shadow-2xl shadow-black/40">
            {/* Subtle vintage mechanical coordinates in corners */}
            <span className="absolute top-2 left-3 text-[9px] font-mono tracking-widest text-[#d4af37]/40"> </span>
            <span className="absolute top-2 right-3 text-[9px] font-mono tracking-widest text-[#d4af37]/40"> </span>
            <span className="absolute bottom-2 left-3 text-[9px] font-mono tracking-widest text-[#d4af37]/40"> </span>
            <span className="absolute bottom-2 right-3 text-[9px] font-mono tracking-widest text-[#d4af37]/40"> </span>

            <SliderMaskText
              text={"CHESS CLUB\nIITK"}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[7rem] !font-headline font-semibold tracking-normal leading-[0.9] text-[#d4af37] drop-shadow-[0_10px_28px_rgba(0,0,0,0.72)]"
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.0 }}
            className="mt-10 flex flex-col items-center gap-2"
          >
            <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse"></div>
            <span className="text-[15px] uppercase tracking-[0.4em] text-[#e5e2e1]/40 font-mono">
              The Gymnasium of Campus Minds
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: Core Slogan */}
      <section className="relative min-h-screen flex items-center justify-center px-12 lg:px-20 overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 z-0">
          <img alt="Chess Theme" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0XUbyKBzENztVgAh6aESgPIC7XwA0lM9Q5EAQXcIzg4K-uwUBFeK--nCT2BIF19Gy98hGFmduCbjU072Gs6wdSSffKreD381eR-dywqyhYu7_qmk5xQpofN0NjZs2AK6MejHEcg0bm94T-rOPLlR9K-MLzX0fAoS7VP9rJUegBfctXasuLza8dxMuBk5h6mezyvE40_gQYvLiBnaZbkmtDz9LSZi8ggzl3Vv4cRH8E8pKetxseMMRcRgWk07GqrG9EO9M1HwvhmY" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest via-surface/40 to-surface"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          <h2 className="text-6xl md:text-8xl font-serif mb-8 leading-tight">
            Silence the Noise.<br />
            <span className="text-primary">Find the Move.</span>
          </h2>
          <p className="text-lg text-on-surface-variant font-body mb-10 max-w-lg leading-relaxed mx-auto text-center">
            The intellectual heart of IIT Kanpur.<br />
            Where tradition meets strategy, and every move is a testament to calculated brilliance. Join the elite echelon of campus thinkers.
          </p>
        {/*
          <div className="flex items-center justify-center gap-6">
            {!isLoggedIn && (
              <button className="primary-gradient text-on-primary px-10 py-4 font-bold rounded-lg shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:scale-105 transition-transform">
                Join the Club
              </button>
            )}
          </div>
        */}
        </motion.div>
      </section>

      <section className="py-24 px-12 lg:px-20 gap-8">
        <div className="col-span-12 lg:col-span-5 mb-12 lg:mb-0">
          <p className="text-primary font-label text-xs tracking-[0.3em] uppercase mb-4">Establishing Excellence</p>
          <h3 className="text-5xl font-serif mb-8 leading-tight">Beyond the 64 Squares</h3>
          <div className="space-y-6 text-on-surface-variant leading-relaxed text-lg">
            <p>Founded on the principles of logic and unwavering focus, Chess Club IITK is not merely a sports body. We are a collective of minds dedicated to the pursuit of objective truth within the confines of the board.</p>
            <p>From high-stakes inter-IIT tournaments to late-night blitz sessions in the Hall of Residence, we foster an environment where every pawn has the potential to become a queen.</p>
          </div>
          <div className="mt-12 p-8 bg-surface-container-low border-l-4 border-primary">
            <p className="text-xl font-serif text-on-surface -mt-4 mb-4">“ Chess is the gymnasium of the mind. ”</p>
            <cite className="text-sm font-label text-on-surface-variant tracking-widest uppercase">— IITK Grandmaster Series</cite>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7 flex flex-wrap gap-6 items-start justify-start mt-8 lg:mt-0 lg:pl-12">
        </div>
      </section>

      <motion.section className="py-24 px-12 lg:px-20 bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 aspect-square rounded-xl overflow-hidden shadow-2xl relative">
            <img alt="Tournament" className="w-full h-full object-cover" src={fresherImg} />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
          </div>
          <motion.div className="w-full md:w-1/2">
            <h3 className="text-xs font-label text-primary tracking-[0.4em] uppercase mb-4">Next Event</h3>
            <h2 className="text-5xl font-serif mb-6">Fresher's Chess League</h2>
            <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">Experience the thrill of OTB chess! An exclusive 8-player team tournament kicking off with live offline auctions. Fight through the group pools to secure the top knockout spots!</p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-4 text-on-surface">
                <span className="material-symbols-outlined text-primary">event</span>
                <span className="font-medium">August 21st - 23rd, 2026</span>
              </li>
              <li className="flex items-center gap-4 text-on-surface">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <span className="font-medium">Senate Hall & OAT</span>
              </li>
              <li className="flex items-center gap-4 text-on-surface">
                <span className="material-symbols-outlined text-primary">emoji_events</span>
                <span className="font-medium">8 Gold Memberships + Coupons</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

     <footer className="bg-surface-container-lowest border-t border-outline-variant/10 px-12 py-16 lg:px-20">
  <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
    <div className="col-span-1 md:col-span-2">
      <h4 className="mb-4 text-xl font-serif text-primary">Chess Club IITK</h4>
      <p className="mb-6 max-w-sm text-on-surface-variant">
        The official digital portal for the IIT Kanpur Chess Club. Archiving brilliance since 2007.
      </p>
      <div className="flex gap-4">
        <a
          href="https://www.chess.com/club/iitk-chess-club"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface-container transition-colors hover:bg-primary hover:text-on-primary"
        >
          <span className="material-symbols-outlined">public</span>
        </a>
        <a
          href="mailto:chessclub@iitk.ac.in"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface-container transition-colors hover:bg-primary hover:text-on-primary"
        >
          <span className="material-symbols-outlined">mail</span>
        </a>
      </div>
    </div>

    <div>
      <h5 className="mb-6 text-sm font-label uppercase tracking-widest text-primary">
        Organization
      </h5>
      <ul className="space-y-3 text-sm text-on-surface-variant">
        <li>
          <span className="cursor-pointer transition-colors hover:text-primary">
            Our History
          </span>
        </li>
        <li>
          <span className="cursor-pointer transition-colors hover:text-primary">
            Core Committee
          </span>
        </li>
        <li>
          <span className="cursor-pointer transition-colors hover:text-primary">
            Alumni Network
          </span>
        </li>
        <li>
          <span className="cursor-pointer transition-colors hover:text-primary">
            Hall of Fame
          </span>
        </li>
      </ul>
    </div>

    <div>
      <h5 className="mb-6 text-sm font-label uppercase tracking-widest text-primary">
        Connect
      </h5>
      <div className="grid grid-cols-2 gap-3">
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
          className="inline-flex h-9 w-full items-center justify-start rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary col-span-2"
        >
          Threads
        </a>
      </div>
    </div>
  </div>

  <div className="mt-16 flex items-center justify-between border-t border-outline-variant/5 pt-8 text-[10px] uppercase tracking-widest text-on-surface-variant/40">
    <p>© 2026 IIT Kanpur Chess Club. All Rights Reserved.</p>
    <p>Designed for the Intellectual Elite</p>
  </div>
</footer>


    </>
  );
};
export default Landing;

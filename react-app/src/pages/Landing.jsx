import fresherImg from '../assets/fresher_league_recap_1775765383248.png';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import SliderMaskText from '../components/SliderMaskText';
import chessboardImg from '../assets/chessboard.jpg';

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
      <section className="relative min-h-[85vh] flex items-center justify-center px-6 md:px-12 lg:px-20 overflow-hidden bg-[#131313]">
        {/* Cinematic golden dust & lighting beam effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-radial from-yellow-600/10 via-yellow-900/5 to-transparent blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[200px] bg-radial from-yellow-600/5 to-transparent blur-[160px] pointer-events-none z-0"></div>

        {/* Elegant chess board subtle border line frame around the hero */}
        <div className="absolute inset-x-8 md:inset-x-12 lg:inset-x-20 top-8 bottom-0 border-x border-t border-zinc-800/40 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#d4af37]"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#d4af37]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 w-full text-center flex flex-col items-center justify-center mt-12"
        >
          {/* Displaying Chess Club IITK in elite scale */}
          <div className="relative py-8 px-4 md:px-12 border border-zinc-800/40 bg-black/20 backdrop-blur-md rounded-2xl max-w-5xl mx-auto shadow-2xl shadow-black/80">
            {/* Subtle vintage mechanical coordinates in corners */}
            <span className="absolute top-2 left-3 text-[9px] font-mono tracking-widest text-[#d4af37]/40"> </span>
            <span className="absolute top-2 right-3 text-[9px] font-mono tracking-widest text-[#d4af37]/40"> </span>
            <span className="absolute bottom-2 left-3 text-[9px] font-mono tracking-widest text-[#d4af37]/40"> </span>
            <span className="absolute bottom-2 right-3 text-[9px] font-mono tracking-widest text-[#d4af37]/40"> </span>

            <SliderMaskText
              text={"CHESS CLUB\nIITK"}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[13rem] font-bold tracking-tight leading-[0.85] font-display text-[#d4af37]"
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.0 }}
            className="mt-10 flex flex-col items-center gap-2"
          >
            <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse"></div>
            <span className="text-[11px] uppercase tracking-[0.4em] text-[#e5e2e1]/40 font-mono">
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
          <h2 className="text-6xl md:text-8xl font-serif italic mb-8 leading-tight">
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
            <span className="text-primary text-4xl font-serif italic">“</span>
            <p className="text-xl font-serif italic text-on-surface -mt-4 mb-4">Chess is the gymnasium of the mind.</p>
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
            <h2 className="text-5xl font-serif mb-6 italic">Fresher's Chess League</h2>
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

      <footer className="bg-surface-container-lowest py-16 px-12 lg:px-20 border-t border-outline-variant/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-xl font-serif italic text-primary mb-4">Chess Club IITK</h4>
            <p className="text-on-surface-variant max-w-sm mb-6">The official digital portal for the IIT Kanpur Chess Club. Archiving brilliance since 2007.</p>
            <div className="flex gap-4">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-primary transition-colors hover:text-on-primary cursor-pointer">
                <span className="material-symbols-outlined">public</span>
              </span>
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-primary transition-colors hover:text-on-primary cursor-pointer">
                <span className="material-symbols-outlined">mail</span>
              </span>
            </div>
          </div>
          <div>
            <h5 className="text-sm font-label uppercase tracking-widest text-primary mb-6">Organization</h5>
            <ul className="space-y-3 text-on-surface-variant text-sm">
              <li><span className="hover:text-primary transition-colors cursor-pointer">Our History</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Core Committee</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Alumni Network</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Hall of Fame</span></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-label uppercase tracking-widest text-primary mb-6">Legal</h5>
            <ul className="space-y-3 text-on-surface-variant text-sm">
              <li><span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Terms of Play</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Anti-Cheat Policy</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-outline-variant/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-on-surface-variant/40">
          <p>© 2026 IIT Kanpur Chess Club. All Rights Reserved.</p>
          <p>Designed for the Intellectual Elite</p>
        </div>
      </footer>
    </>
  );
};
export default Landing;

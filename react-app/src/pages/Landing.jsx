import { useState } from 'react';
import { Link } from 'react-router-dom';
import fresherImg from '../assets/fresher_league_recap_1775765383248.png';
import grandSwissImg from '../assets/grand_swiss_recap_1775765397656.png';
import fideImg from '../assets/fide.png';
import featuredEventImg from '../assets/featured_event.png';
import lolImg from "../assets/lol.png";
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import SliderMaskText from '../components/SliderMaskText';
import chessboardImg from '../assets/chessboard.jpg';
import homePgBg from './home-pg-bg.png';
import Footer from '../components/Footer';
import { OFFICIAL_EVENTS } from './Events';

const Landing = () => {
  const { isLoggedIn } = useAuth();

  // Helper to map event ID to image
  const getEventImage = (id) => {
    switch (id) {
      case 1:
        return lolImg;
      case 2:
        return fresherImg;
      case 3:
        return grandSwissImg;
      case 8:
        return fideImg;
      default:
        return featuredEventImg;
    }
  };



  // Helper to find the next upcoming event relative to local time
  const getNextEvent = () => {
    const now = new Date();
    // Zero out time for date comparison
    const nowTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const futureEvents = OFFICIAL_EVENTS.filter(event => {
      const eventDate = new Date(event.date);
      const eventTime = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();
      return eventTime >= nowTime;
    });

    if (futureEvents.length === 0) return null;

    // Sort by date ascending
    futureEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    return futureEvents[0];
  };

  const nextEvent = getNextEvent();

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

      {/* Empty Flash Cards Section */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-surface-container-lowest">
        <div className="max-w-5xl mx-auto mb-10 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-on-surface">About Chess Club</h2>
          <p className="mt-6 text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Welcome to the Chess Club IIT Kanpur. Our mission is to foster intellectual growth, strategic thinking, and camaraderie through the timeless game of chess. We invite you to explore our upcoming schedules, participate in our organised events.
          </p>
          <p className="mt-6 text-primary font-bold text-lg sm:text-xl md:text-2xl tracking-[0.2em] uppercase font-label">
            Discover your next move.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-8"
        >
          {[
            { 
              id: 1, 
              title: "Play and Grow", 
              desc: "We believe that mastery begins with consistent practice. Our club provides a welcoming environment where players of all experience levels can engage in regular over-the-board play, participate in casual match analysis, and benefit from peer-led mentorship designed to steadily elevate your game." 
            },
            { 
              id: 2, 
              title: "Competitive Environment", 
              desc: "The club hosts regular online and over-the-board campus tournaments open to all skill levels. We invite everyone to join this competitive environment, designed to foster creative tactical thinking, sharpen strategic skills, and help players flourish. Discover your potential and test your limits against peers in structured, official matchplay." 
            },
            { 
              id: 3, 
              title: "Exclusive Events & Talk Shows", 
              desc: "The club hosts premier events, including the Chess Masters Premier League (CMPL) and official FIDE-rated tournaments. Additionally, we feature exclusive talk shows and masterclasses with renowned global chess personalities, including World Champion GM Gukesh Dommaraju, GM Arjun Erigaisi, ChessBase India's Sagar Shah, and Chess.com CEO Erik Allebest." 
            }
          ].map((card, idx) => (
            <div key={card.id} className="relative group cursor-pointer h-full">
              {/* Main Card Body */}
              <div className="relative z-10 rounded-2xl border border-outline-variant/15 bg-gradient-to-br from-surface-container-high/60 to-surface-container/20 backdrop-blur-md p-8 h-full min-h-[350px] flex flex-col justify-between overflow-hidden group-hover:scale-[1.02] group-hover:border-primary/40 group-hover:shadow-[0_12px_36px_rgba(242,202,80,0.12)] transition-all duration-500">
                {/* Golden Hover Fill Overlay with directional transfer illusion */}
                <div className="absolute inset-0 bg-[#f2ca50] scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-500 ease-in-out z-0 pointer-events-none"></div>

                {/* Subtle top corner gradient glow */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none z-10"></div>

                {/* Decorative grid pattern in background */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-10"></div>

                {/* Card Content */}
                <div className="relative z-20 flex flex-col h-full flex-1">
                  {/* Heading of the card at the top */}
                  <div className="w-full flex flex-col items-center">
                    <div className="h-20 flex items-center justify-center w-full">
                      <h3 className="text-xl sm:text-2xl font-serif text-on-surface group-hover:text-[#131313] transition-colors duration-500 leading-snug text-center w-full">
                        {card.title}
                      </h3>
                    </div>
                    {/* Centered Divider Line */}
                    <div className="w-16 h-[1.5px] bg-[#d4af37]/30 group-hover:bg-[#3c2f00]/40 mt-3 transition-colors duration-500"></div>
                  </div>

                  {/* Description of the card below the heading */}
                  {card.desc && (
                    <p className="mt-6 text-xs sm:text-sm text-on-surface-variant group-hover:text-[#251a00]/80 transition-colors duration-500 leading-relaxed text-center">
                      {card.desc}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {nextEvent && (
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="py-16 px-6 md:px-12 lg:px-20 bg-surface"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-primary font-label text-xs tracking-[0.3em] uppercase">Featured Event</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-on-surface mt-2">Upcoming Event</h2>
            </div>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-event-details-modal'))}
              className="w-full text-left rounded-3xl border border-[#4d4635]/25 bg-gradient-to-br from-surface-container-high/80 to-surface-container/40 backdrop-blur-md hover:border-primary/50 hover:shadow-[0_0_50px_rgba(242,202,80,0.15)] transition-all duration-[1000ms] flex flex-col md:flex-row overflow-hidden group cursor-pointer relative"
            >
              {/* Smooth Golden Hover Fill Overlay */}
              <div className="absolute inset-0 bg-[#f2ca50] opacity-0 group-hover:opacity-100 transition-opacity duration-[1000ms] ease-in-out z-0 pointer-events-none"></div>

              {/* Event Image Container */}
              <div className="w-full md:w-[45%] relative aspect-[16/10] md:aspect-auto md:min-h-[340px] shrink-0 overflow-hidden z-10">
                <img
                  alt={nextEvent.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out"
                  src={getEventImage(nextEvent.id)}
                />
                {/* Dark gradient overlay blending image into card */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-surface/60 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[#d4af37]/5 mix-blend-overlay"></div>

                {/* Event Tag Floating Badge */}
                {nextEvent.tag && (
                  <span className="absolute top-4 left-4 px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-surface/90 text-primary border border-primary/30 rounded-full backdrop-blur-sm">
                    {nextEvent.tag}
                  </span>
                )}
              </div>

              {/* Event Details */}
              <div className="p-8 sm:p-10 flex flex-col justify-between flex-1 min-w-0 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#d4af37]/60 group-hover:text-[#3c2f00]/70 transition-colors duration-[1000ms]">
                      Next
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-[#3c2f00] transition-colors duration-[1000ms]">
                      <span>View details</span>
                      <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1.5 transition-all duration-300">
                        arrow_forward
                      </span>
                    </div>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-serif text-on-surface font-semibold tracking-tight leading-tight group-hover:text-[#251a00] transition-colors duration-[1000ms]">
                    {nextEvent.title}
                  </h3>

                  <p className="text-sm sm:text-base text-on-surface-variant/80 group-hover:text-[#251a00]/90 transition-colors duration-[1000ms] line-clamp-3 leading-relaxed font-body">
                    {nextEvent.shortDesc}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-outline-variant/15 group-hover:border-[#3c2f00]/25 transition-colors duration-[1000ms] flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-xs text-on-surface-variant/90 group-hover:text-[#3c2f00]/90">
                  <div className="flex flex-col gap-2.5 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] text-primary group-hover:text-[#3c2f00] transition-colors duration-[1000ms] shrink-0">calendar_today</span>
                      <span className="font-medium tracking-wide">{nextEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] text-primary group-hover:text-[#3c2f00] transition-colors duration-[1000ms] shrink-0">location_on</span>
                      <span className="font-medium tracking-wide truncate max-w-[240px]">{nextEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px] text-primary group-hover:text-[#3c2f00] transition-colors duration-[1000ms] shrink-0">sports_esports</span>
                      <span className="font-medium tracking-wide truncate max-w-[280px]">{nextEvent.format || "Tournament System"}</span>
                    </div>
                  </div>
                  {nextEvent.prizes && (
                    <div className="flex items-center gap-2.5 border border-primary/30 bg-primary/5 px-4 py-2.5 rounded-xl max-w-sm truncate shrink-0 shadow-lg shadow-black/20 group-hover:border-[#3c2f00]/30 group-hover:bg-[#3c2f00]/10 group-hover:text-[#3c2f00] transition-all duration-[1000ms]">
                      <span className="material-symbols-outlined text-[18px] text-primary group-hover:text-[#3c2f00] transition-colors duration-[1000ms] shrink-0">emoji_events</span>
                      <span className="truncate font-bold tracking-wide text-primary group-hover:text-[#3c2f00] text-[11px] uppercase transition-colors duration-[1000ms]">{nextEvent.prizes}</span>
                    </div>
                  )}
                </div>
              </div>
            </button>

            {/* Other Events Button below the card */}
            <div className="flex justify-center mt-10">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/20 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10 transition-colors shadow-md shadow-primary/5"
              >
                <span className="material-symbols-outlined text-base">event_note</span>
                View Other Events
              </Link>
            </div>
          </div>
        </motion.section>
      )}



      <Footer />



    </>
  );
};
export default Landing;

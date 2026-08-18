import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import fresherImg from '../assets/fresher_league_recap_1775765383248.png';
import grandSwissImg from '../assets/grand_swiss_recap_1775765397656.png';
import fideImg from '../assets/fide.png';
import featuredEventImg from '../assets/featured_event.png';
import lolImg from "../assets/lol_poster.png";
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import Footer from '../components/Footer';
import tanmayImg from "../assets/exCoordinators/tanmay.jpg";
import akshatImg from "../assets/exCoordinators/akshat.png";
import kushagraImg from "../assets/exCoordinators/kushagra.jpg";
import pulkitImg from "../assets/exCoordinators/pulkit.jpg";
import { API_BASE_URL } from '../config';
import FloatingChessPieces from '../components/FloatingChessPieces';

import handLeftImg from '../assets/hero/hand_left.png';
import handRightImg from '../assets/hero/hand_right.png';
import kingBeigeImg from '../assets/hero/king_beige.png';
import queenGreenImg from '../assets/hero/queen_green.png';

const Landing = () => {
  const { isLoggedIn } = useAuth();
  const [nextEvent, setNextEvent] = useState(null);
  const heroRef = useRef(null);

  // Scroll tracking across the pinned container (520vh for 4 smooth in-place stages with generous pacing)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  // STAGE 1: Smooth outward movement of hands when scrolling down (clears by 0.18)
  const leftHandX = useTransform(scrollYProgress, [0, 0.18], ["0%", "-150%"]);
  const rightHandX = useTransform(scrollYProgress, [0, 0.18], ["0%", "150%"]);
  const handsOpacity = useTransform(scrollYProgress, [0, 0.12, 0.18], [1, 0.7, 0]);

  // Center "CHESS CLUB IITK" zooms forward into the screen and dissolves away
  const centerScale = useTransform(scrollYProgress, [0, 0.20], [1, 8]);
  const centerOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18], [1, 0.8, 0]);
  const heroVisibility = useTransform(scrollYProgress, v => (v >= 0.20 ? 'none' : 'block'));
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // STAGE 2: About Section materializes in-place in center of screen, stays readable, then dissolves
  const aboutOpacity = useTransform(scrollYProgress, [0.16, 0.23, 0.38, 0.44], [0, 1, 1, 0]);
  const aboutScale = useTransform(scrollYProgress, [0.16, 0.23, 0.38, 0.44], [0.92, 1, 1, 1.08]);
  const aboutPointerEvents = useTransform(scrollYProgress, v => (v >= 0.20 && v <= 0.41 ? 'auto' : 'none'));
  const aboutVisibility = useTransform(scrollYProgress, v => (v < 0.14 || v > 0.46 ? 'none' : 'flex'));

  // STAGE 3: Dedicated Club Stats Section materializes in-place, stays readable, then dissolves
  const statsOpacity = useTransform(scrollYProgress, [0.42, 0.49, 0.64, 0.70], [0, 1, 1, 0]);
  const statsScale = useTransform(scrollYProgress, [0.42, 0.49, 0.64, 0.70], [0.92, 1, 1, 1.08]);
  const statsPointerEvents = useTransform(scrollYProgress, v => (v >= 0.46 && v <= 0.67 ? 'auto' : 'none'));
  const statsVisibility = useTransform(scrollYProgress, v => (v < 0.40 || v > 0.72 ? 'none' : 'flex'));

  // STAGE 4: Upcoming Event materializes in-place in center of screen and HOLDS steadily with delay
  const eventOpacity = useTransform(scrollYProgress, [0.68, 0.76, 1.0], [0, 1, 1]);
  const eventScale = useTransform(scrollYProgress, [0.68, 0.76], [0.92, 1]);
  const eventPointerEvents = useTransform(scrollYProgress, v => (v >= 0.72 ? 'auto' : 'none'));
  const eventVisibility = useTransform(scrollYProgress, v => (v < 0.66 ? 'none' : 'flex'));

  useEffect(() => {
    // Delay preloading by 2 seconds to prioritize main landing page resources
    const timer = setTimeout(() => {
      const imagesToPreload = [tanmayImg, akshatImg, kushagraImg, pulkitImg, handLeftImg, handRightImg, kingBeigeImg, queenGreenImg];
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchNextEvent = async () => {
      let data = globalCache.events;
      if (!data) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/events`);
          if (res.ok) {
            data = await res.json();
            globalCache.events = data;
          }
        } catch (e) {}
      }
      if (data && Array.isArray(data)) {
        const today = new Date();
        today.setHours(0,0,0,0);
        
        // format and filter
        const upcoming = data.map(evt => ({
          id: evt.id,
          title: evt.title,
          date: evt.event_date,
          endDate: evt.event_end_date,
          tag: evt.event_type,
          shortDesc: evt.short_description,
          location: evt.location,
          format: evt.format
        })).filter(evt => {
          const compareDate = new Date(evt.endDate || evt.date);
          compareDate.setHours(0,0,0,0);
          return compareDate >= today;
        });
        
        if (upcoming.length > 0) {
          // Sort by date ascending
          upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
          setNextEvent(upcoming[0]);
        }
      }
    };
    fetchNextEvent();
  }, []);

  // Helper to map event to image
  const getEventImage = (event) => {
    if (!event) return featuredEventImg;
    const t = String(event.title).toLowerCase();
    if (t.includes('league of legends')) return lolImg;
    if (t.includes("fresher's chess") || t.includes("freshers chess")) return fresherImg;
    if (t.includes('grand swiss')) return grandSwissImg;
    if (t.includes('fide rated') || t.includes('fide open')) return fideImg;
    return featuredEventImg;
  };

  return (
    <>
      {/* SVG Filters for Dot Matrix and Tints */}
      <svg className="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
        <defs>
          <filter id="dot-matrix-beige">
            <feColorMatrix 
              type="matrix" 
              values="
                0.88 0 0 0 0.08
                0 0.84 0 0 0.08
                0 0 0.76 0 0.08
                0 0 0 1 0" 
            />
          </filter>
          <filter id="dot-matrix-green">
            <feColorMatrix 
              type="matrix" 
              values="
                0.13 0 0 0 0.02
                0 0.55 0 0 0.05
                0 0 0.13 0 0.02
                0 0 0 1 0" 
            />
          </filter>
        </defs>
      </svg>

      {/* Unified 4-Stage Pinned Experience Container */}
      <div ref={heroRef} className="relative h-[520vh] bg-[#121212]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#121212]">
          
          {/* Subtle Aesthetic Cross Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.14] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1.2px, transparent 0)`,
              backgroundSize: '44px 44px'
            }}
          />

          {/* Dynamic Floating Chess Pieces */}
          <FloatingChessPieces />

          {/* Vignette & Soft Center Glow */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#121212]/50 to-[#121212] pointer-events-none z-0" />
          <div className="absolute w-[500px] h-[300px] rounded-full bg-primary/5 blur-[140px] pointer-events-none z-0" />

          {/* STAGE 1: HERO (Hands + King & Queen + Center Title) */}
          <motion.div 
            style={{ display: heroVisibility }}
            className="absolute inset-0 pointer-events-none z-10 select-none"
          >
            {/* Left Hand + Warm Beige King */}
            <motion.div 
              style={{ x: leftHandX, opacity: handsOpacity }}
              className="absolute left-[-100px] sm:left--15 md:left--7 lg:left--0.001 top-1/2 -translate-y-1/2 pointer-events-none z-20 flex items-center"
            >
              <div className="relative w-[180px] sm:w-[260px] md:w-[320px] lg:w-[380px]">
                {/* King piece in FRONT (#E0D5C1 warm beige with dot matrix positioned right at the fingertips) */}
                <img 
                  src={kingBeigeImg} 
                  alt="Beige King" 
                  className="absolute top-[48%] left-[88%] -translate-x-1/2 -translate-y-1/2 w-[46px] sm:w-[66px] md:w-[82px] lg:w-[98px] rotate-[28deg] drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]"
                  style={{ zIndex: 10, filter: 'drop-shadow(0 0 1px rgba(224,213,193,0.3))' }}
                />
                {/* Left Hand in BACK */}
                <img 
                  src={handLeftImg} 
                  alt="Left Hand" 
                  className="relative w-full h-auto drop-shadow-[0_16px_36px_rgba(0,0,0,0.95)]"
                  style={{ zIndex: 1 }}
                />
              </div>
            </motion.div>

            {/* Right Hand + Green Tinted Queen */}
            <motion.div 
              style={{ x: rightHandX, opacity: handsOpacity }}
              className="absolute right-[-100px] sm:right--2 md:right--4 lg:right--1 top-[35%] -translate-y-1/2 pointer-events-none z-20 flex items-center justify-end"
            >
              <div className="relative w-[180px] sm:w-[260px] md:w-[320px] lg:w-[380px]">
                {/* Queen piece in FRONT (#228B22 green tint with dot matrix positioned right at the fingertip) */}
                <img 
                  src={queenGreenImg} 
                  alt="Green Queen" 
                  className="absolute top-[50%] left-[4%] -translate-x-1/2 -translate-y-1/2 w-[46px] sm:w-[66px] md:w-[82px] lg:w-[98px] -rotate-[18deg] drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]"
                  style={{ zIndex: 10, filter: 'drop-shadow(0 0 1px rgba(34,139,34,0.3))' }}
                />
                {/* Right Hand in BACK */}
                <img 
                  src={handRightImg} 
                  alt="Right Hand" 
                  className="relative w-full h-auto drop-shadow-[0_16px_36px_rgba(0,0,0,0.95)]"
                  style={{ zIndex: 1 }}
                />
              </div>
            </motion.div>

            {/* Center Brand Title */}
            <motion.div
              style={{ 
                opacity: centerOpacity, 
                scale: centerScale
              }}
              className="absolute inset-0 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-black tracking-tight uppercase leading-[0.95] text-[#e5e2e1] drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)] text-center">
                CHESS CLUB
                <span className="block text-primary mt-3 sm:mt-4 font-sans font-black tracking-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-[0_10px_25px_rgba(242,202,80,0.3)]">
                  IITK
                </span>
              </h1>

              {/* Scroll Indicator */}
              <motion.div 
                style={{ opacity: scrollIndicatorOpacity }}
                className="mt-10 flex flex-col items-center gap-2"
              >
                <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-on-surface-variant/70">
                  Scroll to Explore
                </span>
                <span className="material-symbols-outlined text-sm text-primary animate-bounce">
                  keyboard_arrow_down
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* STAGE 2: ABOUT CHESS CLUB (Transitions seamlessly in-place in the center of the screen!) */}
          <motion.div
            style={{
              opacity: aboutOpacity,
              scale: aboutScale,
              pointerEvents: aboutPointerEvents,
              display: aboutVisibility
            }}
            className="absolute inset-0 z-20 w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center py-6 overflow-y-auto"
          >
            <div className="text-center mb-6 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-on-surface">About Chess Club</h2>
              <p className="mt-4 text-zinc-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                Welcome to the Chess Club IIT Kanpur. Our mission is to foster intellectual growth, strategic thinking, and camaraderie through the timeless game of chess. We invite you to explore our upcoming schedules, participate in our organised events.
              </p>
              <p className="mt-3 text-primary font-bold text-xs sm:text-sm md:text-base tracking-[0.2em] uppercase font-label">
                Discover your next move.
              </p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-2">
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
              ].map((card) => (
                <div key={card.id} className="relative group cursor-pointer h-full">
                  <div className="relative z-10 rounded-2xl border border-outline-variant/15 bg-gradient-to-br from-surface-container-high/60 to-surface-container/20 backdrop-blur-md p-6 h-full min-h-[220px] md:min-h-[260px] flex flex-col justify-between overflow-hidden group-hover:scale-[1.02] group-hover:border-primary/40 group-hover:shadow-[0_12px_36px_rgba(242,202,80,0.12)] transition-all duration-500">
                    <div className="absolute inset-0 bg-[#f2ca50] scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left duration-500 ease-in-out z-0 pointer-events-none"></div>
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none z-10"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-10"></div>
                    <div className="relative z-20 flex flex-col h-full flex-1">
                      <div className="w-full flex flex-col items-center">
                        <div className="min-h-[50px] flex items-center justify-center w-full">
                          <h3 className="text-lg sm:text-xl font-serif text-on-surface group-hover:text-[#131313] transition-colors duration-500 leading-snug text-center w-full">
                            {card.title}
                          </h3>
                        </div>
                        <div className="w-12 h-[1.5px] bg-[#d4af37]/30 group-hover:bg-[#3c2f00]/40 mt-2 transition-colors duration-500"></div>
                      </div>
                      {card.desc && (
                        <p className="mt-4 text-xs text-on-surface-variant group-hover:text-[#251a00]/80 transition-colors duration-500 leading-relaxed text-center">
                          {card.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* STAGE 3: DEDICATED CLUB STATS (Materializes in-place with rich animated cards!) */}
          <motion.div
            style={{
              opacity: statsOpacity,
              scale: statsScale,
              pointerEvents: statsPointerEvents,
              display: statsVisibility
            }}
            className="absolute inset-0 z-25 w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center py-6 overflow-y-auto"
          >
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <span className="text-primary font-label text-xs tracking-[0.3em] uppercase">Impact & Heritage</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-on-surface mt-1">Our Impact</h2>
              <p className="mt-3 text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Fostering high-stakes competitive chess and empowering strategic thinkers across IIT Kanpur.
              </p>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[
                {
                  icon: "groups",
                  value: "800+",
                  label: "Community",
                  desc: "Students, contenders, and enthusiasts."
                },
                {
                  icon: "emoji_events",
                  value: "₹2.5L+",
                  label: "Prize Pool Awarded",
                  desc: "Cash prizes and trophies distributed across official championships."
                },
                {
                  icon: "history_edu",
                  value: "18+",
                  label: "Years of Legacy",
                  desc: "Archiving strategic brilliance and competitive spirit since 2007."
                },
                {
                  icon: "event_available",
                  value: "60+",
                  label: "Events Conducted",
                  desc: "FIDE Opens, CMPL, Blitz Arenas, and international guest talk shows."
                }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-3xl border border-outline-variant/15 bg-gradient-to-br from-surface-container-high/70 to-surface-container/30 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden hover:border-primary/40 hover:scale-[1.03] hover:shadow-[0_15px_40px_rgba(242,202,80,0.15)] transition-all duration-500 cursor-pointer shadow-xl shadow-black/40"
                >
                  <div className="absolute inset-0 bg-[#f2ca50] scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500 ease-in-out z-0 pointer-events-none opacity-90"></div>
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors pointer-events-none z-10"></div>
                  
                  <div className="relative z-20 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-[#131313]/10 flex items-center justify-center text-primary group-hover:text-[#131313] transition-colors duration-500">
                          <span className="material-symbols-outlined text-2xl">
                            {stat.icon}
                          </span>
                        </div>
                      </div>

                      <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#f2ca50] group-hover:text-[#131313] tracking-tight leading-none transition-colors duration-500 mb-2">
                        {stat.value}
                      </div>

                      <h3 className="text-sm sm:text-base font-serif font-bold text-on-surface group-hover:text-[#131313] uppercase tracking-wider transition-colors duration-500 mb-2">
                        {stat.label}
                      </h3>
                    </div>

                    <p className="text-xs text-zinc-400 group-hover:text-[#251a00]/80 leading-relaxed transition-colors duration-500 font-body mt-2">
                      {stat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* STAGE 4: UPCOMING EVENT (Materializes in-place in the center of the screen!) */}
          {nextEvent && (
            <motion.div
              style={{
                opacity: eventOpacity,
                scale: eventScale,
                pointerEvents: eventPointerEvents,
                display: eventVisibility
              }}
              className="absolute inset-0 z-30 w-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center py-6 overflow-y-auto"
            >
              <div className="text-center mb-6">
                <span className="text-primary font-label text-xs tracking-[0.3em] uppercase">Featured Arena</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-on-surface mt-1">Upcoming Event</h2>
              </div>

              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-event-details-modal'))}
                className="w-full text-left rounded-3xl border border-[#4d4635]/30 bg-gradient-to-br from-surface-container-high/90 to-surface-container/60 backdrop-blur-xl hover:border-primary/50 hover:shadow-[0_0_50px_rgba(242,202,80,0.2)] transition-all duration-700 flex flex-col md:flex-row overflow-hidden group cursor-pointer relative shadow-2xl shadow-black/80"
              >
                {/* Smooth Golden Hover Fill Overlay */}
                <div className="absolute inset-0 bg-[#f2ca50] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out z-0 pointer-events-none"></div>

                {/* Event Image Container */}
                <div className="w-full md:w-[45%] relative aspect-[16/10] md:aspect-auto md:min-h-[300px] shrink-0 overflow-hidden z-10">
                  <img
                    alt={nextEvent.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    src={getEventImage(nextEvent)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-surface/70 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-[#d4af37]/5 mix-blend-overlay"></div>

                  {/* Event Tag Floating Badge */}
                  {nextEvent.tag && (
                    <span className="absolute top-4 left-4 px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-surface/90 text-primary border border-primary/30 rounded-full backdrop-blur-sm shadow-md">
                      {nextEvent.tag}
                    </span>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 min-w-0 relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#d4af37]/70 group-hover:text-[#3c2f00]/70 transition-colors duration-700">
                        Spotlight Event
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-[#3c2f00] transition-colors duration-700">
                        <span>View details</span>
                        <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1.5 transition-all duration-300">
                          arrow_forward
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif text-on-surface font-semibold tracking-tight leading-tight group-hover:text-[#251a00] transition-colors duration-700">
                      {nextEvent.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-on-surface-variant/80 group-hover:text-[#251a00]/90 transition-colors duration-700 line-clamp-3 leading-relaxed font-body">
                      {nextEvent.shortDesc}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-outline-variant/15 group-hover:border-[#3c2f00]/25 transition-colors duration-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-on-surface-variant/90 group-hover:text-[#3c2f00]/90">
                    <div className="flex flex-col gap-2 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[16px] text-primary group-hover:text-[#3c2f00] transition-colors duration-700 shrink-0">calendar_today</span>
                        <span className="font-medium tracking-wide">{nextEvent.date}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[16px] text-primary group-hover:text-[#3c2f00] transition-colors duration-700 shrink-0">location_on</span>
                        <span className="font-medium tracking-wide truncate max-w-[240px]">{nextEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[16px] text-primary group-hover:text-[#3c2f00] transition-colors duration-700 shrink-0">sports_esports</span>
                        <span className="font-medium tracking-wide truncate max-w-[280px]">{nextEvent.format || "Tournament System"}</span>
                      </div>
                    </div>
                    {nextEvent.prizes && (
                      <div className="flex items-center gap-2 border border-primary/30 bg-primary/5 px-3.5 py-2 rounded-xl max-w-sm truncate shrink-0 shadow-lg shadow-black/20 group-hover:border-[#3c2f00]/30 group-hover:bg-[#3c2f00]/10 group-hover:text-[#3c2f00] transition-all duration-700">
                        <span className="material-symbols-outlined text-[16px] text-primary group-hover:text-[#3c2f00] transition-colors duration-700 shrink-0">emoji_events</span>
                        <span className="truncate font-bold tracking-wide text-primary group-hover:text-[#3c2f00] text-[10px] uppercase transition-colors duration-700">{nextEvent.prizes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* Other Events CTA Button */}
              <div className="flex justify-center mt-6">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-primary/30 bg-primary/10 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-surface transition-all duration-300 shadow-lg shadow-primary/10"
                >
                  <span className="material-symbols-outlined text-sm">event_note</span>
                  View All Tournaments
                </Link>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Original Footer positioned below pinned section so user scrolls into it */}
      <Footer />
    </>
  );
};
export default Landing;

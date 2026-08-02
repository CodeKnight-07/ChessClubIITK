import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import tournamentImg from '../assets/chess_tournament_gallery_1775821881801.png';
import workshopImg from '../assets/chess_workshop_gallery_1775821901249.png';
import socialImg from '../assets/chess_social_gallery_1775821917712.png';

// Import custom Gallery assets
import img2 from '../Gallery/3 3.png';
import img3 from '../Gallery/Untitled design (19).png';
import img4 from '../Gallery/6.png';
import img5 from '../Gallery/4.png';
import img6 from '../Gallery/2 3.png';
import img7 from '../Gallery/5.png';
import img8 from '../Gallery/8.png';
import img9 from '../Gallery/9.png';
import img10 from '../Gallery/SCHOOL VISIT.png';

// Dynamically import all images in the FIDE RATED folder using Vite's glob import
const FIDE_IMAGES_GLOB = import.meta.glob('../Gallery/FIDE RATED/*.{png,jpg,jpeg,PNG,JPG,JPEG}', { eager: true });
const FIDE_RATED_PHOTOS = Object.values(FIDE_IMAGES_GLOB).map(module => module.default);

// Dynamically import all images in the Street Chess folder using Vite's glob import
const STREET_CHESS_GLOB = import.meta.glob('../assets/Street Chess/*.{png,jpg,jpeg,PNG,JPG,JPEG}', { eager: true });
const STREET_CHESS_PHOTOS = Object.values(STREET_CHESS_GLOB).map(module => module.default);

// Dynamically import all images in the Grand Swiss folder using Vite's glob import
const GRAND_SWISS_GLOB = import.meta.glob('../assets/Grand Swiss/*.{png,jpg,jpeg,PNG,JPG,JPEG}', { eager: true });
const GRAND_SWISS_PHOTOS = Object.values(GRAND_SWISS_GLOB).map(module => module.default);

// Extract the specific 1-indexed photos (1, 3, 13, 15, 17, and the last photo in the folder) for the spotlight slideshow
const SLIDESHOW_PHOTOS = FIDE_RATED_PHOTOS.length >= 17
  ? [
    FIDE_RATED_PHOTOS[0],   // Photo 1
    FIDE_RATED_PHOTOS[2],   // Photo 3
    FIDE_RATED_PHOTOS[13],  // Photo 13
    FIDE_RATED_PHOTOS[15],  // Photo 15
    FIDE_RATED_PHOTOS[17],  // Photo 17
    FIDE_RATED_PHOTOS[FIDE_RATED_PHOTOS.length - 1] // Last photo in the folder
  ]
  : FIDE_RATED_PHOTOS;

const GALLERY_IMAGES = [
  {
    id: 1,
    category: 'Tournaments',
    title: 'SBI GIC Ltd. Presents FIDE Rated Open Rapid Chess Tournament 2026',
    image: tournamentImg,
    photos: FIDE_RATED_PHOTOS,
    description: 'High-stakes tactical battles at IIT Kanpur. Click the photo to view the full gallery.'
  },
  {
    id: 2,
    category: 'Workshops',
    title: 'Chess in Slums',
    image: img2,
    description: 'Deconstructing the Sicilian Defense with our core team.'
  },
  {
    id: 3,
    category: 'Socials',
    title: 'We The Ones',
    image: img3,
    description: 'Late night sessions filled with coffee and 3-minute madness.'
  },
  {
    id: 4,
    category: 'Tournaments',
    title: 'IITK Grand Swiss',
    image: img4,
    photos: GRAND_SWISS_PHOTOS,
    description: 'The road to the candidates starts here. Click the photo to view the tournament gallery.'
  },
  {
    id: 5,
    category: 'Workshops',
    title: 'School Visits',
    image: img5,
    description: 'Empowering the next generation of grandmasters.'
  },
  {
    id: 6,
    category: 'Socials',
    title: 'Tournament Visits',
    image: img6,
    description: 'Travelling to and participating in regional tournaments to represent the spirit of IIT Kanpur.'
  },
  {
    id: 7,
    category: 'Socials',
    title: 'Torch Relay',
    image: img7,
    description: 'Carrying the flame of sportsmanship across campus during the Udghosh Torch Relay.'
  },
  {
    id: 8,
    category: 'Tournaments',
    title: 'IITK Chess Cup',
    image: img8,
    description: 'The premier annual over-the-board tournament crowning the Chess King of IIT Kanpur.'
  },
  {
    id: 9,
    category: 'Tournaments',
    title: 'Freshers',
    image: img9,
    description: 'Welcoming the incoming batch of novices and enthusiasts with our annual Freshers Tournament.'
  },
  {
    id: 10,
    category: 'Tournaments',
    title: 'Qualifiers|UDGHOSH',
    image: img10,
    description: 'High-tension qualifying matches selecting the official IITK team for the Udghosh Inter-College Festival.'
  },
];

const CATEGORIES = ['All', 'Tournaments', 'Workshops', 'Socials'];

// CURRENT_YEAR_EVENTS: Add new active season (2026-2027) events here.
// When new tournaments or showcases are played, simply add them as an object:
// { id, title, tag, date, coverImage, photos, description }
const CURRENT_YEAR_EVENTS = [
  {
    id: 'current-street-chess',
    title: 'Street Chess 2026',
    tag: 'Street Showcase',
    date: 'Nov 12, 2026',
    coverImage: STREET_CHESS_PHOTOS.length > 0 ? STREET_CHESS_PHOTOS[0] : workshopImg,
    photos: STREET_CHESS_PHOTOS,
    description: 'Bringing the game of chess to the campus streets! Casual, blitz, and speed matchplays on public tables open for all passersby.'
  }
  // Add new events here:
  /*
  {
    id: 'current-next-event',
    title: 'Your Next Tournament Name',
    tag: 'Tournament Type',
    date: 'Date of Event',
    coverImage: nextEventCoverImage,
    photos: nextEventPhotosArray,
    description: 'Brief description of the event.'
  }
  */
];

// 3D Diary Book Single Page Component
const DiaryPage = ({ event, pageNumber, isLeftPage, onPhotoClick }) => {
  if (!event) return null;

  return (
    <div className={`w-full h-full bg-[#FAF6EE] p-4 sm:p-6 md:p-10 flex flex-col justify-between relative overflow-hidden select-none ${isLeftPage ? 'shadow-[inset_10px_0_20px_rgba(0,0,0,0.05),inset_0_4px_10px_rgba(0,0,0,0.03)] border-r border-black/5' : 'shadow-[inset_-10px_0_20px_rgba(0,0,0,0.05),inset_0_4px_10px_rgba(0,0,0,0.03)]'}`}>
      {/* Page lines texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
      
      {/* Spine crease shadow */}
      <div className={`absolute ${isLeftPage ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} top-0 h-full w-[25px] from-black/15 via-black/5 to-transparent pointer-events-none z-10`} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-between py-2 sm:py-4 h-full">
        {/* Top Header details */}
        <div className="w-full text-center mb-2 sm:mb-3">
          {event.category && (
            <div className="mb-1 px-2.5 py-0.5 rounded border-2 border-red-800/40 text-red-800/85 font-mono text-[8px] sm:text-[10px] font-extrabold uppercase tracking-widest rotate-[-2deg] inline-block bg-red-800/[0.04] shadow-[0_0_2px_rgba(153,27,27,0.15)]">
              {event.category}
            </div>
          )}
          <h3 className="font-serif italic text-xs sm:text-sm md:text-base lg:text-lg text-[#2d2417] leading-tight font-bold px-2 line-clamp-1">
            {event.title}
          </h3>
        </div>

        {/* Polaroid Image */}
        <div 
          onClick={() => onPhotoClick && event.photos && onPhotoClick(event.photos, event.title)}
          className={`bg-white p-2 pb-5 sm:pb-6 rounded shadow-[0_4px_10px_rgba(0,0,0,0.15)] border border-zinc-200/40 w-full max-w-[95%] sm:max-w-[88%] md:max-w-[82%] rotate-[1.5deg] relative my-auto ${event.photos ? 'cursor-zoom-in hover:scale-[1.02] active:scale-[0.98] transition-all duration-300' : ''}`}
        >
          {/* Taped corners */}
          <div className="absolute w-8 h-3 bg-yellow-100/30 backdrop-blur-[0.5px] border border-white/20 shadow-sm -rotate-45 -top-2 -left-2.5" />
          <div className="absolute w-8 h-3 bg-yellow-100/30 backdrop-blur-[0.5px] border border-white/20 shadow-sm rotate-45 -top-2 -right-2.5" />

          <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 border border-zinc-200/10">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
              draggable="false"
            />
          </div>
        </div>

        {/* Bottom Description */}
        <div className="w-full text-center mt-3 sm:mt-5 px-2">
          {/* Ink Divider */}
          <div className="w-12 h-[1px] bg-[#8a7f6e]/30 mx-auto mb-2 sm:mb-3" />
          <p className="text-[#42392c] font-serif text-[10px] sm:text-xs md:text-sm lg:text-base leading-normal sm:leading-relaxed italic opacity-95 line-clamp-3 md:line-clamp-4">
            {event.description}
          </p>
        </div>
      </div>

      {/* Page Number */}
      <div className={`absolute bottom-3 ${isLeftPage ? 'left-6' : 'right-6'} font-handwritten text-sm text-[#8a7f6e]/70 select-none`}>
        — {pageNumber} —
      </div>
    </div>
  );
};

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentSpread, setCurrentSpread] = useState(0);
  const [previousSpread, setPreviousSpread] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animDirection, setAnimDirection] = useState('next');
  const [isOpenLightbox, setIsOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [lightboxTitle, setLightboxTitle] = useState('');



  // Slideshow interval timer (5 seconds)
  useEffect(() => {
    if (SLIDESHOW_PHOTOS.length <= 1) return;
    const interval = setInterval(() => {
      setSlideshowIndex(prev => (prev + 1) % SLIDESHOW_PHOTOS.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Preload slideshow photos to prevent sudden flashes or delays during transitions
  useEffect(() => {
    if (SLIDESHOW_PHOTOS.length === 0) return;
    SLIDESHOW_PHOTOS.forEach(photo => {
      const img = new Image();
      img.src = photo;
    });
  }, []);

  const handleSpotlightClick = () => {
    if (SLIDESHOW_PHOTOS.length === 0) return;
    const currentPhoto = SLIDESHOW_PHOTOS[slideshowIndex];
    const mainIndex = FIDE_RATED_PHOTOS.indexOf(currentPhoto);
    setLightboxPhotos(FIDE_RATED_PHOTOS);
    setLightboxTitle('SBI GIC Ltd. Presents FIDE Rated Open Rapid Chess Tournament 2026');
    setLightboxIndex(mainIndex !== -1 ? mainIndex : 0);
    setIsOpenLightbox(true);
  };

  const openExhibition = (photos, title, startIdx = 0) => {
    if (!photos || photos.length === 0) return;
    setLightboxPhotos(photos);
    setLightboxTitle(title);
    setLightboxIndex(startIdx);
    setIsOpenLightbox(true);
  };

  // Measure container width for responsive calculations
  useEffect(() => {
    if (!containerRef.current) return;

    setContainerWidth(containerRef.current.offsetWidth);

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentSpread(0);
    setPreviousSpread(0);
    setIsAnimating(false);
  };

  const handleNext = () => {
    const totalSpreads = Math.ceil(carouselImages.length / 2);
    if (isAnimating || totalSpreads <= 1) return;
    setAnimDirection('next');
    setPreviousSpread(currentSpread);
    setCurrentSpread(prev => (prev + 1) % totalSpreads);
    setIsAnimating(true);
  };

  const handlePrev = () => {
    const totalSpreads = Math.ceil(carouselImages.length / 2);
    if (isAnimating || totalSpreads <= 1) return;
    setAnimDirection('prev');
    setPreviousSpread(currentSpread);
    setCurrentSpread(prev => (prev - 1 + totalSpreads) % totalSpreads);
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };



  // Helper to map index to wrapped relative offset in [-total/2, total/2]
  const getRelativeIndex = (index, centerIndex, total) => {
    let diff = index - centerIndex;
    while (diff < -total / 2) diff += total;
    while (diff > total / 2) diff -= total;
    return diff;
  };

  const handleNextPhoto = () => {
    if (lightboxPhotos.length === 0) return;
    setLightboxIndex(prev => (prev + 1) % lightboxPhotos.length);
  };

  const handlePrevPhoto = () => {
    if (lightboxPhotos.length === 0) return;
    setLightboxIndex(prev => (prev - 1 + lightboxPhotos.length) % lightboxPhotos.length);
  };

  // Keyboard navigation listener for lightbox modal
  useEffect(() => {
    if (!isOpenLightbox) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      } else if (e.key === 'Escape') {
        setIsOpenLightbox(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenLightbox]);

  const fideTournament = GALLERY_IMAGES.find(img => img.id === 1);
  const otherImages = GALLERY_IMAGES.filter(img => img.id !== 1);

  // Determine if spotlight should show (only for All or Tournaments category)
  const showSpotlight = activeCategory === 'All' || activeCategory === 'Tournaments';

  // Filter remaining images for the carousel
  const carouselImages = otherImages.filter(img =>
    activeCategory === 'All' ? true : img.category === activeCategory
  );

  return (

    <div className="px-6 md:px-12 pb-20 max-w-7xl mx-auto min-h-screen">
      <header className="py-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary font-label text-xs tracking-[0.4em] uppercase mb-4"
        >
          Visual Archive
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-serif italic mb-8"
        >
          The Gallery of <span className="text-primary">Kings</span>
        </motion.h1>

      </header>

      {/* Featured FIDE Tournament Spotlight (Top) */}
      <AnimatePresence mode="wait">
        {showSpotlight && fideTournament && (
          <motion.div
            key="spotlight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-20 bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-primary/20 hover:shadow-lg transition-all shadow-2xl max-w-5xl mx-auto group"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Image side */}
              <div className="lg:w-3/5 relative aspect-[16/10] overflow-hidden flex-shrink-0">
                <AnimatePresence>
                  <motion.img
                    key={slideshowIndex}
                    src={SLIDESHOW_PHOTOS[slideshowIndex]}
                    alt={fideTournament.title}
                    initial={{ opacity: 0, zIndex: 2 }}
                    animate={{ opacity: 1, zIndex: 2 }}
                    exit={{ opacity: 1, zIndex: 1 }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-surface-container-low opacity-80 pointer-events-none z-10"></div>
                <div className="absolute top-4 left-4 bg-primary text-on-primary font-label text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md z-10">
                  FIDE Rated
                </div>
              </div>

              {/* Content side */}
              <div className="lg:w-2/5 p-8 lg:p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-outline-variant/10">
                <span className="text-[10px] font-label text-primary uppercase tracking-[0.3em] mb-3 block">
                  Featured Tournament
                </span>
                <h2 className="text-3xl font-serif text-on-surface mb-4 leading-tight group-hover:text-primary transition-colors">
                  {fideTournament.title}
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {fideTournament.description}
                </p>

                {/* View Gallery CTA Button */}
                <button
                  onClick={handleSpotlightClick}
                  className="mt-8 self-start bg-primary text-on-primary font-bold px-6 py-3 rounded-lg shadow-lg hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-2 hover:bg-primary-container outline-none"
                >
                  <span className="material-symbols-outlined text-lg">photo_library</span>
                  <span>View Captures ({FIDE_RATED_PHOTOS.length})</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Season Exhibition (New Section) */}
      <section className="mb-24 max-w-5xl mx-auto">
        <div className="text-center md:text-left mb-10">
          <p className="text-primary font-label text-xs tracking-[0.3em] uppercase mb-2">
            Active Season
          </p>
          <h2 className="text-4xl font-serif text-on-surface">
            This year events
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CURRENT_YEAR_EVENTS.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#1b1916] rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-primary/20 hover:shadow-[0_12px_40px_rgba(242,202,80,0.08)] transition-all duration-300 flex flex-col justify-between group relative"
            >
              {/* Card Image Wrapper */}
              <div className="relative aspect-[16/11] overflow-hidden">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1916] via-transparent to-transparent pointer-events-none opacity-80" />
                <div className="absolute top-3 left-3 bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm font-label text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                  {event.tag}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-label text-on-surface-variant/60 tracking-wider block mb-2 font-semibold">
                    {event.date}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-6 line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <button
                  onClick={() => openExhibition(event.photos, event.title)}
                  className="w-full bg-[#fafafa]/5 text-on-surface hover:bg-primary hover:text-on-primary font-label text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl border border-outline-variant/10 hover:border-primary transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">filter_hdr</span>
                  <span>View event archive</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3D Diary Book Section (Archives - Bottom) */}
      <div className="relative w-full" ref={containerRef}>
        {carouselImages.length > 0 ? (
          <div className="py-10 flex flex-col items-center">
            <div className="w-full max-w-[900px] mb-6 text-center md:text-left">
              <p className="text-primary font-label text-xs tracking-[0.3em] uppercase mb-2">
                Archives & History
              </p>
              <h3 className="text-3xl font-serif text-on-surface">
                Past Year Events
              </h3>
            </div>

            {/* Book Wrapper */}
            <div
              className="w-full max-w-[900px] aspect-[16/10] sm:aspect-[16/9.5] relative rounded-2xl bg-[#2d1f10] border-4 border-[#3e2c17] shadow-[0_25px_60px_rgba(0,0,0,0.65),inset_0_0_30px_rgba(0,0,0,0.8)] p-2 sm:p-3 group"
              style={{
                perspective: '2000px',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Gold Metal Corners */}
              <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]/80 rounded-tl-lg pointer-events-none z-30 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.2)]" />
              <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]/80 rounded-tr-lg pointer-events-none z-30 shadow-[inset_-1px_1px_3px_rgba(255,255,255,0.2)]" />
              <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]/80 rounded-bl-lg pointer-events-none z-30 shadow-[inset_1px_-1px_3px_rgba(255,255,255,0.2)]" />
              <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]/80 rounded-br-lg pointer-events-none z-30 shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.2)]" />

              {/* Silk Ribbon Bookmark */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 bottom-[-16px] w-3.5 h-10 bg-red-700/90 rounded-b-md shadow-md z-30 transition-transform duration-300 origin-top hover:scale-y-110 pointer-events-auto" 
                title="Archival Ribbon"
              />
              {/* Inner Pages container */}
              <div 
                className="w-full h-full relative rounded-lg overflow-hidden flex shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Static Left Page (Underneath) */}
                <div className="w-1/2 h-full">
                  <DiaryPage 
                    event={
                      isAnimating
                        ? (animDirection === 'next'
                            ? carouselImages[previousSpread * 2]
                            : carouselImages[currentSpread * 2])
                        : carouselImages[currentSpread * 2]
                    }
                    pageNumber={
                      isAnimating
                        ? (animDirection === 'next'
                            ? previousSpread * 2 + 1
                            : currentSpread * 2 + 1)
                        : currentSpread * 2 + 1
                    }
                    isLeftPage={true}
                    onPhotoClick={openExhibition}
                  />
                </div>

                {/* Static Right Page (Underneath) */}
                <div className="w-1/2 h-full">
                  <DiaryPage 
                    event={
                      isAnimating
                        ? (animDirection === 'next'
                            ? carouselImages[currentSpread * 2 + 1]
                            : carouselImages[previousSpread * 2 + 1])
                        : carouselImages[currentSpread * 2 + 1]
                    }
                    pageNumber={
                      isAnimating
                        ? (animDirection === 'next'
                            ? currentSpread * 2 + 2
                            : previousSpread * 2 + 2)
                        : currentSpread * 2 + 2
                    }
                    isLeftPage={false}
                    onPhotoClick={openExhibition}
                  />
                </div>

                {/* Animating Flipping Page Overlay */}
                <AnimatePresence mode="wait">
                  {isAnimating && (
                    <motion.div
                      key={`${currentSpread}-${animDirection}`}
                      initial={{ rotateY: animDirection === 'next' ? 0 : -180 }}
                      animate={{ rotateY: animDirection === 'next' ? -180 : 0 }}
                      exit={{ rotateY: animDirection === 'next' ? -180 : 0 }}
                      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                      onAnimationComplete={handleAnimationComplete}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "50%",
                        height: "100%",
                        transformOrigin: "left center",
                        transformStyle: "preserve-3d",
                        zIndex: 15,
                        pointerEvents: "none"
                      }}
                    >
                      {/* Front Face (Facing up initially, visible 0 -> 90 deg) */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transformStyle: "preserve-3d",
                          transform: "rotateY(0deg)"
                        }}
                      >
                        <DiaryPage 
                          event={
                            animDirection === 'next'
                              ? carouselImages[previousSpread * 2 + 1]
                              : carouselImages[currentSpread * 2 + 1]
                          } 
                          pageNumber={
                            animDirection === 'next'
                              ? previousSpread * 2 + 2
                              : currentSpread * 2 + 2
                          }
                          isLeftPage={false}
                          onPhotoClick={openExhibition}
                        />
                      </div>

                      {/* Back Face (Facing down initially, visible 90 -> 180 deg) */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transformStyle: "preserve-3d",
                          transform: "rotateY(180deg)"
                        }}
                      >
                        <DiaryPage 
                          event={
                            animDirection === 'next'
                              ? carouselImages[currentSpread * 2]
                              : carouselImages[previousSpread * 2]
                          } 
                          pageNumber={
                            animDirection === 'next'
                              ? currentSpread * 2 + 1
                              : previousSpread * 2 + 1
                          }
                          isLeftPage={true}
                          onPhotoClick={openExhibition}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Spine Crease / Binding shadow (Center) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[36px] pointer-events-none z-30 bg-gradient-to-r from-black/0 via-black/30 to-black/0" />
                {/* Binder crease line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[1px] bg-black/25 pointer-events-none z-30" />

                {/* Click Overlay Targets */}
                {!isAnimating && carouselImages.length > 2 && (
                  <>
                    <div
                      onClick={handlePrev}
                      className="absolute left-0 top-0 w-1/2 h-full z-20 cursor-w-resize hover:bg-black/[0.01] transition-colors"
                      title="Previous Pages"
                    />
                    <div
                      onClick={handleNext}
                      className="absolute right-0 top-0 w-1/2 h-full z-20 cursor-e-resize hover:bg-black/[0.01] transition-colors"
                      title="Next Pages"
                    />
                  </>
                )}
              </div>

              {/* Navigation Arrows (Positioned outside the book box) */}
              {carouselImages.length > 2 && (
                <>
                  <button
                    onClick={handlePrev}
                    disabled={isAnimating}
                    className="absolute left-[-20px] sm:left-[-30px] md:left-[-56px] top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-low/95 border border-outline-variant/20 hover:border-primary/50 text-on-surface flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none transition-all shadow-xl outline-none"
                  >
                    <span className="material-symbols-outlined text-xl sm:text-2xl">chevron_left</span>
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={isAnimating}
                    className="absolute right-[-20px] sm:right-[-30px] md:right-[-56px] top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-low/95 border border-outline-variant/20 hover:border-primary/50 text-on-surface flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none transition-all shadow-xl outline-none"
                  >
                    <span className="material-symbols-outlined text-xl sm:text-2xl">chevron_right</span>
                  </button>
                </>
              )}
            </div>
            
            {/* Optional helper text */}
            {carouselImages.length > 2 && (
              <div className="mt-4 text-xs font-label uppercase tracking-widest text-on-surface-variant/60 flex items-center gap-2 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                <span>Click on pages or use arrows to turn • Events {currentSpread * 2 + 1}-{Math.min(currentSpread * 2 + 2, carouselImages.length)} of {carouselImages.length}</span>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center text-on-surface-variant/50 italic">
            No captures found in this archive yet.
          </div>
        )}
      </div>

      {/* Full-Screen Image Lightbox Modal */}
      <AnimatePresence>
        {isOpenLightbox && lightboxPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 outline-none"
          >
            {/* Header Controls */}
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto h-12">
              <div className="text-on-surface/75 text-xs md:text-sm font-label uppercase tracking-widest">
                {lightboxTitle} Capture ({lightboxIndex + 1} / {lightboxPhotos.length})
              </div>
              <button
                onClick={() => setIsOpenLightbox(false)}
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary transition-colors text-on-surface hover:text-on-primary flex items-center justify-center outline-none shadow-lg"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Main Photo Area */}
            <div className="flex-1 flex items-center justify-center relative max-w-7xl mx-auto w-full my-4">
              {/* Previous Button */}
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 md:left-4 z-10 w-12 h-12 rounded-full bg-surface-container-low/80 hover:bg-primary text-on-surface hover:text-on-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none"
              >
                <span className="material-symbols-outlined text-2xl">chevron_left</span>
              </button>

              {/* Active Image */}
              <div className="relative max-h-[68vh] max-w-[85vw] flex items-center justify-center overflow-hidden rounded-xl shadow-2xl border border-outline-variant/10">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={lightboxIndex}
                    src={lightboxPhotos[lightboxIndex]}
                    alt={`${lightboxTitle} Photo ${lightboxIndex + 1}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="max-h-[68vh] max-w-full object-contain rounded-xl"
                  />
                </AnimatePresence>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextPhoto}
                className="absolute right-2 md:right-4 z-10 w-12 h-12 rounded-full bg-surface-container-low/80 hover:bg-primary text-on-surface hover:text-on-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none"
              >
                <span className="material-symbols-outlined text-2xl">chevron_right</span>
              </button>
            </div>

            {/* Thumbnails Footer */}
            <div className="w-full max-w-7xl mx-auto py-4 overflow-x-auto flex justify-center gap-2 border-t border-outline-variant/10">
              {lightboxPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${idx === lightboxIndex
                    ? 'border-primary scale-105 shadow-md shadow-primary/20'
                    : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Decoration */}
      <footer className="mt-32 pt-16 border-t border-outline-variant/5 text-center">
        <p className="text-[10px] font-label uppercase tracking-[0.5em] text-on-surface-variant/30">
          Capturing the soul of the move since 2007
        </p>
      </footer>
    </div>
  );
};

export default Gallery;

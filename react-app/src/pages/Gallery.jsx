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
    description: 'High-stakes tactical battles at IIT Kanpur. Click to view all captures from the event.'
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
    description: 'The road to the candidates starts here.'
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
    description: 'Honoring our graduating legends with one last match.'
  },
  {
    id: 7,
    category: 'Socials',
    title: 'Torch Relay',
    image: img7,
    description: 'Honoring our graduating legends with one last match.'
  },
  {
    id: 8,
    category: 'Tournaments',
    title: 'IITK Chess Cup',
    image: img8,
    description: 'Honoring our graduating legends with one last match.'
  },
  {
    id: 9,
    category: 'Tournaments',
    title: 'Freshers',
    image: img9,
    description: 'Honoring our graduating legends with one last match.'
  },
  {
    id: 10,
    category: 'Tournaments',
    title: 'Qualifiers|UDGHOSH',
    image: img10,
    description: 'Honoring our graduating legends with one last match.'
  },
];

const CATEGORIES = ['All', 'Tournaments', 'Workshops', 'Socials'];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpenLightbox, setIsOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

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
    setLightboxIndex(mainIndex !== -1 ? mainIndex : 0);
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
    setCurrentIndex(0);
  };

  // Helper to map index to wrapped relative offset in [-total/2, total/2]
  const getRelativeIndex = (index, centerIndex, total) => {
    let diff = index - centerIndex;
    while (diff < -total / 2) diff += total;
    while (diff > total / 2) diff -= total;
    return diff;
  };

  const handleNextPhoto = () => {
    setLightboxIndex(prev => (prev + 1) % FIDE_RATED_PHOTOS.length);
  };

  const handlePrevPhoto = () => {
    setLightboxIndex(prev => (prev - 1 + FIDE_RATED_PHOTOS.length) % FIDE_RATED_PHOTOS.length);
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

  const isMobile = containerWidth < 768;
  const cardWidth = isMobile ? containerWidth * 0.74 : containerWidth * 0.28;
  const gap = isMobile ? containerWidth * 0.04 : containerWidth * 0.033;

  // Calculate dynamic container height based on card width aspect ratio + padding for active scaling
  const cardHeight = cardWidth * 1.25;
  const containerHeight = cardHeight + 60;

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
          className="text-6xl font-serif mb-8"
        >
          The Gallery of <div className="text-primary">Chess Club IITK</div>
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

      {/* Horizontal Snapping 3D Coverflow Carousel (Bottom) */}
      <div className="relative w-full" ref={containerRef}>
        {carouselImages.length > 0 ? (
          <div
            className="relative overflow-hidden py-10 w-full"
            style={{
              height: `${containerHeight}px`,
              perspective: '1200px',
              perspectiveOrigin: '50% 50%'
            }}
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(event, info) => {
                const swipe = info.offset.x;
                const velocity = info.velocity.x;
                const N = carouselImages.length;

                if (swipe < -60 || velocity < -400) {
                  setCurrentIndex(prev => (prev + 1) % N);
                } else if (swipe > 60 || velocity > 400) {
                  setCurrentIndex(prev => (prev - 1 + N) % N);
                }
              }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative w-full h-full"
            >
              {carouselImages.map((img, idx) => {
                const d = getRelativeIndex(idx, currentIndex, carouselImages.length);
                const isActive = d === 0;
                const isVisible = Math.abs(d) <= 1;

                return (
                  <motion.div
                    key={img.id}
                    style={{
                      position: 'absolute',
                      width: `${cardWidth}px`,
                      left: '50%',
                      top: '20px',
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden'
                    }}
                    animate={{
                      x: - (cardWidth / 2) + d * (cardWidth * 0.82 + gap),
                      scale: isActive ? 1.05 : 0.90,
                      rotateY: d === 0 ? 0 : (d < 0 ? 35 : -35),
                      z: isActive ? 0 : -150,
                      opacity: isVisible ? (isActive ? 1.0 : 0.45) : 0,
                      zIndex: isActive ? 10 : (isVisible ? 5 : 0),
                      pointerEvents: isActive ? 'auto' : (isVisible ? 'auto' : 'none'),
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 24 }}
                    className="flex-shrink-0 group relative bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary/20 transition-colors shadow-2xl"
                  >
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <img
                        src={img.image}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        draggable="false"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Navigation Buttons (Absolute Overlay) */}
            {carouselImages.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentIndex(prev => (prev - 1 + carouselImages.length) % carouselImages.length)}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-surface-container-low/90 border border-outline-variant/20 hover:border-primary/50 text-on-surface flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl outline-none"
                >
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button
                  onClick={() => setCurrentIndex(prev => (prev + 1) % carouselImages.length)}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-surface-container-low/90 border border-outline-variant/20 hover:border-primary/50 text-on-surface flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl outline-none"
                >
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center text-on-surface-variant/50 ">
            No captures found in this archive yet.
          </div>
        )}
      </div>

      {/* Full-Screen Image Lightbox Modal */}
      <AnimatePresence>
        {isOpenLightbox && FIDE_RATED_PHOTOS.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 outline-none"
          >
            {/* Header Controls */}
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto h-12">
              <div className="text-on-surface/75 text-xs md:text-sm font-label uppercase tracking-widest">
                FIDE Rated Tournament Capture ({lightboxIndex + 1} / {FIDE_RATED_PHOTOS.length})
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
                    src={FIDE_RATED_PHOTOS[lightboxIndex]}
                    alt={`FIDE Rated Tournament Photo ${lightboxIndex + 1}`}
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
              {FIDE_RATED_PHOTOS.map((photo, idx) => (
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
      <footer className="relative mt-20 border-t border-outline-variant/10 bg-surface-container-lowest px-6 py-14 sm:px-8 md:px-12 lg:px-16 before:content-[''] before:absolute before:inset-0 before:bg-surface-container-lowest before:-mx-[100vw] before:z-[-1]">
  <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
    <div className="max-w-md">
      <h6 className="m-0 text-xl font-serif text-primary sm:text-2xl">
        Chess Club IITK
      </h6>
      <p className="mt-4 m-0 max-w-sm text-sm leading-relaxed text-on-surface-variant">
        The official intellectual repository and match-log of the Chess Club at the Indian Institute of Technology, Kanpur. Founded for the love of the game, sustained by the pursuit of logic.
      </p>
    </div>

    <div className="md:max-w-md md:text-right">
      <p className="m-0 text-[10px] font-label uppercase tracking-widest text-primary">
        Connect
      </p>

      <div className="mt-5 flex flex-wrap gap-3 md:justify-end">
        <a
          href="https://www.instagram.com/chessiitk/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          Instagram
        </a>

        <a
          href="mailto:chessiitk21@gmail.com"
          aria-label="Email"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          Email
        </a>

        <a
          href="https://x.com/chessiitk"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          X
        </a>

        <a
          href="https://www.linkedin.com/company/chess-iitk/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          LinkedIn
        </a>

        <a
          href="https://www.facebook.com/chessclubiitk/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          Facebook
        </a>

        <a
          href="https://www.chess.com/club/iitk-chess-club"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chess.com"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          Chess.com
        </a>

        <a
          href="https://www.threads.com/@chessiitk?xmt=AQG0WclpAXcX0l6MVRZkMQ6ltp7AQi8X1H4vyrFo6qXNahU"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Threads"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          Threads
        </a>
      </div>
    </div>
  </div>

  <div className="mt-12 flex flex-col gap-3 border-t border-outline-variant/10 pt-6 text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50 sm:flex-row sm:items-center sm:justify-between">
    <span>© 2024 Chess Club IITK. Intellectual Property Reserved.</span>
    <span>Est. 1960</span>
  </div>
</footer>
    </div>
  );
};

export default Gallery;

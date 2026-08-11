import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { globalCache } from '../utils/cache';
import Footer from '../components/Footer';
import PhotoBook from '../components/PhotoBook';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

// Keep your static UI assets
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

// Dynamically import other casual photos using Vite's glob import
const OTHER_IMAGES_GLOB = import.meta.glob('../Gallery/OTHER PHOTOS/*.{png,jpg,jpeg,PNG,JPG,JPEG}', { eager: true });
const OTHER_PHOTOS = Object.values(OTHER_IMAGES_GLOB).map(module => module.default);

// Extract the specific 1-indexed photos for the spotlight slideshow
const SLIDESHOW_PHOTOS = FIDE_RATED_PHOTOS.length >= 17
  ? [
    FIDE_RATED_PHOTOS[0],   // Photo 1
    FIDE_RATED_PHOTOS[2],   // Photo 3
    FIDE_RATED_PHOTOS[13],  // Photo 13
    FIDE_RATED_PHOTOS[15],  // Photo 15
    FIDE_RATED_PHOTOS[17],  // Photo 17
    FIDE_RATED_PHOTOS[FIDE_RATED_PHOTOS.length - 1] // Last photo
  ]
  : FIDE_RATED_PHOTOS;

// Segment other photos to make sure every static event has a functional gallery of 4-5 images
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
    photos: OTHER_PHOTOS.slice(0, 5),
    description: 'Deconstructing the Sicilian Defense and introducing chess logic with our core team.'
  },
  {
    id: 3,
    category: 'Socials',
    title: 'We The Ones',
    image: img3,
    photos: OTHER_PHOTOS.slice(5, 10),
    description: 'Late night sessions filled with coffee, conversations, and 3-minute blitz madness.'
  },
  {
    id: 4,
    category: 'Tournaments',
    title: 'IITK Grand Swiss',
    image: img4,
    photos: GRAND_SWISS_PHOTOS,
    description: 'The road to the Candidates starts here. Click to view the tournament gallery.'
  },
  {
    id: 5,
    category: 'Workshops',
    title: 'School Visits',
    image: img5,
    photos: OTHER_PHOTOS.slice(10, 15),
    description: 'Empowering the next generation of local school children with grandmaster basics.'
  },
  {
    id: 6,
    category: 'Socials',
    title: 'Tournament Visits',
    image: img6,
    photos: OTHER_PHOTOS.slice(15, 20),
    description: 'Travelling to and representing the chess spirit of IIT Kanpur in regional events.'
  },
  {
    id: 7,
    category: 'Socials',
    title: 'Torch Relay',
    image: img7,
    photos: OTHER_PHOTOS.slice(20, 25),
    description: 'Carrying the flame of sportsmanship across campus during the Udghosh Torch Relay.'
  },
  {
    id: 8,
    category: 'Tournaments',
    title: 'IITK Chess Cup',
    image: img8,
    photos: OTHER_PHOTOS.slice(25, 30),
    description: 'The premier annual over-the-board tournament crowning the Chess King of IIT Kanpur.'
  },
  {
    id: 9,
    category: 'Tournaments',
    title: 'Freshers',
    image: img9,
    photos: OTHER_PHOTOS.slice(30, 35),
    description: 'Welcoming the incoming batch of novices and enthusiasts with our annual Freshers Tournament.'
  },
  {
    id: 10,
    category: 'Tournaments',
    title: 'Qualifiers | UDGHOSH',
    image: img10,
    photos: OTHER_PHOTOS.slice(35),
    description: 'High-tension qualifying matches selecting the official IITK team for the Udghosh Inter-College Festival.'
  },
];

const CATEGORIES = ['All', 'Tournaments', 'Workshops', 'Socials'];

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
];

// 3D Diary Book Single Page Component (Club Memories)
const DiaryPage = ({ photoUrl, pageNumber, isLeftPage, isAdmin, photoIdx, onDelete, onReplace }) => {
  if (!photoUrl && pageNumber !== 0 && pageNumber !== 999) return null;

  if (pageNumber === 0) {
    // Front Cover
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-amber-950 flex flex-col justify-between p-6 text-center border-l-4 border-amber-800 shadow-inner rounded-r-xl select-none">
        <div className="border border-primary/30 rounded-lg p-4 flex-1 flex flex-col justify-center items-center gap-4">
          <span className="material-symbols-outlined text-primary text-5xl animate-pulse">menu_book</span>
          <div>
            <h3 className="font-serif text-2xl text-primary tracking-wide leading-tight mb-2">Club Memories</h3>
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/80">Chess Club IITK</p>
          </div>
          <div className="h-0.5 w-12 bg-primary/30" />
          <p className="text-[9px] font-label text-on-surface-variant/60 uppercase tracking-widest max-w-[160px]">
            Visual Archives • Casual Moments
          </p>
        </div>
      </div>
    );
  }

  if (pageNumber === 999) {
    // Back Cover
    return (
      <div className="absolute inset-0 bg-gradient-to-bl from-amber-950 to-amber-900 flex flex-col justify-center items-center p-6 text-center border-r-4 border-amber-800 shadow-inner rounded-l-xl select-none">
        <div className="border border-[#d4af37]/20 rounded-lg p-4 w-full h-full flex flex-col justify-center items-center gap-4">
          <span className="material-symbols-outlined text-primary text-4xl">emoji_events</span>
          <h3 className="font-serif text-lg text-[#d4af37] tracking-wider">Chess Club IITK</h3>
          <p className="text-[9px] font-label text-on-surface-variant/50 max-w-[150px]">
            Thank you for being part of our chess journey.
          </p>
          <div className="h-0.5 w-10 bg-[#d4af37]/20 mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-[#FAF6EE] p-4 sm:p-5 md:p-8 flex flex-col justify-between relative overflow-hidden select-none ${isLeftPage ? 'shadow-[inset_10px_0_20px_rgba(0,0,0,0.05),inset_0_4px_10px_rgba(0,0,0,0.03)] border-r border-black/5' : 'shadow-[inset_-10px_0_20px_rgba(0,0,0,0.05),inset_0_4px_10px_rgba(0,0,0,0.03)]'}`}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
      <div className={`absolute ${isLeftPage ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} top-0 h-full w-[25px] from-black/15 via-black/5 to-transparent pointer-events-none z-10`} />

      <div className="flex-1 flex flex-col items-center justify-between py-2 h-full">
        {/* Photo Container */}
        <div className="flex-1 w-full bg-zinc-900 rounded-lg overflow-hidden border border-zinc-400/25 shadow-md flex items-center justify-center p-1.5 relative group/photo">
          <img
            src={photoUrl}
            alt={`Memory ${pageNumber}`}
            className="max-w-full max-h-full object-contain rounded"
            draggable="false"
          />
          {/* Admin Overlays */}
          {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 bg-black/60 p-1.5 rounded-lg backdrop-blur-sm z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(photoIdx, photoUrl);
                }}
                className="w-7 h-7 rounded bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow"
                title="Delete Photo"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
              <label
                className="w-7 h-7 rounded bg-primary hover:bg-primary-container text-[#3c2f00] flex items-center justify-center transition-colors shadow cursor-pointer"
                title="Replace Photo"
              >
                <span className="material-symbols-outlined text-base">swap_horiz</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      onReplace(photoIdx, photoUrl, e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="mt-3 w-full text-center">
          <div className="w-12 h-[1px] bg-[#8a7f6e]/30 mx-auto mb-2" />
          <h4 className="font-serif text-xs font-semibold text-zinc-700 tracking-wide">Club Moments</h4>
          <p className="text-[9px] text-zinc-500 font-label uppercase tracking-widest mt-0.5">IIT Kanpur Chess Community</p>
        </div>
      </div>

      <div className={`absolute bottom-3 ${isLeftPage ? 'left-6' : 'right-6'} font-handwritten text-xs text-[#8a7f6e]/70 select-none`}>
        — Page {pageNumber} —
      </div>
    </div>
  );
};

import fcl1 from '../Gallery/FCL/fcl/1.HEIC';
import fcl2 from '../Gallery/FCL/fcl/2.JPG';
import fcl3 from '../Gallery/FCL/fcl/3.JPG';
import fcl4 from '../Gallery/FCL/fcl/4.JPG';
import fcl5 from '../Gallery/FCL/fcl/5.JPG';
import fcl6 from '../Gallery/FCL/fcl/6.JPG';
import fcl7 from '../Gallery/FCL/fcl/7.JPG';
import fcl9 from '../Gallery/FCL/fcl/9.JPG';
import fcl10 from '../Gallery/FCL/fcl/10.HEIC';
import fcl11 from '../Gallery/FCL/fcl/11.JPG';
import fcl12 from '../Gallery/FCL/fcl/12.JPG';
import fcl13 from '../Gallery/FCL/fcl/13.JPG';

const FCL_PHOTOS = [fcl1, fcl2, fcl3, fcl4, fcl5, fcl6, fcl7, fcl9, fcl10, fcl11, fcl12, fcl13];

const PREVIOUS_YEARS = ['25-26'];
const PREVIOUS_YEARS_DATA = {
  '25-26': [
    {
      id: "event-1",
      category: "TOURNAMENTS",
      title: "Freshers' Chess League",
      description: "The ultimate showdown among the freshers.",
      photos: FCL_PHOTOS,
      image: FCL_PHOTOS[0]
    },
    {
      id: "event-2",
      category: "WORKSHOPS",
      title: "Opening Principles",
      description: "Mastering the first 10 moves.",
      photos: [],
      image: workshopImg
    }
  ]
};

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeYear, setActiveYear] = useState(PREVIOUS_YEARS[0]);
  const [isOpenLightbox, setIsOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [lightboxTitle, setLightboxTitle] = useState('');

  // 3D Book spread state variables
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [previousSpread, setPreviousSpread] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animDirection, setAnimDirection] = useState('next');

  // Pull login / admin auth status
  const { isLoggedIn, token } = useAuth();

  let isAdmin = false;
  if (isLoggedIn && token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'admin' || payload.role === 'secretary') {
        isAdmin = true;
      }
    } catch (error) {
      console.error("Could not decode token for admin check:", error);
    }
  }

  // Database states
  const [carouselImages, setCarouselImages] = useState([]);
  const [isEditingFeatured, setIsEditingFeatured] = useState(false);
  const [featuredTitle, setFeaturedTitle] = useState("Loading...");
  const [featuredDesc, setFeaturedDesc] = useState("Loading...");
  const [fideRatedPhotos, setFideRatedPhotos] = useState([]);
  const [clubMemoriesPhotos, setClubMemoriesPhotos] = useState([]);
  const [galleryCards, setGalleryCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch gallery archives from backend API
  const fetchGallery = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery`);
      const data = await response.json();
      
      const formatUrl = (url) => {
        if (!url) return '';
        const cleanUrl = url.replace(/\s/g, '%20');
        return cleanUrl.startsWith('http') ? cleanUrl : `${API_BASE_URL}${cleanUrl}`;
      };

      const fide = data
        .filter(img => img.album_type === 'FIDE_RATED')
        .map(img => formatUrl(img.image_url));
        
      const memories = data
        .filter(img => img.album_type === 'CLUB_MEMORIES')
        .map(img => formatUrl(img.image_url));
      
      setFideRatedPhotos(fide);
      setClubMemoriesPhotos(memories);
      setGalleryCards(data);
      
      const configResponse = await fetch(`${API_BASE_URL}/api/config/featured`);
      let configData = null;
      if (configResponse.ok) {
        configData = await configResponse.json();
        setFeaturedTitle(configData.featured_title);
        setFeaturedDesc(configData.featured_desc);
      }

      globalCache.gallery = { fide, memories, data, configData };
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (globalCache.gallery) {
      const cached = globalCache.gallery;
      if (cached && !Array.isArray(cached)) {
        const { fide, memories, data, configData } = cached;
        setFideRatedPhotos(fide || []);
        setClubMemoriesPhotos(memories || []);
        setGalleryCards(data || []);
        if (configData) {
          setFeaturedTitle(configData.featured_title);
          setFeaturedDesc(configData.featured_desc);
        }
      } else if (Array.isArray(cached)) {
        const formatUrl = (url) => {
          if (!url) return '';
          const cleanUrl = url.replace(/\s/g, '%20');
          return cleanUrl.startsWith('http') ? cleanUrl : `${API_BASE_URL}${cleanUrl}`;
        };
        const fide = cached
          .filter(img => img.album_type === 'FIDE_RATED')
          .map(img => formatUrl(img.image_url));
        const memories = cached
          .filter(img => img.album_type === 'CLUB_MEMORIES')
          .map(img => formatUrl(img.image_url));
        setFideRatedPhotos(fide || []);
        setClubMemoriesPhotos(memories || []);
        setGalleryCards(cached || []);
      }
      setIsLoading(false);
      fetchGallery();
    } else {
      fetchGallery();
    }
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/carousel`);
      const data = await response.json();
      if (response.ok) {
        setCarouselImages(data);
        globalCache.carouselImages = data;
      }
    } catch (err) {
      console.error("Failed to fetch carousel images:", err);
    }
  };

  useEffect(() => {
    if (globalCache.carouselImages) {
      setCarouselImages(globalCache.carouselImages);
      fetchImages();
    } else {
      fetchImages();
    }
  }, []);

  // Admin delete database memory
  const handleDeletePhoto = async (index, photoUrl) => {
    if (!window.confirm("Are you sure you want to delete this photo from the archives?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery/memories`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ image_url: photoUrl, index: index })
      });
      if (response.ok) {
        setClubMemoriesPhotos(prev => prev.filter((_, i) => i !== index));
        setSpreadIndex(0);
      } else {
        alert("Failed to delete photo.");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  // Admin replace database memory
  const handleReplacePhoto = async (index, oldPhotoUrl, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('new_image', file);
    formData.append('old_image_url', oldPhotoUrl);
    formData.append('index', index);

    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery/memories/replace`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` 
        },
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        setClubMemoriesPhotos(prev => {
          const newPhotos = [...prev];
          newPhotos[index] = data.new_image_url;
          return newPhotos;
        });
      } else {
        alert("Failed to replace photo.");
      }
    } catch (error) {
      console.error("Error replacing photo:", error);
    }
  };

  // Admin save featured spotlight config details
  const handleSaveFeatured = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/featured`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: featuredTitle,
          description: featuredDesc
        })
      });

      if (response.ok) {
        setIsEditingFeatured(false); 
      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving config:", error);
    }
  };

  // Slideshow interval timer (5 seconds)
  useEffect(() => {
    if (SLIDESHOW_PHOTOS.length <= 1) return;
    const interval = setInterval(() => {
      setSlideshowIndex(prev => (prev + 1) % SLIDESHOW_PHOTOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Preload spotlight images
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

  // Measure container width
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
    setSpreadIndex(0);
    setIsAnimating(false);
  };

  // Pagination for dynamic memories 3D book
  const totalSpreads = Math.floor(clubMemoriesPhotos.length / 2) + 2;

  const handleNext = () => {
    if (isAnimating || totalSpreads <= 1) return;
    setAnimDirection('next');
    setPreviousSpread(spreadIndex);
    setSpreadIndex(prev => (prev + 1) % totalSpreads);
    setIsAnimating(true);
  };

  const handlePrev = () => {
    if (isAnimating || totalSpreads <= 1) return;
    setAnimDirection('prev');
    setPreviousSpread(spreadIndex);
    setSpreadIndex(prev => (prev - 1 + totalSpreads) % totalSpreads);
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  const handleNextPhoto = () => {
    if (lightboxPhotos.length === 0) return;
    setLightboxIndex(prev => (prev + 1) % lightboxPhotos.length);
  };

  const handlePrevPhoto = () => {
    if (lightboxPhotos.length === 0) return;
    setLightboxIndex(prev => (prev - 1 + lightboxPhotos.length) % lightboxPhotos.length);
  };

  // Lightbox keyboard shortcuts
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
  }, [isOpenLightbox, lightboxPhotos]);

  // Map 3D Book page number to corresponding content safely
  const getBookPageContent = (pageNum) => {
    if (pageNum < 0 || pageNum > clubMemoriesPhotos.length + 1) return null;

    if (pageNum === 0) {
      return <DiaryPage pageNumber={0} isLeftPage={false} />;
    }

    if (pageNum === clubMemoriesPhotos.length + 1) {
      return <DiaryPage pageNumber={999} isLeftPage={true} />;
    }

    const photoIdx = pageNum - 1;
    const photoUrl = clubMemoriesPhotos[photoIdx];
    return (
      <DiaryPage
        photoUrl={photoUrl}
        pageNumber={pageNum}
        isLeftPage={pageNum % 2 !== 0}
        isAdmin={isAdmin}
        photoIdx={photoIdx}
        onDelete={handleDeletePhoto}
        onReplace={handleReplacePhoto}
      />
    );
  };

  const fideTournament = GALLERY_IMAGES.find(img => img.id === 1);
  const otherImages = GALLERY_IMAGES.filter(img => img.id !== 1);

  const showSpotlight = activeCategory === 'All' || activeCategory === 'Tournaments';

  // Filter exhibition cards for grid
  const filteredGridEvents = otherImages.filter(img =>
    activeCategory === 'All' ? true : img.category === activeCategory
  );

  return (
    <>
      <div className="px-6 md:px-12 pb-20 max-w-7xl mx-auto min-h-screen text-on-surface">
      <header className="py-16 text-center">
        <p className="text-primary font-label text-xs tracking-[0.4em] uppercase mb-4">
          Visual Archive
        </p>
        <h1 className="text-5xl sm:text-6xl font-serif mb-8">
          The Gallery of <span className="text-primary">Kings</span>
        </h1>
      </header>



      {/* Featured FIDE Tournament Spotlight (Top) */}
      <AnimatePresence mode="wait">
        {showSpotlight && fideTournament && (
          <motion.div
            key="spotlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-20 bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-primary/20 hover:shadow-lg transition-all shadow-2xl max-w-5xl mx-auto group"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Image side */}
              <div className="lg:w-3/5 relative aspect-[16/10] overflow-hidden flex-shrink-0 bg-surface-container-highest">
                <AnimatePresence>
                  <motion.img
                    key={slideshowIndex}
                    src={SLIDESHOW_PHOTOS[slideshowIndex]}
                    alt={fideTournament.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-surface-container-low opacity-85 pointer-events-none z-10"></div>
                <div className="absolute top-4 left-4 bg-primary text-[#3c2f00] font-label text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md z-10">
                  FIDE Rated
                </div>
              </div>

              {/* Content side */}
              <div className="lg:w-2/5 p-8 lg:p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-outline-variant/10">
                <span className="text-[10px] font-label text-primary uppercase tracking-[0.3em] mb-3 block">
                  FIDE RATED RAPID TOURNAMENT
                </span>
                
                {isEditingFeatured ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={featuredTitle}
                      onChange={(e) => setFeaturedTitle(e.target.value)}
                      className="w-full bg-surface border border-outline px-3 py-2 rounded text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                    <textarea
                      value={featuredDesc}
                      onChange={(e) => setFeaturedDesc(e.target.value)}
                      className="w-full bg-surface border border-outline px-3 py-2 rounded text-sm text-on-surface h-24 focus:outline-none focus:border-primary"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveFeatured}
                        className="bg-primary text-[#3c2f00] font-bold text-xs px-4 py-2 rounded hover:scale-105 transition-all"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingFeatured(false)}
                        className="bg-surface-container border border-outline-variant text-on-surface-variant font-bold text-xs px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-serif text-on-surface mb-4 leading-tight group-hover:text-primary transition-colors">
                      {featuredTitle}
                    </h2>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {featuredDesc}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-8">
                      <button
                        onClick={handleSpotlightClick}
                        className="bg-primary text-[#3c2f00] font-bold px-6 py-3 rounded-lg shadow-lg hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-2 hover:bg-primary-container outline-none"
                      >
                        <span className="material-symbols-outlined text-lg">photo_library</span>
                        <span>View Captures ({FIDE_RATED_PHOTOS.length})</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => setIsEditingFeatured(true)}
                          className="border border-outline hover:border-primary text-on-surface-variant hover:text-primary px-4 py-3 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          <span>Edit Config</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Season Exhibition (New Section) */}
      <AnimatePresence mode="wait">
        {(activeCategory === 'All' || activeCategory === 'Socials') && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-24 max-w-5xl mx-auto"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl font-serif text-on-surface">
                Active Season
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CURRENT_YEAR_EVENTS.map((event) => (
                <div
                  key={event.id}
                  className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-primary/20 hover:shadow-[0_12px_40px_rgba(242,202,80,0.08)] transition-all duration-300 flex flex-col justify-between group relative shadow-lg"
                >
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent pointer-events-none opacity-80" />
                    <div className="absolute top-3 left-3 bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm font-label text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                      {event.tag}
                    </div>
                  </div>

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
                      className="w-full bg-surface-container hover:bg-primary text-on-surface hover:text-[#3c2f00] font-label text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl border border-outline-variant/10 hover:border-primary transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">filter_hdr</span>
                      <span>View event archive</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
        </AnimatePresence>

      {/* Past Seasons Section */}
      <section className="mb-24 max-w-7xl mx-auto px-4 md:px-0">
        <div className="text-center mb-10">
          <p className="text-primary font-label text-xs tracking-[0.3em] uppercase mb-2">
            Our Legacy
          </p>
          <h2 className="text-4xl font-serif text-on-surface">
            Past Seasons
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-12 mt-8">
          {/* Left Column: Navigation Buttons */}
          <div className="w-full md:w-1/4 flex flex-col gap-4">
            {PREVIOUS_YEARS.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`w-full px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden flex items-center justify-between group
                  ${activeYear === year 
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/30 border-none' 
                    : 'bg-surface-container-low border border-outline-variant/30 text-on-surface hover:border-primary hover:text-primary'
                  }`}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] opacity-80">
                    history
                  </span>
                  {year}
                </span>
                {activeYear === year && (
                  <span className="material-symbols-outlined relative z-10 text-[18px]">
                    chevron_right
                  </span>
                )}
                {activeYear !== year && (
                  <div className="absolute inset-0 bg-primary/5 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500 ease-out"></div>
                )}
              </button>
            ))}
          </div>

          {/* Right Column: Event Cards */}
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PREVIOUS_YEARS_DATA[activeYear]?.map((event) => (
                <div
                  key={event.id}
                  className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-primary/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative shadow-lg cursor-pointer"
                  onClick={() => openExhibition(event.photos, event.title)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent pointer-events-none opacity-85" />
                    <div className="absolute top-3 left-3 bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm font-label text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                      {event.category}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
                        {event.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-6 line-clamp-3">
                        {event.description}
                      </p>
                    </div>

                    <div className="w-full bg-surface-container group-hover:bg-primary text-on-surface group-hover:text-[#3c2f00] font-label text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl border border-outline-variant/10 group-hover:border-primary transition-all flex items-center justify-center gap-2 mt-auto">
                      <span className="material-symbols-outlined text-sm font-bold">photo_library</span>
                      <span>View Gallery</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Archives Card Grid (Preserves all other 9 static events in a beautiful cards grid!) */}
      <section className="mb-24 max-w-5xl mx-auto">
        <div className="text-center md:text-left mb-10">
          <p className="text-primary font-label text-xs tracking-[0.3em] uppercase mb-2">
            Archives & Showcases
          </p>
          <h2 className="text-4xl font-serif text-on-surface">
            Archived Exhibitions
          </h2>
        </div>

        {filteredGridEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredGridEvents.map((event) => (
              <div
                key={event.id}
                className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-primary/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent pointer-events-none opacity-85" />
                  <div className="absolute top-3 left-3 bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm font-label text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                    {event.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed mb-6 line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  <button
                    onClick={() => openExhibition(event.photos, event.title)}
                    className="w-full bg-surface-container hover:bg-primary text-on-surface hover:text-[#3c2f00] font-label text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl border border-outline-variant/10 hover:border-primary transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">photo_library</span>
                    <span>View Gallery ({event.photos ? event.photos.length : 0})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-on-surface-variant/50 italic text-sm">
            No events found in this category.
          </div>
        )}
      </section>

      {/* 3D Diary Book Section (Club Memories & moments from the database) */}
      <AnimatePresence mode="wait">
        {(activeCategory === 'All' || activeCategory === 'Socials') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full border-t border-outline-variant/10 pt-20"
            ref={containerRef}
          >
            <div className="py-10 flex flex-col items-center">
              <div className="w-full max-w-[900px] mb-8 text-center md:text-left">
                <p className="text-primary font-label text-xs tracking-[0.3em] uppercase mb-2">
                  Interactive Scrapbook
                </p>
                <h3 className="text-3xl sm:text-4xl font-serif text-on-surface">
                  Casual Club Memories
                </h3>
              </div>

              {clubMemoriesPhotos.length > 0 ? (
                <div className="w-full flex flex-col items-center">
                  {/* Book Cover Wrapper */}
                  <div
                    className="w-full max-w-[900px] aspect-[16/10] sm:aspect-[16/9.5] relative rounded-2xl bg-[#2d1f10] border-4 border-[#3e2c17] shadow-[0_25px_60px_rgba(0,0,0,0.65),inset_0_0_30px_rgba(0,0,0,0.8)] p-2 sm:p-3"
                    style={{
                      perspective: '2000px',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Metal Book Corners */}
                    <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]/80 rounded-tl-lg pointer-events-none z-30 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.2)]" />
                    <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]/80 rounded-tr-lg pointer-events-none z-30 shadow-[inset_-1px_1px_3px_rgba(255,255,255,0.2)]" />
                    <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]/80 rounded-bl-lg pointer-events-none z-30 shadow-[inset_1px_-1px_3px_rgba(255,255,255,0.2)]" />
                    <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]/80 rounded-br-lg pointer-events-none z-30 shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.2)]" />

                    {/* Ribbon bookmark */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-[-16px] w-3.5 h-10 bg-red-700/90 rounded-b-md shadow-md z-30 transition-transform duration-300 origin-top hover:scale-y-110 pointer-events-auto" />

                    {/* Pages Container */}
                    <div
                      className="w-full h-full relative rounded-lg overflow-hidden flex shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Left Side Static Page */}
                      <div className="w-1/2 h-full">
                        {getBookPageContent(
                          isAnimating
                            ? (animDirection === 'next' ? previousSpread * 2 - 1 : spreadIndex * 2 - 1)
                            : spreadIndex * 2 - 1
                        )}
                      </div>

                      {/* Right Side Static Page */}
                      <div className="w-1/2 h-full">
                        {getBookPageContent(
                          isAnimating
                            ? (animDirection === 'next' ? spreadIndex * 2 : previousSpread * 2)
                            : spreadIndex * 2
                        )}
                      </div>

                      {/* Turning Page Overlay */}
                      <AnimatePresence mode="wait">
                        {isAnimating && (
                          <motion.div
                            key={`${spreadIndex}-${animDirection}`}
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
                              zIndex: 25,
                              pointerEvents: "none"
                            }}
                          >
                            {/* Front Face (visible 0 -> 90 deg) */}
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
                              {getBookPageContent(
                                animDirection === 'next' ? previousSpread * 2 : spreadIndex * 2
                              )}
                            </div>

                            {/* Back Face (visible 90 -> 180 deg) */}
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
                              {getBookPageContent(
                                animDirection === 'next' ? spreadIndex * 2 - 1 : previousSpread * 2 - 1
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Book spine crease */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[30px] pointer-events-none z-30 bg-gradient-to-r from-black/0 via-black/35 to-black/0" />
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[1px] bg-black/30 pointer-events-none z-30" />

                      {/* Clicking targets */}
                      {!isAnimating && totalSpreads > 1 && (
                        <>
                          <div
                            onClick={handlePrev}
                            className="absolute left-0 top-0 w-1/2 h-full z-20 cursor-w-resize"
                            title="Previous Pages"
                          />
                          <div
                            onClick={handleNext}
                            className="absolute right-0 top-0 w-1/2 h-full z-20 cursor-e-resize"
                            title="Next Pages"
                          />
                        </>
                      )}
                    </div>

                    {/* Book navigation arrows */}
                    {totalSpreads > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          disabled={isAnimating}
                          className="absolute left-[-20px] sm:left-[-35px] md:left-[-56px] top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-low/95 border border-outline-variant/20 hover:border-primary/50 text-on-surface flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none transition-all shadow-xl outline-none"
                        >
                          <span className="material-symbols-outlined text-xl sm:text-2xl">chevron_left</span>
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={isAnimating}
                          className="absolute right-[-20px] sm:right-[-35px] md:right-[-56px] top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-low/95 border border-outline-variant/20 hover:border-primary/50 text-on-surface flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none transition-all shadow-xl outline-none"
                        >
                          <span className="material-symbols-outlined text-xl sm:text-2xl">chevron_right</span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Spread indicator */}
                  {totalSpreads > 1 && (
                    <div className="mt-6 text-xs font-label uppercase tracking-widest text-on-surface-variant/60 flex items-center gap-2 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      <span>Spread {spreadIndex + 1} of {totalSpreads} • Memories ({clubMemoriesPhotos.length} photos)</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center text-on-surface-variant/50 italic text-sm border-2 border-dashed border-outline-variant/10 rounded-2xl w-full max-w-[900px]">
                  No memories uploaded in the database archive yet.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="text-on-surface/75 text-xs md:text-sm font-label uppercase tracking-widest truncate max-w-[70%]">
                {lightboxTitle} Capture ({lightboxIndex + 1} / {lightboxPhotos.length})
              </div>
              <button
                onClick={() => setIsOpenLightbox(false)}
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary transition-colors text-on-surface hover:text-[#3c2f00] flex items-center justify-center outline-none shadow-lg"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Main Photo Area */}
            <div className="flex-1 flex items-center justify-center relative max-w-7xl mx-auto w-full my-4">
              {/* Previous Button */}
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 md:left-4 z-10 w-12 h-12 rounded-full bg-surface-container-low/80 hover:bg-primary text-on-surface hover:text-[#3c2f00] flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none"
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
                className="absolute right-2 md:right-4 z-10 w-12 h-12 rounded-full bg-surface-container-low/80 hover:bg-primary text-on-surface hover:text-[#3c2f00] flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none"
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
                  className={`w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    idx === lightboxIndex
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
      </div>

      {/* Global Footer */}
      <Footer />
    </>
  );
};

export default Gallery;

import { useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';

// Keep your static UI assets
import tournamentImg from '../assets/chess_tournament_gallery_1775821881801.png';
import workshopImg from '../assets/chess_workshop_gallery_1775821901249.png';
import socialImg from '../assets/chess_social_gallery_1775821917712.png';
const CATEGORIES = ['All', 'Tournaments', 'Workshops', 'Socials'];

const Gallery = () => {
// Pull the user data from your login system
  const { isLoggedIn, token } = useAuth();


// The Ultimate Bouncer: Checks local storage AND the secure token payload
  let isAdmin = false;
  if (isLoggedIn && token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // We are now checking the 'role' key exactly as your Python backend wrote it!
      // I included both 'admin' and 'secretary' just in case. 
      if (payload.role === 'admin' || payload.role === 'secretary') {
        isAdmin = true;
      }
    } catch (error) {
      console.error("Could not decode token for admin check:", error);
    }
  }

  // State to hold the array of images from the database
  const [carouselImages, setCarouselImages] = useState([]);
  // --- Admin Editing States ---
  const [isEditingFeatured, setIsEditingFeatured] = useState(false);
  const [featuredTitle, setFeaturedTitle] = useState("Loading...");
  const [featuredDesc, setFeaturedDesc] = useState("Loading...");
  // 1. CLOUD DATA STATES
  const [fideRatedPhotos, setFideRatedPhotos] = useState([]);
  const [clubMemoriesPhotos, setClubMemoriesPhotos] = useState([]);
  const [galleryCards, setGalleryCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. EXISTING UI STATES
  const [activeCategory, setActiveCategory] = useState('All');
  const [isOpenLightbox, setIsOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const [spreadIndex, setSpreadIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next');
  const [isAlbumAutoplay, setIsAlbumAutoplay] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isAlbumLightboxOpen, setIsAlbumLightboxOpen] = useState(false);
  const [albumLightboxIndex, setAlbumLightboxIndex] = useState(0);

  

  // 3. FETCH DATA FROM YOUR PYTHON BACKEND
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gallery`);
        const data = await response.json();
        
        // Split the database rows into your two arrays
        const fide = data
          .filter(img => img.album_type === 'FIDE_RATED')
          .map(img => img.image_url.replace(/\s/g, '%20'));
          
        const memories = data
          .filter(img => img.album_type === 'CLUB_MEMORIES')
          .map(img => img.image_url.replace(/\s/g, '%20'));
        
        setFideRatedPhotos(fide);
        setClubMemoriesPhotos(memories);
        setGalleryCards(data);
        setIsLoading(false);
        const configResponse = await fetch(`${API_BASE_URL}/api/config/featured`);
        if (configResponse.ok) {
          const configData = await configResponse.json();
          setFeaturedTitle(configData.featured_title);
          setFeaturedDesc(configData.featured_desc);
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // The GET request to load images on page load
useEffect(() => {
  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/carousel`);
      const data = await response.json();
      if (response.ok) {
        setCarouselImages(data);
      }
    } catch (err) {
      console.error("Failed to fetch carousel images:", err);
    }
  };
  
  fetchImages();
}, []);
const handleDeletePhoto = async (index, photoUrl) => {
  alert("Delete button was clicked!");
    if (!window.confirm("Delete this photo from the archives?")) return;
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
      } else {
        alert("Failed to delete photo.");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

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
  const handleSaveFeatured = async () => {
    // Add these right before the try/catch block

    try {
      const response = await fetch(`${API_BASE_URL}/api/config/featured`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // THE VIP PASS
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

  // 4. CALCULATE SLIDESHOW PHOTOS DYNAMICALLY
  const SLIDESHOW_PHOTOS = fideRatedPhotos.length >= 17
    ? [
      fideRatedPhotos[0],   
      fideRatedPhotos[2],   
      fideRatedPhotos[13],  
      fideRatedPhotos[15],  
      fideRatedPhotos[17],  
      fideRatedPhotos[fideRatedPhotos.length - 1] 
    ]
    : fideRatedPhotos;

  // If the data is still fetching, return a simple loading state
    

  // Slideshow interval timer (20 seconds)
  useEffect(() => {
    if (SLIDESHOW_PHOTOS.length <= 1) return;
    const interval = setInterval(() => {
      setSlideshowIndex(prev => (prev + 1) % SLIDESHOW_PHOTOS.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [SLIDESHOW_PHOTOS.length]);

  // Preload slideshow and album photos to prevent sudden flashes or delays
  useEffect(() => {
    if (SLIDESHOW_PHOTOS.length > 0) {
      SLIDESHOW_PHOTOS.forEach(photo => {
        const img = new Image();
        img.src = photo;
      });
    }
    if (clubMemoriesPhotos.length > 0) {
      clubMemoriesPhotos.forEach(photo => {
        const img = new Image();
        img.src = photo;
      });
    }
  }, [SLIDESHOW_PHOTOS, clubMemoriesPhotos]);

  const flipNext = () => {
    if (isFlipping) return;
    if (spreadIndex >= 21) return;
    setFlipDirection('next');
    setIsFlipping(true);
  };

  const flipPrev = () => {
    if (isFlipping) return;
    if (spreadIndex <= 0) return;
    setFlipDirection('prev');
    setIsFlipping(true);
  };

  // Keyboard navigation for Album stack and Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpenLightbox) return;

      if (isAlbumLightboxOpen) {
        if (e.key === 'ArrowRight') {
          setAlbumLightboxIndex(prev => (prev + 1) % clubMemoriesPhotos.length);
        } else if (e.key === 'ArrowLeft') {
          setAlbumLightboxIndex(prev => (prev - 1 + clubMemoriesPhotos.length) % clubMemoriesPhotos.length);
        } else if (e.key === 'Escape') {
          setIsAlbumLightboxOpen(false);
        }
      } else {
        if (e.key === 'ArrowRight') {
          flipNext();
        } else if (e.key === 'ArrowLeft') {
          flipPrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenLightbox, isAlbumLightboxOpen, spreadIndex, isFlipping, clubMemoriesPhotos.length]);

  // Autoplay slideshow for Album (automatically flips every 5 seconds)
  useEffect(() => {
    if (!isAlbumAutoplay || isFlipping) return;
    const interval = setInterval(() => {
      if (spreadIndex >= 21) {
        setSpreadIndex(0);
      } else {
        flipNext();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isAlbumAutoplay, spreadIndex, isFlipping]);

  // Sync index between Album and Fullscreen Lightbox
  useEffect(() => {
    if (!isAlbumLightboxOpen) {
      const newSpread = Math.floor((albumLightboxIndex + 2) / 2);
      setSpreadIndex(newSpread);
    }
  }, [isAlbumLightboxOpen, albumLightboxIndex]);

  useEffect(() => {
    if (isAlbumLightboxOpen) {
      const photoIdx = Math.max(0, Math.min(clubMemoriesPhotos.length - 1, 2 * spreadIndex - 2));
      setAlbumLightboxIndex(photoIdx);
    }
  }, [isAlbumLightboxOpen, clubMemoriesPhotos.length, spreadIndex]);

  const jumpToPhoto = (idx) => {
    if (isFlipping) return;
    const targetSpread = Math.floor((idx + 2) / 2);
    setSpreadIndex(targetSpread);
  };

  const getPageContent = (pageNum) => {
    if (pageNum < 0 || pageNum > clubMemoriesPhotos.length + 1) return null;

    if (pageNum === 0) {
      // Front Cover
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-amber-955 flex flex-col justify-between p-6 text-center border-l-4 border-amber-800 shadow-inner rounded-r-xl select-none">
          <div className="border border-primary/30 rounded-lg p-4 flex-1 flex flex-col justify-center items-center gap-4">
            <span className="material-symbols-outlined text-primary text-5xl animate-pulse">menu_book</span>
            <div>
              <h3 className="font-serif text-2xl text-primary tracking-wide leading-tight mb-2">Club Memories</h3>
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/80">Chess Club IITK</p>
            </div>
            <div className="h-0.5 w-12 bg-primary/30" />
            <p className="text-[9px] font-label text-on-surface-variant/60 uppercase tracking-widest max-w-[160px]">
              Est. 2026 • Visual Archives
            </p>
          </div>
        </div>
      );
    }

    if (pageNum === clubMemoriesPhotos.length + 1) {
      // Back Cover
      return (
        <div className="absolute inset-0 bg-gradient-to-bl from-amber-955 to-amber-900 flex flex-col justify-center items-center p-6 text-center border-r-4 border-amber-800 shadow-inner rounded-l-xl select-none">
          <div className="border border-primary/20 rounded-lg p-4 w-full h-full flex flex-col justify-center items-center gap-4">
            <span className="material-symbols-outlined text-primary text-4xl">emoji_events</span>
            <h3 className="font-serif text-lg text-primary tracking-wider">Chess Club IITK</h3>
            <p className="text-[9px] font-label text-on-surface-variant/50 max-w-[150px]">
              Thank you for being part of our chess journey.
            </p>
            <div className="h-0.5 w-10 bg-primary/20 mt-2" />
          </div>
        </div>
      );
    }

    // Photo Page 
    const photoIdx = pageNum - 1;
    const photoUrl = clubMemoriesPhotos[photoIdx];

    return (
      <div className="absolute inset-0 bg-[#fbf9f4] text-zinc-800 p-4 flex flex-col justify-between shadow-inner select-none border border-zinc-300/30">
        
        

        {/* Photo Container */}
        <div className="flex-1 w-full bg-zinc-900 rounded-lg overflow-hidden border border-zinc-400/25 shadow-md flex items-center justify-center p-1.5">
          <img
            src={photoUrl}
            alt={`Memory ${pageNum}`}
            className="max-w-full max-h-full object-contain"
            draggable="false"
          />
        </div>

        {/* Polaroid/Archival Caption */}
        <div className="mt-3 pt-2 border-t border-zinc-300/40 flex justify-between items-center px-1">
          <div>
            <h4 className="font-serif text-xs font-semibold text-zinc-700 tracking-wide">Club Moments</h4>
            <p className="text-[9px] text-zinc-500 font-label">IIT Kanpur Chess Community</p>
          </div>
          <span className="font-mono text-[9px] font-semibold text-zinc-400 bg-zinc-200/50 px-2 py-0.5 rounded-full border border-zinc-300/30">
            Page {pageNum}
          </span>
        </div>
      </div>
    );
  };
  const handleSpotlightClick = () => {
    // 1. If the database has no photos, do nothing
    if (carouselImages.length === 0) return;
    
    // 2. Figure out exactly which photo the slideshow is currently on
    // We use the same modulo (%) math trick so it perfectly matches what is on screen
    const currentPhotoIndex = slideshowIndex % carouselImages.length;
    
    // 3. Open the lightbox directly to that photo!
    setLightboxIndex(currentPhotoIndex);
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

  const handleNextPhoto = () => {
  setLightboxIndex((prev) => 
    prev === carouselImages.length - 1 ? 0 : prev + 1
  );
};

  const handlePrevPhoto = () => {
  setLightboxIndex((prev) => 
    prev === 0 ? carouselImages.length - 1 : prev - 1
  );
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
  }, [isOpenLightbox, fideRatedPhotos.length]);

  // Static content for the featured tournament card since DB doesn't have titles yet
  const featuredTournament = {
    title: 'SBI GIC Ltd. Presents FIDE Rated Open Rapid Chess Tournament 2026',
    description: 'High-stakes tactical battles at IIT Kanpur. Click to view all captures from the event.'
  };

  // Determine if spotlight should show (only for All or Tournaments category)
  const showSpotlight = activeCategory === 'All' || activeCategory === 'Tournaments';
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-primary font-serif text-2xl">
        Loading Archives...
      </div>
    );
  }
  return (
    <div>
      <div className="px-6 md:px-12 pb-20 max-w-7xl mx-auto min-h-screen" ref={containerRef}>
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
            className="text-4xl sm:text-6xl font-serif mb-8"
          >
            The Gallery of <div className="text-primary">Chess Club IITK</div>
          </motion.h1>

        </header>

        {/* Featured FIDE Tournament Spotlight (Top) */}
        <AnimatePresence mode="wait">
          {showSpotlight && (
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
                <div className="lg:w-3/5 relative aspect-[16/10] overflow-hidden flex-shrink-0 bg-surface-container-highest">
                  
                  {/* Check if we have images from the database */}
                  {carouselImages.length > 0 ? (
                    <>
                      <AnimatePresence>
                        <motion.img
                          // We use modulo (%) so the index loops safely without crashing if an image is deleted
                          key={carouselImages[slideshowIndex % carouselImages.length].id}
                          src={`${API_BASE_URL}${carouselImages[slideshowIndex % carouselImages.length].image_url}`}
                          alt={featuredTitle}
                          initial={{ opacity: 0, zIndex: 2 }}
                          animate={{ opacity: 1, zIndex: 2 }}
                          exit={{ opacity: 1, zIndex: 1 }}
                          transition={{ duration: 1.8, ease: "easeInOut" }}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        />
                      </AnimatePresence>

                      {/* ADMIN DELETE BUTTON */}
                      {isAdmin && (
                        <button
                          onClick={async () => {
                            const imgId = carouselImages[slideshowIndex % carouselImages.length].id;
                            if (window.confirm("Are you sure you want to delete this photo?")) {
                              try {
                                const response = await fetch(`${API_BASE_URL}/api/carousel/${imgId}`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('chess-club-jwt')}`
                                  }
                                });
                                if (response.ok) {
                                  // Instantly remove it from the array so the screen updates
                                  setCarouselImages(carouselImages.filter(img => img.id !== imgId));
                                }
                              } catch (err) {
                                console.error("Delete failed", err);
                              }
                            }
                          }}
                          className="absolute top-4 right-4 bg-red-600/90 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg hover:bg-red-500 z-50 transition-colors cursor-pointer"
                          title="Delete this photo"
                        >
                          ✕
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
                      No featured images uploaded yet.
                    </div>
                  )}

                  {/* Your original gradients and tags stay exactly the same! */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-surface-container-low opacity-80 pointer-events-none z-10"></div>
                  <div className="absolute top-4 left-4 bg-primary text-on-primary font-label text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md z-20">
                    FIDE Rated
                  </div>
                </div>

                {/* Content side */}
                <div className="lg:w-2/5 p-8 lg:p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-outline-variant/10">
                  <span className="text-[10px] font-label text-primary uppercase tracking-[0.3em] mb-3 block">
                    Featured Tournament
                  </span>
                  {/* THE EDITING UI SWAP */}
    { isEditingFeatured ? (
      <div className="flex flex-col gap-3">
        <input 
          className="bg-zinc-800 text-white p-2 rounded border border-zinc-700 font-serif text-2xl md:text-3xl"
          value={featuredTitle}
          onChange={(e) => setFeaturedTitle(e.target.value)}
        />
        <textarea 
          className="bg-zinc-800 text-zinc-400 p-2 rounded border border-zinc-700 h-24 text-sm"
          value={featuredDesc}
          onChange={(e) => setFeaturedDesc(e.target.value)}
        />
        <div className="flex gap-2">
          <button 
            onClick={handleSaveFeatured} 
            className="bg-yellow-400 text-black px-4 py-2 rounded font-bold hover:bg-yellow-500 transition-colors"
          >
            Save Changes
          </button>
          <button 
            onClick={() => setIsEditingFeatured(false)} 
            className="bg-zinc-700 text-white px-4 py-2 rounded font-bold hover:bg-zinc-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <div>
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
          {featuredTitle}
        </h2>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6">
          {featuredDesc}
        </p>
        

        {isAdmin && (
  <div className="mt-8 flex flex-col md:flex-row gap-6 items-start md:items-center bg-zinc-900/80 p-4 rounded-lg border border-yellow-400/20">
    
    {/* 1. Edit Text Button */}
    <button 
      onClick={() => setIsEditingFeatured(true)} 
      className="text-yellow-400 text-sm font-bold hover:underline flex items-center gap-2"
    >
      <span>✏️</span> Edit Title & Details
    </button>

    <div className="hidden md:block w-px h-8 bg-zinc-700"></div>

    {/* 2. Add New Carousel Photo Input */}
    <div className="flex flex-col gap-2">
      <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
        📸 Add Carousel Photo
      </label>
      <input 
        type="file" 
        accept="image/*"
        className="text-sm text-zinc-400 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-yellow-400 file:text-black hover:file:bg-yellow-500 cursor-pointer transition-colors"
        onChange={async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          // Package the physical file
          const formData = new FormData();
          formData.append('image', file);

          try {
            // Send it to your Python backend
            const response = await fetch(`${API_BASE_URL}/api/carousel`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('chess-club-jwt')}`
              },
              body: formData
            });
            
            if (response.ok) {
              alert("Image uploaded successfully! Refresh the page to see it in the carousel.");
              // NOTE: If you have a fetch function to reload images, you can call it right here instead of refreshing!
            } else {
              alert("Failed to upload image.");
            }
          } catch (err) {
            console.error("Upload error:", err);
            alert("Server connection failed.");
          }
        }} 
      />
    </div>

  </div>
)}
      </div>
    )}

                  {/* View Gallery CTA Button */}
                  <button
  onClick={handleSpotlightClick}
  className="mt-8 self-start bg-primary text-on-primary font-bold px-6 py-3 rounded-lg shadow-lg hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-2 hover:bg-primary-container outline-none"
>
  <span className="material-symbols-outlined text-lg">photo_library</span>
  {/* Now it will read exactly how many photos are in your database! */}
  <span>View Captures ({carouselImages.length})</span>
</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Club Memories Section */}
        {clubMemoriesPhotos.length > 0 && (() => {
          const bookScale = containerWidth > 0 && containerWidth < 840 ? (containerWidth - 32) / 800 : 1;
          const bookHeight = 500 * bookScale;

          return (
            <section className="mt-20 sm:mt-28 mb-16 border-t border-outline-variant/10 pt-16 max-w-5xl mx-auto overflow-visible">
              <div className="text-center mb-12">
                <p className="text-primary font-label text-xs tracking-[0.4em] uppercase mb-3">
                  Interactive Archives
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif text-on-surface mb-4">
                  Club Memories
                </h2>
              </div>

              {/* 3D Page Turning Book Wrapper */}
              <div
                className="w-full flex items-center justify-center overflow-visible"
                style={{ height: `${bookHeight}px` }}
              >
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, info) => {
                    const swipeThreshold = 50;
                    if (info.offset.x > swipeThreshold) {
                      flipPrev();
                    } else if (info.offset.x < -swipeThreshold) {
                      flipNext();
                    }
                  }}
                  className="relative bg-zinc-950 border-8 border-stone-900 rounded-3xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] flex select-none overflow-visible origin-center cursor-grab active:cursor-grabbing"
                  style={{
                    width: '800px',
                    height: '500px',
                    perspective: '2000px',
                    transform: `scale(${bookScale})`,
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  {/* Spine of the book */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-gradient-to-r from-stone-950 via-stone-800 to-stone-950 z-30 transform -translate-x-1/2 shadow-lg" />

                  {/* Spine shadows */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-8 bg-gradient-to-r from-black/40 to-transparent z-20 pointer-events-none" />
                  <div className="absolute top-0 bottom-0 right-1/2 w-8 bg-gradient-to-l from-black/40 to-transparent z-20 pointer-events-none" />

                  {/* LEFT SIDE (Static background) */}
                  <div className="w-1/2 h-full relative bg-zinc-900 rounded-l-2xl overflow-hidden shadow-2xl origin-right">
                    {isFlipping && flipDirection === 'next'
                      ? getPageContent(2 * spreadIndex - 1)
                      : isFlipping && flipDirection === 'prev'
                        ? getPageContent(2 * (spreadIndex - 1) - 1)
                        : getPageContent(2 * spreadIndex - 1)}
                  </div>

                  {/* RIGHT SIDE (Static background) */}
                  <div className="w-1/2 h-full relative bg-zinc-900 rounded-r-2xl overflow-hidden shadow-2xl origin-left">
                    {isFlipping && flipDirection === 'next'
                      ? getPageContent(2 * (spreadIndex + 1))
                      : isFlipping && flipDirection === 'prev'
                        ? getPageContent(2 * spreadIndex)
                        : getPageContent(2 * spreadIndex)}
                  </div>

                  {/* FLIPPING SHEET */}
                  {isFlipping && (
                    <motion.div
                      key={`${spreadIndex}-${flipDirection}`}
                      initial={{ rotateY: flipDirection === 'next' ? 0 : -180 }}
                      animate={{ rotateY: flipDirection === 'next' ? -180 : 0 }}
                      transition={{ duration: 0.85, ease: [0.645, 0.045, 0.355, 1.0] }}
                      onAnimationComplete={() => {
                        setSpreadIndex(prev => flipDirection === 'next' ? prev + 1 : prev - 1);
                        setIsFlipping(false);
                      }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: '50%',
                        width: '50%',
                        transformStyle: 'preserve-3d',
                        originX: 0,
                        zIndex: 25
                      }}
                    >
                      {/* Front Face (Facing right initially) */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(0deg)',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {flipDirection === 'next'
                          ? getPageContent(2 * spreadIndex)
                          : getPageContent(2 * (spreadIndex - 1))}
                        {/* Soft shadow on page when flipping */}
                        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                      </div>

                      {/* Back Face (Facing left initially, rotated 180deg) */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {flipDirection === 'next'
                          ? getPageContent(2 * (spreadIndex + 1) - 1)
                          : getPageContent(2 * spreadIndex - 1)}
                        {/* Soft shadow on page when flipping */}
                        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Album Controls */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-12">
                <button
                  onClick={flipPrev}
                  disabled={spreadIndex <= 0}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-low border border-outline-variant/20 hover:border-primary/50 text-on-surface flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl outline-none disabled:opacity-30 disabled:pointer-events-none"
                  title="Previous Pages (Left Arrow)"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">chevron_left</span>
                </button>

                <button
                  onClick={() => setIsAlbumAutoplay(!isAlbumAutoplay)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl outline-none ${isAlbumAutoplay
                    ? 'bg-primary border-primary text-on-primary'
                    : 'bg-surface-container-low border-outline-variant/20 hover:border-primary/50 text-on-surface'
                    }`}
                  title={isAlbumAutoplay ? 'Pause Slideshow' : 'Play Slideshow'}
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">
                    {isAlbumAutoplay ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsAlbumLightboxOpen(true);

                  }}
                  
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-low border border-outline-variant/20 hover:border-primary/50 text-on-surface flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl outline-none"
                  title="Fullscreen View"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">fullscreen</span>
                </button>

                <button
                  onClick={() => setShowThumbnails(!showThumbnails)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl outline-none ${showThumbnails
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-surface-container-low border-outline-variant/20 hover:border-primary/50 text-on-surface'
                    }`}
                  title="Show All Photos Grid"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">grid_view</span>
                </button>

                <button
                  onClick={flipNext}
                  disabled={spreadIndex >= 21}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-low border border-outline-variant/20 hover:border-primary/50 text-on-surface flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl outline-none disabled:opacity-30 disabled:pointer-events-none"
                  title="Next Pages (Right Arrow)"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">chevron_right</span>
                </button>
              </div>

              {/* Thumbnails Grid Drawer */}
              <AnimatePresence>
                {showThumbnails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-12 border-t border-outline-variant/10 pt-8 overflow-hidden"
                  >
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-72 overflow-y-auto p-2 border border-outline-variant/5 bg-surface-container-lowest/50 rounded-xl custom-scrollbar">
                      {clubMemoriesPhotos.map((photo, idx) => {
                        const isHighlighted = idx === Math.max(0, Math.min(clubMemoriesPhotos.length - 1, 2 * spreadIndex - 2)) || idx === Math.max(0, Math.min(clubMemoriesPhotos.length - 1, 2 * spreadIndex - 1));
                        return (
                          <button
                            key={idx}
                            onClick={() => jumpToPhoto(idx)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative group ${isHighlighted && spreadIndex > 0 && spreadIndex < 21
                              ? 'border-primary scale-[0.98] shadow-md shadow-primary/20'
                              : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]'
                              }`}
                          >
                            <img src={photo} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[11px] text-white font-bold font-mono bg-black/60 px-2 py-0.5 rounded">{idx + 1}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })()}

        {/* Full-Screen Image Lightbox Modal */}
  <AnimatePresence>
  {/* We check carouselImages instead of fideRatedPhotos */}
  {isOpenLightbox && carouselImages.length > 0 && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 outline-none"
    >
      {/* Header Controls */}
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto h-12">
        <div className="text-on-surface/75 text-xs md:text-sm font-label uppercase tracking-widest">
          FIDE Rated Tournament Capture ({lightboxIndex + 1} / {carouselImages.length})
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

              src={`${API_BASE_URL}${carouselImages[lightboxIndex]?.image_url}`}
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
        {carouselImages.map((photo, idx) => (
          <button
            key={photo.id || idx}
            onClick={() => setLightboxIndex(idx)}
            className={`w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${idx === lightboxIndex
              ? 'border-primary scale-105 shadow-md shadow-primary/20'
              : 'border-transparent opacity-50 hover:opacity-100'
              }`}
          >
            {/* Same backend URL setup for the thumbnails */}
            <img src={`${API_BASE_URL}${photo.image_url}`} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  )}
</AnimatePresence>

        {/* Full-Screen Album Lightbox Modal */}
        <AnimatePresence>
          {isAlbumLightboxOpen && clubMemoriesPhotos.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 outline-none"
            >
             {/* Header Controls */}
              <div className="flex justify-between items-center w-full max-w-7xl mx-auto h-12">
                <div className="text-on-surface/75 text-xs md:text-sm font-label uppercase tracking-widest">
                  Club Memories Capture ({albumLightboxIndex + 1} / {clubMemoriesPhotos.length})
                </div>
                
                {/* Top Right Controls Group */}
                <div className="flex items-center gap-3 sm:gap-4">
                  
                  {/* --- THE ADMIN OVERLAY --- */}
                  {isAdmin && (
                    <div className="flex gap-2">
                      <label className="bg-yellow-500 text-black px-3 py-1.5 sm:px-4 rounded text-[10px] sm:text-xs font-bold cursor-pointer hover:bg-yellow-400 transition-colors shadow-lg flex items-center">
                        Replace
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleReplacePhoto(albumLightboxIndex, clubMemoriesPhotos[albumLightboxIndex], e.target.files[0])} 
                        />
                      </label>
                      <button 
                        onClick={() => handleDeletePhoto(albumLightboxIndex, clubMemoriesPhotos[albumLightboxIndex])}
                        className="bg-red-600 text-white px-3 py-1.5 sm:px-4 rounded text-[10px] sm:text-xs font-bold hover:bg-red-500 transition-colors shadow-lg outline-none"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={() => setIsAlbumLightboxOpen(false)}
                    className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary transition-colors text-on-surface hover:text-on-primary flex items-center justify-center outline-none shadow-lg shrink-0"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
              </div>

              {/* Main Photo Area */}
              <div className="flex-1 flex items-center justify-center relative max-w-7xl mx-auto w-full my-4">
                {/* Previous Button */}
                <button
                  onClick={() => setAlbumLightboxIndex(prev => (prev - 1 + clubMemoriesPhotos.length) % clubMemoriesPhotos.length)}
                  className="absolute left-2 md:left-4 z-10 w-12 h-12 rounded-full bg-surface-container-low/80 hover:bg-primary text-on-surface hover:text-on-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none"
                >
                  <span className="material-symbols-outlined text-2xl">chevron_left</span>
                </button>

                {/* Active Image */}
                <div className="relative max-h-[68vh] max-w-[85vw] flex items-center justify-center overflow-hidden rounded-xl shadow-2xl border border-outline-variant/10">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={albumLightboxIndex}
                      src={clubMemoriesPhotos[albumLightboxIndex]}
                      alt={`Club Memories Photo ${albumLightboxIndex + 1}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.5}
                      onDragEnd={(e, info) => {
                        const swipeThreshold = 50;
                        if (info.offset.x > swipeThreshold) {
                          setAlbumLightboxIndex(prev => (prev - 1 + clubMemoriesPhotos.length) % clubMemoriesPhotos.length);
                        } else if (info.offset.x < -swipeThreshold) {
                          setAlbumLightboxIndex(prev => (prev + 1) % clubMemoriesPhotos.length);
                        }
                      }}
                      className="max-h-[68vh] max-w-full object-contain rounded-xl cursor-grab active:cursor-grabbing"
                    />
                  </AnimatePresence>
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setAlbumLightboxIndex(prev => (prev + 1) % clubMemoriesPhotos.length)}
                  className="absolute right-2 md:right-4 z-10 w-12 h-12 rounded-full bg-surface-container-low/80 hover:bg-primary text-on-surface hover:text-on-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all outline-none"
                >
                  <span className="material-symbols-outlined text-2xl">chevron_right</span>
                </button>
              </div>

              {/* Thumbnails Footer */}
              <div className="w-full max-w-7xl mx-auto py-4 overflow-x-auto flex justify-start md:justify-center gap-2 border-t border-outline-variant/10 scrollbar-none">
                {clubMemoriesPhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAlbumLightboxIndex(idx)}
                    className={`w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${idx === albumLightboxIndex
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
      <Footer />
    </div>
  );
};

export default Gallery;
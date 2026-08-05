import { useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import PhotoBook from '../components/PhotoBook';
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
  const [activeTenure, setActiveTenure] = useState('2025-26');
  const [isOpenLightbox, setIsOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const [isTenureModalOpen, setIsTenureModalOpen] = useState(false);
  const [openStripTenure, setOpenStripTenure] = useState(null);
  const [modalCategory, setModalCategory] = useState("Past Memories");

  const defaultEvents = [
    { 
      id: "Workshops", 
      category: "WORKSHOPS",
      title: "Chess in Slums",
      description: "Deconstructing the Sicilian Defense and introducing chess logic with our core team.",
      photoCount: 5,
      img: workshopImg 
    },
    { 
      id: "Socials", 
      category: "SOCIALS",
      title: "We The Ones",
      description: "Late night sessions filled with coffee, conversations, and 3-minute blitz madness.",
      photoCount: 5,
      img: socialImg 
    },
    { 
      id: "Tournaments", 
      category: "TOURNAMENTS",
      title: "IITK Grand Swiss",
      description: "The road to the Candidates starts here. Click to view the tournament gallery.",
      photoCount: 17,
      img: tournamentImg 
    }
  ];

  

  // 3. FETCH DATA FROM YOUR PYTHON BACKEND
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/gallery`);
        const data = await response.json();
        
        // Helper function to handle both external URLs and local static paths
        const formatUrl = (url) => {
          if (!url) return '';
          const cleanUrl = url.replace(/\s/g, '%20');
          return cleanUrl.startsWith('http') ? cleanUrl : `${API_BASE_URL}${cleanUrl}`;
        };

        // Split the database rows into your two arrays and format the URLs
        const fide = data
          .filter(img => img.album_type === 'FIDE_RATED')
          .map(img => formatUrl(img.image_url));
          
        const memories = data
          .filter(img => img.album_type === 'CLUB_MEMORIES')
          .map(img => formatUrl(img.image_url));
        
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
        {showSpotlight && (
          <div
            key="spotlight"
            className="mb-20 bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-primary/20 hover:shadow-lg transition-all shadow-2xl max-w-5xl mx-auto group"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Image side */}
              <div className="lg:w-3/5 relative aspect-[16/10] overflow-hidden flex-shrink-0 bg-surface-container-highest">
                
                {/* Check if we have images from the database */}
                {carouselImages.length > 0 ? (
                  <>
                    <img
                      // We use modulo (%) so the index loops safely without crashing if an image is deleted
                      key={carouselImages[slideshowIndex % carouselImages.length].id}
                      src={carouselImages[slideshowIndex % carouselImages.length]?.image_url?.startsWith('http') 
                        ? carouselImages[slideshowIndex % carouselImages.length].image_url 
                        : `${API_BASE_URL}${carouselImages[slideshowIndex % carouselImages.length]?.image_url}`}
                      alt={featuredTitle}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />

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
                  FIDE RATED RAPID TOURNAMENT
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

                              const formData = new FormData();
                              formData.append('image', file);

                              try {
                                const response = await fetch(`${API_BASE_URL}/api/carousel`, {
                                  method: 'POST',
                                  headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('chess-club-jwt')}`
                                  },
                                  body: formData
                                });
                                
                                if (response.ok) {
                                  const newImage = await response.json(); // Backend should return the new image object
                                  // Instantly add it to the UI!
                                  setCarouselImages(prev => [...prev, newImage]);
                                  alert("Image uploaded and added to the carousel!");
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
          </div>
        )}
        {/* Club Memories Section */}
        <section className="mt-20 sm:mt-28 mb-16 border-t border-outline-variant/10 pt-16 max-w-5xl mx-auto overflow-visible">
              {/* Current Tenure Cards */}
              <div className="pt-4 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
                {defaultEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => {
                      setActiveTenure("Current");
                      setModalCategory(event.id);
                      setIsTenureModalOpen(true);
                    }}
                    className="bg-[#1c1c1c] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-black/50"
                  >
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={event.img} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      {/* Category Tag */}
                      <div className="absolute top-4 left-4 bg-amber-500/20 border border-amber-500/30 backdrop-blur-md text-amber-400 text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest shadow-sm">
                        {event.category}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-serif text-white mb-3 font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">
                        {event.description}
                      </p>

                      {/* Button */}
                      <button className="w-full py-3 bg-[#242424] hover:bg-[#2a2a2a] text-gray-300 text-xs font-bold tracking-[0.15em] uppercase rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/10">
                        <span className="material-symbols-outlined text-[18px]">photo_library</span>
                        VIEW GALLERY ({event.photoCount})
                      </button>
                    </div>
                  </div>
                ))}
              </div>

{/* Tenure Strips */}
              <div className="w-full max-w-4xl mx-auto mt-12 mb-4 flex flex-col gap-4">
                {["2025-26", "2024-25"].map((tenure) => (
                  <div key={tenure} className="flex flex-col gap-2">
                    <button
                      onClick={() => setOpenStripTenure(openStripTenure === tenure ? null : tenure)}
                      className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface py-5 px-8 rounded-2xl shadow-lg hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all flex justify-between items-center group outline-none"
                    >
                      <span className="font-serif text-2xl tracking-wide">{tenure}</span>
                      <motion.span
                        animate={{ rotate: openStripTenure === tenure ? 180 : 0 }}
                        className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform"
                      >
                        expand_more
                      </motion.span>
                    </button>
                    
                    <AnimatePresence>
                      {openStripTenure === tenure && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 pb-8 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                            {defaultEvents.map((event) => (
                              <div
                                key={event.id}
                                onClick={() => {
                                  setActiveTenure(tenure);
                                  setModalCategory(event.id);
                                  setIsTenureModalOpen(true);
                                }}
                                className="bg-[#1c1c1c] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-black/50"
                              >
                                {/* Image Section */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                  <img 
                                    src={event.img} 
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                  />
                                  {/* Category Tag */}
                                  <div className="absolute top-4 left-4 bg-amber-500/20 border border-amber-500/30 backdrop-blur-md text-amber-400 text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest shadow-sm">
                                    {event.category}
                                  </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex flex-col flex-1 text-left">
                                  <h3 className="text-xl font-serif text-white mb-3 font-semibold">{event.title}</h3>
                                  <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">
                                    {event.description}
                                  </p>

                                  {/* Button */}
                                  <button className="w-full py-3 bg-[#242424] hover:bg-[#2a2a2a] text-gray-300 text-xs font-bold tracking-[0.15em] uppercase rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/10">
                                    <span className="material-symbols-outlined text-[18px]">photo_library</span>
                                    VIEW GALLERY ({event.photoCount})
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>

        {/* Full-Screen Image Lightbox Modal */}
  <AnimatePresence>
    {isOpenLightbox && carouselImages.length > 0 && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 outline-none"
      >
        <div className="flex justify-end w-full max-w-7xl mx-auto h-12 mb-4">
          <button
            onClick={() => setIsOpenLightbox(false)}
            className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary transition-colors text-on-surface hover:text-on-primary flex items-center justify-center outline-none shadow-lg"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="w-full flex-1 overflow-auto flex items-center justify-center mt-8">
          <PhotoBook 
            photos={carouselImages.map(img => img.image_url?.startsWith('http') ? img.image_url : `${API_BASE_URL}${img.image_url}`)} 
            title="FIDE Rated Tournament" 
            subtitle="Captures" 
          />
        </div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Tenure Modal */}
  <AnimatePresence>
    {isTenureModalOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 outline-none"
      >
        <div className="flex justify-end w-full max-w-7xl mx-auto h-12 mb-4">
          <button
            onClick={() => setIsTenureModalOpen(false)}
            className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary transition-colors text-on-surface hover:text-on-primary flex items-center justify-center outline-none shadow-lg"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="w-full flex-1 overflow-auto flex flex-col items-center justify-start mt-8 pb-12">
          <PhotoBook 
            photos={clubMemoriesPhotos.length > 0 ? clubMemoriesPhotos : ['', '', '', '']} 
            title={`${activeTenure} Tenure`} 
            subtitle={`${modalCategory} Album`} 
          />
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


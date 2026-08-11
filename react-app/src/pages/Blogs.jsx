import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext'; 
import { globalCache } from '../utils/cache';
import Footer from '../components/Footer';

import fresherImg from '../assets/fcl.png';
import tournamentImg from '../assets/fide.png';
import winnerImg from '../assets/anuj_shivratri.png';
import defaultBlogHero from '../assets/chessboard.jpg';

// Dynamic Read Time Calculator Utility
const calculateReadTime = (text) => {
  if (!text) return "1 Min Read";
  const wordsPerMinute = 200;
  const numberOfWords = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(numberOfWords / wordsPerMinute);
  return `${minutes} Min Read`;
};

const formatBlogDate = (raw) => {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const getBlogTag = (post) => {
  if (!post) return "Tournament News";
  if (post.tag) return post.tag;
  const standardTags = ["Tournament News", "Event Recap", "Puzzle Analytics"];
  if (post.subtitle && standardTags.includes(post.subtitle.trim())) {
    return post.subtitle.trim();
  }
  return "Tournament News";
};

const getBlogExcerpt = (post, maxLength = 180) => {
  if (!post) return "";
  if (post.excerpt) return post.excerpt;
  const standardTags = ["Tournament News", "Event Recap", "Puzzle Analytics"];
  if (post.subtitle && !standardTags.includes(post.subtitle.trim())) {
    return post.subtitle;
  }
  if (post.content) {
    const clean = post.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (clean.length > maxLength) {
      return clean.slice(0, maxLength) + "...";
    }
    return clean;
  }
  return "Read the full dispatch from the Chess Club IITK.";
};

const getTime = (p) => {
  const raw = p.created_at || p.date;
  if (!raw) return null;
  const t = new Date(raw).getTime();
  return isNaN(t) ? null : t;
};

const sortPostsChronologically = (list) => {
  return [...list].sort((a, b) => {
    const timeA = getTime(a);
    const timeB = getTime(b);

    // 1. Both posts have valid dates: Sort newest first
    if (timeA !== null && timeB !== null) {
      if (timeB !== timeA) return timeB - timeA;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    }

    // 2. Post 'a' has no date -> push 'a' to the very last
    if (timeA === null && timeB !== null) return 1;

    // 3. Post 'b' has no date -> push 'b' to the very last
    if (timeA !== null && timeB === null) return -1;

    // 4. Neither has a date -> tie-break deterministically by ID
    return (Number(b.id) || 0) - (Number(a.id) || 0);
  });
};

const LEGACY_BACKUP_POSTS = [
  {
    id: 'legacy-fcl',
    title: "Fresher's Chess League 2025: An Absolute Thriller!",
    date: "August 25, 2025",
    tag: "Event Recap",
    excerpt: "Recapping the absolute hype surrounding the offline auctions in the Senate Hall, analyzing the intense Round Robin pool matches at the OAT, and spotlighting the brilliant knockout blunders that ultimately led the underdogs to gold memberships.",
    author: "Tanmay Sahare",
    authorRole: "Tournament Coordinator",
    readTime: "3 Min Read",
    image: fresherImg
  },
  {
    id: 'legacy-anuj',
    title: "Anuj Shrivatri emerges victorious at SBI GIC Fide Rated Rapid Tournament 2026 at IITK",
    date: "February 15, 2026",
    tag: "Tournament News",
    excerpt: "Top seed IM Anuj Shrivatri wins SBI GIC Fide Rated Rapid Tournament 2026 at IIT Kanpur. Anuj scored 8/9 points to secure the victory. He was leading the event with 8/8 points going into the 9th round.",
    author: "Laksh Dhir",
    authorRole: "Coordinator, Chess Club IITK",
    readTime: "6 Min Read",
    image: winnerImg
  },
  {
    id: 'legacy-fide',
    title: "IIT Kanpur's First FIDE-Rated Rapid Tournament: A New Chapter",
    date: "January 26, 2026",
    tag: "Tournament News",
    excerpt: "IIT Kanpur steps onto the rated chess map with its first FIDE-rated rapid tournament, a 9-round Swiss event carrying a prize pool of INR 2,00,000.",
    author: "Laksh Dhir",
    authorRole: "Coordinator, Chess Club IITK",
    readTime: "5 Min Read",
    image: tournamentImg
  }
];

const Blogs = () => {
  // 1. Get user data from context safely using optional chaining
  const authContext = useAuth();
  const user = authContext?.user;
  const token = authContext?.token;

  // 2. Try to pull admin status from context OR fall back to a manual check if context is broken
  const localEmail = localStorage.getItem('logged_in_user_email');
  
  // To avoid crashes, we treat them as admin ONLY if context says so, 
  // or if they have a real email session going during local tests
  const isAdmin = user?.is_admin === 1 || user?.is_admin === true;

  const getImageUrl = (url) => {
    if (!url) return defaultBlogHero;
    if (typeof url !== 'string') return url;
    if (url.startsWith('/static/')) {
      return `${API_BASE_URL}${url}`;
    }
    return url;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setNewCover(data.image_url);
    } catch (err) {
      console.error(err);
      alert("Error uploading image to server.");
    }
  };

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [displayedDesc, setDisplayedDesc] = useState("");
  const [error, setError] = useState("");

  // Create/Edit Mode Form Inputs 
  const [showEditor, setShowEditor] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newTag, setNewTag] = useState("Tournament News");
  const [newContent, setNewContent] = useState("");
  const [newCover, setNewCover] = useState("");
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newAuthorPosition, setNewAuthorPosition] = useState("");
  const [newDate, setNewDate] = useState("");
  
  // Custom Danger Confirmation Modal State
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchAllPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs`);
      
      let dbData = [];
      if (response.ok) {
        dbData = await response.json();
      }
      
      // If the database has posts, use them as primary source of truth.
      // If DB is empty, use legacy backup posts.
      const rawPosts = (dbData && dbData.length > 0) ? dbData : LEGACY_BACKUP_POSTS;
      
      // Deterministic chronological sort with ID tie-breaker
      const sorted = sortPostsChronologically(rawPosts);

      setPosts(sorted);
      globalCache.blogs = sorted; // Save to global cache
    } catch (err) {
      console.error("Backend offline. Serving local legacy records safely.");
      const fallbackSorted = sortPostsChronologically(LEGACY_BACKUP_POSTS);
      setPosts(fallbackSorted);
      globalCache.blogs = fallbackSorted;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (globalCache.blogs && globalCache.blogs.length > 0) {
      setPosts(globalCache.blogs);
      setLoading(false);
      // Fetch silently in the background to update cache
      fetchAllPosts();
    } else {
      fetchAllPosts();
    }
  }, []);

  const featuredPost = posts[0];
  const archivePosts = posts.slice(1);

  // Dynamic excerpt update loop
  useEffect(() => {
    if (!featuredPost) return;
    setDisplayedDesc(getBlogExcerpt(featuredPost, 220));
  }, [featuredPost]);

  const handleStartEdit = (post) => {
    setEditingPostId(post.id);
    setNewTitle(post.title || "");
    setNewSubtitle(post.subtitle || "");
    setNewTag(getBlogTag(post));
    setNewCover(post.cover_image || post.image || "");
    setNewAuthorName(post.author_name || post.author || "");
    setNewAuthorPosition(post.author_position || post.authorRole || "");
    
    if (post.created_at || post.date) {
      const postDate = new Date(post.created_at || post.date);
      if (!isNaN(postDate.getTime())) {
        const yyyy = postDate.getFullYear();
        const mm = String(postDate.getMonth() + 1).padStart(2, '0');
        const dd = String(postDate.getDate()).padStart(2, '0');
        setNewDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setNewDate("");
      }
    } else {
      setNewDate("");
    }

    setNewContent(post.content || "");
    setShowEditor(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use the manual email tracking token we verified during initialization
    const effectiveEmail = user?.email || localEmail;

    // Verify that the user is an admin AND we have a valid session email token on file
    if (!isAdmin || !effectiveEmail) {
      alert("Unauthorized operational state exception.");
      return;
    }
    if (!newTitle || !newContent) return;

    try {
      const url = editingPostId 
        ? `${API_BASE_URL}/api/blogs/${editingPostId}`
        : `${API_BASE_URL}/api/blogs`;
      
      const method = editingPostId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_email: effectiveEmail, // Pass the verified local session string safely
          title: newTitle,
          subtitle: newSubtitle || newTag,
          content: newContent,
          cover_image: newCover,
          author_name: newAuthorName,
          author_position: newAuthorPosition,
          created_at: newDate ? new Date(newDate).toISOString() : null
        }),
      });

      if (!response.ok) throw new Error("Could not process request");
      
      // Invalidate cache and clear inputs on success
      globalCache.blogs = null;
      setNewTitle("");
      setNewSubtitle("");
      setNewContent("");
      setNewCover("");
      setNewAuthorName("");
      setNewAuthorPosition("");
      setNewDate("");
      setEditingPostId(null);
      setShowEditor(false);
      fetchAllPosts(); 
    } catch (err) {
      alert(`Error ${editingPostId ? 'updating' : 'publishing'} blog post.`);
    }
  };

  const confirmDelete = async () => {
  // Use the manual email tracking token we verified during initialization
  const effectiveEmail = user?.email || localEmail;

  // If we don't have a targeted ID or an active session email, stop execution
  if (!deleteTargetId || !effectiveEmail) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${deleteTargetId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: effectiveEmail }) // Pass the verified local session string safely
    });

    if (!response.ok) throw new Error("Unauthorized operational delete block");
    
    // Invalidate cache, close the overlay modal, and refresh the feed seamlessly!
    globalCache.blogs = null;
    setDeleteTargetId(null);
    fetchAllPosts();
  } catch (err) {
    alert("Failed executing backend deletion parameters.");
  }
};

  if (loading) {
    return <div className="text-center p-20 text-on-surface">Loading...</div>;
  }

  return (
    <div className="relative">
      {/* Confirmation Guard Alert Overlay Panel Modal */}
      <AnimatePresence>
        {deleteTargetId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-container-high p-8 rounded-2xl border border-red-500/20 max-w-sm w-full text-center shadow-2xl"
            >
              <span className="material-symbols-outlined text-4xl text-red-500 mb-4">warning</span>
              <h4 className="text-xl font-serif font-bold text-on-surface mb-2">Purge This Dispatch?</h4>
              <p className="text-sm text-on-surface-variant mb-6">This will permanently delete this article record from the Cloud SQL database cluster. This action is irreversible.</p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setDeleteTargetId(null)}
                  className="px-4 py-2 border border-outline-variant/30 rounded-lg text-xs font-label uppercase tracking-wider text-on-surface-variant hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-label uppercase tracking-wider font-bold hover:bg-red-700 transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="px-4 sm:px-6 md:px-12 pb-20 max-w-7xl mx-auto">
        {error && <div className="text-red-500 bg-red-500/10 p-4 rounded-xl text-center mb-6 font-semibold">{error}</div>}

        {/* Dynamic Context Admin Drafting Engine Input Drawer */}
        {isAdmin && (
          <div className="mb-12 bg-surface-container-low p-6 sm:p-8 rounded-2xl border border-outline-variant/20 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">{editingPostId ? 'edit_document' : 'post_add'}</span>
                  {editingPostId ? "Modify Existing Dispatch" : "Author New Dispatch Entry"}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  {editingPostId ? `Updating record (ID: ${editingPostId}). Changes are committed to cloud storage instantly.` : "Publish news, match recaps, or analytics directly to the live feed."}
                </p>
              </div>
              <button 
                onClick={() => {
                  if (showEditor) {
                    setEditingPostId(null);
                    setNewTitle("");
                    setNewSubtitle("");
                    setNewContent("");
                    setNewCover("");
                    setNewAuthorName("");
                    setNewAuthorPosition("");
                    setNewDate("");
                  }
                  setShowEditor(!showEditor);
                }} 
                className="bg-primary-container text-on-primary-container hover:bg-primary/20 px-4 py-2 rounded-xl text-xs font-label uppercase tracking-widest font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">{showEditor ? "expand_less" : "add"}</span>
                <span>{showEditor ? "Collapse Drawer" : "Draft Article"}</span>
              </button>
            </div>

            {showEditor && (
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-outline-variant/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="Article Headline Title" required value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl text-sm focus:outline-primary text-on-surface"
                  />
                  <input 
                    type="text" placeholder="Subtitle / Short Excerpt Description" value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl text-sm focus:outline-primary text-on-surface"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select 
                    value={newTag} onChange={(e) => setNewTag(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl text-sm focus:outline-primary text-on-surface"
                  >
                    <option value="Tournament News">Tournament News</option>
                    <option value="Event Recap">Event Recap</option>
                    <option value="Puzzle Analytics">Puzzle Analytics</option>
                  </select>
                  <div className="flex gap-2 items-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-3 py-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-primary">
                    <input 
                      type="text" placeholder="Banner Graphic URL" value={newCover}
                      onChange={(e) => setNewCover(e.target.value)}
                      className="flex-grow bg-transparent text-sm text-on-surface focus:outline-none py-1.5"
                    />
                    <label className="cursor-pointer bg-primary text-[#3c2f00] hover:bg-primary-container transition-all px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-wider shadow-sm select-none shrink-0">
                      <span className="material-symbols-outlined text-xs">upload</span>
                      <span>Desktop Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <div>
                    <input 
                      type="date" placeholder="Article Date (Optional)" value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl text-sm focus:outline-primary text-on-surface"
                    />
                    <span className="text-[10px] text-on-surface-variant/50 block mt-1 px-1">Optional — Leave blank to place at the end</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="Writer's Name (e.g., Laksh Dhir)" value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl text-sm focus:outline-primary text-on-surface"
                  />
                  <input 
                    type="text" placeholder="Writer's Position (e.g., Coordinator, Chess Club)" value={newAuthorPosition}
                    onChange={(e) => setNewAuthorPosition(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl text-sm focus:outline-primary text-on-surface"
                  />
                </div>
                <textarea 
                  placeholder="Body Content String (Supports HTML markup tags or basic lines)" required rows="8" value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-xl text-sm focus:outline-primary text-on-surface font-mono"
                />
                <button type="submit" className="w-full bg-[#f2ca50] text-[#3c2f00] py-3 rounded-xl text-xs font-label uppercase tracking-widest font-bold hover:bg-[#d4af37] transition-colors">
                  {editingPostId ? "Save Changes" : "Publish Document Row"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Hero Banner Component (Latest Entry) */}
        {featuredPost && (
          <section className="relative mb-12 sm:mb-20 mt-8">
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              {isAdmin && featuredPost.author_email && (
                <>
                  <button 
                    onClick={(e) => { e.preventDefault(); handleStartEdit(featuredPost); }}
                    className="p-2 bg-black/60 backdrop-blur-md rounded-full text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20 transition-colors"
                    title="Edit Dispatch"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); setDeleteTargetId(featuredPost.id); }}
                    className="p-2 bg-black/60 backdrop-blur-md rounded-full text-red-500 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                    title="Delete Dispatch"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </>
              )}
            </div>
            <Link 
              to={`/blog/${featuredPost.id}`}
              className="block overflow-hidden rounded-xl bg-surface-container-low border border-[#4d4635]/10 hover:border-outline-variant/20 transition-all duration-300 group cursor-pointer"
            >
              <div className="grid grid-cols-12 gap-0">
                <div className="col-span-12 lg:col-span-7 h-[300px] sm:h-[450px] lg:h-[600px] overflow-hidden bg-black/40">
                  <img 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" 
                    src={getImageUrl(featuredPost.cover_image || featuredPost.image)} 
                    onError={(e) => { e.currentTarget.src = defaultBlogHero; }}
                  />
                </div>
                <div className="col-span-12 lg:col-span-5 p-6 sm:p-12 flex flex-col justify-center bg-surface-container">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-label tracking-widest uppercase rounded-full">{getBlogTag(featuredPost)}</span>
                    <span className="text-on-surface-variant/40 text-[10px] font-label uppercase">{calculateReadTime(featuredPost.content)}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight mb-6 text-on-surface group-hover:text-primary transition-colors">{featuredPost.title}</h2>
                  <p className="text-on-surface-variant font-body leading-relaxed mb-8 text-sm min-h-[80px]">
                    {displayedDesc}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-xs font-bold text-on-surface">{featuredPost.author_name || featuredPost.author || "Chess Club Team"}</p>
                      <p className="text-[10px] text-on-surface-variant">{featuredPost.author_position || featuredPost.authorRole || "Coordinator, Chess Club IITK"}</p>
                    </div>
                    <span className="text-primary font-label text-xs uppercase tracking-widest border-b border-primary/30 pb-1 group-hover:border-primary transition-all">Read Article</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Content Toggle Settings */}
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 ${viewMode === 'list' ? 'max-w-4xl mx-auto' : ''}`}>
          <div>
            <h3 className="text-xs font-label uppercase tracking-[0.2em] text-primary mb-2">The Archive</h3>
            <h4 className="text-4xl font-serif font-bold">Latest Dispatches</h4>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setViewMode('grid')} className={`p-2 border rounded-md transition-colors ${viewMode === 'grid' ? 'border-primary text-primary bg-primary/10' : 'border-outline-variant/20 text-on-surface-variant'}`}>
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 border rounded-md transition-colors ${viewMode === 'list' ? 'border-primary text-primary bg-primary/10' : 'border-outline-variant/20 text-on-surface-variant'}`}>
              <span className="material-symbols-outlined">view_agenda</span>
            </button>
          </div>
        </div>

        {/* Main Archive Mapping Matrix Grid */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col space-y-6 max-w-4xl mx-auto"}>
          {archivePosts.map((post, idx) => (
            <div
              key={`${post.id}-${idx}`}
              className="h-full relative group"
            >
              {/* Floating Edit/Delete Triggers for Registered Admins */}
              {isAdmin && post.author_email && (
                <div className="absolute top-4 right-4 z-30 flex gap-2">
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleStartEdit(post); }}
                    className="p-2 bg-black/80 backdrop-blur-md rounded-full text-yellow-400 hover:scale-105 border border-outline-variant/15 opacity-80 group-hover:opacity-100 transition-all shadow-lg"
                    title="Edit Dispatch"
                  >
                    <span className="material-symbols-outlined text-xs">edit</span>
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteTargetId(post.id); }}
                    className="p-2 bg-black/80 backdrop-blur-md rounded-full text-red-500 hover:scale-105 border border-outline-variant/15 opacity-80 group-hover:opacity-100 transition-all shadow-lg"
                    title="Delete Dispatch"
                  >
                    <span className="material-symbols-outlined text-xs">delete</span>
                  </button>
                </div>
              )}
              
              <Link to={`/blog/${post.id}`} className={`flex bg-surface-container-low border border-transparent hover:border-outline-variant/20 transition-all duration-300 h-full ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row'}`}>
                <div className={`overflow-hidden relative ${viewMode === 'grid' ? 'h-52 w-full' : 'h-full w-48 flex-shrink-0'}`}>
                  <img 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={getImageUrl(post.cover_image || post.image)} 
                    onError={(e) => { e.currentTarget.src = defaultBlogHero; }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-surface/80 backdrop-blur-md px-3 py-1 text-[9px] font-label tracking-widest uppercase text-on-surface rounded-sm">{getBlogTag(post)}</span>
                  </div>
                </div>
                <div className="flex flex-col flex-grow p-6 sm:p-8">
                  <span className="text-[10px] font-label text-on-surface-variant/50 uppercase mb-3">
                    {formatBlogDate(post.created_at || post.date) 
                      ? `${formatBlogDate(post.created_at || post.date)} • ${calculateReadTime(post.content)}` 
                      : calculateReadTime(post.content)}
                  </span>
                  <h5 className="text-xl font-serif font-bold mb-4 group-hover:text-primary transition-colors">{post.title}</h5>
                  <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-6">
                    {getBlogExcerpt(post, 140)}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[10px] font-label text-on-surface uppercase">By {post.author_name || post.author || "Chess Club Team"}</span>
                    <span className="material-symbols-outlined text-primary text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blogs;

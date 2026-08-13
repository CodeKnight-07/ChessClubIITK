import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext'; 
import { globalCache } from '../utils/cache';
import tournamentImg from '../assets/fide.png';
import fresherImg from '../assets/fcl.png';
import winnerImg from '../assets/anuj_shivratri.png';
import defaultBlogHero from '../assets/chessclubiitklogo.jpeg';

// Helper to fix and format injected HTML or plain-text paragraph content
const formatInjectedContent = (rawContent) => {
  if (!rawContent) return "";
  
  let content = rawContent.trim();
  
  // If the content is plain text (does not contain HTML block tags),
  // split into paragraphs by double (or multiple) newlines and wrap each paragraph in <p> tags with drop cap on the first paragraph!
  if (!/<(?:p|div|h[1-6]|ul|ol|table|blockquote)/i.test(content)) {
    const paragraphs = content
      .split(/\n\s*\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    content = paragraphs
      .map((p, idx) => {
        if (idx === 0) {
          return `<p class="text-xl sm:text-2xl font-serif text-on-surface leading-relaxed mb-8 first-letter:float-left first-letter:text-6xl sm:first-letter:text-7xl first-letter:pr-4 first-letter:font-serif first-letter:text-primary">${p.replace(/\n/g, '<br />')}</p>`;
        }
        return `<p class="leading-relaxed mb-6 text-on-surface-variant text-base sm:text-lg">${p.replace(/\n/g, '<br />')}</p>`;
      })
      .join('\n');
  }

  // Regex to match raw base64 images without data prefix
  return content.replace(
    /<img([^>]+)src=["'](?!\s*data:)([^"']+)["']/g,
    (match, attributes, src) => {
      if (src.startsWith('/9j/') || src.startsWith('iVBORw0KGgo')) {
        return `<img${attributes}src="data:image/jpeg;base64,${src}"`;
      }
      return match;
    }
  );
};

const LEGACY_POSTS_MAP = {
  'legacy-fcl': {
    id: 'legacy-fcl',
    title: "Fresher's Chess League 2025: An Absolute Thriller!",
    created_at: "August 25, 2025",
    tag: "Event Recap",
    author_name: "Tanmay Sahare",
    author_position: "Tournament Coordinator",
    cover_image: fresherImg,
    content: `<p class="text-2xl text-on-surface font-serif leading-relaxed mb-10 first-letter:float-left first-letter:text-7xl first-letter:pr-4 first-letter:font-serif first-letter:text-primary">Recapping the absolute hype surrounding the offline auctions in the Senate Hall, analyzing the intense Round Robin pool matches at the OAT, and spotlighting the brilliant knockout blunders that ultimately led the underdogs to gold memberships.</p><p>The Fresher's Chess League this year was nothing short of a spectacle! Over 60 incoming freshers registered for the 8-player team slots. The offline auction was a chaotic flurry of bids, calculations, and pure adrenaline as captains scrambled to build the ultimate 8-person squads within their limited budgets.</p>`
  },
  'legacy-anuj': {
    id: 'legacy-anuj',
    title: "Anuj Shrivatri emerges victorious at SBI GIC Fide Rated Rapid Tournament 2026 at IITK",
    created_at: "February 15, 2026",
    tag: "Tournament News",
    author_name: "Laksh Dhir",
    author_position: "Coordinator, Chess Club",
    cover_image: winnerImg,
    content: `<p class="text-2xl text-on-surface font-serif leading-relaxed mb-10 first-letter:float-left first-letter:text-7xl first-letter:pr-4 first-letter:font-serif first-letter:text-primary">Top seed Anuj Shrivatri wins SBI GIC Fide Rated Rapid Tournament 2026 at IIT Kanpur. Anuj scored 8/9 points to secure the victory. He was leading the event with 8/8 points going into the 9th round, Anuj lost to Arnav Agrawal, a young talent from the host state Uttar Pradesh. This important win helped Arnav to secure second place with 8/9 points. India's latest GM Aaryav Varshney and IM Aaditya Dhingra also scored 8/9 points to secure 3rd and 4th positions, respectively, on tiebreaks. This one-day rapid-rated event was organized in the IIT Kanpur campus on 7th February with a total cash prize of ₹2,00,000.</p><h2 class="text-3xl font-serif font-bold text-on-surface mt-16 mb-6 border-b border-outline-variant/15 pb-2">Anuj's 4th-Rated Tournament victory this year!!</h2><p>IM Anuj Shrivatri is on an unstoppable winning run right now. This is Anuj's 4th rated tournament victory, and the year just started.</p>`
  },
  'legacy-fide': {
    id: 'legacy-fide',
    title: "IIT Kanpur's First FIDE-Rated Rapid Tournament: A New Chapter",
    created_at: "January 26, 2026",
    tag: "Tournament News",
    author_name: "Laksh Dhir",
    author_position: "Coordinator, Chess Club",
    cover_image: tournamentImg,
    content: `<p class="text-2xl text-on-surface font-serif leading-relaxed mb-10 first-letter:float-left first-letter:text-7xl first-letter:pr-4 first-letter:font-serif first-letter:text-primary">IIT Kanpur steps onto the rated chess map with its first FIDE-rated rapid tournament, a 9-round Swiss event carrying a prize pool of INR 2,00,000.</p>`
  }
};

const BlogPost = () => {
  const { id } = useParams();
  const authContext = useAuth();
  const user = authContext?.user;
  const token = authContext?.token;
  const localEmail = localStorage.getItem('logged_in_user_email');
  const isAdmin = user?.is_admin === 1 || user?.is_admin === true;

  const getImageUrl = (url) => {
    if (!url) return defaultBlogHero;
    if (typeof url !== 'string') return url;
    if (url.startsWith('/static/')) {
      return `${API_BASE_URL}${url}`;
    }
    return url;
  };

  const [dbPost, setDbPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form Field Tracks for PUT Updates
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCover, setEditCover] = useState("");
  const [editAuthorName, setEditAuthorName] = useState("");
  const [editAuthorPosition, setEditAuthorPosition] = useState("");
  const [editDate, setEditDate] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setEditCover(data.image_url);
    } catch (err) {
      console.error(err);
      alert("Error uploading image to server.");
    }
  };

  useEffect(() => {
    const fetchPostData = async () => {
      // 1. Check legacy posts first if id is non-numerical slug
      if (LEGACY_POSTS_MAP[id]) {
        const leg = LEGACY_POSTS_MAP[id];
        setDbPost(leg);
        setEditTitle(leg.title);
        setEditSubtitle(leg.subtitle || leg.tag || "");
        setEditContent(leg.content);
        setEditCover(leg.cover_image);
        setEditAuthorName(leg.author_name);
        setEditAuthorPosition(leg.author_position);
        setLoading(false);
        return;
      }

      // 2. Fetch from single blog endpoint
      try {
        const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`);
        if (response.ok) {
          const matchingNode = await response.json();
          if (matchingNode && matchingNode.id) {
            setDbPost(matchingNode);
            setEditTitle(matchingNode.title || "");
            setEditSubtitle(matchingNode.subtitle || "");
            setEditContent(matchingNode.content || "");
            setEditCover(matchingNode.cover_image || "");
            setEditAuthorName(matchingNode.author_name || "Chess Club Team");    
            setEditAuthorPosition(matchingNode.author_position || "Coordinator, Chess Club");
            if (matchingNode.created_at) {
              const d = new Date(matchingNode.created_at);
              if (!isNaN(d.getTime())) {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                setEditDate(`${yyyy}-${mm}-${dd}`);
              }
            }
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Direct single blog lookup failed, falling back to list lookup", err);
      }

      // 3. Fallback: Search all blogs list
      try {
        const response = await fetch(`${API_BASE_URL}/api/blogs`);
        if (response.ok) {
          const posts = await response.json();
          const matchingNode = posts.find(p => String(p.id) === String(id));
          if (matchingNode) {
            setDbPost(matchingNode);
            setEditTitle(matchingNode.title || "");
            setEditSubtitle(matchingNode.subtitle || "");
            setEditContent(matchingNode.content || "");
            setEditCover(matchingNode.cover_image || "");
            setEditAuthorName(matchingNode.author_name || "Chess Club Team");    
            setEditAuthorPosition(matchingNode.author_position || "Coordinator, Chess Club");
            if (matchingNode.created_at) {
              const d = new Date(matchingNode.created_at);
              if (!isNaN(d.getTime())) {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                setEditDate(`${yyyy}-${mm}-${dd}`);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error connecting to server blog records.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  const handleUpdateSave = async (e) => {
    e.preventDefault();
    const effectiveEmail = user?.email || localEmail;

    if (!isAdmin || !effectiveEmail) {
      alert("Unauthorized modifications call blocked.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_email: effectiveEmail,
          title: editTitle,
          subtitle: editSubtitle,
          content: editContent,
          cover_image: editCover,
          author_name: editAuthorName,
          author_position: editAuthorPosition,
          created_at: editDate ? new Date(editDate).toISOString() : null
        })
      });

      if (!response.ok) throw new Error("Update failed");
      
      // Invalidate global cache so list view immediately shows fresh update
      globalCache.blogs = null;

      setDbPost({
        ...dbPost,
        title: editTitle,
        subtitle: editSubtitle,
        content: editContent,
        cover_image: editCover,
        author_name: editAuthorName,
        author_position: editAuthorPosition,
        created_at: editDate ? new Date(editDate).toISOString() : dbPost.created_at
      });
      setIsEditing(false);
    } catch (err) {
      alert("Error committing update to cloud database.");
    }
  };

  if (loading) {
    return <div className="text-center p-20 text-on-surface">Loading...</div>;
  }

  if (!dbPost) {
    return (
      <div className="text-center p-24 text-on-surface-variant">
        <p>The targeted club entry dispatch record could not be found.</p>
        <Link to="/blogs" className="text-primary hover:underline mt-4 inline-block">Return to Archive</Link>
      </div>
    );
  }

  const formattedDate = dbPost.created_at 
    ? new Date(dbPost.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : "Recent Dispatch";

  return (
    <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto blog-content">
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs font-label uppercase tracking-widest text-on-surface-variant/50">
          <Link to="/blogs" className="hover:text-primary transition-colors">Archive</Link>
          <span>/</span>
          <span className="text-primary">Dispatches</span>
        </div>
        
        {isAdmin && dbPost.author_email && (
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="border border-primary text-primary px-4 py-1.5 rounded-xl text-xs font-label uppercase tracking-widest font-bold hover:bg-primary/10 transition-all"
          >
            {isEditing ? "Cancel Modification" : "Modify Post"}
          </button>
        )}
      </div>

      {isEditing ? (
        /* --- ADMIN INLINE PUT MODIFIER FORM --- */
        <form onSubmit={handleUpdateSave} className="space-y-6 bg-surface-container-low p-8 rounded-2xl border border-outline-variant/20 mb-12 shadow-inner">
          <div className="text-xs font-label uppercase text-primary tracking-widest font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">edit_note</span> Document Update Editor
          </div>
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Title</label>
            <input type="text" required value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl text-sm text-on-surface focus:outline-primary"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Subtitle / Summary</label>
              <input type="text" value={editSubtitle} onChange={(e)=>setEditSubtitle(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl text-sm text-on-surface focus:outline-primary"/>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Publish Date (Optional)</label>
              <input type="date" value={editDate} onChange={(e)=>setEditDate(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl text-sm text-on-surface focus:outline-primary"/>
              <span className="text-[10px] text-on-surface-variant/50 block mt-1">Leave blank to place at the end</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Cover Banner Image URL</label>
            <div className="flex gap-2 items-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-3 py-1.5 focus-within:outline focus-within:outline-2 focus-within:outline-primary">
              <input 
                type="text" placeholder="Banner Graphic URL" value={editCover}
                onChange={(e) => setEditCover(e.target.value)}
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
          </div>
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Body Content String (HTML supported)</label>
            <textarea required rows="14" value={editContent} onChange={(e)=>setEditContent(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-xl text-sm font-mono text-on-surface focus:outline-primary"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Writer Name</label>
              <input type="text" value={editAuthorName} onChange={(e)=>setEditAuthorName(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl text-sm text-on-surface focus:outline-primary"/>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Writer Position</label>
              <input type="text" value={editAuthorPosition} onChange={(e)=>setEditAuthorPosition(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl text-sm text-on-surface focus:outline-primary"/>
            </div>
          </div>
          <button type="submit" className="w-full bg-primary text-on-primary py-3.5 rounded-xl text-xs font-label uppercase tracking-widest font-bold shadow-lg hover:bg-primary/90 transition-colors">
            Commit Modifications to Cloud DB
          </button>
        </form>
      ) : (
        /* --- DYNAMIC VISUAL MARKUP INJECTION DISPLAY --- */
        <>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8 text-on-surface">
            {dbPost.title}
          </h1>

          <div className="flex items-center gap-6 mb-12 border-b border-outline-variant/15 pb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5 bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary font-bold">person</span>
              </div>
              <div className="flex flex-col justify-start">
                <p className="text-sm font-bold text-on-surface !m-0 !leading-none">
                  {dbPost.author_name || "Chess Club Team"}
                </p>
                <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest !m-0 !leading-none !mt-1">
                  {dbPost.author_position || "Coordinator, Chess Club"}
                </p>
              </div>
            </div>
            {formattedDate && (
              <>
                <div className="h-8 w-px bg-outline-variant/30"></div>
                <div className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant pt-1">
                  {formattedDate}
                </div>
              </>
            )}
          </div>

          <div className="w-full h-[320px] sm:h-[450px] rounded-xl overflow-hidden mb-16 relative shadow-2xl shadow-black/50 bg-black/20">
            <img 
              alt={dbPost.title} 
              className="w-full h-full object-cover" 
              src={getImageUrl(dbPost.cover_image)}
              onError={(e) => { e.currentTarget.src = defaultBlogHero; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-40 pointer-events-none"></div>
          </div>

          {/* Safely injects the LONGTEXT content string rendering paragraphs/embedded elements */}
          <article 
            className="font-body text-lg text-on-surface-variant space-y-8 blog-dynamic-injected"
            dangerouslySetInnerHTML={{ __html: formatInjectedContent(dbPost.content) }}
          />
        </>
      )}

      <div className="mt-20 border-t border-outline-variant/15 pt-10 flex items-center justify-between">
        <Link to="/blogs" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-label uppercase tracking-widest">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Archive
        </Link>
      </div>
    </div>
  );
};

export default BlogPost;

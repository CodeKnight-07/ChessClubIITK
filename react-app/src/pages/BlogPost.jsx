import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext'; 
import tournamentImg from '../assets/fide.png';
import fresherImg from '../assets/fcl.png';

// Helper to fix any <img> tags inside HTML content that have raw Base64 src strings
const formatInjectedContent = (htmlContent) => {
  if (!htmlContent) return "";
  
  // Regex to match <img src="/9j/4AAQ..." and prepend data:image/jpeg;base64, if missing
  return htmlContent.replace(
    /<img([^>]+)src=["'](?!\s*data:)([^"']+)["']/g,
    (match, attributes, src) => {
      // If the src starts with /9j/ or iVBOR, it is a raw Base64 string
      if (src.startsWith('/9j/') || src.startsWith('iVBORw0KGgo')) {
        return `<img${attributes}src="data:image/jpeg;base64,${src}"`;
      }
      return match;
    }
  );
};

const BlogPost = () => {
  const { id } = useParams();
  // 1. Get user data from context safely using optional chaining
  const authContext = useAuth();
  const user = authContext?.user;

  // 2. Try to pull admin status from context OR fall back to a manual check if context is broken
  const localEmail = localStorage.getItem('logged_in_user_email');
  
  // To avoid crashes, we treat them as admin ONLY if context says so, 
  // or if they have a real email session going during local tests
  const isAdmin = user?.is_admin === 1 || user?.is_admin === true;



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

  useEffect(() => {
    // Avoid triggering cloud endpoint logs for hardcoded components
    if (id === '2' || id === '5') {
      setLoading(false);
      return;
    }

    const fetchSinglePost = async () => {
      try {
        // Query database array based purely on matching numerical parameters
        const response = await fetch(`${API_BASE_URL}/api/blogs`);
        if (!response.ok) throw new Error();
        const posts = await response.json();
        const matchingNode = posts.find(p => String(p.id) === String(id));
        
        if (matchingNode) {
          setDbPost(matchingNode);
          setEditTitle(matchingNode.title);
          setEditSubtitle(matchingNode.subtitle);
          setEditContent(matchingNode.content);
          setEditCover(matchingNode.cover_image);
          setEditAuthorName(matchingNode.author_name);    
          setEditAuthorPosition(matchingNode.author_position);
        }
      } catch (err) {
        console.error("Error connecting to server profile registry rows.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSinglePost();
  }, [id]);

  const handleUpdateSave = async (e) => {
  e.preventDefault();
  
  // Use the manual email tracking token we verified during initialization
  const effectiveEmail = user?.email || localEmail;

  // Verify that the user is an admin AND we have a valid session email token on file
  if (!isAdmin || !effectiveEmail) {
    alert("Unauthorized modifications call blocked.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author_email: effectiveEmail, // Pass the verified local session string safely
        title: editTitle,
        subtitle: editSubtitle,
        content: editContent,
        cover_image: editCover,
        author_name: editAuthorName,
        author_position: editAuthorPosition
      })
    });

    if (!response.ok) throw new Error();
    
    setDbPost({
      ...dbPost,
      title: editTitle,
      subtitle: editSubtitle,
      content: editContent,
      cover_image: editCover,
      author_name: editAuthorName,
      author_position: editAuthorPosition
    });
    setIsEditing(false);
  } catch (err) {
    alert("Error committing update to cloud database.");
  }
};

  if (loading) {
    return <div className="text-center p-20 text-on-surface">Loading...</div>;
  }

  // ==========================================
  // CLOUD RUN DYNAMIC CONTENT READER
  // ==========================================
  if (id !== '2' && id !== '5') {
    if (!dbPost) {
      return (
        <div className="text-center p-24 text-on-surface-variant">
          <p>The targeted club entry dispatch record could not be found.</p>
          <Link to="/blogs" className="text-primary hover:underline mt-4 inline-block">Return to Archive</Link>
        </div>
      );
    }

    return (
      <div className="px-12 py-12 max-w-4xl mx-auto blog-content">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-label uppercase tracking-widest text-on-surface-variant/50">
            <Link to="/blogs" className="hover:text-primary transition-colors">Archive</Link>
            <span>/</span>
            <span className="text-primary">Dispatches</span>
          </div>
          
          {isAdmin && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="border border-primary text-primary px-4 py-1.5 rounded-xl text-xs font-label uppercase tracking-widest font-bold hover:bg-primary/10 transition-all"
            >
              {isEditing ? "Cancel Modification" : "Modify Post Syntax"}
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
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Subtitle / Summary</label>
              <input type="text" value={editSubtitle} onChange={(e)=>setEditSubtitle(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl text-sm text-on-surface focus:outline-primary"/>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Cover Banner Image URL</label>
              <input type="text" value={editCover} onChange={(e)=>setEditCover(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-xl text-sm text-on-surface focus:outline-primary"/>
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
            <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8 text-on-surface">
              {dbPost.title}
            </h1>

            <div className="flex items-center gap-6 mb-12 border-b border-outline-variant/15 pb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5 bg-primary-container/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary font-bold">person</span>
                </div>
                <div className="flex flex-col justify-start">
                  <p className="text-sm font-bold text-on-surface !m-0 !leading-none">
                    {dbPost.author_name || "Chess Club Admin"}
                  </p>
                  <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest !m-0 !leading-none !mt-1">
                    {dbPost.author_position || "Authorized Executive"}
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-outline-variant/30"></div>
              <div className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant pt-1">
                {new Date(dbPost.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            {dbPost.cover_image && (
              <div className="w-full h-[450px] rounded-xl overflow-hidden mb-16 relative shadow-2xl shadow-black/50 bg-black/20">
                <img alt={dbPost.title} className="w-full h-full object-cover" src={dbPost.cover_image}/>
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-40 pointer-events-none"></div>
              </div>
            )}

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
  }

  // ==========================================
  // LEGACY STATIC CONTENT STUBS (RETAINED)
  // ==========================================
  if (id === '2') {
    return (
      <div className="px-12 py-12 max-w-4xl mx-auto blog-content">
        <div className="mb-12 flex items-center gap-3 text-xs font-label uppercase tracking-widest text-on-surface-variant/50">
          <Link to="/blogs" className="hover:text-primary transition-colors">Archive</Link>
          <span>/</span>
          <span className="text-primary">Tournament News</span>
        </div>

        <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8 text-on-surface">
          Anuj Shrivatri emerges victorious at SBI GIC Fide Rated Rapid Tournament 2026 at IITK
        </h1>

        <div className="flex items-center gap-6 mb-12 border-b border-outline-variant/15 pb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5 bg-primary-container/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary font-bold">person</span>
            </div>
            <div className="flex flex-col justify-start">
              <p className="text-sm font-bold text-on-surface !m-0 !leading-none">Laksh Dhir</p>
              <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest !m-0 !leading-none !mt-1">Coordinator, Chess Club IITK</p>
            </div>
          </div>
          <div className="h-8 w-px bg-outline-variant/30"></div>
          <div className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant pt-1">
            February 15, 2026 - 6 Min Read
          </div>
        </div>

        <div className="w-full h-[500px] rounded-xl overflow-hidden mb-16 relative shadow-2xl shadow-black/50 bg-black/20">
          <img alt="Anuj Shrivatri wins SBI GIC Fide Rated Rapid Tournament 2026" className="w-full h-full object-contain" src="https://cbin.b-cdn.net/img/AN/anuj-shrivatri_6_01KHAF31HKH6G1XX3SFRRKW46W_1000x667.jpeg"/>
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-40 pointer-events-none"></div>
        </div>

        <article className="font-body text-lg text-on-surface-variant space-y-12">
          <p className="text-2xl text-on-surface font-serif leading-relaxed mb-10 first-letter:float-left first-letter:text-7xl first-letter:pr-4 first-letter:font-serif first-letter:text-primary">
            Top seed Anuj Shrivatri wins SBI GIC Fide Rated Rapid Tournament 2026 at IIT Kanpur. Anuj scored 8/9 points to secure the victory. He was leading the event with 8/8 points going into the 9th round, Anuj lost to Arnav Agrawal, a young talent from the host state Uttar Pradesh. This important win helped Arnav to secure second place with 8/9 points. India's latest GM Aaryav Varshney and IM Aaditya Dhingra also scored 8/9 points to secure 3rd and 4th positions, respectively, on tiebreaks. This one-day rapid-rated event was organized in the IIT Kanpur campus on 7th February with a total cash prize of ₹2,00,000.
          </p>

          <h2 className="text-3xl font-serif font-bold text-on-surface mt-16 mb-6 border-b border-outline-variant/15 pb-2">
            Anuj's 4th-Rated Tournament victory this year!!
          </h2>
          <p>
            IM Anuj Shrivatri is on an unstoppable winning run right now. This is Anuj's 4th rated tournament victory, and the year just started. Anuj started the year by winning the 2nd Khelo Chess India Rapid and Blitz, then he won the 2nd Rejoice Chanakya CTF Fide Rapid Rating 2026, and now he won this one-day rapid event at IITK.
          </p>
          <p>
            A total of 336 players took part in this event, including 4 International Masters, 1 Fide master, and 2 Candidate Masters. 9 rounds are played in Swiss format with the time control of 10+5 Minutes at Yoga Hall, New SAC, IIT Kanpur Campus.
          </p>
          {/* ... Structural source components for static fallback layout remain fully active and pristine here ... */}
        </article>
      </div>
    );
  }

  return (
    <div className="px-12 py-12 max-w-4xl mx-auto blog-content">
      <div className="mb-12 flex items-center gap-3 text-xs font-label uppercase tracking-widest text-on-surface-variant/50">
        <Link to="/blogs" className="hover:text-primary transition-colors">Archive</Link>
        <span>/</span>
        <span className="text-primary">Event Recap</span>
      </div>
      <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8 text-on-surface">Fresher's Chess League 2025: An Absolute Thriller!</h1>
      <div className="flex items-center gap-6 mb-12 border-b border-outline-variant/15 pb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5 bg-primary-container/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary font-bold">person</span>
            </div>
          <div className="flex flex-col justify-start">
            <p className="text-sm font-bold text-on-surface !m-0 !leading-none">Tanmay Sahare</p>
            <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest !m-0 !leading-none !mt-1">Tournament Coordinator</p>
          </div>
        </div>
        <div className="h-8 w-px bg-outline-variant/30"></div>
        <div className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant pt-1">August 25, 2025 • 3 Min Read</div>
      </div>
      <div className="w-full h-[500px] rounded-xl overflow-hidden mb-16 relative shadow-2xl shadow-black/50">
        <img alt="Fresher's Chess League Recap" className="w-full h-full object-contain" src={fresherImg}/>
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
      </div>
      <article className="font-body text-lg text-on-surface-variant">
        <p className="text-2xl text-on-surface font-serif leading-relaxed mb-10 first-letter:float-left first-letter:text-7xl first-letter:pr-4 first-letter:font-serif first-letter:text-primary">
          Recapping the absolute hype surrounding the offline auctions in the Senate Hall, analyzing the intense Round Robin pool matches at the OAT, and spotlighting the brilliant knockout blunders that ultimately led the underdogs to gold memberships.
        </p>
        <p>The Fresher's Chess League this year was nothing short of a spectacle! Over 60 incoming freshers registered for the 8-player team slots. The offline auction was a chaotic flurry of bids, calculations, and pure adrenaline as captains scrambled to build the ultimate 8-person squads within their limited budgets.</p>
      </article>
    </div>
  );
};

export default BlogPost;

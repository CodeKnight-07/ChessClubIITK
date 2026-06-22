import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fresherImg from '../assets/fcl.png';
import grandSwissImg from '../assets/grand_swiss_recap_1775765397656.png';
import winnerImg from '../assets/anuj_shivratri.png';
import endgameImg from '../assets/endgame_puzzle_1775765427614.png';
import tournamentImg from '../assets/fide.png';
import Footer from '../components/Footer';

const BLOG_POSTS = [
   {
    id: 1,
    title: "Fresher's Chess League 2026: An Absolute Thriller!",
    date: "April 02, 2026",
    tag: "Event Recap",
    excerpt: "Recapping the absolute hype surrounding the offline auctions in the Senate Hall, analyzing the intense Round Robin pool matches at the OAT, and spotlighting the brilliant knockout blunders that ultimately led the underdogs to gold memberships.",
    author: "Tanmay Sahare",
    image: fresherImg
  },
  // {
  //   id: 3,
  //   title: "IITK Grand Swiss: Path to the Candidates",
  //   date: "March 15, 2026",
  //   tag: "Event Recap",
  //   excerpt: "A deep dive into the brutal 7-round grinding matches of the IITK Grand Swiss and how the top 3 players locked in their Candidate seats.",
  //   author: "Akshat Srivastava",
  //   image: grandSwissImg
  // },
  // {
  //   id: 4,
  //   title: "Instagram Puzzle #45: Endgames are Purely Math",
  //   date: "February 24, 2026",
  //   tag: "Puzzle Analytics",
  //   excerpt: "Analyzing the tricky pawn endgame challenge posted to the community last week. When to push, and when to play the waiting game.",
  //   author: "Kushagra Shukla",
  //   image: endgameImg
  // },
  {
    id: 2,
    title: "Anuj Shivratri wins FIDE-rated tournament!",
    date: "February 15, 2026",
    tag: "Tournament news",
    excerpt: "Anuj Shrivatri emerges victorious at SBI GIC Fide Rated Rapid Tournament 2026 at IITK",
    author: "Inesh Aggarwal",
    image: winnerImg
  }
];

const Blogs = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const featuredDescription = "IIT Kanpur steps onto the rated chess map with its first FIDE-rated rapid tournament, a 9-round Swiss event carrying a prize pool of INR 2,00,000.";
  const [displayedDesc, setDisplayedDesc] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedDesc(featuredDescription.slice(0, index));
      index++;
      if (index > featuredDescription.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
    <div className="px-12 pb-20 max-w-7xl mx-auto">
      <section className="relative mb-20 group mt-8">
        <div className="grid grid-cols-12 gap-0 overflow-hidden rounded-xl bg-surface-container-low border border-[#4d4635]/10">
          <div className="col-span-15 lg:col-span-7 h-[600px] overflow-hidden">
            <img alt="IIT Kanpur FIDE-rated rapid tournament" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" src={tournamentImg} />

          </div>
          <div className="col-span-12 lg:col-span-5 p-12 flex flex-col justify-center bg-surface-container">
            <div className="flex items-center space-x-3 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-label tracking-widest uppercase rounded-full">Tournament News</span>
              <span className="text-on-surface-variant/40 text-[10px] font-label uppercase">5 Min Read</span>

            </div>
            <h2 className="text-5xl font-serif font-bold leading-tight mb-6 text-on-surface">IIT Kanpur's First FIDE-Rated Rapid Tournament: A New Chapter</h2>

            <p className="text-on-surface-variant font-body leading-relaxed mb-8 text-sm min-h-[80px]">
              {displayedDesc}
              <span className="animate-pulse border-r-2 border-primary ml-[2px] h-[1em] inline-block -mb-[2px]"></span>
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-xs font-bold text-on-surface">Laksh Dhir</p>
                  <p className="text-[10px] text-on-surface-variant">Coordinator, Chess Club IITK</p>
    
                </div>
              </div>
              <Link to="/blog/5" className="text-primary font-label text-xs uppercase tracking-widest border-b border-primary/30 pb-1 hover:border-primary transition-all">Read Article</Link>

            </div>
          </div>
        </div>
      </section>

      <div className={`flex items-end justify-between mb-12 ${viewMode === 'list' ? 'max-w-4xl mx-auto' : ''}`}>
        <div>
          <h3 className="text-xs font-label uppercase tracking-[0.2em] text-primary mb-2">The Archive</h3>
          <h4 className="text-4xl font-serif font-bold">Latest Dispatches</h4>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 border rounded-md transition-colors ${viewMode === 'grid' ? 'border-primary text-primary bg-primary/10' : 'border-outline-variant/20 text-on-surface-variant hover:text-primary hover:border-primary/50'}`}
          >
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 border rounded-md transition-colors ${viewMode === 'list' ? 'border-primary text-primary bg-primary/10' : 'border-outline-variant/20 text-on-surface-variant hover:text-primary hover:border-primary/50'}`}
          >
            <span className="material-symbols-outlined">view_agenda</span>
          </button>
        </div>
      </div>

      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col space-y-6 max-w-4xl mx-auto"}>
        {BLOG_POSTS.map(post => (
          <Link key={post.id} to={`/blog/${post.id}`} className={`flex bg-surface-container-low group cursor-pointer border border-transparent hover:border-outline-variant/20 transition-all duration-300 ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row'}`}>
            <div className={`overflow-hidden relative ${viewMode === 'grid' ? 'h-100' : 'h-64 md:h-full md:w-48 flex-shrink-0'}`}>
              <img alt={post.tag} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={post.image} />
              <div className="absolute top-4 left-4">
                <span className="bg-surface/80 backdrop-blur-md px-3 py-1 text-[9px] font-label tracking-widest uppercase text-on-surface rounded-sm">{post.tag}</span>
              </div>
            </div>
            <div className={`flex flex-col flex-grow ${viewMode === 'grid' ? 'p-8' : 'p-6 md:p-8'}`}>
              <span className="text-[10px] font-label text-on-surface-variant/50 uppercase mb-3">{post.date}</span>
              <h5 className="text-xl font-serif font-bold mb-4 group-hover:text-primary transition-colors">{post.title}</h5>
              <p className={`text-sm text-on-surface-variant leading-relaxed line-clamp-3 ${viewMode === 'grid' ? 'mb-6' : 'mb-4'}`}>
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-[10px] font-label text-on-surface uppercase">By {post.author}</span>
                <span className="material-symbols-outlined text-primary text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      


    </div>
    <Footer />
</div>
  );
};

export default Blogs;

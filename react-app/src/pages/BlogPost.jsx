import { Link, useParams } from 'react-router-dom';
import fresherImg from '../assets/fresher_league_recap_1775765383248.png';
import tournamentImg from '../assets/chess_tournament_gallery_1775821881801.png';

const BlogPost = () => {
  const { id } = useParams();

  if (id === '5') {
    return (
      <div className="px-12 py-12 max-w-4xl mx-auto blog-content">
        <div className="mb-12 flex items-center gap-3 text-xs font-label uppercase tracking-widest text-on-surface-variant/50">
          <Link to="/blogs" className="hover:text-primary transition-colors">Archive</Link>
          <span>/</span>
          <span className="text-primary">Tournament News</span>
        </div>

        <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8 text-on-surface">IIT Kanpur's First FIDE-Rated Rapid: A New Chapter</h1>

        <div className="flex items-center gap-6 mb-12 border-b border-outline-variant/15 pb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5 bg-primary-container/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">emoji_events</span>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">Laksh Dhir</p>
              <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">Coordinator, Chess Club IITK</p>
            </div>
          </div>
          <div className="h-8 w-px bg-outline-variant/30"></div>
          <div className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant pt-1">
            January 26, 2026 - 5 Min Read
          </div>
        </div>

        <div className="w-full h-[700px] rounded-xl overflow-hidden mb-16 relative shadow-2xl shadow-black/50 bg-black/20">
          <img alt="IIT Kanpur FIDE-rated rapid tournament" className="w-full h-full object-contain" src={tournamentImg}/>
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-40 pointer-events-none"></div>
        </div>


        <article className="font-body text-lg text-on-surface-variant">
          <p className="text-2xl text-on-surface font-serif leading-relaxed mb-10 first-letter:float-left first-letter:text-7xl first-letter:pr-4 first-letter:font-serif first-letter:text-primary">
            Chess has been an integral part of the intellectual and competitive culture at IIT Kanpur. Beyond classrooms and laboratories, the game has served as a platform for strategic thinking, patience and fun. As interest in the sport continued to grow, so did the need for an organized platform that could nurture talent, encourage participation and provide competitive exposure. This vision laid the foundation for the formation of the Chess Club IITK in 2007.
          </p>

          <p>We organize a variety of events and initiatives across the academic year aimed at encouraging active participation of the campus community. These include the annual championship cycle, comprising events such as the Candidates Tournament, Grand Swiss, Chess Cup and Speed Chess Championship. We also conduct India’s Biggest Collegiate Chess League – CMPL, with the most recent edition having a 9 Lakh+ prize pool and 1500+ participants. We regularly hold practice sessions, internal tournaments (100+ participants) and street chess that help players gain consistent over the board experience. The chess team of IIT Kanpur has brought numerous laurels to our club. IIT Kanpur also honoured Sir Vishwanathan Anand with an honorary doctorate in 2016.</p>

          <p>With relatively few top-tier tournaments being conducted regularly around Kanpur, a significant pool of emerging talent often remains underexposed and we saw this gap as an opportunity to enhance our reach to the next level. And what better platform than FIDE? So, building upon these year-round efforts to promote chess, we take a significant step forward by organizing our first FIDE Rated Rapid Chess Tournament with a whopping prize pool of 2,00,000 INR. This event reflects our commitment to organize chess competitions that meet professional standards and offer players the opportunity to participate in officially recognized events. Participants can look forward to this event as a chance to earn or improve their FIDE rating. The tournament will be conducted strictly in accordance with FIDE Laws of Chess, under the supervision of qualified arbiters to ensure fair play and smooth proceedings. We cordially invite chess players from clubs, institutions and independent backgrounds to join us for this special occasion.</p>

          <h3>From Campus Boards to Rated Play</h3>
          <p>The move toward a FIDE-rated rapid tournament has been discussed within the club for several years. Logistics, academic schedules, and coordination challenges delayed the idea, but the ambition stayed alive. Now, with the first edition finally taking shape, IITK has the chance to turn a long-running club goal into a visible milestone.</p>

          <div className="my-12 p-8 bg-surface-container-low border border-outline-variant/15 rounded-xl">
            <h4 className="text-primary font-label text-xs uppercase tracking-widest mb-4">Tournament Overview</h4>
            <p className="text-sm font-serif italic m-0">Date: February 7, 2026. Venue: Yoga Hall, New SAC, IIT Kanpur. Format: 9-round Swiss. Time control: 10+5 rapid. Prize pool: INR 2,00,000.</p>
          </div>

          <p>We look forward to sharing a positive and memorable chess experience with all participants. Till then, Happy Chessing!</p>

          <p className="text-sm text-on-surface-variant/70">Based on reporting by ChessBase India.</p>
        </article>

        <div className="mt-20 border-t border-outline-variant/15 pt-10 flex items-center justify-between">
          <Link to="/blogs" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-label uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Archive
          </Link>
          <a href="https://www.chessbase.in/news/first-fide-rated-rapid-chess-tournament-at-iitk" target="_blank" rel="noreferrer" className="text-primary text-sm font-label uppercase tracking-widest border-b border-primary/30 pb-1 hover:border-primary transition-all">
            Source
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="px-12 py-12 max-w-4xl mx-auto blog-content">
      {/* Breadcrumb */}
      <div className="mb-12 flex items-center gap-3 text-xs font-label uppercase tracking-widest text-on-surface-variant/50">
        <Link to="/blogs" className="hover:text-primary transition-colors">Archive</Link>
        <span>/</span>
        <span className="text-primary">Event Recap</span>
      </div>

      {/* Header */}
      <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8 text-on-surface">Fresher's Chess League 2026: An Absolute Thriller!</h1>
      
      {/* Metadata */}
      <div className="flex items-center gap-6 mb-12 border-b border-outline-variant/15 pb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5">
            <img alt="Author" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaAlIqrr8k378NDrG6yLqQm8_fueXgk5fHBbuh-_ahSVxtDMXTYYaEUzzuKUDsNo86BQu3NXY73hAz9aV3L9KIzJfHJsxU5EVXAxNk1wdJge-3tW5C8XSkobeDhig_yfNM5zzDmo8C0HexWJcUumwjOQEvWOm8FZA3c5EZRWEWeRzgZj15SEoERDr3kDntSGYElCKxiv-dApp91iBQahaEUC4GJkmemodr5ry5p5Dl8hkFAaPH9KpUyQT6yggglxuRYhuIcxEP3Do"/>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Tanmay Sahare</p>
            <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">Tournament Coordinator</p>
          </div>
        </div>
        <div className="h-8 w-px bg-outline-variant/30"></div>
        <div className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant pt-1">
          April 02, 2026 • 8 Min Read
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[400px] rounded-xl overflow-hidden mb-16 relative shadow-2xl shadow-black/50">
        <img alt="Fresher's Chess League Recap" className="w-full h-full object-cover" src={fresherImg}/>
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
      </div>

      {/* Article Body */}
      <article className="font-body text-lg text-on-surface-variant">
        <p className="text-2xl text-on-surface font-serif leading-relaxed mb-10 first-letter:float-left first-letter:text-7xl first-letter:pr-4 first-letter:font-serif first-letter:text-primary">
          Recapping the absolute hype surrounding the offline auctions in the Senate Hall, analyzing the intense Round Robin pool matches at the OAT, and spotlighting the brilliant knockout blunders that ultimately led the underdogs to gold memberships.
        </p>
        
        <p>The Fresher's Chess League this year was nothing short of a spectacle! Over 60 incoming freshers registered for the 8-player team slots. The offline auction was a chaotic flurry of bids, calculations, and pure adrenaline as captains scrambled to build the ultimate 8-person squads within their limited budgets.</p>
        
        <h3>The Bloodbath of Round Robin Pool B</h3>
        <p>While Pool A saw a clean sweep by the pre-tournament favorites, Pool B turned into an absolute bloodbath. Three teams finished with equal match points, leading to a nail-biting tiebreaker sequence built squarely on total board points. It came down to a single 10+5 rapid match on Board 4, where a shocking Queen blunder shifted the entire trajectory of the tournament.</p>

        <blockquote>
          "I didn't even see the bishop parked on c8. The 5-second increment wasn't enough to save me from the tactical blindness!"
        </blockquote>

        <p>That blunder sent the underdogs skyrocketing into the semifinals, proving once again that Over-The-Board (OTB) chess under time pressure is a completely different beast compared to playing online in the comfort of a dorm room.</p>

        <h3>The Finals & The Loot</h3>
        <p>The atmosphere at the OAT for the finals was electric. The crowd watched in silence as the decisive match extended into a grinding endgame where a solitary knight and two passed pawns overcame a defending rook. The tension broke into massive applause as the resignation came through.</p>
        
        <div className="my-12 p-8 bg-surface-container-low border border-outline-variant/15 rounded-xl">
          <h4 className="text-primary font-label text-xs uppercase tracking-widest mb-4">The Spoils of War</h4>
          <p className="text-sm font-serif italic m-0">Congratulations to the winning team for securing the coveted 8 Gold Memberships! Furthermore, we distributed Mama Mio Discount coupons to the top 50 participants, ensuring nobody went home empty-handed after such an incredible display of intellectual stamina.</p>
        </div>

        <p>If you missed this event, don't worry! Keep grinding your tactics, analyzing your blunders, and we will see you back on the board for the upcoming IITK Grand Swiss qualifiers!</p>
      </article>

      {/* Footer Nav */}
      <div className="mt-20 border-t border-outline-variant/15 pt-10 flex items-center justify-between">
        <Link to="/blogs" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-label uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Archive
        </Link>
        <div className="flex gap-4">
            <span className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface hover:border-primary hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
            </span>
            <span className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface hover:border-primary hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">share</span>
            </span>
        </div>
      </div>
    </div>
  );
};
export default BlogPost;

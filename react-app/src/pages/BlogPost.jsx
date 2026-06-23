import { Link, useParams } from 'react-router-dom';
import fresherImg from '../assets/fcl.png';
import tournamentImg from '../assets/fide.png';
import winnerImg from '../assets/anuj_shivratri.png';
const BlogPost = () => {
  const { id } = useParams();

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
            <div>
              <p className="text-sm font-bold text-on-surface">Laksh Dhir</p>
              <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">Coordinator, Chess Club IITK</p>
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

          <div className="grid grid-cols-1 gap-8 my-12">
            <div className="flex flex-col items-center">
              <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 w-full bg-surface-container-low p-2">
                <img alt="Anuj scored 8/9 points to win the event" className="w-full object-contain rounded-lg max-h-[500px]" src="https://cbin.b-cdn.net/img/AN/anuj-shrivatri_6_01KHAF31HKH6G1XX3SFRRKW46W_1000x667.jpeg" />
                <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                  Anuj scored 8/9 points to win the event; he won ₹40,000 and a beautiful trophy
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 w-full bg-surface-container-low p-2">
                <img alt="Arnav Agrawal" className="w-full object-contain rounded-lg max-h-[500px]" src="https://cbin.b-cdn.net/img/AR/arnav-agrawal_01KHAF2NS6X884P1AK76FJACJE_1000x667.jpeg" />
                <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                  Arnav Agrawal turned the tables in the last round after winning against Anuj to secure second place
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 w-full bg-surface-container-low p-2">
                <img alt="Aaryan Varshney" className="w-full object-contain rounded-lg max-h-[500px]" src="https://cbin.b-cdn.net/img/AA/aaryan-varshney_01KHAF2TXEJ3GWMWQ9FKG1GSB4_1000x667.jpeg" />
                <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                  Aaryan Varshney also scored 8/9 points to secure third place, and he won a ₹15,000 cash prize
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-on-surface mt-16 mb-6 border-b border-outline-variant/15 pb-2">
            Interview with Anuj Shrivatri
          </h2>
          <div className="space-y-6 my-8">
            <blockquote className="border-l-4 border-primary pl-6 py-2 bg-surface-container-low p-6 rounded-r-xl border border-outline-variant/15">
              <p className="text-primary font-bold font-label text-sm uppercase tracking-wider mb-2">Devansh Singh (DS)</p>
              <p className="text-on-surface font-serif text-lg leading-relaxed mb-4">How does it feel to win this tournament?</p>
              <p className="text-primary font-bold font-label text-sm uppercase tracking-wider mb-2">Anuj Shrivatri (AS)</p>
              <p className="text-on-surface-variant leading-relaxed">It feels great, the tournament was overall well organized and it was worth it to visit the IIT Kanpur campus.</p>
            </blockquote>

            <blockquote className="border-l-4 border-primary pl-6 py-2 bg-surface-container-low p-6 rounded-r-xl border border-outline-variant/15">
              <p className="text-primary font-bold font-label text-sm uppercase tracking-wider mb-2">Devansh Singh (DS)</p>
              <p className="text-on-surface font-serif text-lg leading-relaxed mb-4">Which match was the toughest for you and why?</p>
              <p className="text-primary font-bold font-label text-sm uppercase tracking-wider mb-2">Anuj Shrivatri (AS)</p>
              <p className="text-on-surface-variant leading-relaxed">Maybe against Aaryan, because after opening the position was tense and unclear and it quickly became complicated.</p>
            </blockquote>

            <blockquote className="border-l-4 border-primary pl-6 py-2 bg-surface-container-low p-6 rounded-r-xl border border-outline-variant/15">
              <p className="text-primary font-bold font-label text-sm uppercase tracking-wider mb-2">Devansh Singh (DS)</p>
              <p className="text-on-surface font-serif text-lg leading-relaxed mb-4">What is one lesson this tournament taught you?</p>
              <p className="text-primary font-bold font-label text-sm uppercase tracking-wider mb-2">Anuj Shrivatri (AS)</p>
              <p className="text-on-surface-variant leading-relaxed">One takeaway was not to relax too early, before last round I was pretty sure that even if I lose, I'll most likely be 1st. So I wasn't too much focused in the last match which caused a lot of blunders.</p>
            </blockquote>

            <blockquote className="border-l-4 border-primary pl-6 py-2 bg-surface-container-low p-6 rounded-r-xl border border-outline-variant/15">
              <p className="text-primary font-bold font-label text-sm uppercase tracking-wider mb-2">Devansh Singh (DS)</p>
              <p className="text-on-surface font-serif text-lg leading-relaxed mb-4">Anything else you'd like to share, maybe a game from the event</p>
              <p className="text-primary font-bold font-label text-sm uppercase tracking-wider mb-2">Anuj Shrivatri (AS)</p>
              <p className="text-on-surface-variant leading-relaxed">Yes, the game with Aaditya Dhingra</p>
            </blockquote>
          </div>

          <div className="bg-surface-container-high p-8 rounded-xl border border-outline-variant/30 font-mono text-sm leading-relaxed my-12 relative shadow-lg">
            <div className="absolute top-4 right-4 flex items-center space-x-2 text-xs text-on-surface-variant/50">
              <span className="material-symbols-outlined text-sm">extension</span>
              <span>PGN Game</span>
            </div>
            <h4 className="font-serif font-bold text-lg text-on-surface mb-4">Anuj Shrivatri vs Aaditya Dhingra (1-0)</h4>
            <div className="rounded-xl overflow-hidden mb-6 max-h-[400px]">
              <img alt="Anuj vs Aaditya" className="w-full object-cover" src="https://cbin.b-cdn.net/img/AN/anuj--aaditya-dhingra_01KHAF2ZVQX71K6266JXJEZ0X2_1000x667.jpeg" />
            </div>
            <p className="text-on-surface-variant bg-black/20 p-6 rounded-lg border border-outline-variant/10 leading-loose break-words whitespace-pre-wrap">
              {"1. c4 e5 2. g3 Nf6 3. Bg2 h6 4. Nc3 Bb4 5. Nf3 Nc6 6. Nd5 Bc5 7. O-O d6 8. e3 a6 9. d4 Ba7 10. dxe5 dxe5 11. b3 O-O 12. Bb2 Re8 13. Qe2 Bg4 14. h3 Bh5 15. g4 Bg6 16. Rad1 Nd7 17. Nc3 (17. b4 $1 e4 (17... Qc8 18. c5 (18. b5)) 19. Nd2 Nce5 19. Nxe4 (19. Bxe4)) 17... Qc8 18. Nh4 Bh7 19. Be4 Nf6 20. Bxh7+ Nxh7 21. Nf5 Ne7 22. Nxe7+ / Rxe7 23. Ne4 Qe6 24. Rd5 Qg6 25. Qf3 Rae8 26. Ba3 Re6 27. Qf5 h5 (27... Bb6) 28. Kg2 hxg4 29. hxg4 Bb6 30. Rd7 Qxf5 31. gxf5 Rh6 32. Rfd1 (32. c5 Nf8) 32... Nf6 33. Rd8 Nxe4 34. Rxe8+ Kh7 35. Rdd8 g5 36. Rh8+ Kg7 37. Rdg8+ Kf6 38. Rxh6+"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="flex flex-col items-center">
              <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 w-full bg-surface-container-low p-2">
                <img alt="Battlefield" className="w-full object-cover rounded-lg h-64" src="https://cbin.b-cdn.net/img/PL/playing-hall_52_01KHAF2SJWRWSFRCPK7ADZB3ZH_1000x667.jpeg" />
                <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                  Battlefield!
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 w-full bg-surface-container-low p-2">
                <img alt="Trophies" className="w-full object-cover rounded-lg h-64" src="https://cbin.b-cdn.net/img/TR/trophies-iitk_01KHAF2WERC4AWQVG57304S705_1000x666.jpeg" />
                <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                  Beautiful Trophies for the winners
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center my-12">
            <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 w-full max-w-2xl bg-surface-container-low p-2">
              <img alt="Aaryan Varshney" className="w-full object-contain rounded-lg max-h-[500px]" src="https://cbin.b-cdn.net/img/AA/aaryan-varshney_2_01KHAF2X5AV90XXKHMXZ0RRC4T_1000x1127.jpeg" />
              <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                India's Latest GM Aaryan Varshney in action
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-on-surface mt-16 mb-6 border-b border-outline-variant/15 pb-2">
            Performance of IIT Kanpur players
          </h2>
          <p>
            Their results reflected not just individual brilliance but also the serious, competitive playing culture at IIT Kanpur, complementing the club’s broader effort to make chess an engaging spectator sport on campus.
          </p>

          <div className="space-y-12 my-12">
            <div className="flex flex-col md:flex-row gap-6 items-center bg-surface-container-low p-6 rounded-xl border border-outline-variant/15">
              <div className="w-full md:w-1/3 rounded-lg overflow-hidden flex-shrink-0">
                <img alt="Spandan Pati" className="w-full object-cover h-48" src="https://cbin.b-cdn.net/img/SP/spandan-pati_01KHAF31DQN9W1CKVB68A3VC56_1000x1015.jpeg" />
              </div>
              <div className="flex-grow">
                <h4 className="font-serif font-bold text-xl text-on-surface mb-2">Spandan Pati</h4>
                <p className="text-sm leading-relaxed">
                  Spandan Pati, the current IITK Chess Champion (a title earned through the rigorous championship cycle followed at IIT Kanpur) and one of IITK's strongest players, scored 7/9 points, showing the strength of IITK
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center bg-surface-container-low p-6 rounded-xl border border-outline-variant/15">
              <div className="w-full md:w-1/3 rounded-lg overflow-hidden flex-shrink-0">
                <img alt="Divyesh Bhattacharyya" className="w-full object-cover h-48" src="https://cbin.b-cdn.net/img/DI/divyesh-bhattacharyya_01KHAF2QRX9APK0TD1GVP66ZQZ_1000x667.jpeg" />
              </div>
              <div className="flex-grow">
                <h4 className="font-serif font-bold text-xl text-on-surface mb-2">Divyesh Bhattacharyya</h4>
                <p className="text-sm leading-relaxed">
                  Divyesh Bhattacharyya also scored 7/9 points with 6 wins and 2 draws
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center bg-surface-container-low p-6 rounded-xl border border-outline-variant/15">
              <div className="w-full md:w-1/3 rounded-lg overflow-hidden flex-shrink-0">
                <img alt="Jayaraman Balasubramanian" className="w-full object-cover h-48" src="https://cbin.b-cdn.net/img/JA/jayaraman-balasubramanian_01KHAF2SDPVQD04AEN87GCCT6C_1000x750.jpeg" />
              </div>
              <div className="flex-grow">
                <h4 className="font-serif font-bold text-xl text-on-surface mb-2">Jayaraman Balasubramanian</h4>
                <p className="text-sm leading-relaxed">
                  Jayaraman Balasubramanian of IITK scored 7/9 points, and with 7 wins and 2 losses
                </p>
              </div>
            </div>
          </div>

          <p>
            IITK students who had never opened a rating before got paired against seasoned rated players. Some drew. Some won. Many walked away officially rated for the first time. That’s the kind of ripple effect IITK wanted for their own people, as well as many others playing their first rated tournament!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="flex flex-col items-center">
              <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 w-full bg-surface-container-low p-2">
                <img alt="Akshat Rastogi" className="w-full object-cover rounded-lg h-64" src="https://cbin.b-cdn.net/img/BE/beauty-of-the-game_01KHAF2YA63NEM68P4QGZGHF5M_1000x666.jpeg" />
                <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                  The Braveheart: Akshat Rastogi
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 w-full bg-surface-container-low p-2">
                <img alt="Akshat Rastogi Interviews" className="w-full object-cover rounded-lg h-64" src="https://cbin.b-cdn.net/img/IN/interviews-iitk_01KHAF2QVAFFB8K7E7DEWEH9Q5_1000x666.jpeg" />
                <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                  I wish all of us could love this game like Akshat does
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center my-12">
            <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 w-full max-w-2xl bg-surface-container-low p-2">
              <a target="_blank" rel="noopener noreferrer" href="https://s1.chess-results.com/UploadData.aspx?lan=1&amp;tnr=1341791&amp;Uid=2" className="block hover:opacity-90 transition-opacity">
                <img alt="Prize List" className="w-full object-contain rounded-lg" src="https://cbin.b-cdn.net/img/PR/prize-list-iitk_01KHAECGF4F9XZ7S533G15SZB3_842x725.png" />
              </a>
              <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                <a target="_blank" rel="noopener noreferrer" href="https://s1.chess-results.com/UploadData.aspx?lan=1&amp;tnr=1341791&amp;Uid=2" className="text-primary hover:underline">Prize List</a>
              </p>
            </div>
          </div>


          <h2 className="text-3xl font-serif font-bold text-on-surface mt-16 mb-6 border-b border-outline-variant/15 pb-2 text-center">
            What This Meant to Us - Chess Club IITK
          </h2>
          <blockquote className="border-l-4 border-primary pl-6 my-8 text-on-surface/90 bg-primary/5 p-6 rounded-r-xl space-y-4">
            <p>This tournament wasn’t perfect. We learned a lot. We improvised a lot. We ran on adrenaline and chai for most of the day.</p>
            <p>But it worked.</p>
            <p>It proved that IIT Kanpur can host a professional, large-scale, FIDE-rated event!</p>
            <p>It proved that UP has both the demand and the strength for stronger tournaments!</p>
            <p>It proved that when students are properly supported, they can make a serious impact!</p>
            <p>Most importantly, it felt personal.</p>
            <p>From the first budgeting meeting in September to the last prize distribution photo in February, this was built by people who genuinely love the game :) And this is only the beginning. We plan to scale it bigger. Stronger. Smoother. With more titled players. Larger prize pools. Even better production. And hopefully, more stories like Arnav’s. For now, though, we’re just grateful.</p>
            <p>Grateful to the people at Chessbase India for guiding us.</p>
            <p>Grateful to our sponsors.</p>
            <p>Grateful to the arbiters.</p>
            <p>Grateful to the players.</p>
            <p>Grateful to everyone who believed this could happen.</p>
            <p>Until next time.</p>
            <p>Happy Chessing!!</p>
            <p className="font-bold text-right text-primary font-serif">— Chess Club IITK</p>
          </blockquote>

          <div className="flex flex-col items-center my-12">
            <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 w-full max-w-2xl bg-surface-container-low p-2">
              <img alt="Team Behind IITK Chess" className="w-full object-contain rounded-lg" src="https://cbin.b-cdn.net/img/AK/akshat-iitk_01KHAF2NW5BEHDC6VADY3ZGW69_1000x667.jpeg" />
              <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                Team Behind this Successful event at IITK: (Left to Right) Pulkit Gajipara, Kushagra Shukla, Tanmay Sahare, and Akshat Srivastava
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-on-surface mt-16 mb-6 border-b border-outline-variant/15 pb-2">
            Chess At IIT Kanpur
          </h2>
          <p>
            At IIT Kanpur, chess has never been just about selecting five players and sending a team out. While most college clubs across India operate largely as competitive units, we have consciously tried to build something bigger, a culture.
          </p>
          <p>
            We want casual players to feel just as included as 2300-rated ones. We want chess to feel like a spectator sport on campus. We want freshers who have just learned en passant to sit next to titled players and feel inspired, not intimidated.
          </p>
          <p>
            Over the years, that philosophy led us to build one of India’s biggest collegiate chess ecosystems.
          </p>

          <div className="grid grid-cols-1 gap-8 my-12">
            <div className="flex flex-col items-center">
              <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 w-full bg-surface-container-low p-2">
                <img alt="CMPL" className="w-full object-contain rounded-lg max-h-[500px]" src="https://cbin.b-cdn.net/img/CH/chess-masters-premier-league_01KHAF351G6FFX82XC213EHHFE_1000x613.png" />
                <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                  Through the Chess Masters Premier League (CMPL), internal tournaments with 100+ participants, practice sessions, street chess, and our annual championship cycle, we’ve consistently raised the bar.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 w-full bg-surface-container-low p-2">
                <img alt="Guest Speakers" className="w-full object-contain rounded-lg max-h-[500px]" src="https://cbin.b-cdn.net/img/GU/guest-speakers-chessclub-iitk_2_01KHAGSD8KVK3VXKY4N2K5H7KF_1000x563.png" />
                <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                  We’ve been fortunate to host and interact with some of the biggest names in Indian chess, including GM D Gukesh, GM Arjun Erigaisi, Sagar Bhai, Amruta ma’am, and GM Srinath Narayanan, among many others! We’ve live-streamed with them, learned from them, and grown because of them.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 bg-surface-container-low p-2">
                <img alt="CMPL Stream" className="w-full object-cover rounded-lg h-64" src="https://cbin.b-cdn.net/img/CM/cmpl-stream_01KHAF2ZKG85V2T5RB5ZFXGHG4_1000x560.jpeg" />
                <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                  CMPL Streams
                </p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg border border-outline-variant/15 bg-surface-container-low p-2">
                <img alt="FCL 2025" className="w-full object-cover rounded-lg h-64" src="https://cbin.b-cdn.net/img/FR/freshers-chess-league-2025-iitk_01KHAF3386V3ME9XXQQVS2QV8X_1000x750.jpeg" />
                <p className="text-xs text-on-surface-variant/80 text-center mt-3 font-label uppercase tracking-wider">
                  Fresher's Chess League 2025
                </p>
              </div>
            </div>
          </div>


          <h2 className="text-3xl font-serif font-bold text-on-surface mt-16 mb-6 border-b border-outline-variant/15 pb-2">
            Final Ranking after 9 Rounds
          </h2>
          <div className="overflow-x-auto my-12 border border-outline-variant/15 rounded-xl shadow-lg">
            <table className="w-full text-left border-collapse bg-surface-container-low text-sm min-w-[600px]">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant/30 text-xs font-label uppercase tracking-wider text-on-surface">
                  <th className="p-4">Rk</th>
                  <th className="p-4">SNo</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">FED</th>
                  <th className="p-4">Rtg</th>
                  <th className="p-4">Club/City</th>
                  <th className="p-4 text-right">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-on-surface-variant font-body">
                {[
                  { rk: 1, sno: 1, title: "IM", name: "Anuj, Shrivatri", fed: "IND", rtg: 2317, city: "MP", pts: "8.0" },
                  { rk: 2, sno: 5, title: "-", name: "Arnav, Agrawal", fed: "IND", rtg: 2128, city: "UP", pts: "8.0" },
                  { rk: 3, sno: 2, title: "IM", name: "Aaryan, Varshney", fed: "IND", rtg: 2303, city: "DL", pts: "8.0" },
                  { rk: 4, sno: 4, title: "IM", name: "Aaditya, Dhingra", fed: "IND", rtg: 2195, city: "HR", pts: "8.0" },
                  { rk: 5, sno: 3, title: "IM", name: "Sharma, Dinesh K.", fed: "IND", rtg: 2212, city: "LIC", pts: "7.5" },
                  { rk: 6, sno: 19, title: "-", name: "Md, Hasnain Siddiqui", fed: "IND", rtg: 1763, city: "UP", pts: "7.5" },
                  { rk: 7, sno: 7, title: "CM", name: "Deepak, Katiyar", fed: "IND", rtg: 2088, city: "UP", pts: "7.5" },
                  { rk: 8, sno: 12, title: "-", name: "Sparsh, Yadav", fed: "IND", rtg: 1896, city: "UP", pts: "7.0" },
                  { rk: 9, sno: 6, title: "FM", name: "Madhvendra, Pratap Sharma", fed: "IND", rtg: 2126, city: "MP", pts: "7.0" },
                  { rk: 10, sno: 15, title: "-", name: "Akshat, Negi", fed: "IND", rtg: 1847, city: "DL", pts: "7.0" },
                  { rk: 11, sno: 10, title: "WFM", name: "Sachi, Jain", fed: "IND", rtg: 1939, city: "DL", pts: "7.0" },
                  { rk: 12, sno: 11, title: "CM", name: "Prakhar, Tripathi", fed: "IND", rtg: 1903, city: "UP", pts: "7.0" },
                  { rk: 13, sno: 14, title: "-", name: "Maaz, Iqubal", fed: "IND", rtg: 1887, city: "UP", pts: "7.0" },
                  { rk: 14, sno: 48, title: "-", name: "Shashank, Srivastava", fed: "IND", rtg: 1587, city: "UP", pts: "7.0" },
                  { rk: 15, sno: 34, title: "-", name: "Shivay, Singh", fed: "IND", rtg: 1646, city: "UP", pts: "7.0" },
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-primary/5 transition-colors">
                    <td className="p-4 font-bold">{row.rk}</td>
                    <td className="p-4">{row.sno}</td>
                    <td className={`p-4 font-bold ${row.title !== '-' ? 'text-primary' : ''}`}>{row.title}</td>
                    <td className="p-4 font-bold text-on-surface">{row.name}</td>
                    <td className="p-4">{row.fed}</td>
                    <td className="p-4">{row.rtg}</td>
                    <td className="p-4">{row.city}</td>
                    <td className="p-4 font-bold text-primary text-right">{row.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <div className="mt-20 border-t border-outline-variant/15 pt-10 flex items-center justify-between">
          <Link to="/blogs" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-label uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Archive
          </Link>
        </div>
      </div>
    );
  }
  else if(id==5){
    return(
      <div className="px-12 py-12 max-w-4xl mx-auto blog-content">
        <div className="mb-12 flex items-center gap-3 text-xs font-label uppercase tracking-widest text-on-surface-variant/50">
          <Link to="/blogs" className="hover:text-primary transition-colors">Archive</Link>
          <span>/</span>
          <span className="text-primary">Tournament News</span>
        </div>

        <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8 text-on-surface">IIT Kanpur's First FIDE-Rated Rapid: A New Chapter</h1>

        <div className="flex items-center gap-6 mb-12 border-b border-outline-variant/15 pb-8">
          <div className="flex items-center gap-3">
            <div className="flex flex-col justify-start">
              <p className="text-sm font-bold text-on-surface m-0 leading-none">Laksh Dhir</p>
              <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest m-0 leading-none">
                Coordinator, Chess Club IITK
              </p>
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
            <p className="text-sm font-serif m-0">Date: February 7, 2026. Venue: Yoga Hall, New SAC, IIT Kanpur. Format: 9-round Swiss. Time control: 10+5 rapid. Prize pool: INR 2,00,000.</p>
          </div>

          <p>We look forward to sharing a positive and memorable chess experience with all participants. Till then, Happy Chessing!</p>

        </article>

        <div className="mt-20 border-t border-outline-variant/15 pt-10 flex items-center justify-between">
          <Link to="/blogs" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-label uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Archive
          </Link>
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
      <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8 text-on-surface">Fresher's Chess League 2025: An Absolute Thriller!</h1>
      
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
          August 25, 2025 • 8 Min Read
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden mb-16 relative shadow-2xl shadow-black/50">
        <img alt="Fresher's Chess League Recap" className="w-full h-full object-contain" src={fresherImg}/>
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
          <p className="text-sm font-serif m-0">Congratulations to the winning team for securing the coveted 8 Gold Memberships! Furthermore, we distributed Mama Mio Discount coupons to the top 50 participants, ensuring nobody went home empty-handed after such an incredible display of intellectual stamina.</p>
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

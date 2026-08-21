import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';
import { globalCache } from '../utils/cache';

const Results = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [standings, setStandings] = useState([]);
  const [loadingStandings, setLoadingStandings] = useState(true);

  useEffect(() => {
    const fetchEventDetailsAndStandings = async () => {
      let foundEvent = null;
      if (globalCache.events && Array.isArray(globalCache.events)) {
        foundEvent = globalCache.events.find(e => `db-${e.id}` === id || String(e.id) === id);
      }
      
      if (!foundEvent) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/events`);
          if (res.ok) {
            const data = await res.json();
            globalCache.events = data;
            foundEvent = data.find(e => `db-${e.id}` === id || String(e.id) === id);
          }
        } catch (e) {
          console.error("Error loading events for results page:", e);
        }
      }
      
      setEvent(foundEvent);
      setLoadingEvent(false);

      if (foundEvent) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/events/${foundEvent.id}/standings`);
          if (res.ok) {
            const data = await res.json();
            setStandings(data || []);
          }
        } catch (e) {
          console.error("Error loading standings:", e);
        }
      }
      setLoadingStandings(false);
    };
    fetchEventDetailsAndStandings();
  }, [id]);

  // Check if columns should be conditionally shown
  const hasRollNo = standings.some(s => s.roll_no && s.roll_no.trim() !== '');
  const hasTb1 = standings.some(s => s.tb1 && s.tb1.trim() !== '');
  const hasTb2 = standings.some(s => s.tb2 && s.tb2.trim() !== '');

  const getRankBadgeClass = (rank) => {
    if (rank === '1') return 'text-yellow-400 font-bold';
    if (rank === '2') return 'text-zinc-300 font-bold';
    if (rank === '3') return 'text-amber-600 font-bold';
    return 'text-on-surface-variant font-medium';
  };

  return (
    <div className="min-h-screen text-on-surface pt-4 sm:pt-6 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative">
        
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-outline-variant/10 pb-8 mb-10">
          <div className="max-w-3xl">
            {loadingEvent ? (
              <div className="h-10 w-64 bg-surface-container-high animate-pulse rounded-lg mb-3"></div>
            ) : (
              <h1 className="text-4xl font-serif leading-tight text-on-surface sm:text-5xl">
                {event ? `${event.title} Standings` : 'Tournament Results'}
              </h1>
            )}
            <p className="mt-3 text-sm font-light leading-relaxed text-on-surface-variant/80 sm:text-base">
              The official standings, scorecards, and results from Chess Club Kanpur's historical tournaments.
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        {(loadingEvent || loadingStandings) ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : standings.length > 0 ? (
          /* Render Standings Table */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-surface-container-low border border-outline-variant/10 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-outline-variant/10 text-left text-sm">
                <thead className="bg-[#151515] text-[#d4af37] uppercase font-mono text-xs tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-4 w-20 text-center">Rank</th>
                    <th className="px-6 py-4">Player Name</th>
                    {hasRollNo && <th className="px-6 py-4">Roll Number</th>}
                    <th className="px-6 py-4">Score</th>
                    {hasTb1 && <th className="px-6 py-4">Tiebreak 1</th>}
                    {hasTb2 && <th className="px-6 py-4">Tiebreak 2</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5 text-zinc-300">
                  {standings.map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-high/40 transition-colors">
                      <td className={`px-6 py-4 text-center font-mono ${getRankBadgeClass(row.rank)}`}>
                        {row.rank === '1' && '🥇 '}
                        {row.rank === '2' && '🥈 '}
                        {row.rank === '3' && '🥉 '}
                        {row.rank !== '1' && row.rank !== '2' && row.rank !== '3' && row.rank}
                      </td>
                      <td className="px-6 py-4 font-semibold text-white">{row.name}</td>
                      {hasRollNo && <td className="px-6 py-4 font-mono text-zinc-400">{row.roll_no || '-'}</td>}
                      <td className="px-6 py-4 text-primary font-bold">{row.score}</td>
                      {hasTb1 && <td className="px-6 py-4 font-mono text-zinc-400">{row.tb1 || '-'}</td>}
                      {hasTb2 && <td className="px-6 py-4 font-mono text-zinc-400">{row.tb2 || '-'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          /* Empty State Section */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 text-center bg-surface-container-low border border-outline-variant/10 rounded-3xl p-8"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-inner">
              <span className="material-symbols-outlined text-3xl font-light">emoji_events</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-on-surface mb-2">No Standings Recorded</h3>
            <p className="text-on-surface-variant/70 text-sm max-w-sm leading-relaxed mb-8">
              Detailed standings and round summaries will be updated here as tournament data is processed.
            </p>
            <Link 
              to="/events" 
              className="px-6 py-2.5 rounded-xl bg-primary text-[#3c2f00] font-bold text-xs font-label uppercase tracking-widest hover:bg-[#d4af37] transition-all shadow-md shadow-primary/10 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Return to Events
            </Link>
          </motion.div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default Results;

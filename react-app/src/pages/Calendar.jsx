import { useState, useEffect } from 'react';
import AddEventModal from '../components/AddEventModal';
import ViewDayModal from '../components/ViewDayModal';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const PRE_SCHEDULED_EVENTS = [
  { id: 'pre-1', type: 'workshop', title: 'Interviews', location: 'Online/Offline', time: 'TBD', date: '2026-05-22' },
  { id: 'pre-2', type: 'workshop', title: 'Secy Tasks & Results', location: 'Online', time: 'TBD', date: '2026-05-25' },
  { id: 'pre-3', type: 'workshop', title: 'Secy Recruitment & All-Team Meet', location: 'Online', time: 'TBD', date: '2026-06-05' },
  { id: 'pre-4', type: 'tournament', title: 'Fog of war tournament', location: 'chess.com', time: 'TBD', date: '2026-06-20' },
  { id: 'pre-5', type: 'workshop', title: 'Orientation PPT & Intro Video', location: 'Online', time: 'TBD', date: '2026-07-15' },
  { id: 'pre-6', type: 'tournament', title: 'International Chess Day Arena', location: 'chess.com', time: 'TBD', date: '2026-07-20' },
  { id: 'pre-7', type: 'tournament', title: 'League of Legends 6.0', location: 'Online', time: 'TBD', date: '2026-08-07' },
  { id: 'pre-8', type: 'tournament', title: 'Candidates Start', location: 'chess.com', time: 'TBD', date: '2026-08-19' },
  { id: 'pre-9', type: 'tournament', title: "Fresher's Chess League", location: 'Online', time: 'TBD', date: '2026-08-21' },
  { id: 'pre-10', type: 'tournament', title: 'Candidates End', location: 'Online', time: 'TBD', date: '2026-09-04' },
  { id: 'pre-11', type: 'tournament', title: 'Twisted Boards', location: 'Online', time: 'TBD', date: '2026-09-05' },
  { id: 'pre-12', type: 'tournament', title: 'IITK Chess Championship Starts', location: 'TBD', time: 'TBD', date: '2026-09-22' },
  { id: 'pre-13', type: 'workshop', title: '1st Secy Review', location: 'TBD', time: 'TBD', date: '2026-09-26' },
  { id: 'pre-14', type: 'tournament', title: 'IITK Grand Swiss', location: 'TBD', time: 'TBD', date: '2026-10-02' },
  { id: 'pre-15', type: 'tournament', title: 'IITK Chess Championship Ends', location: 'TBD', time: 'TBD', date: '2026-10-08' },
  { id: 'pre-16', type: 'workshop', title: 'FIDE Permissions & Designing', location: 'TBD', time: 'TBD', date: '2026-10-15' },
  { id: 'pre-17', type: 'workshop', title: 'Puzzles Quiz', location: 'TBD', time: 'TBD', date: '2026-10-27' },
  { id: 'pre-18', type: 'workshop', title: 'Endsem Blackout Period Begins', location: 'N/A', time: 'All Day', date: '2026-11-06' },
  { id: 'pre-19', type: 'workshop', title: 'Endsems', location: 'IITK', time: 'All Day', date: '2026-11-16' },
  { id: 'pre-20', type: 'tournament', title: 'Speed Chess Championship', location: 'Online', time: 'TBD', date: '2026-12-25' },
  { id: 'pre-21', type: 'workshop', title: 'FIDE Permissions & Designing', location: 'TBD', time: 'TBD', date: '2026-12-28' },
  { id: 'pre-22', type: 'tournament', title: 'FIDE Rated Open Rapid Tournament', location: 'TBD', time: 'TBD', date: '2027-01-09' },
  { id: 'pre-23', type: 'workshop', title: '2nd Secy Review', location: 'TBD', time: 'TBD', date: '2027-01-15' },
  { id: 'pre-24', type: 'workshop', title: 'FIDE Bills Clearing', location: 'TBD', time: 'TBD', date: '2027-01-20' },
  { id: 'pre-25', type: 'tournament', title: 'Twisted Boards', location: 'Online', time: 'TBD', date: '2027-02-05' },
  { id: 'pre-26', type: 'workshop', title: 'Prospective Candidates', location: 'TBD', time: 'TBD', date: '2027-02-15' },
  { id: 'pre-27', type: 'tournament', title: "Queen's Gambit", location: 'TBD', time: 'TBD', date: '2027-03-08' },
  { id: 'pre-28', type: 'tournament', title: 'Chess Masters Premier League 4.0', location: 'TBD', time: 'TBD', date: '2027-03-15' },
  { id: 'pre-29', type: 'workshop', title: 'Coordie Interviews', location: 'TBD', time: 'TBD', date: '2027-03-18' },
  { id: 'pre-30', type: 'workshop', title: '3rd Post Secy Review', location: 'TBD', time: 'TBD', date: '2027-03-20' },
  { id: 'pre-31', type: 'workshop', title: 'End-Tenure Party', location: 'TBD', time: 'TBD', date: '2027-03-30' },
  { id: 'pre-32', type: 'tournament', title: 'IITK Chess Cup', location: 'TBD', time: 'TBD', date: '2027-04-02' },
  { id: 'pre-33', type: 'workshop', title: 'End-Term Report', location: 'TBD', time: 'TBD', date: '2027-04-10' }
];

const Calendar = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate(); // Initialize the router navigation

  const [currentDate, setCurrentDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  
  // 1. New states for database events
  const [dbEvents, setDbEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // We can kill the modal states for events since we are redirecting now!
  const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'list' : 'calendar');

  // Keep filters if you want to keep the checkboxes, otherwise they can be removed too
  const [showTournaments, setShowTournaments] = useState(true);
  const [showWorkshops, setShowWorkshops] = useState(true);

  // 2. Fetch from your new API!
  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${API_BASE_URL}/api/events`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Map backend data to what the calendar grid expects
          const formattedEvents = data.map(evt => {
             // Ensure the date is perfectly formatted as YYYY-MM-DD for the grid filter
             const yyyyMmDd = new Date(evt.event_date).toISOString().split('T')[0];
             
             return {
               id: `db-${evt.id}`,
               title: evt.title,
               date: yyyyMmDd,
               type: evt.event_type.toLowerCase(), // e.g., 'tournament', 'workshop'
               time: evt.event_time,
               location: evt.location
             };
          });
          
          setDbEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch events for calendar:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarEvents();
  }, []);

  // 3. Merge the hardcoded events with the dynamic database events
  const allEvents = [
    ...PRE_SCHEDULED_EVENTS,
    ...dbEvents
  ].filter(e => {
    // Apply your filters based on the unified 'type'
    if (e.type === 'tournament' && !showTournaments) return false;
    if (e.type === 'workshop' && !showWorkshops) return false;
    return true;
  });

  

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const currentMonthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  const currentMonthEvents = allEvents
    .filter((e) => e.date && e.date.startsWith(currentMonthStr))
    .sort((a, b) => a.date.localeCompare(b.date));

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const calendarCells = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    const day = daysInPrevMonth - firstDayOfMonth + i + 1;
    calendarCells.push({ type: 'prev', day });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarCells.push({ type: 'current', day: i, dateStr });
  }

  const totalCellsNeeded = calendarCells.length > 35 ? 42 : 35;
  const remainingCells = totalCellsNeeded - calendarCells.length;

  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({ type: 'next', day: i });
  }

  const handleScheduleClick = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };
return (
    <>
      <motion.main
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
      >
        <div className="mb-8 md:mb-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-serif leading-tight text-on-surface sm:text-5xl">
              Mastering the <span className="text-primary">Tides of Time</span>
            </h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-on-surface-variant/80 sm:text-base">
              View the collective assembly of the IITK Chess Community&apos;s upcoming
              stratagems, workshops, and championship cycles.
            </p>
          </div>
        </div>

        {/* Removed the 12-column grid to let the calendar take 100% width! */}
        <div className="w-full">
            <div className={`flex flex-col overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low ${viewMode === 'calendar' ? 'min-h-[720px]' : ''}`}>
              <div className="flex shrink-0 items-center justify-between border-b border-outline-variant/10 px-4 py-4 sm:px-6">
                <h3 className="text-2xl font-serif font-bold text-on-surface sm:text-3xl">
                  {monthName}{' '}
                  <span className="font-normal text-on-surface-variant/50">
                    {year}
                  </span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
                    className="flex items-center gap-1.5 rounded-lg border border-outline-variant/20 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-container transition-colors outline-none mr-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {viewMode === 'calendar' ? 'list' : 'calendar_month'}
                    </span>
                    <span className="hidden sm:inline">{viewMode === 'calendar' ? 'List View' : 'Calendar View'}</span>
                  </button>

                  <button
                    onClick={handlePrevMonth}
                    className="rounded-lg p-2 outline-none transition-colors hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="rounded-lg p-2 outline-none transition-colors hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* LIST VIEW */}
              {viewMode === 'list' ? (
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[640px] disable-scrollbar">
                  {currentMonthEvents.length === 0 ? (
                    <div className="text-center py-16 text-on-surface-variant/50">
                      <span className="material-symbols-outlined text-5xl mb-3 opacity-50">event_busy</span>
                      <p className="text-sm font-label uppercase tracking-widest">No events scheduled for this month</p>
                    </div>
                  ) : (
                    currentMonthEvents.map((evt, idx) => {
                      let formattedDate = evt.date;
                      try {
                        const [y, m, d] = evt.date.split('-');
                        const dateObj = new Date(y, m - 1, d);
                        formattedDate = dateObj.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
                      } catch (e) {}

                      return (
                        <div
                          key={idx}
                          // Redirect to events page instead of opening a modal
                          onClick={() => navigate('/events')}
                          className={`p-4 rounded-xl border-l-[4px] bg-surface-container-high transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-primary/50 hover:bg-surface-container-highest ${
                            evt.type === 'tournament' ? 'border-[#f2ca50]' : 
                            evt.type === 'workshop' ? 'border-[#e5e2e1]' : 
                            'border-[#60a5fa]'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <span className="text-[10px] font-mono font-bold text-on-surface-variant/60">
                                {formattedDate}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                evt.type === 'tournament' ? 'bg-[#f2ca50]/15 text-[#f2ca50]' : 
                                evt.type === 'workshop' ? 'bg-[#e5e2e1]/15 text-[#e5e2e1]' : 
                                'bg-[#60a5fa]/15 text-blue-400'
                              }`}>
                                {evt.type}
                              </span>
                            </div>
                            <h4 className="text-base sm:text-lg font-serif font-bold text-on-surface truncate">{evt.title}</h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant shrink-0">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">location_on</span>
                              <span>{evt.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">schedule</span>
                              <span>{evt.time}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                /* CALENDAR VIEW */
                <>
                  <div className="grid shrink-0 grid-cols-7 text-center border-b border-outline-variant/10">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                      <div
                        key={i}
                        className="py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid flex-1 grid-cols-7 auto-rows-fr">
                    {calendarCells.map((cell, idx) => {
                      const isCurrent = cell.type === 'current';
                      const isToday = isCurrent && cell.dateStr === todayStr; // <-- NEW: Check if this cell is today!
                      
                      const dayEvents = isCurrent
                        ? allEvents.filter((e) => e.date === cell.dateStr)
                        : [];

                      const baseClass =
                        'group relative flex min-h-[110px] flex-col overflow-hidden border-b border-r border-outline-variant/5 p-2 sm:p-3';
                      
                      // NEW: Add a faint gold background to today's box
                      const bgClass = isCurrent
                        ? isToday 
                          ? 'bg-primary/5 transition-colors hover:bg-primary/10' 
                          : 'bg-transparent transition-colors hover:bg-surface-container-high'
                        : 'bg-surface-container-lowest opacity-30';

                      return (
                        <div
                          key={idx}
                          className={`${baseClass} ${bgClass}`}
                        >
                          {/* NEW: The day number wrapper. If it's today, make it a solid gold circle! */}
                          <div className="mb-1 flex items-start">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                                isToday
                                  ? 'bg-primary text-black font-bold' // Solid circle for today
                                  : dayEvents.length > 0
                                  ? 'font-bold text-primary'
                                  : 'font-medium text-on-surface/80'
                              }`}
                            >
                              {cell.day}
                            </span>
                          </div>

                          <div className="flex-1 space-y-1 overflow-y-auto min-h-0 disable-scrollbar">
                            {dayEvents.map((evt, eIdx) => (
                              <div
                                key={eIdx}
                                title={evt.title} // <-- Bonus! Added the tooltip here!
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate('/events');
                                }}
                                className={`cursor-pointer rounded border-l-[3px] px-1.5 py-1 text-left hover:opacity-80 transition-opacity ${
                                  evt.type === 'tournament'
                                    ? 'border-[#f2ca50] bg-primary/10'
                                    : evt.type === 'workshop'
                                    ? 'border-[#e5e2e1] bg-[#e5e2e1]/5'
                                    : 'border-[#60a5fa] bg-[#60a5fa]/10'
                                }`}
                              >
                                <div
                                  className={`truncate text-[9px] font-bold uppercase leading-tight tracking-tight ${
                                    evt.type === 'tournament'
                                      ? 'text-primary'
                                      : evt.type === 'workshop'
                                      ? 'text-on-surface'
                                      : 'text-blue-400'
                                  }`}
                                >
                                  {evt.title}
                                </div>
                                <div className="mt-0.5 truncate text-[8px] text-on-surface-variant">
                                  {evt.location} • {evt.time}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
        </div> 
      </motion.main>

      <Footer />
    </>
  );
};
export default Calendar;

import { useState, useEffect } from 'react';
import AddEventModal from '../components/AddEventModal';
import ViewDayModal from '../components/ViewDayModal';
import { useAuth } from '../context/AuthContext';

// Timeline events spanning the 2026-27 tenure
const PRE_SCHEDULED_EVENTS = [
  // May 2026
  { id: 'pre-1', type: 'workshop', title: 'Interviews', location: 'Online/Offline', time: 'TBD', date: '2026-05-22' },
  { id: 'pre-2', type: 'workshop', title: 'Secy Tasks & Results', location: 'Online', time: 'TBD', date: '2026-05-25' },
  
  // June 2026
  { id: 'pre-3', type: 'workshop', title: 'Secy Recruitment & All-Team Meet', location: 'Online', time: 'TBD', date: '2026-06-05' },
  { id: 'pre-4', type: 'tournament', title: 'Fog of war tournament', location: 'chess.com', time: 'TBD', date: '2026-06-20' },
  
  // July 2026
  { id: 'pre-5', type: 'workshop', title: 'Orientation PPT & Intro Video', location: 'Online', time: 'TBD', date: '2026-07-15' },
  { id: 'pre-6', type: 'tournament', title: 'International Chess Day Arena', location: 'chess.com', time: 'TBD', date: '2026-07-20' },
  
  // August 2026
  { id: 'pre-7', type: 'tournament', title: 'League of Legends 6.0', location: 'Online', time: 'TBD', date: '2026-08-07' },
  { id: 'pre-8', type: 'tournament', title: 'Candidates Start', location: 'chess.com', time: 'TBD', date: '2026-08-19' },
  { id: 'pre-9', type: 'tournament', title: "Fresher's Chess League", location: 'Online', time: 'TBD', date: '2026-08-21' },
  
  // September 2026
  { id: 'pre-10', type: 'tournament', title: 'Candidates End', location: 'Online', time: 'TBD', date: '2026-09-04' },
  { id: 'pre-11', type: 'tournament', title: 'Twisted Boards', location: 'Online', time: 'TBD', date: '2026-09-05' },
  { id: 'pre-12', type: 'tournament', title: 'IITK Chess Championship Starts', location: 'TBD', time: 'TBD', date: '2026-09-22' },
  { id: 'pre-13', type: 'workshop', title: '1st Secy Review', location: 'TBD', time: 'TBD', date: '2026-09-26' },
  
  // October 2026
  { id: 'pre-14', type: 'tournament', title: 'IITK Grand Swiss', location: 'TBD', time: 'TBD', date: '2026-10-02' },
  { id: 'pre-15', type: 'tournament', title: 'IITK Chess Championship Ends', location: 'TBD', time: 'TBD', date: '2026-10-08' },
  { id: 'pre-16', type: 'workshop', title: 'FIDE Permissions & Designing', location: 'TBD', time: 'TBD', date: '2026-10-15' },
  { id: 'pre-17', type: 'workshop', title: 'Puzzles Quiz', location: 'TBD', time: 'TBD', date: '2026-10-27' },
  
  // November 2026
  { id: 'pre-18', type: 'workshop', title: 'Endsem Blackout Period Begins', location: 'N/A', time: 'All Day', date: '2026-11-06' },
  { id: 'pre-19', type: 'workshop', title: 'Endsems', location: 'IITK', time: 'All Day', date: '2026-11-16' },
  
  // December 2026
  { id: 'pre-20', type: 'tournament', title: 'Speed Chess Championship', location: 'Online', time: 'TBD', date: '2026-12-25' },
  { id: 'pre-21', type: 'workshop', title: 'FIDE Permissions & Designing', location: 'TBD', time: 'TBD', date: '2026-12-28' },
  
  // January 2027
  { id: 'pre-22', type: 'tournament', title: 'FIDE Rated Open Rapid Tournament', location: 'TBD', time: 'TBD', date: '2027-01-09' },
  { id: 'pre-23', type: 'workshop', title: '2nd Secy Review', location: 'TBD', time: 'TBD', date: '2027-01-15' },
  { id: 'pre-24', type: 'workshop', title: 'FIDE Bills Clearing', location: 'TBD', time: 'TBD', date: '2027-01-20' },
  
  // February 2027
  { id: 'pre-25', type: 'tournament', title: 'Twisted Boards', location: 'Online', time: 'TBD', date: '2027-02-05' },
  { id: 'pre-26', type: 'workshop', title: 'Prospective Candidates', location: 'TBD', time: 'TBD', date: '2027-02-15' },
  
  // March 2027
  { id: 'pre-27', type: 'tournament', title: "Queen's Gambit", location: 'TBD', time: 'TBD', date: '2027-03-08' },
  { id: 'pre-28', type: 'tournament', title: 'Chess Masters Premier League 4.0', location: 'TBD', time: 'TBD', date: '2027-03-15' },
  { id: 'pre-29', type: 'workshop', title: 'Coordie Interviews', location: 'TBD', time: 'TBD', date: '2027-03-18' },
  { id: 'pre-30', type: 'workshop', title: '3rd Post Secy Review', location: 'TBD', time: 'TBD', date: '2027-03-20' },
  { id: 'pre-31', type: 'workshop', title: 'End-Tenure Party', location: 'TBD', time: 'TBD', date: '2027-03-30' },
  
  // April 2027
  { id: 'pre-32', type: 'tournament', title: 'IITK Chess Cup', location: 'TBD', time: 'TBD', date: '2027-04-02' },
  { id: 'pre-33', type: 'workshop', title: 'End-Term Report', location: 'TBD', time: 'TBD', date: '2027-04-10' }
];

const Calendar = () => {
  const { isLoggedIn } = useAuth();
  const [currentDate, setCurrentDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  ) ;

  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewDateEvents, setViewDateEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  
  // Filters
  const [showTournaments, setShowTournaments] = useState(true);
  const [showWorkshops, setShowWorkshops] = useState(true);
  const [showMatches, setShowMatches] = useState(true);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('chess-club-user-events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Could not parse saved events");
      }
    }
  }, []);

  const handleAddEvent = (newEvent) => {
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('chess-club-user-events', JSON.stringify(updatedEvents));
  };

  const handleEditEvent = (updatedEvent) => {
    const updatedEvents = events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    setEvents(updatedEvents);
    localStorage.setItem('chess-club-user-events', JSON.stringify(updatedEvents));
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('chess-club-user-events', JSON.stringify(updatedEvents));
    setEditingEvent(null);
  };

  const allEvents = [
    ...(showWorkshops || showTournaments ? PRE_SCHEDULED_EVENTS.filter(e => 
      (e.type === 'tournament' && showTournaments) || 
      (e.type === 'workshop' && showWorkshops)
    ) : []),
    ...(showMatches && isLoggedIn ? events : [])
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); 
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const calendarCells = [];
  
  // Previous month padding
  for (let i = 0; i < firstDayOfMonth; i++) {
    const day = daysInPrevMonth - firstDayOfMonth + i + 1;
    calendarCells.push({ type: 'prev', day });
  }
  
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarCells.push({ type: 'current', day: i, dateStr });
  }
  
  // Next month padding
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
    <div className="p-8 h-screen flex flex-col relative overflow-hidden bg-surface text-on-surface">
      <div className="mb-6 flex flex-col justify-between relative z-10 shrink-0">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-serif text-on-surface leading-tight">Mastering the <span className=" text-primary">Tides of Time</span></h2>
          <p className="mt-2 text-on-surface-variant/80 text-base font-light leading-relaxed">View the collective assembly of the IITK Chess Community's upcoming stratagems, workshops, and championship cycles.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6 relative z-10 flex-1 min-h-0">
        <div className="col-span-12 lg:col-span-9 bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10 shrink-0">
            <h3 className="text-2xl font-serif font-bold text-on-surface">{monthName} <span className="text-on-surface-variant/50 font-normal">{year}</span></h3>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-surface-container rounded-lg transition-colors material-symbols-outlined outline-none">chevron_left</button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-surface-container rounded-lg transition-colors material-symbols-outlined outline-none">chevron_right</button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center border-b border-outline-variant/10 shrink-0">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className="py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant/50">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr flex-1 min-h-0">
            {calendarCells.map((cell, idx) => {
              const isCurrent = cell.type === 'current';
              const dayEvents = isCurrent ? allEvents.filter(e => e.date === cell.dateStr) : [];
              
              const baseClass = "border-r border-b border-outline-variant/5 p-2 flex flex-col min-h-0 overflow-hidden relative group ";
              let bgClass = isCurrent ? "bg-transparent hover:bg-surface-container-high transition-colors cursor-pointer " : "opacity-30 bg-surface-container-lowest ";
              
              return (
                <div 
                  key={idx} 
                  className={baseClass + bgClass}
                  onClick={() => {
                    if (isCurrent) {
                      setViewDateEvents(dayEvents);
                      setSelectedDate(cell.dateStr);
                      setIsViewModalOpen(true);
                    }
                  }}
                >
                  <span className={`text-sm ${dayEvents.length > 0 ? 'font-bold text-primary' : 'font-medium text-on-surface/80'}`}>
                    {cell.day}
                  </span>
                  
                  {isCurrent && isLoggedIn && (
                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                         <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(cell.dateStr);
                              setIsModalOpen(true);
                            }}
                            className="material-symbols-outlined text-[14px] text-on-surface-variant hover:text-primary outline-none"
                         >
                           add
                         </button>
                     </div>
                  )}

                  <div className="mt-1 flex-1 min-h-0 overflow-y-auto space-y-1 disable-scrollbar">
                    {dayEvents.map((evt, eIdx) => (
                      <div 
                        key={eIdx} 
                        className={`px-1.5 py-1 rounded text-left border-l-[3px] ${
                          evt.type === 'tournament' ? 'border-[#f2ca50] bg-primary/10' : 
                          evt.type === 'workshop' ? 'border-[#e5e2e1] bg-[#e5e2e1]/5' : 
                          'border-[#60a5fa] bg-[#60a5fa]/10' // user matches
                        }`}
                      >
                        <div className={`text-[9px] font-bold uppercase tracking-tight leading-tight truncate ${
                          evt.type === 'tournament' ? 'text-primary' :
                          evt.type === 'workshop' ? 'text-on-surface' :
                          'text-blue-400'
                        }`}>
                          {evt.title}
                        </div>
                        <div className="text-[8px] text-on-surface-variant mt-0.5 truncate">{evt.location} • {evt.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6 flex flex-col">
          <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10">
            <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold mb-4">Filter Events</h4>
            <div className="space-y-3">
              <label 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setShowTournaments(!showTournaments)}
              >
                <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center transition-colors ${showTournaments ? 'border border-[#f2ca50] bg-[#f2ca50]' : 'border border-outline-variant bg-transparent'}`}>
                  {showTournaments && <span className="material-symbols-outlined text-[10px] text-[#3c2f00]">check</span>}
                </div>
                <span className="text-xs text-on-surface group-hover:text-primary transition-colors">Tournaments</span>
              </label>
              <label 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setShowWorkshops(!showWorkshops)}
              >
                <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center transition-colors ${showWorkshops ? 'border border-[#e5e2e1] bg-[#e5e2e1]' : 'border border-outline-variant bg-transparent'}`}>
                  {showWorkshops && <span className="material-symbols-outlined text-[10px] text-[#131313]">check</span>}
                </div>
                <span className="text-xs text-on-surface group-hover:text-[#e5e2e1] transition-colors">Club Workshops</span>
              </label>
              {isLoggedIn && (
                <label 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setShowMatches(!showMatches)}
                >
                  <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center transition-colors ${showMatches ? 'border border-blue-400 bg-blue-400' : 'border border-outline-variant bg-transparent'}`}>
                    {showMatches && <span className="material-symbols-outlined text-[10px] text-black">check</span>}
                  </div>
                  <span className="text-xs text-on-surface group-hover:text-blue-400 transition-colors">Your Matches</span>
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/10">
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">Active</p>
              <p className="text-xl font-serif text-primary">{events.length}</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/10">
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant mb-1">Events</p>
              <p className="text-xl font-serif text-primary">{PRE_SCHEDULED_EVENTS.length}</p>
            </div>
          </div>
        </div>
        <footer className="relative mt-20 border-t border-outline-variant/10 bg-surface-container-lowest px-6 py-14 sm:px-8 md:px-12 lg:px-16 before:content-[''] before:absolute before:inset-0 before:bg-surface-container-lowest before:-mx-[100vw] before:z-[-1]">
  <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
    <div className="max-w-md">
      <h6 className="m-0 text-xl font-serif text-primary sm:text-2xl">
        Chess Club IITK
      </h6>
      <p className="mt-4 m-0 max-w-sm text-sm leading-relaxed text-on-surface-variant">
        The official intellectual repository and match-log of the Chess Club at the Indian Institute of Technology, Kanpur. Founded for the love of the game, sustained by the pursuit of logic.
      </p>
    </div>

    <div className="md:max-w-md md:text-right">
      <p className="m-0 text-[10px] font-label uppercase tracking-widest text-primary">
        Connect
      </p>

      <div className="mt-5 flex flex-wrap gap-3 md:justify-end">
        <a
          href="https://www.instagram.com/chessiitk/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          Instagram
        </a>

        <a
          href="mailto:chessiitk21@gmail.com"
          aria-label="Email"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          Email
        </a>

        <a
          href="https://x.com/chessiitk"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          X
        </a>

        <a
          href="https://www.linkedin.com/company/chess-iitk/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          LinkedIn
        </a>

        <a
          href="https://www.facebook.com/chessclubiitk/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          Facebook
        </a>

        <a
          href="https://www.chess.com/club/iitk-chess-club"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chess.com"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          Chess.com
        </a>

        <a
          href="https://www.threads.com/@chessiitk?xmt=AQG0WclpAXcX0l6MVRZkMQ6ltp7AQi8X1H4vyrFo6qXNahU"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Threads"
          className="inline-flex h-9 items-center justify-center rounded-full border border-outline-variant/30 px-4 text-xs font-medium text-on-surface-variant transition-all hover:border-primary hover:text-primary"
        >
          Threads
        </a>
      </div>
    </div>
  </div>

  <div className="mt-12 flex flex-col gap-3 border-t border-outline-variant/10 pt-6 text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50 sm:flex-row sm:items-center sm:justify-between">
    <span>© 2024 Chess Club IITK. Intellectual Property Reserved.</span>
    <span>Est. 1960</span>
  </div>
</footer>
      </div>
      
      {isLoggedIn && (
        <button 
          onClick={handleScheduleClick}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-on-primary shadow-2xl flex items-center justify-center group hover:scale-110 transition-all z-50 outline-none"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
          <span className="absolute right-16 bg-surface-container-highest text-[#e5e2e1] px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity border border-outline-variant/20 pointer-events-none whitespace-nowrap">Schedule Match</span>
        </button>
      )}

      <AddEventModal 
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
        }}
        onAddEvent={handleAddEvent}
        initialDate={selectedDate}
        editEvent={editingEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />

      <ViewDayModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        dateStr={selectedDate}
        events={viewDateEvents}
        onEditClick={(evt) => {
          setEditingEvent(evt);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
};

export default Calendar;

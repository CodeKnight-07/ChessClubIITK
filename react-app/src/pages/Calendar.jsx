import { useState, useEffect } from 'react';
import AddEventModal from '../components/AddEventModal';
import ViewDayModal from '../components/ViewDayModal';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
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

  const [currentDate, setCurrentDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewDateEvents, setViewDateEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const [showTournaments, setShowTournaments] = useState(true);
  const [showWorkshops, setShowWorkshops] = useState(true);
  const [showMatches, setShowMatches] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('chess-club-user-events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error('Could not parse saved events');
      }
    }
  }, []);

  const handleAddEvent = (newEvent) => {
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('chess-club-user-events', JSON.stringify(updatedEvents));
  };

  const handleEditEvent = (updatedEvent) => {
    const updatedEvents = events.map((e) =>
      e.id === updatedEvent.id ? updatedEvent : e
    );
    setEvents(updatedEvents);
    localStorage.setItem('chess-club-user-events', JSON.stringify(updatedEvents));
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter((e) => e.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('chess-club-user-events', JSON.stringify(updatedEvents));
    setEditingEvent(null);
  };

  const allEvents = [
    ...(showWorkshops || showTournaments
      ? PRE_SCHEDULED_EVENTS.filter(
          (e) =>
            (e.type === 'tournament' && showTournaments) ||
            (e.type === 'workshop' && showWorkshops)
        )
      : []),
    ...(showMatches && isLoggedIn ? events : [])
  ];

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

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
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

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9">
            <div className="flex min-h-[720px] flex-col overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low">
              <div className="flex shrink-0 items-center justify-between border-b border-outline-variant/10 px-4 py-4 sm:px-6">
                <h3 className="text-2xl font-serif font-bold text-on-surface sm:text-3xl">
                  {monthName}{' '}
                  <span className="font-normal text-on-surface-variant/50">
                    {year}
                  </span>
                </h3>

                <div className="flex items-center gap-2">
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
                  const dayEvents = isCurrent
                    ? allEvents.filter((e) => e.date === cell.dateStr)
                    : [];

                  const baseClass =
                    'group relative flex min-h-[110px] flex-col overflow-hidden border-b border-r border-outline-variant/5 p-2 sm:p-3';
                  const bgClass = isCurrent
                    ? 'cursor-pointer bg-transparent transition-colors hover:bg-surface-container-high'
                    : 'bg-surface-container-lowest opacity-30';

                  return (
                    <div
                      key={idx}
                      className={`${baseClass} ${bgClass}`}
                      onClick={() => {
                        if (isCurrent) {
                          setViewDateEvents(dayEvents);
                          setSelectedDate(cell.dateStr);
                          setIsViewModalOpen(true);
                        }
                      }}
                    >
                      <span
                        className={`text-sm ${
                          dayEvents.length > 0
                            ? 'font-bold text-primary'
                            : 'font-medium text-on-surface/80'
                        }`}
                      >
                        {cell.day}
                      </span>

                      {isCurrent && isLoggedIn && (
                        <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(cell.dateStr);
                              setIsModalOpen(true);
                            }}
                            className="outline-none"
                          >
                            <span className="material-symbols-outlined text-[14px] text-on-surface-variant hover:text-primary">
                              add
                            </span>
                          </button>
                        </div>
                      )}

                      <div className="mt-1 flex-1 space-y-1 overflow-y-auto min-h-0 disable-scrollbar">
                        {dayEvents.map((evt, eIdx) => (
                          <div
                            key={eIdx}
                            className={`rounded border-l-[3px] px-1.5 py-1 text-left ${
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
            </div>
          </div>

          <div className="col-span-12 flex flex-col gap-6 lg:col-span-3">
            <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-low p-5">
              <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                Filter Events
              </h4>

              <div className="space-y-3">
                <label
                  className="group flex cursor-pointer items-center gap-3"
                  onClick={() => setShowTournaments(!showTournaments)}
                >
                  <div
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm transition-colors ${
                      showTournaments
                        ? 'border border-[#f2ca50] bg-[#f2ca50]'
                        : 'border border-outline-variant bg-transparent'
                    }`}
                  >
                    {showTournaments && (
                      <span className="material-symbols-outlined text-[10px] text-[#3c2f00]">
                        check
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-on-surface transition-colors group-hover:text-primary">
                    Tournaments
                  </span>
                </label>

                <label
                  className="group flex cursor-pointer items-center gap-3"
                  onClick={() => setShowWorkshops(!showWorkshops)}
                >
                  <div
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm transition-colors ${
                      showWorkshops
                        ? 'border border-[#e5e2e1] bg-[#e5e2e1]'
                        : 'border border-outline-variant bg-transparent'
                    }`}
                  >
                    {showWorkshops && (
                      <span className="material-symbols-outlined text-[10px] text-[#131313]">
                        check
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-on-surface transition-colors group-hover:text-[#e5e2e1]">
                    Club Workshops
                  </span>
                </label>

                {isLoggedIn && (
                  <label
                    className="group flex cursor-pointer items-center gap-3"
                    onClick={() => setShowMatches(!showMatches)}
                  >
                    <div
                      className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm transition-colors ${
                        showMatches
                          ? 'border border-blue-400 bg-blue-400'
                          : 'border border-outline-variant bg-transparent'
                      }`}
                    >
                      {showMatches && (
                        <span className="material-symbols-outlined text-[10px] text-black">
                          check
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-on-surface transition-colors group-hover:text-blue-400">
                      Your Matches
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-low p-4">
                <p className="mb-1 text-[9px] uppercase tracking-widest text-on-surface-variant">
                  Active
                </p>
                <p className="text-xl font-serif text-primary">{events.length}</p>
              </div>

              <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-low p-4">
                <p className="mb-1 text-[9px] uppercase tracking-widest text-on-surface-variant">
                  Events
                </p>
                <p className="text-xl font-serif text-primary">
                  {PRE_SCHEDULED_EVENTS.length}
                </p>
              </div>
            </div>
          </div>
        </div> 
      </motion.main>


      <Footer />



      {isLoggedIn && (
        <button
          onClick={handleScheduleClick}
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-2xl outline-none transition-all hover:scale-110"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
          <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg border border-outline-variant/20 bg-surface-container-highest px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#e5e2e1] opacity-0 transition-opacity group-hover:opacity-100">
            Schedule Match
          </span>
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
    </>
  );
};

export default Calendar;

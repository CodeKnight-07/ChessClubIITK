import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { globalCache } from '../utils/cache';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';
import { OFFICIAL_EVENTS } from '../constants/events';

const Events = () => {
  // 1. Pull auth context and token for admin verification and API calls
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedId, setExpandedId] = useState(null);

  // LoL Registration Custom States
  const [isRegisteredForLol, setIsRegisteredForLol] = useState(false);
  const [isLolModalOpen, setIsLolModalOpen] = useState(false);
  const [lolProfileData, setLolProfileData] = useState(null);
  const [lolRegError, setLolRegError] = useState('');
  const [lolRegSuccess, setLolRegSuccess] = useState(false);
  const [isSubmittingLol, setIsSubmittingLol] = useState(false);
  const [isFetchingLolProfile, setIsFetchingLolProfile] = useState(false);

  // Check LoL registration status
  useEffect(() => {
    if (isLoggedIn && token) {
      const checkLolStatus = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/register-lol/status`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setIsRegisteredForLol(data.is_registered);
          }
        } catch (e) {
          console.error("Error checking lol registration status:", e);
        }
      };
      checkLolStatus();
    } else {
      setIsRegisteredForLol(false);
    }
  }, [isLoggedIn, token]);

  // Handle auto-opening registration modal from landing page announcement popup
  useEffect(() => {
    if (location.state?.openRegisterLol && isLoggedIn && token) {
      handleRegisterLolClick();
      // Clean up the location state so it doesn't open again on page reload
      window.history.replaceState({}, document.title);
    }
  }, [location.state, isLoggedIn, token]);

  const handleRegisterLolClick = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setIsFetchingLolProfile(true);
    setLolRegError('');
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.sub || localStorage.getItem('logged_in_user_email');
      
      const response = await fetch(`${API_BASE_URL}/api/user/profile/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const profile = await response.json();
        setLolProfileData(profile);
        setIsLolModalOpen(true);
      } else {
        setLolRegError("Failed to fetch profile properties. Please try again.");
      }
    } catch (err) {
      console.error("Failed to load profile for LoL registration:", err);
      setLolRegError("Connection failed. Please check your backend.");
    } finally {
      setIsFetchingLolProfile(false);
    }
  };

  const handleConfirmLolRegistration = async () => {
    setIsSubmittingLol(true);
    setLolRegError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/register-lol`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: lolProfileData.email,
          name: lolProfileData.name,
          roll_no: lolProfileData.rollno,
          chess_username: lolProfileData.chesscom,
          contact: lolProfileData.contact,
          secondary_email: lolProfileData.secondary_email
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setLolRegSuccess(true);
        setIsRegisteredForLol(true);
      } else {
        setLolRegError(data.error || "Failed to register.");
      }
    } catch (err) {
      console.error("LoL registration submission failure:", err);
      setLolRegError("Server connection error.");
    } finally {
      setIsSubmittingLol(false);
    }
  };

  // 2. The Ultimate Bouncer: Admin Check Logic
  let isAdmin = false;
  if (isLoggedIn && token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'admin' || payload.role === 'secretary') {
        isAdmin = true;
      }
    } catch (error) {
      console.error("Could not decode token for admin check:", error);
    }
  }

  // 3. State for fetched events from database
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Modal and Form State for Admin Creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'Tournament',
    short_description: '',
    event_briefing: '',
    event_date: '',
    event_time: '',
    location: '',
    format: '',
    register_link: ''
  });

  const [editingEventId, setEditingEventId] = useState(null);

  // 5. Fetch Events from Backend on Mount
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`);
      
      if (response.ok) {
        const dbEvents = await response.json();
        
        // Format the database events to match OFFICIAL_EVENTS
        const formattedDbEvents = dbEvents.map(dbEvent => ({
           id: `db-${dbEvent.id}`, // Ensure unique IDs
           title: dbEvent.title,
           date: dbEvent.event_date,
           tag: dbEvent.event_type,
           time: dbEvent.event_time,
           location: dbEvent.location,
           format: dbEvent.format,
           shortDesc: dbEvent.short_description,
           fullDesc: dbEvent.event_briefing,
           register_link: dbEvent.register_link,
           // The old hardcoded events had arrays for schedules, you can leave this blank 
           // for DB events or handle it conditionally in your JSX
           schedule: [] 
        }));

        // Combine the hardcoded events and the new database events!
        const combined = [...OFFICIAL_EVENTS, ...formattedDbEvents];
        setEvents(combined);
        globalCache.events = combined; // Save to global cache!
      } else {
        // If the DB fails, at least show the hardcoded ones
        setEvents([...OFFICIAL_EVENTS]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([...OFFICIAL_EVENTS]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (globalCache.events) {
      setEvents(globalCache.events);
      setIsLoading(false);
      // Fetch silently in the background to update cache
      fetchEvents();
    } else {
      fetchEvents();
    }
  }, []);

  // 6. UI Interaction Handlers
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Triggered when the "Edit" button is clicked
  const openEditModal = (event) => {
    setEditingEventId(event.id);
    
    // Format the date properly for the <input type="date"> (YYYY-MM-DD)
    let formattedDate = event.date;
    try {
      formattedDate = new Date(event.date).toISOString().split('T')[0];
    } catch(e) {}

    // Populate the form with the event's current details
    setFormData({
      title: event.title,
      event_type: event.tag,
      short_description: event.shortDesc,
      event_briefing: event.fullDesc,
      event_date: formattedDate,
      event_time: event.time,
      location: event.location,
      format: event.format,
      register_link: event.register_link || ''
    });
    
    setIsModalOpen(true);
  };

  // Triggered when the "Delete" button is clicked
  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to permanently delete this event?")) return;

    // Check if it's a database event (starts with 'db-')
    const isDbEvent = String(eventId).startsWith('db-');
    
    if (isDbEvent) {
      const realId = eventId.replace('db-', '');
      try {

        await fetch(`${API_BASE_URL}/api/events/${realId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Failed to delete from database:", error);
      }
    }

    // Immediately remove it from the screen for a snappy UI
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setExpandedId(null);
  };
  // 7. Admin Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const isDbEvent = editingEventId && String(editingEventId).startsWith('db-');
    const realId = isDbEvent ? editingEventId.replace('db-', '') : null;
    
    // If we are editing, use PUT and attach the ID. Otherwise, use POST.
    const method = editingEventId ? 'PUT' : 'POST';
    const endpoint = realId ? `/api/events/${realId}` : '/api/events';

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(`Event ${editingEventId ? 'updated' : 'created'} successfully!`);
        setIsModalOpen(false);
        setEditingEventId(null); // Reset edit state
        
        // Re-fetch events to show the updated data
        const updatedResponse = await fetch(`${API_BASE_URL}/api/events`);
        if (updatedResponse.ok) {
           const dbEvents = await updatedResponse.json();
           const formattedDbEvents = dbEvents.map(dbEvent => ({
             id: `db-${dbEvent.id}`,
             title: dbEvent.title,  
             date: dbEvent.event_date,
             tag: dbEvent.event_type,
             time: dbEvent.event_time,
             location: dbEvent.location,
             format: dbEvent.format,
             shortDesc: dbEvent.short_description,
             fullDesc: dbEvent.event_briefing,
             register_link: dbEvent.register_link,
             schedule: [] 
          }));
          setEvents([...OFFICIAL_EVENTS, ...formattedDbEvents]);
        }
      }
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };


return (
    <div className="min-h-screen bg-[#111111] text-white pt-24 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative">
        
        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-gray-800 pb-8 mb-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif text-gray-100 mb-4">
              Upcoming Events
            </h1>
            <p className="text-gray-400 text-lg">
              The curated schedule of major club events, workshops, and tournaments. 
              For your personal match schedule, please consult the Calendar.
            </p>
          </div>

          {/* Admin Create Event Button */}
          {isAdmin && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-yellow-400 text-black px-6 py-2 rounded-md font-bold text-sm hover:bg-yellow-500 transition-colors shadow-lg"
            >
              + Create Event
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        ) : (
          /* Events List */
          <div className="space-y-6">
            {events.map((event) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
              >
                {/* Event Header (Always Visible) */}
                <div 
                  className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                  onClick={() => toggleExpand(event.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-gray-500 mb-3 uppercase">
                      <span className="text-yellow-400">{event.tag}</span> {/* Changed from event_type */}
                      <span>•</span>
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span> {/* Changed from event_date */}
                    </div>
                    <h3 className="text-2xl font-serif text-gray-100 mb-3">{event.title}</h3>
                    <p className="text-gray-400 leading-relaxed max-w-3xl">
                      {event.shortDesc} {/* Changed from short_description */}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-4 min-w-[140px]">
                    <div className="text-left md:text-right">
                      <div className="text-xs text-gray-500 tracking-wider mb-1 uppercase">Time</div>
                      <div className="font-medium text-gray-200">{event.time}</div> {/* Changed from event_time */}
                    </div>
                    <button 
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        expandedId === event.id ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      <svg 
                        className={`w-5 h-5 transition-transform duration-300 ${expandedId === event.id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {expandedId === event.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-gray-800 bg-[#161616] p-6 md:p-8"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-2">
                        <h4 className="text-xs font-bold tracking-widest text-yellow-400 mb-4 uppercase">Event Briefing</h4>
                        <p className="text-gray-300 leading-relaxed">
                          {event.fullDesc} {/* Changed from event_briefing */}
                        </p>
                      </div>
                      
                      <div className="space-y-6">
                        {event.location && (
                          <div className="bg-[#111111] p-5 rounded-lg border border-gray-800">
                            <h4 className="text-xs font-bold tracking-widest text-gray-500 mb-2 uppercase flex items-center gap-2">
                              Location
                            </h4>
                            <p className="text-gray-200">{event.location}</p>
                          </div>
                        )}
                        
                        {event.format && (
                          <div className="bg-[#111111] p-5 rounded-lg border border-gray-800">
                            <h4 className="text-xs font-bold tracking-widest text-gray-500 mb-2 uppercase flex items-center gap-2">
                              Match Format
                            </h4>
                            <p className="text-gray-200">{event.format}</p>
                          </div>
                        )}

                        {event.id === 1 ? (
                          isRegisteredForLol ? (
                            <button
                              disabled
                              className="block w-full text-center bg-gray-800 text-gray-500 py-3 rounded-lg font-bold cursor-not-allowed border border-gray-700"
                            >
                              REGISTERED ✓
                            </button>
                          ) : (
                            <button 
                              onClick={handleRegisterLolClick}
                              disabled={isFetchingLolProfile}
                              className="block w-full text-center bg-yellow-400 text-black py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
                            >
                              {isFetchingLolProfile ? "LOADING PROFILE..." : "REGISTER"}
                            </button>
                          )
                        ) : event.register_link && (
                          <a 
                            href={event.register_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-yellow-400 text-black py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
                          >
                            REGISTER
                          </a>
                        )}
                      </div>
                    </div>
                    {/* Admin Edit/Delete Controls */}
                    {isAdmin && (
                      <div className="mt-8 pt-6 border-t border-gray-800 flex flex-wrap items-center gap-4">
                        <button 
                          onClick={() => openEditModal(event)}
                          className="bg-gray-800 text-yellow-400 px-5 py-2 rounded-md font-bold text-sm hover:bg-gray-700 transition-colors"
                        >
                          Edit Event
                        </button>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="bg-red-900/50 text-red-400 border border-red-900 px-5 py-2 rounded-md font-bold text-sm hover:bg-red-900 hover:text-red-200 transition-colors"
                        >
                          Delete Event
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* LoL Registration Modal */}
      {isLolModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
          <div className="bg-[#1a1a1a] p-8 rounded-xl max-w-lg w-full border border-gray-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl text-yellow-400 mb-2 font-serif font-bold">Event Registration</h2>
            <p className="text-gray-400 text-sm mb-6">League of Legends 6.0 — August 7, 2026</p>
            
            {lolRegSuccess ? (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
                <h3 className="text-xl font-bold text-gray-100 mb-2">Registration Confirmed!</h3>
                <p className="text-gray-400 text-sm mb-6">You have been successfully registered for League of Legends 6.0.</p>
                <button 
                  onClick={() => {
                    setIsLolModalOpen(false);
                    setLolRegSuccess(false);
                  }}
                  className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 text-gray-200">
                <p className="text-xs text-yellow-400/80 mb-2 font-semibold">
                  ⚠️ Please verify that your profile details below are correct. These details cannot be modified during registration.
                </p>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input readOnly value={lolProfileData?.name || ''} className="w-full p-2.5 bg-[#111111] rounded-md border border-gray-800 text-gray-400 cursor-not-allowed focus:outline-none" />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Roll Number</label>
                    <input readOnly value={lolProfileData?.rollno || ''} className="w-full p-2.5 bg-[#111111] rounded-md border border-gray-800 text-gray-400 cursor-not-allowed focus:outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Chess.com Username</label>
                    <input readOnly value={lolProfileData?.chesscom || ''} className="w-full p-2.5 bg-[#111111] rounded-md border border-gray-800 text-gray-400 cursor-not-allowed focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Primary Email (IITK)</label>
                  <input readOnly value={lolProfileData?.email || ''} className="w-full p-2.5 bg-[#111111] rounded-md border border-gray-800 text-gray-400 cursor-not-allowed focus:outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Secondary Email (Gmail)</label>
                  <input readOnly value={lolProfileData?.secondary_email || 'Not Provided'} className="w-full p-2.5 bg-[#111111] rounded-md border border-gray-800 text-gray-400 cursor-not-allowed focus:outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                  <input readOnly value={lolProfileData?.contact || ''} className="w-full p-2.5 bg-[#111111] rounded-md border border-gray-800 text-gray-400 cursor-not-allowed focus:outline-none" />
                </div>

                {lolRegError && (
                  <div className="text-red-400 text-xs mt-2 bg-red-950/30 border border-red-900/50 p-2.5 rounded-md">
                    {lolRegError}
                  </div>
                )}

                <div className="flex justify-end gap-4 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsLolModalOpen(false)} 
                    disabled={isSubmittingLol}
                    className="px-5 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmLolRegistration}
                    disabled={isSubmittingLol}
                    className="px-5 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 transition-colors text-sm flex items-center gap-2"
                  >
                    {isSubmittingLol ? "Registering..." : "Confirm & Register"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
          <div className="bg-[#1a1a1a] p-8 rounded-xl max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl text-yellow-400 mb-6 font-serif font-bold">Create New Event</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-gray-200">
              <input name="title" value={formData.title} placeholder="Event Title" required onChange={handleChange} className="p-3 bg-[#111111] rounded-md border border-gray-800 focus:border-yellow-400 focus:outline-none transition-colors" />
              
              <div className="flex flex-col md:flex-row gap-5">
                <select name="event_type" value={formData.event_type} onChange={handleChange} className="p-3 bg-[#111111] rounded-md border border-gray-800 focus:border-yellow-400 focus:outline-none flex-1">
                  <option value="Tournament">Tournament</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Social">Social</option>
                </select>
                <input type="date" name="event_date" value={formData.event_date} required onChange={handleChange} className="p-3 bg-[#111111] rounded-md border border-gray-800 focus:border-yellow-400 focus:outline-none flex-1 [color-scheme:dark]" />
              </div>

              <div className="flex flex-col md:flex-row gap-5">
                <input name="event_time" value={formData.event_time} placeholder="Time (e.g., 9:00 PM Onwards)" required onChange={handleChange} className="p-3 bg-[#111111] rounded-md border border-gray-800 focus:border-yellow-400 focus:outline-none flex-1" />
                <input name="location" value={formData.location} placeholder="Location (e.g., chess.com or LH7)" onChange={handleChange} className="p-3 bg-[#111111] rounded-md border border-gray-800 focus:border-yellow-400 focus:outline-none flex-1" />
              </div>

              <div className="flex flex-col md:flex-row gap-5">
                <input name="format" value={formData.format} placeholder="Format (e.g., 3+0 Knockouts)" onChange={handleChange} className="p-3 bg-[#111111] rounded-md border border-gray-800 focus:border-yellow-400 focus:outline-none flex-1" />
                <input name="register_link" value={formData.register_link} placeholder="Registration URL" onChange={handleChange} className="p-3 bg-[#111111] rounded-md border border-gray-800 focus:border-yellow-400 focus:outline-none flex-1" />
              </div>

              <textarea name="short_description" value={formData.short_description} placeholder="Short Description (for the header)" rows="2" onChange={handleChange} className="p-3 bg-[#111111] rounded-md border border-gray-800 focus:border-yellow-400 focus:outline-none"></textarea>
              <textarea name="event_briefing" value={formData.event_briefing} placeholder="Full Event Briefing" rows="5" onChange={handleChange} className="p-3 bg-[#111111] rounded-md border border-gray-800 focus:border-yellow-400 focus:outline-none"></textarea>

              <div className="flex justify-end gap-4 mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors font-medium">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 transition-colors">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
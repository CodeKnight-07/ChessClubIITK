import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { OFFICIAL_EVENTS } from './Events';

const EventRegistration = () => {
  const { id } = useParams();
  const event = OFFICIAL_EVENTS.find(e => e.id === parseInt(id, 10));

  const [formData, setFormData] = useState({ name: '', rollNo: '', phone: '', email: '', remarks: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback if event is completely invalid
  if (!event) {
    return (
      <div className="px-12 py-20 max-w-3xl mx-auto text-center min-h-screen">
        <h2 className="text-3xl font-serif text-on-surface mb-4">Event Not Found</h2>
        <Link to="/events" className="text-primary hover:underline font-label uppercase tracking-widest text-xs">Return to Directory</Link>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save to localStorage
    const savedParticipations = JSON.parse(localStorage.getItem('chess-club-participations') || '[]');
    // Check if already registered for this event (optional, but good practice)
    if (!savedParticipations.find(p => p.eventId === event.id)) {
      const newParticipation = {
        id: `rsvp_${Date.now()}`,
        eventId: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        tag: event.tag,
        registeredAt: new Date().toISOString()
      };
      savedParticipations.push(newParticipation);
      localStorage.setItem('chess-club-participations', JSON.stringify(savedParticipations));
    }

    // Simulate API network delay to make it feel premium/real
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f2ca50', '#d4af37', '#ffffff', '#1c1b1b'] 
      });
    }, 800);
  };

  return (
    <div className="px-6 md:px-12 py-12 max-w-4xl mx-auto min-h-screen flex flex-col">
      <Link to="/events" className="group inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-[10px] font-label uppercase tracking-widest mb-10 w-fit">
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Back to Events
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-serif text-on-surface leading-tight mb-4">{event.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-label uppercase tracking-widest font-bold text-on-surface-variant">
          <span className="text-on-surface">{event.date}</span>
          <span>•</span>
          <span>{event.time}</span>
          <span>•</span>
          <span className="truncate">{event.location}</span>
          {event.format && (
            <>
              <span>•</span>
              <span className="text-primary truncate">{event.format}</span>
            </>
          )}
        </div>
      </div>

      <div className="bg-surface-container border border-[#4d4635]/20 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        {isSubmitted ? (
          /* SUCCESS STATE */
          <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-6 text-primary shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <span className="material-symbols-outlined text-4xl">check</span>
            </div>
            <h2 className="text-3xl font-serif text-on-surface mb-3">RSVP Confirmed</h2>
            <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed mb-8">
              Your details have been registered into the official ledger. Please verify your inbox for further scheduling protocol.
            </p>
            <Link
              to="/events"
              className="px-8 py-3 bg-[#1c1b1b] border border-outline-variant/30 text-on-surface hover:border-primary/50 hover:text-primary transition-all rounded-lg text-xs font-bold uppercase tracking-widest"
            >
              Return to Events
            </Link>
          </div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1.5 focus-within:text-primary transition-colors">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inesh Aggarwal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#131313] border border-[#4d4635]/30 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1.5 focus-within:text-primary transition-colors">Institute Roll Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 210123"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  className="w-full bg-[#131313] border border-[#4d4635]/30 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1.5 focus-within:text-primary transition-colors">IITK Email ID</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. member@iitk.ac.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#131313] border border-[#4d4635]/30 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1.5 focus-within:text-primary transition-colors">
                  Contact Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#131313] border border-[#4d4635]/30 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors focus:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                />
              </div>
            </div>

            <div className="space-y-4 flex flex-col h-full">
              <div className="flex-1 flex flex-col">
                <label className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1.5 focus-within:text-primary transition-colors">Tactical Remarks / Queries</label>
                <textarea
                  placeholder="Any specific questions for the organizers or dietary constraints?"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full flex-1 bg-[#131313] border border-[#4d4635]/30 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-[#f2ca50] to-[#d4af37] text-[#3c2f00] font-bold py-4 rounded-lg text-xs uppercase tracking-widest outline-none transition-all ${isSubmitting ? 'opacity-80 scale-[0.98]' : 'hover:scale-[1.02] shadow-[0_10px_20px_rgba(212,175,55,0.15)]'}`}
                >
                  {isSubmitting ? 'Transmitting Data...' : 'Confirm Registration'}
                </button>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default EventRegistration;

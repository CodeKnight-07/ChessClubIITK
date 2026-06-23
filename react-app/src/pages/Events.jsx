import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export const OFFICIAL_EVENTS = [
  {
    id: 1,
    title: "League of Legends 6.0",
    date: "August 7, 2026",
    tag: "Tournament",
    time: "Multiple Days",
    location: "chess.com",
    shortDesc:
      "An open-for-all 4-player team event. Qualifiers start August 7th with the best advancing to knockouts!",
    fullDesc:
      "Form a 4-player team and compete in the legendary online qualifier arena (3+2 blitz format) on August 7th! The stakes are high: only the top 6 teams overall, along with the top 2 Alumni teams, will qualify for the knockouts. The semi-finals and finals knockouts will transition to a high-pressure 5+0 format.",
    schedule: [
      { time: "Aug 7th", activity: "Qualifier Arena (Blitz 3+2)" },
      { time: "Aug 8th", activity: "Semi-Finals Knockouts (Blitz 5+0)" },
      { time: "Aug 9th", activity: "Grand Finals (Blitz 5+0)" }
    ],
    prizes: "Winning team gets 4 Gold Memberships!"
  },
  {
    id: 2,
    title: "Fresher's Chess League",
    date: "August 21, 2026",
    tag: "Tournament",
    time: "Multiple Days",
    location: "Senate Hall & OAT",
    shortDesc:
      "An 8-player team OTB tournament featuring offline auctions, pools, and knockouts!",
    fullDesc:
      "Experience the thrill of OTB chess! The tournament begins on August 21st with an offline auction in the Senate Hall to distribute players into 8 teams. The teams will be divided into 2 pools of 4 teams each. You will battle it out in a Round Robin stage (10+5 format) where each team plays the other 3. The top 2 teams from each pool advance to the fiery semi-finals and finals on August 23rd!",
    schedule: [
      { time: "Aug 21st", activity: "Player Auctions (Senate Hall)" },
      { time: "Aug 22nd", activity: "Round Robin Pool Stages (OAT)" },
      { time: "Aug 23rd", activity: "Semi-Finals & Finals (OAT)" }
    ],
    prizes: "8 Gold Memberships for Winners + Mama Mio Coupons for Top 50!"
  },
  {
    id: 3,
    title: "IITK Grand Swiss",
    date: "October 2, 2026",
    tag: "Tournament",
    time: "Multiple Days",
    location: "Hall 3 Mess",
    shortDesc:
      "A 7-round Swiss OTB tournament. The gateway to the Candidates and the Chess Cup!",
    fullDesc:
      "Calling all chess enthusiasts! The IITK Grand Swiss is entirely an Over-The-Board (OTB) tournament played under a 10+5 rapid time format using the Swiss System format. Across 7 grueling rounds, players will battle it out to secure highly coveted spots in the next IITK Candidates tournament and the Chess Cup.",
    schedule: [
      { time: "Oct 2nd", activity: "Rounds 1 - 3" },
      { time: "Oct 3rd", activity: "Rounds 4 & 5" },
      { time: "Oct 4th", activity: "Rounds 6 & 7 (Finals)" }
    ],
    prizes:
      "Top 3: Candidates. Pos 4-17: Chess Cup. Top 5: Gold Memberships. Top 50: Coupons."
  }
];

const Events = () => {
  const { isLoggedIn } = useAuth();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 sm:px-8 md:px-10 lg:px-12 lg:py-12">
        <div className="mb-10 md:mb-12">
          <h1 className="m-0 text-4xl font-serif leading-tight tracking-tight text-on-surface sm:text-5xl">
            Upcoming Events
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant sm:text-base">
            The curated schedule of major club events, workshops, and tournaments.
            For your personal match schedule, please consult the Calendar.
          </p>
        </div>

        <div className="space-y-5">
          {OFFICIAL_EVENTS.map((event, idx) => {
            const isExpanded = expandedId === event.id;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.1, ease: "easeOut" }}
                className={`overflow-hidden rounded-2xl border transition-all duration-500 ${
                  isExpanded
                    ? 'border-primary/40 bg-surface-container shadow-[0_12px_36px_rgba(212,175,55,0.08)]'
                    : 'border-outline-variant/15 bg-surface-container-low hover:border-outline-variant/35 hover:bg-surface-container'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(event.id)}
                  className="w-full cursor-pointer px-5 py-5 text-left sm:px-6 sm:py-6 md:px-8 md:py-7"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest font-label">
                        <span
                          className={
                            event.tag === 'Tournament'
                              ? 'text-primary'
                              : event.tag === 'Workshop'
                              ? 'text-on-surface'
                              : 'text-blue-400'
                          }
                        >
                          {event.tag}
                        </span>
                        <span className="text-on-surface-variant/40">•</span>
                        <span className="text-on-surface-variant">{event.date}</span>
                      </div>

                      <h3 className="m-0 text-2xl font-serif text-on-surface sm:text-[28px]">
                        {event.title}
                      </h3>

                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-on-surface-variant">
                        {event.shortDesc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-5 border-t border-outline-variant/10 pt-4 md:justify-end md:border-t-0 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="m-0 mb-1 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                          Time
                        </p>
                        <p className="m-0 text-xs font-bold text-on-surface">
                          {event.time}
                        </p>
                      </div>

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-inner transition-all duration-300 ${
                          isExpanded
                            ? 'rotate-180 border-primary bg-primary text-[#3c2f00]'
                            : 'border-outline-variant/30 bg-[#2a2828] text-[#e5e2e1]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xl">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-outline-variant/10 px-5 pb-6 pt-4 sm:px-6 md:px-8 md:pb-8">
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
                        <div className="md:col-span-8">
                          <h4 className="mb-4 text-[10px] font-label uppercase tracking-widest text-primary">
                            Event Briefing
                          </h4>
                          <p className="mb-8 text-sm leading-relaxed text-on-surface-variant">
                            {event.fullDesc}
                          </p>

                          <h4 className="mb-4 text-[10px] font-label uppercase tracking-widest text-primary">
                            Agenda Overview
                          </h4>

                          <div className="space-y-3 rounded-xl border border-outline-variant/10 bg-[#131313] p-4 sm:p-5">
                            {event.schedule.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <span className="w-16 shrink-0 text-xs font-bold text-on-surface-variant">
                                  {item.time}
                                </span>
                                <span className="h-2 w-2 rounded-full bg-primary/50"></span>
                                <span className="text-xs text-on-surface sm:text-sm">
                                  {item.activity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-5 md:col-span-4">
                          <div className="rounded-xl border border-outline-variant/10 bg-[#131313] p-5">
                            <h4 className="mb-2 flex items-center gap-2 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                              <span className="material-symbols-outlined text-[14px]">
                                location_on
                              </span>
                              Location
                            </h4>
                            <p className="m-0 text-sm font-bold text-on-surface">
                              {event.location}
                            </p>
                          </div>

                          <div className="rounded-xl border border-[#f2ca50]/20 bg-[#131313] p-5">
                            <h4 className="mb-2 flex items-center gap-2 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                              <span className="material-symbols-outlined text-[14px] text-primary">
                                emoji_events
                              </span>
                              Honors
                            </h4>
                            <p className="m-0 text-sm font-bold text-primary">
                              {event.prizes}
                            </p>
                          </div>

                          {isLoggedIn && (
                            <Link
                              to={`/events/register/${event.id}`}
                              className="mt-2 block w-full rounded-xl bg-gradient-to-r from-[#f2ca50] to-[#d4af37] px-4 py-3 text-center text-[11px] font-bold uppercase tracking-widest text-[#3c2f00] shadow-lg outline-none transition-transform hover:scale-[1.02]"
                            >
                              Register
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

        </div>
      </main>

      <Footer />


    </>
  );
};

export default Events;

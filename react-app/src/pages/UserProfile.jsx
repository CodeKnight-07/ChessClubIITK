import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config'; 
import userAvatar from '../assets/new_user_avatar.png';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [participations, setParticipations] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Extract the authenticated session email dynamically rather than hardcoding it
  const userEmail = localStorage.getItem('logged_in_user_email') || "student@iitk.ac.in";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/profile/${userEmail}`);
        if (!response.ok) throw new Error("Could not retrieve profile properties");
        
        const data = await response.json();
        setProfile({
          ...data,
          avatar: data.avatar || userAvatar
        });
      } catch (err) {
        console.error(err);
        setError("Failed loading profile from server.");
      }
    };

    fetchProfile();

    const savedParts = localStorage.getItem('chess-club-participations');
    if (savedParts) {
      try {
        setParticipations(JSON.parse(savedParts));
      } catch (e) {
        console.error("Could not parse participations");
      }
    } else {
      setParticipations([{
        id: "fide_legacy_1",
        eventId: 999,
        title: "FIDE Rated Open Rapid Tournament",
        date: "7th Feb, 2026",
        time: "Standard",
        tag: "Tournament"
      }]);
    }
  }, [userEmail]);

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error("Failed saving database modifications");
      
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error(err);
      setError("Unable to save adjustments to server database.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profile) {
    return <div className="text-center p-12 text-on-surface">Loading Profile...</div>;
  }

  return (
    <div className="px-12 py-12 max-w-6xl mx-auto">
      {error && <div className="mb-4 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg text-center font-semibold">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Player Identity */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gradient-to-b from-[#201f1f] to-[#131313] rounded-3xl p-8 border border-[#4d4635]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/10 rounded-bl-full blur-3xl transition-opacity duration-700"></div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative mb-6">
                <div 
                  className={`w-32 h-32 rounded-2xl border border-outline-variant/30 overflow-hidden shadow-2xl relative ${isEditing ? 'cursor-pointer ring-2 ring-primary ring-offset-4 ring-offset-[#131313]' : 'ring-1 ring-white/10'}`}
                  onClick={() => isEditing && fileInputRef.current?.click()}
                >
                  <img 
                    alt="Player Profile Avatar" 
                    className={`w-full h-full object-cover transition-all duration-500 ${isEditing ? 'brightness-50' : 'brightness-90 group-hover:brightness-100'}`}
                    src={profile.avatar}
                  />
                  {isEditing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-80 hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined mb-1 text-2xl">photo_camera</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold">Replace</span>
                    </div>
                  )}
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              
              <div className="mt-4 mb-6 w-full flex flex-col items-center">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="text-3xl font-serif text-center bg-transparent border-b-2 border-primary/50 text-white mb-2 pb-1 focus:outline-none focus:border-primary transition-colors w-full"
                    placeholder="Full Name"
                  />
                ) : (
                  <h2 className="text-3xl font-serif text-on-surface mb-2 tracking-tight drop-shadow-md">{profile.name}</h2>
                )}
              </div>

              {/* User Meta Data Box */}
              <div className="w-full bg-[#131313]/80 rounded-xl mb-8 border border-outline-variant/5 shadow-inner backdrop-blur-md p-5 py-6">
                {isEditing ? (
                  <div className="flex flex-col gap-4">
                    <input 
                      type="text" 
                      value={profile.rollNo}
                      onChange={(e) => setProfile({...profile, rollNo: e.target.value})}
                      className="text-[11px] font-label uppercase tracking-widest bg-transparent border-b border-outline-variant/30 text-on-surface pb-1 focus:outline-none focus:border-primary w-full transition-colors text-center"
                      placeholder="Roll Number"
                    />
                    <input 
                      type="text" 
                      value={profile.contact}
                      onChange={(e) => setProfile({...profile, contact: e.target.value})}
                      className="text-[11px] font-label uppercase tracking-widest bg-transparent border-b border-outline-variant/30 text-on-surface pb-1 focus:outline-none focus:border-primary w-full transition-colors text-center"
                      placeholder="Contact Number"
                    />
                    {/* EMAIL INPUT: Locked down with 'disabled' flag */}
                    <div className="w-full relative">
                      <input 
                        type="email" 
                        value={profile.email}
                        disabled
                        className="text-[11px] font-label uppercase tracking-widest bg-transparent border-b border-outline-variant/10 text-on-surface-variant/40 pb-1 focus:outline-none w-full text-center cursor-not-allowed select-none"
                        placeholder="IITK Email ID"
                      />
                      <span className="absolute right-2 bottom-1.5 text-[14px] text-on-surface-variant/30 material-symbols-outlined">lock</span>
                    </div>
                    {/* CHESS.COM INPUT: Locked down with 'disabled' flag */}
                    <div className="w-full relative">
                      <input 
                        type="text" 
                        value={profile.chesscom}
                        disabled
                        className="text-[11px] font-label uppercase tracking-widest bg-transparent border-b border-outline-variant/10 text-primary/40 pb-1 focus:outline-none w-full text-center cursor-not-allowed select-none"
                        placeholder="Chess.com ID"
                      />
                      <span className="absolute right-2 bottom-1.5 text-[14px] text-primary/30 material-symbols-outlined">lock</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center text-left">
                      <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Roll No</span>
                      <span className="text-[11px] text-on-surface font-mono">{profile.rollNo || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center text-left">
                      <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Contact</span>
                      <span className="text-[11px] text-on-surface font-mono">{profile.contact || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center text-left">
                      <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Email</span>
                      <span className="text-[11px] text-on-surface font-mono flex-shrink truncate max-w-[140px]">{profile.email || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center text-left pt-2 border-t border-outline-variant/10">
                      <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Chess.com</span>
                      <span className="text-xs text-primary font-mono tracking-widest">{profile.chesscom || "-"}</span>
                    </div>
                  </div>
                )}
              </div>

              {isEditing ? (
                <button 
                  onClick={handleSave}
                  className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase shadow-[0_10px_20px_rgba(212,175,55,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all outline-none"
                >
                  Save Changes
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-[#f2ca50] hover:bg-[#d4af37] text-[#3c2f00] py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase shadow-lg hover:-translate-y-1 transition-all outline-none"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Ledger */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/15">
            <h3 className="text-2xl font-serif text-on-surface">Past Participations</h3>
          </div>

          <div className="space-y-4">
            {participations.length === 0 ? (
              <div className="text-center py-12 bg-[#1c1b1b] border border-[#4d4635]/10 rounded-xl shadow-sm">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">confirmation_number</span>
                <p className="text-sm text-on-surface-variant">No participations on record yet.</p>
              </div>
            ) : (
              participations.map((part, idx) => (
                <div key={part.id || idx} className="grid grid-cols-12 gap-4 items-center bg-[#1c1b1b] rounded-xl p-4 md:p-6 border border-[#4d4635]/10 hover:border-primary/30 transition-colors cursor-pointer group shadow-sm">
                  <div className="col-span-12 md:col-span-8 flex items-center gap-4 px-0 md:px-2">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-surface-container-highest rounded-full border border-outline-variant/20 shadow-inner">
                        <span className="material-symbols-outlined text-on-surface-variant">
                          {part.tag === 'Tournament' ? 'emoji_events' : part.tag === 'Workshop' ? 'school' : 'local_play'}
                        </span>
                    </div>
                    <div>
                      <p className="text-sm text-on-surface font-bold truncate max-w-[150px] sm:max-w-none">{part.title}</p>
                      <p className="text-xs text-on-surface-variant mt-1">{part.tag}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-4 flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0 opacity-70 group-hover:opacity-100 transition-opacity">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Time</p>
                      <p className="text-xs font-bold text-on-surface truncate max-w-[80px]">{part.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Date</p>
                      <p className="text-xs font-bold text-on-surface">{part.date}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="w-full mt-6 py-4 border border-outline-variant/20 border-dashed rounded-xl text-xs font-label uppercase tracking-widest text-on-surface-variant hover:text-primary hover:border-primary/50 bg-[#1c1b1b]/50 hover:bg-[#1c1b1b] transition-all">
            Load Historical Archives
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

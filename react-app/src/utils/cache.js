// Lightweight client-side cache manager with localStorage persistence to bypass backend cold starts on reload
const getStored = (key) => {
  try {
    const val = localStorage.getItem(`chess_club_cache_${key}`);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    return null;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem(`chess_club_cache_${key}`, JSON.stringify(val));
  } catch (e) {
    // Ignore storage errors or limits
  }
};

export const globalCache = {
  get blogs() { return getStored('blogs'); },
  set blogs(val) { setStored('blogs', val); },

  get events() { return getStored('events'); },
  set events(val) { setStored('events', val); },

  get gallery() { return getStored('gallery'); },
  set gallery(val) { setStored('gallery', val); },

  get carouselImages() { return getStored('carouselImages'); },
  set carouselImages(val) { setStored('carouselImages', val); },

  get profile() { return getStored('profile'); },
  set profile(val) { setStored('profile', val); }
};

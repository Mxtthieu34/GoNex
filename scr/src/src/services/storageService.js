const KEYS = {
  FAVORITES: 'gonex_favorites_v2',
  HISTORY: 'gonex_history_v2',
  SETTINGS: 'gonex_settings_v2'
};

export const storageService = {
  getFavorites: () => JSON.parse(localStorage.getItem(KEYS.FAVORITES) || '[]'),
  addFavorite: (item) => {
    const favs = storageService.getFavorites();
    if (!favs.some(f => f.url === item.url)) {
      const updated = [item, ...favs];
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    }
    return favs;
  },
  removeFavorite: (url) => {
    const favs = storageService.getFavorites().filter(f => f.url !== url);
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));
    return favs;
  },
  clearFavorites: () => {
    localStorage.removeItem(KEYS.FAVORITES);
    return [];
  },
  getHistory: () => JSON.parse(localStorage.getItem(KEYS.HISTORY) || '[]'),
  addHistory: (item) => {
    const history = storageService.getHistory().filter(h => h.url !== item.url);
    const updated = [{ ...item, timestamp: Date.now() }, ...history].slice(0, 50);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
    return updated;
  },
  removeHistory: (url) => {
    const history = storageService.getHistory().filter(h => h.url !== url);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    return history;
  },
  clearHistory: () => {
    localStorage.removeItem(KEYS.HISTORY);
    return [];
  },
  getSettings: () => JSON.parse(localStorage.getItem(KEYS.SETTINGS) || '{"theme":"dark"}'),
  saveSettings: (settings) => localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings))
};
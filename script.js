const AppState = { isOnline: true, data: [], lastUpdate: null };

const updateAppState = (newState) => {
  Object.assign(AppState, newState);
};

const registerServiceWorker = async () => {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);
    }
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
};

registerServiceWorker();

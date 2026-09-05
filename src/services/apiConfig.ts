// Central API Configuration for Web and Mobile (Capacitor/Android)
export const getBackendUrl = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const isCapacitor = !!(window as any)?.Capacitor?.isNativePlatform?.() || 
                        window.location.protocol === 'capacitor:' || 
                        window.location.protocol === 'ionic:';
    if (isCapacitor) {
      return 'https://claudemining.com';
    }
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return window.location.origin;
    }
    return 'http://localhost:5000';
  }
  return 'https://claudemining.com';
};

export const API_URL = getBackendUrl();

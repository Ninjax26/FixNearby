import { useEffect, useState } from 'react';
import useToast from './useToast';
import { syncOfflineQueue } from '../services/offlineQueue';

export const useNetworkSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { showToast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast("Internet connection restored. Syncing offline changes...");
      syncOfflineQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast("You are offline. Operations will be queued locally.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  return { isOnline };
};

export default useNetworkSync;

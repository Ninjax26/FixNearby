import { useEffect, useState } from 'react';
import useToast from './useToast';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { addToast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addToast({
        id: Date.now().toString(),
        type: 'success',
        message: 'Internet connection restored. Syncing offline changes...',
      });
      // Process offline queue
      const queue = JSON.parse(localStorage.getItem('offline-mutations') || '[]');
      if (queue.length > 0) {
        localStorage.removeItem('offline-mutations');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      addToast({
        id: Date.now().toString(),
        type: 'warning',
        message: 'You are offline. Operations will be queued locally.',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addToast]);

  const queueRequest = (url, method, body) => {
    const queue = JSON.parse(localStorage.getItem('offline-mutations') || '[]');
    queue.push({ id: Date.now(), url, method, body });
    localStorage.setItem('offline-mutations', JSON.stringify(queue));
  };

  return { isOnline, queueRequest };
};

export default useOfflineSync;

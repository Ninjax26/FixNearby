import { useEffect } from 'react';

const BASE_TITLE = 'FixNearby - Local Service Discovery';

const useDocumentTitle = (title) => {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | FixNearby` : BASE_TITLE;
    return () => {
      document.title = prev;
    };
  }, [title]);
};

export default useDocumentTitle;

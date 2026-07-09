import { useContext } from 'react';
import { GlobalStateContext } from '../context/GlobalStateContext';

const useGlobalState = () => {
  const ctx = useContext(GlobalStateContext);
  if (!ctx) {
    throw new Error('useGlobalState must be used inside a <GlobalStateProvider>');
  }
  return ctx;
};

export default useGlobalState;

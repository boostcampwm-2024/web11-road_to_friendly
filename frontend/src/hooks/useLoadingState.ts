import { useState } from 'react';

export const useLoadingState = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [resultLoading, setResultLoading] = useState(false);

  const startResultLoading = () => setResultLoading(true);
  const finishResultLoading = () => setResultLoading(false);
  const finishInitialLoading = () => setInitialLoading(false);

  return {
    initialLoading,
    resultLoading,
    startResultLoading,
    finishResultLoading,
    finishInitialLoading
  };
};

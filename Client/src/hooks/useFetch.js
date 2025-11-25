import { useCallback, useEffect, useRef, useState } from 'react';

// Generic data fetch hook using axios
export function useFetch(endpointFn, params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  
  // Track params string to detect changes
  const paramsString = JSON.stringify(params);
  const prevParamsRef = useRef('');
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await endpointFn(params);
      setData(res.data);
      setHasFetched(true);
    } catch (err) {
      // Only log non-network errors to avoid console spam
      if (err.code !== 'ERR_NETWORK') {
        console.error('API Error:', err);
      }
      const errorMessage = err.code === 'ERR_NETWORK' 
        ? 'Cannot connect to server. Please make sure the backend is running.'
        : err?.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [endpointFn, paramsString]);

  useEffect(() => {
    // Only fetch if params have changed
    if (prevParamsRef.current !== paramsString) {
      prevParamsRef.current = paramsString;
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsString]);

  return { data, loading, error, refetch: fetchData, hasFetched };
}

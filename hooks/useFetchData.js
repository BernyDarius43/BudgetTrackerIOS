// hooks/useFetchData.js
import { useState, useEffect } from 'react';
import  fetchData  from '../services/api'; // import your API module
import { AxiosResponse } from 'axios';

const useFetchData = (url) => {
  const [data, setData] = useState<AxiosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // flag to prevent state updates after unmount

    fetchData(url)
      .then(data => {
        if (isMounted) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(function(e) {
        if (!isMounted) {
          setError(e);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetchData;

import {useState, useEffect} from 'react';
import axios from 'axios';

const useGet = (url, headers) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();

    axios.get(url, { headers: headers, cancelToken: cancelTokenSource.token })
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
        setError(null);
      }).catch((err) => {
        if(axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          setError(err.message);
          setIsLoading(false);
        }
      });
    
    return () => cancelTokenSource.cancel();
  }, [url]);

  return {data, isLoading, error};
};

export default useGet;
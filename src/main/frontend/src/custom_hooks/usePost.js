import {useState, useCallback} from 'react';
import axios from 'axios';

const usePost = ({url, payload, headers, entity}) => {
  const [response, setResponse] = useState({data: null, isLoading: false, error: null});

  const handlePost = useCallback(() => {
    setResponse({data: null, isLoading: true, error: null})
    axios.post(url, payload, headers)
    .then((res) => {
      console.log(`new ${entity} created`);
      console.log(res);
      setResponse({data: res.data, isLoading: false, error: null});
    })
    .catch((err) => {
      console.log(`error creating ${entity}`);
      console.log(err.message);
      console.log(response);
      setResponse({data: null, isLoading: false, error: err});
    });
  }, [url, payload, headers, response, entity]);

  return [response, handlePost];
};

export default usePost;
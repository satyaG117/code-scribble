import { useState , useEffect , useRef , useCallback } from 'react'

const useFetch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal : httpAbortCtrl.signal
            });

            const data = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            )

            if (!response.ok) {
                throw new Error(data.message);
            }

            setIsLoading(false);
            return data;
        } catch (err) {
            setIsLoading(false);
            setError(err.message);
            throw new Error(err.message);
        }
    }, [])

    const clearError = () =>{
        setError(null)
    }


    useEffect(()=>{
       return () =>{
        activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
       } 
    },[])

    return {
        isLoading,
        error,
        clearError,
        sendRequest
    }
}

export default useFetch;
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ScribbleList from "../components/ScribbleList"
import useFetch from "../../shared/hooks/useFetch";
import LoadingIcon from "../../shared/components/UIElements/LoadingIcon";

export default function Scribbles() {
    const [scribbles, setScribbles] = useState([]);
    const { sendRequest, error, isLoading , clearError } = useFetch()

    useEffect(() => {
        let responseData;
        const fetchScribbles = async () => {
            try {
                responseData = await sendRequest('http://localhost:8000/api/scribbles');
                setScribbles([...scribbles, ...responseData.scribbles])
                console.log(responseData.scribbles)
            } catch (err) {
            }
        }
        fetchScribbles();
    }, [])

    useEffect(() => {
        if (error) {
            toast(error);
            clearError();
        }
    }, [error])

    return (
        <div className="container">
            {scribbles.length > 0 && (<ScribbleList scribbles={scribbles} />)}
            {isLoading && (<div className="container d-flex justify-content-center"><LoadingIcon /></div>)}
        </div>
    )
}

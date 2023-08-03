import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ScribbleList from "../components/ScribbleList"
import useFetch from "../../shared/hooks/useFetch";
import LoadingIcon from "../../shared/components/UIElements/LoadingIcon";

export default function Scribbles() {
    const limit = 6;
    const [page, setPage] = useState(1);
    const [scribbles, setScribbles] = useState([]);
    const { sendRequest, error, isLoading, clearError } = useFetch()

    const fetchScribbles = async () => {
        let responseData;
        try {
            responseData = await sendRequest(`http://localhost:8000/api/scribbles?page=${page}&limit=${limit}`);
            setScribbles([...scribbles, ...responseData.scribbles])
            setPage(prevPage => prevPage + 1);
        } catch (err) {
        }
    }

    useEffect(() => {
        fetchScribbles();
    }, [])

    useEffect(() => {
        if (error) {
            toast(error);
            clearError();
        }
    }, [error])

    const handleLoadScribbles = ()=>{
        fetchScribbles();
    }

    return (
        <div className="container">
            {scribbles.length > 0 && (<ScribbleList scribbles={scribbles} />)}
            <div className="container m-3 p-2 d-flex justify-content-center">
                <button className="btn btn-outline-info btn-lg" disabled={isLoading} onClick={handleLoadScribbles}>Load more</button>

            </div>
            {isLoading && (<div className="container d-flex justify-content-center"><LoadingIcon /></div>)}
        </div>
    )
}

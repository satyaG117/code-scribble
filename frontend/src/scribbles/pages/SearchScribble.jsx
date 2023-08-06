import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useFetch from '../../shared/hooks/useFetch'
import TextInput from '../../shared/components/form-elements/TextInput'
import LoadingIcon from '../../shared/components/UIElements/LoadingIcon'
import ScribbleList from '../components/ScribbleList';

export default function SearchScribble() {
    const limit = 4;
    const { register, watch, handleSubmit } = useForm();
    const [searchParams, setSearchParams] = useState(null);
    const [scribbles, setScribbles] = useState([])
    const [page, setPage] = useState(1);
    const { sendRequest, error, clearError, isLoading } = useFetch();

    const inputValue = watch('term', '');

    const onSubmit = (data) => {
        setSearchParams(data);
        setScribbles([])
        // reset page no since search params changed
        setPage(1);
    }

    const fetchScribbles = async () => {
        let responseData;
        try {
            responseData = await sendRequest(`http://localhost:8000/api/scribbles/search?term=${searchParams.term}&page=${page}&limit=${limit}`);
            setScribbles([...scribbles, ...responseData.scribbles])
            setPage(prevPage => prevPage + 1);
        } catch (err) {
        }
    }

    const handleLoadScribbles = () => {
        fetchScribbles();
    }

    useEffect(() => {
        if (!searchParams) return;

        fetchScribbles();
    }, [searchParams])

    useEffect(() => {
        if (error) {
            toast(error);
            clearError();
        }
    }, [error])

    return (
        <>
            <div className="container mt-1">

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='row m-1'>
                        <div className='col-10'>
                            <TextInput
                                name="term"
                                placeholder='Search'
                                type="text"
                                register={register}
                            />
                        </div>
                        <div className='col-2'>
                            <button className='btn btn-info' disabled={!inputValue}>
                                Search
                            </button>
                        </div>
                    </div>
                </form>
                {scribbles.length > 0 && (<ScribbleList scribbles={scribbles} />)}
                <div className="container m-3 p-2 d-flex justify-content-center">
                    <button className="btn btn-outline-info btn-lg" disabled={isLoading} onClick={handleLoadScribbles}>Load more</button>
                </div>
                {isLoading && (
                    <div className='d-flex justify-content-center'>
                        <LoadingIcon />
                    </div>
                )}
            </div>
        </>
    )
}

import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useFetch from '../../shared/hooks/useFetch';
import TextArea from '../../shared/components/form-elements/TextArea';
import TextInput from '../../shared/components/form-elements/TextInput';
import { AuthContext } from '../../shared/contexts/AuthContext';
import LoadingIcon from '../../shared/components/UIElements/LoadingIcon';

export default function NewScribble() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext)

    const { register, handleSubmit ,formState: { errors } } = useForm();
    const { sendRequest, isLoading, error } = useFetch()

    const onSubmit = async (formInputs) => {
        try {
            const responseData = await sendRequest('http://localhost:8000/api/scribbles',
                'POST',
                JSON.stringify(formInputs),
                {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            )
            navigate(`/scribbles/${responseData.scribble._id}`);

        } catch (err) {

        }
    }
    useEffect(() => {
        if (error) {
            toast(error);
        }
    }, [error])

    return (
        <>
            {isLoading && (<LoadingIcon asOverlay={true} />)}
            <div className="bg-dark-blue shadow container col-lg-4 offset-lg-4 mt-5 p-3">
                <h2>Create a new scribble</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextInput
                        label="Title"
                        name="title"
                        placeholder='A title for the scribble'
                        type="text"
                        register={register}
                        constraints={{
                            required: 'Title is required',
                            minLength: {
                                value: 3,
                                message: 'Title should be atleast 3 characters long'
                            }
                        }}
                        error={errors.title}
                    />

                    <TextArea
                        label="Description"
                        name="description"
                        placeholder='Write a short description for your scribble'
                        register={register}
                        constraints={{
                            required: 'Required',
                        }}
                        rows="8"
                        cols="40"
                        error={errors.description}
                    />

                    <button className='btn btn-info'>Create</button>
                </form>

            </div>
        </>
    )
}

import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useFetch from '../../shared/hooks/useFetch';
import TextArea from '../../shared/components/form-elements/TextArea';
import TextInput from '../../shared/components/form-elements/TextInput';
import { AuthContext } from '../../shared/contexts/AuthContext';
import LoadingIcon from '../../shared/components/UIElements/LoadingIcon';
import BinaryChoiceModal from '../../shared/components/UIElements/BinaryChoiceModal';


export default function EditScribble() {
    const { scribbleId } = useParams();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { sendRequest, isLoading, error , clearError} = useFetch()
    const { sendRequest: sendUpdate, isLoading: isUpdating, error: errorWhileUpdate , clearError : clearUpdateError } = useFetch()


    useEffect(() => {
        const fetchScribbleData = async () => {
            let responseData;
            try {
                responseData = await sendRequest(`http://localhost:8000/api/scribbles/${scribbleId}`);
                setValue('title', responseData.scribble.title);
                setValue('description', responseData.scribble.description);
                // if not author then redirect
                if (responseData.author._id.toString() !== auth.userId) {
                    navigate('/');
                }
            } catch (err) {

            }
        }
        fetchScribbleData();
    }, [])


    const onSubmit = async (formInputs) => {
        try {
            await sendUpdate(`http://localhost:8000/api/scribbles/${scribbleId}`,
                'PATCH',
                JSON.stringify(formInputs),
                {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            )
            navigate(`/scribbles/${scribbleId}`);
        } catch (err) {

        }
    }

    useEffect(() => {
        if (errorWhileUpdate) {
            toast(errorWhileUpdate);
            clearUpdateError();
        }
    }, [errorWhileUpdate])

    const goBack = () => {
        clearError()
        navigate(-1);
    }

    const reloadPage = () => {
        clearError();
        window.location.reload();
    }

    return (
        <>
            <BinaryChoiceModal
                visible={error}
                title="ERROR!!!"
                message={error}
                onClose={goBack}
                onPrimaryAction={reloadPage}
                onSecondaryAction={goBack}
                primaryActionText="Retry"
                secondaryActionText="Go back"
            />
            {(isLoading || isUpdating) && (<LoadingIcon asOverlay={true} />)}
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

                    <button className='btn btn-info'>Edit</button>
                </form>

            </div>
        </>
    )
}

import { useForm } from 'react-hook-form'
import { Link , useNavigate } from 'react-router-dom';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext , useEffect } from 'react';


import useFetch from '../../shared/hooks/useFetch';
import TextInput from '../../shared/components/form-elements/TextInput'
import { AuthContext } from '../../shared/contexts/AuthContext';
import LoadingIcon from '../../shared/components/UIElements/LoadingIcon';

export default function Signup() {

    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { sendRequest, isLoading , error , clearError } = useFetch()

    const onSubmit = async (formInputs) => {
        let responseData;
        try {
            responseData = await sendRequest('http://localhost:8000/api/users/signup',
                'POST',
                JSON.stringify({
                    name : formInputs.name,
                    email: formInputs.email,
                    password: formInputs.password
                }),
                {
                    'Content-Type': 'application/json'
                }
            )

            auth.login(responseData.userId, responseData.token);
            navigate('/scribbles')
        } catch (err) {
            
        }
    }
    useEffect(()=>{
        if(error){
            toast(error);
            clearError();
        }
    },[error])
    return (
        <>
            {isLoading && (<LoadingIcon asOverlay={true} />)}
            <div className="bg-dark-blue container col-md-6 offset-md-3 col-lg-4 offset-lg-4 mt-5 p-3 shadow">
                <h2>Signup</h2>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextInput
                        label="Name"
                        name="name"
                        placeholder='Enter your name'
                        type="text"
                        register={register}
                        constraints={{
                            required: 'Name is required',
                        }}
                        error={errors.name}
                    />
                    <TextInput
                        label="Email"
                        name="email"
                        placeholder='Enter your email'
                        type="email"
                        register={register}
                        constraints={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: 'Invalid email address'
                            }
                        }}
                        error={errors.email}
                    />
                    <TextInput
                        label="Password"
                        name="password"
                        placeholder='Enter your Password'
                        type="password"
                        register={register}
                        constraints={{
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password should be atleast 6 characters long'
                            }
                        }}
                        error={errors.password}
                    />
                    <button className='btn btn-info'>Submit</button>
                </form>
                <hr />
                <span>Already have an account ? </span><Link to="/login"> Login </Link>
            </div>
        </>
    )
}

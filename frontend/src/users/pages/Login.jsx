import { useForm } from 'react-hook-form'
import { Link , useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useContext } from 'react';


import useFetch from '../../shared/hooks/useFetch';
import TextInput from '../../shared/components/form-elements/TextInput'
import { AuthContext } from '../../shared/contexts/AuthContext';
import LoadingIcon from '../../shared/components/UIElements/LoadingIcon';


export default function Login() {
    
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { sendRequest, isLoading , error , clearError } = useFetch()

    const onSubmit = async (formInputs) => {
        let responseData;
        try {
            responseData = await sendRequest('http://localhost:8000/api/users/login',
                'POST',
                JSON.stringify({
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
            // console.log(err.toString());
        }
    }
    useEffect(()=>{
        if(error){
            toast(error);
            clearError()
        }
    },[error])
    return (
        <>
            {isLoading && (<LoadingIcon asOverlay={true} />)}
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4 mt-5 p-3 bg-dark-blue shadow">
                <h2>Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                <span>Need an account ? </span><Link to="/signup"> Signup </Link>
            </div>
        </>
    )
}

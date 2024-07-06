import { useForm } from 'react-hook-form';
import { useNavigate,Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/user/userSlice';
import { jwtDecode } from 'jwt-decode';
import { useToast } from "@/components/ui/use-toast"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
const backendURI=import.meta.env.VITE_BACKEND_URI;
export default function SignIn() {
    const { toast } = useToast()
    const { register, handleSubmit, formState: { errors }} = useForm();
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const location=useLocation();
    useEffect(()=>{
        const token=localStorage.getItem('token');
        if(token){
            navigate('/');
        }
    },[])
    const onSubmit = handleSubmit(async (data) => {
        try {
            const {email,password}=data;
            const response = await fetch(`${backendURI}/api/auth/signIn`, {
                method: 'POST',
                credentials:'include',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({email,password})
            });
            if(response.ok){
                const result=await response.json();
                const decodedToken=jwtDecode(result.token);
                dispatch(setUser(decodedToken));
                localStorage.setItem('token', result.token);
                localStorage.setItem('refreshTime',Date.now()/1000);
                toast({
                    description: "Successfully signed In",
                  })
                setTimeout(() => {
                    navigate(location.state?.from?.pathname || '/');
                }, 3000);
            }
            else{
                const result=await response.json();
            
            }
    } catch (error) {
        throw new Error(error);
    }
    });
    return (
    <div className='flex justify-center items-center min-h-screen dark bg-zinc-200 '>
            <Card className="w-[350px] md:w-[450px] ">
                <CardHeader>
                    <CardTitle className='text-3xl text-center font-semibold py-2'>
                        Sign in
                    </CardTitle>
                    <CardContent>
                        <form className='flex flex-col gap-4' onSubmit={onSubmit}>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type='email'
                                placeholder='Enter your email'
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                            />
                            {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type='password'
                                placeholder='Enter your password'
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must have at least 6 characters'
                                    }
                                })}
                            />
                            {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                            <Button type='submit' className='w-full'>SUBMIT</Button>
                        </form>
                    </CardContent>
                </CardHeader>
                <CardFooter className='flex flex-col gap-2'>
                    <p className='px-2 underline'><Link to='/forgotPassword' >Forgot Password?</Link></p>
                    <p className='px-2'>Not Registered? <Link className='underline' to="/auth/signup">Create an Account </Link></p>
                </CardFooter>
            </Card>
        </div>
    )
}


import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
import signInImage from '/signinImage.jpg';
const backendURI=import.meta.env.VITE_BACKEND_URI;
export default function SignUp() {
    const { toast } = useToast()
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate=useNavigate();
    useEffect(()=>{
        const token=localStorage.getItem('token');
        if(token){
            navigate('/');
        }
    },[])
    const onSubmit = handleSubmit(async (data) => {
        try {
                const {firstName,lastName,email,password}=data;
                const response = await fetch(`${backendURI}/api/users/signUp`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({firstName,lastName,email,password})
                });
                if(response.ok){
                    const result=await response.json();
                    toast({
                        description: "Successfully Registered ",
                      })
                    setTimeout(() => {
                        navigate('/auth/signin');
                    }, 3000);
                }
                else{
                    const result=await response.json();
                }
        } catch (error) {
            throw new Error(error);
        }
    });
    const watchPassword = watch("password", "");

    return (
        <div className='flex justify-center items-center min-h-screen dark bg-zinc-200  bg-cover bg-center' style={{ backgroundImage: `url(${signInImage})` }}>
            <Card className="w-[350px] md:w-[450px] ">
                <CardHeader>
                    <CardTitle className='text-3xl text-center font-semibold py-2'>
                        Sign Up
                    </CardTitle>
                    <CardContent>
                        <form className='flex flex-col gap-4' onSubmit={onSubmit}>
                            <div className='flex gap-4'>
                                <div>
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        type='text'
                                        placeholder='Enter your first name'
                                        {...register('firstName', {
                                            required: 'First name is required'
                                        })}
                                    />
                                    {errors.firstName && <p className='text-red-500'>{errors.firstName.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        type='text'
                                        placeholder='Enter your last name'
                                        {...register('lastName',{
                                            required: 'last name is required'
                                        })}
                                    />
                                    {errors.lastName && <p className='text-red-500'>{errors.lastName.message}</p>}
                                </div>
                            </div>
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
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type='password'
                                placeholder='Confirm your password'
                                {...register('confirmPassword', {
                                    validate: value => value === watchPassword || "Passwords do not match"
                                })}
                            />
                            {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword.message}</p>}
                            <Button type='submit' className='w-full'>SUBMIT</Button>
                        </form>
                    </CardContent>
                </CardHeader>
                <CardFooter className='flex flex-col'>
                    <p className='px-2'>Already have an account? <Link className='underline' to="/auth/signin">Login</Link></p>
                </CardFooter>
            </Card>
        </div>
    )
}

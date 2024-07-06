import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast"
const backendURI=import.meta.env.VITE_BACKEND_URI;
export default function ResetPassword() {
    const {toast}=useToast();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch('password', ''); // Watching the password field

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${backendURI}/api/auth/resetPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, ...data }),
            });
            
            if (response.ok) {
                toast({
                    description: "Password changed Successfully",
                  })
                setTimeout(() => {
                    navigate('/auth/signin');
                }, 3000);
            } else {
                throw new Error('error')
            }
        } catch (error) {
            throw new Error(error)
        }
    };

    return (
        <div className='h-screen w-screen flex justify-center items-center dark'>
            <Card className='mx-2 w-full md:w-1/2 lg:w-1/4'>
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        <Label htmlFor='pass'>Enter new Password</Label>
                        <Input 
                            id='pass' 
                            type='password' 
                            {...register('password', { 
                                required: 'Password is required', 
                                minLength: { value: 6, message: 'Password must be at least 6 characters' } 
                            })} 
                        />
                        {errors.password && <p className='text-red-500'>{errors.password.message}</p>}

                        <Label htmlFor='confirmPass'>Confirm new Password</Label>
                        <Input 
                            id='confirmPass' 
                            type='password' 
                            {...register('confirmPassword', { 
                                required: 'Confirm password is required', 
                                validate: value => value === password || 'Passwords do not match' 
                            })} 
                        />
                        {errors.confirmPassword && <p className='text-red-500'>{errors.confirmPassword.message}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button type='submit' className='w-full'>Submit</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

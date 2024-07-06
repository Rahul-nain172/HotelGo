import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
const backendURI=import.meta.env.VITE_BACKEND_URI;
export default function ForgotPassword() {
    const {toast}=useToast();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [linkSent,setLinkSent]=useState(false);

    const onSubmit = async (data) => {
        try {
            setLinkSent(true);
            const response = await fetch(`${backendURI}/api/auth/forgotPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                toast({
                    description: "An Email containing Reset Password Link has been sent to your email address",
                  });
                  
            } else {
                toast({
                    description: "Email Not registered",
                  });
                  setLinkSent(false);
            }
        } catch (error) {
            throw new Error(error)
        }
    };

    return (
        <div className='h-screen w-screen flex justify-center items-center dark'>
            <Card className='mx-2 w-full md:w-1/2 lg:w-1/4'>
                <CardHeader>
                    <CardTitle>Enter Email</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        <label htmlFor='email'>Email</label>
                        <Input 
                            id='email' 
                            type='email' 
                            {...register('email', { 
                                required: 'Email is required', 
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })} 
                        />
                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button type='submit' className='w-full' disabled={linkSent}>Submit</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

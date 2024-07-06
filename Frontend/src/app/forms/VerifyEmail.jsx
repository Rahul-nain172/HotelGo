import React from 'react'
import { Button } from '@/components/ui/button'
import { useLocation } from 'react-router-dom'
const backendURI=import.meta.env.VITE_BACKEND_URI;
export default function verifyEmail() {
    const location=useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token=queryParams.get('token');
    const verifyEmail=async()=>{
        try{
            const response=await fetch(`${backendURI}/api/users/verifyEmail`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({token})
            });
            if(response.ok){
                console.log('email verified');
            }
            else {
                console.log('error in verifying Email');
            }
        }
        catch(error){
            throw new error(error);
        }
    }
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <Button onClick={verifyEmail}>Verify</Button>
    </div>
  )
}

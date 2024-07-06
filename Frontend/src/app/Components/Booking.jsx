import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function formatDateString(dateString) {
    const date = new Date(dateString);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsOfYear = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const day = daysOfWeek[date.getUTCDay()];
    const dayOfMonth = date.getUTCDate();
    const month = monthsOfYear[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${day}, ${dayOfMonth} ${month}, ${year}`;
}
const backendURI=import.meta.env.VITE_BACKEND_URI;
export default function Booking() {
    const navigate=useNavigate();
    const user=useSelector((state)=>state.user);
    const fetchBookings = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendURI}/api/booking/getBookings`, {
            method: 'Get',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }
    const { data: bookings, isLoading, error } = useQuery({
        queryKey: ['bookings'],
        queryFn: fetchBookings,
    });
    useEffect(()=>{
        if(!user.isLoggedIn){
            navigate('/auth/signin');
        }
    },[user])
    if (isLoading) return (<>Loading...</>)

    return (
        <div className='flex flex-col justify-center items-center my-6 gap-4'>
            <p className='text-xl md:text-2xl lg:text-3xl font-semibold'>Your Bookings</p>
            {bookings.map((booking,ind) => (
        
                <Card key={ind} className='w-full lg:w-1/2'>
                    <CardHeader>
                        <CardTitle>Order ID: {booking.orderId}</CardTitle>
                    </CardHeader>
                    <CardContent className='text-lg' >
                        <p className='flex justify-between'><span>Hotel Name: </span><span>{booking.hotelName}</span></p>
                        <p className='flex justify-between'><span>Check IN: </span><span>{formatDateString(booking.checkIn)}</span></p>
                        <p className='flex justify-between'><span>CHECK OUT: </span><span>{formatDateString(booking.checkOut)}</span></p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

import React, { useState } from 'react'
import ImageGallery from './ImageGallery';
import { FaStar } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Date_Picker } from './DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { saveAdultCount, saveCheckIn, saveCheckOut, saveChildCount } from '@/redux/search/searchSlice';
const backendURI=import.meta.env.VITE_BACKEND_URI;
console.log(backendURI);
export default function Hotelpage() {

    const { hotelId } = useParams();
    const searchOptions = useSelector((state) => state.searchOptions);
    const { isLoggedIn } = useSelector((state) => state.user);
    const [checkIn, setCheckIn] = useState(sessionStorage.getItem('checkIn'));
    const [checkOut, setCheckOut] = useState(sessionStorage.getItem('checkOut'));
    const [adultCount, setAdultCount] = useState(parseInt(parseInt(sessionStorage.getItem('adultCount')))||'');
    const [childCount, setChildCount] = useState(parseInt(parseInt(sessionStorage.getItem('childCount')))||'');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const fetchHotel = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendURI}/api/hotel/search/${hotelId}`);
        if (!response.ok) {
            throw new Error('Error in fetching hotel');
        }
        return response.json();
    }
    const { data: hotel, isLoading, error } = useQuery({
        queryKey: ['hotel'],
        queryFn: fetchHotel,
    });
    if (isLoading) return <div>loading....</div>;
    if (error) return <div>Error: {error.message}</div>;
    const calPrice=()=>{
        const totalNights = Math.ceil(new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 24 * 60 * 60);
        return totalNights*hotel.pricePerNight;
    }
    const bookNow = (event) => {
        event.preventDefault();
        sessionStorage.setItem('checkIn',checkIn);
        sessionStorage.setItem('checkOut',checkOut);
        sessionStorage.setItem('childCount',childCount);
        sessionStorage.setItem('adultCount',adultCount);
        navigate(`/bookHotel/${hotel._id}`);

        //displayRazorpay(hotel);


    }
    const signIn = (event) => {
        event.preventDefault();
        dispatch(saveCheckIn(checkIn));
        dispatch(saveCheckOut(checkOut));
        dispatch(saveChildCount(childCount));
        dispatch(saveAdultCount(adultCount));
        navigate('/auth/signIn', { state: { from: location } });
    }
    return (
        <div className='my-8'>
            <Card>
                <CardHeader className='p-0 flex my-4 items-center '>
                    <CardTitle className='text-xl md:text-2xl lg:text-3xl font-medium'>{hotel.name}</CardTitle>
                    <div className='flex mx-2'>{
                        Array.from({ length: hotel.starsRating }, (_, index) => (
                            <FaStar key={index} className='text-yellow-400' />
                        ))
                    }
                    </div>
                </CardHeader>
                <CardContent className='flex flex-col gap-4 p-2'>
                    <div className=''>
                        <ImageGallery images={hotel.imageUrls} />
                    </div>
                    <div className='grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-2 '>
                        <div className='lg:col-span-3 xl:col-span-4 border-2 py-4 px-2'>
                            <span className='font-medium text-xl lg:text-2xl '>Facilities Provided</span>
                            <div className='grid grid-cols-2 lg:grid-cols-4  justify-evenly gap-3 my-4 '> {hotel.facilities.map((facility, ind) => (
                                <span key={ind} className='rounded-lg flex md:text-lg lg:text-xl text-center items-center border border-solid px-2 bg-gray-300' style={{ fontWeight: '450' }}>{facility}</span>
                            ))}
                            </div>
                        </div>
                        <div className='flex flex-col gap-4 border-2 justify-center items-center py-4 px-4  '>
                            <div className='flex justify-between w-full  text-lg font-semibold'> <span >Per Night </span><span className=''>{calPrice()}</span></div>
                            <Date_Picker checkIn={checkIn} checkOut={checkOut} isCheckIn={true} func={setCheckIn} />
                            <Date_Picker checkIn={checkIn} checkOut={checkOut} isCheckIn={false} func={setCheckOut} />
                            <div className='flex gap-2'>
                                <Input type='number' min={0} placeholder='Adults' className='h-10 sm:w-24  bg-white placeholder:text-black'
                                    value={adultCount}
                                    onChange={(e) => setAdultCount(e.target.value)} />
                                <Input type='number' min={0} placeholder='Children' className='h-10 sm:w-24 bg-white placeholder:text-black '
                                    value={childCount}
                                    onChange={(e) => setChildCount(e.target.value)} />
                            </div>
                            {isLoggedIn ? <Button disabled={!checkIn||!checkOut||!childCount||!adultCount} className='w-full bg-orange-500' onClick={(e) => bookNow(e)}>Book Now</Button>
                                : <Button disabled={!checkIn||!checkOut||!childCount||!adultCount} className='w-full bg-blue-500' onClick={(e) => signIn(e)} >Sign in</Button>}
                        </div>
                    </div>
                    <div className='border-2 py-4 px-2 flex flex-col'>
                        <span className='font-medium text-xl lg:text-2xl '>Description</span>
                        <span className='my-4'>{hotel.description}</span>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}

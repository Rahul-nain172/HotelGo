import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import React, { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import logo from "/logo.png"
import { useToast } from '@/components/ui/use-toast';

const backendURI=import.meta.env.VITE_BACKEND_URI;
const createBooking = async (body) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${backendURI}/api/booking/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        throw new Error('Failed to add booking');
    }
    return res.json();
}
export default function BookHotel() {
    const {toast}=useToast();
    const user = useSelector((state) => state.user);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const param = useParams();
    const { hotelId } = param;
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
    const bookingMutation = useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast({
                description: "Booked Successfully ",
              })
            setTimeout(() => {
                navigate('/yourBookings');
            }, 3000);
        },
        onError: (error) => {
            throw new error(error);
        }

    })
    useEffect(() => {
        if (!user.isLoggedIn || !param) {
            navigate('/');
        }
    }, [])
    if (isLoading) return <div>loading....</div>;
    if (error) return <div>Error: {error.message}</div>;
    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };
    const displayRazorpay = async (hotel) => {
        const token = localStorage.getItem('token');
        try {
            const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                return;
            }

            const response = await fetch(`${backendURI}/api/payment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    amount: hotel.pricePerNight,
                    currency: 'INR',
                    receipt: 'receipt#1'
                })
            });
            if (!response.ok) {
                throw new Error('error in creating payment');
            }
            const data = await response.json();
            const { amount, id: order_id, currency } = data;
            const options = {
                key: import.meta.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: amount.toString(),
                currency: currency,
                name: 'Hotel Go',
                description: 'Test Transaction',
                image: logo,
                order_id: order_id,
                handler: async function (response) {
                    try {
                        const body = { ...response };
                        const res = await fetch(`${backendURI}/api/payment/validate`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(body)
                        });
                        if (res.ok) {
                            const data={hotelName:hotel.name,orderId:response.razorpay_order_id,checkIn:sessionStorage.getItem('checkIn'),checkOut:sessionStorage.getItem('checkOut')};
                            bookingMutation.mutate(data);
                        }
                        else{
                            throw new Error('error')
                        }
                    }
                    catch (error) {
                        throw new Error('error')
                    }

                },

                prefill: {
                    name: `${user.name}`,
                    email: `${user.email}`,
                    contact: `9999999999`,
                },
                notes: {
                    address: 'Hotel Go'
                },
                theme: {
                    color: '#3399cc'
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        }
        catch (error) {
            throw new Error(error)
        }
    };
    const bookNow = (event) => {
        event.preventDefault();
        displayRazorpay(hotel);

    }

    const location = hotel.name + ',' + hotel.city + ',' + hotel.country
    const checkIn = new Date(sessionStorage.getItem('checkIn') || '').toLocaleDateString();
    const checkOut = new Date(sessionStorage.getItem('checkOut') || '').toLocaleDateString();
    const childCount = parseInt(sessionStorage.getItem('childCount')) || 0;
    const adultCount = parseInt(sessionStorage.getItem('adultCount')) || 0;
    const totalNights = Math.ceil(new Date(sessionStorage.getItem('checkOut') || '').getTime() - new Date(sessionStorage.getItem('checkIn') || '').getTime()) / (1000 * 24 * 60 * 60);
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl'>Booking Page</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex justify-center '>
                        <div className='flex flex-col border-4 p-4 gap-2  w-full md:w-1/2'>
                            <p className='text-lg font-semibold text-center'>Your Booking Details</p>
                            <div className='border-2 p-2'>
                                <p className='text-lg font-semibold'>Name</p>
                                <p>{user.name}</p>
                            </div>
                            <div className='border-2 p-2'>
                                <p className='text-lg font-semibold'>Email</p>
                                <p>{user.email}</p>
                            </div>
                            <div className='border-2 p-2'>
                                <p className='text-lg font-semibold'>Hotel Location</p>
                                <p>{location}</p>
                            </div>
                            <div className='border-2 p-2'>
                                <p className='text-lg font-semibold'>Check In & Out</p>
                                <div className='flex flex-col'>
                                    <p className='flex justify-between'><span>Check-in:</span> <span>{checkIn}</span></p>
                                    <p className='flex justify-between'><span>Check-out:</span> <span>{checkOut}</span></p>
                                </div>
                            </div>
                            <div className='border-2 p-2'>
                                <p className='text-lg font-semibold'>Guest Info</p>
                                <div className='flex flex-col justify-between '>
                                    <p className='flex justify-between'><span>Child Count: </span><span>{childCount}</span></p>
                                    <p className='flex justify-between'><span>Adult Count: </span><span>{adultCount}</span></p>
                                </div>
                            </div>
                            <div className='border-2 p-2'>
                                <p className='text-lg font-semibold'>Duration of Stay</p>
                                <p>{totalNights}</p>
                            </div>
                            <div className='border-2 p-2'>
                                <p className='text-lg font-semibold'>Price</p>
                                <p className='font-bold'>{totalNights*hotel.pricePerNight} $</p>
                            </div>
                        </div>

                    </div>

                </CardContent>
                <CardFooter className='justify-center'>
                    <Button onClick={(e) => bookNow(e)}>Confirm & Pay</Button>
                </CardFooter>
            </Card>

        </div>
    )
}

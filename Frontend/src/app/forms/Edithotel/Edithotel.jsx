import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AddHotel from '../Addhotel/Addhotel';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
const backendURI=import.meta.env.VITE_BACKEND_URI;
export default function Edithotel() {
    const params=useParams();
    const {hotelId}=params;
    const user=useSelector((state)=>state.user);
    const navigate=useNavigate();
    useEffect(()=>{
      if(!user||user.isAdmin===false){
        navigate('/');
      }
    },[navigate,user])
    const fetchHotel = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendURI}/api/hotel/getHotel/${hotelId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      };
      const { data: hotel, error, isLoading } = useQuery({
        queryKey: ['hotel'],
        queryFn: fetchHotel,
      });
  return (
    <>
    <AddHotel hotel={hotel}/>
    </>
  )
}

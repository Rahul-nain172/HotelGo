import {useEffect}from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const backendURI=import.meta.env.VITE_BACKEND_URI;
export default function ViewHotels() {
  const user=useSelector((state)=>state.user);
  const queryClient = useQueryClient();
  const navigate=useNavigate();
  useEffect(()=>{
    if(!user||user.isAdmin===false){
      navigate('/');
    }
  },[navigate,user])
  const fetchHotels = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${backendURI}/api/hotel/getHotels`, {
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
  const { data: hotels, error, isLoading } = useQuery({
    queryKey: ['hotels'],
    queryFn: fetchHotels,
  });
  const deleteHotel=async(hotelId)=>{
    const token = localStorage.getItem('token');
    const response=await fetch(`${backendURI}/api/hotel/deleteHotel`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'authorization':`bearer ${token}`
      },
      body:JSON.stringify({hotelId})
    })
    return response.json();
  }
  const hotelMutation = useMutation({
    mutationFn: deleteHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
    },
    onError: (error) => {
      throw new Error(error);
    }
  });
  if (isLoading) {
    return (
      <div className='dark flex flex-col gap-8 w-screen my-5'>
        <div className='flex justify-between mx-5 md:mx-12'>
          <div className='font-bold text-4xl'>Manage Hotels</div>
          <Button className='p-1 h-12 w-18 font-medium text-lg'><FaPlus />Add New</Button>
        </div>
        {[1, 2, 3].map((_, index) => (
          <Card className="mx-5 md:mx-12 font-display" key={index}>
            <CardHeader className='flex flex-col gap-4'>
              <CardTitle className='text-3xl'>
                <Skeleton className='h-8 w-3/4' />
              </CardTitle>
              <CardDescription className='text-xl'>
                <Skeleton className='h-6 w-5/6' />
              </CardDescription>
            </CardHeader>
            <CardContent className='flex justify-between text-lg'>
              <div className='grid grid-cols-1 gap-3 w-2/3 items-center md:grid-cols-2 lg:grid-cols-3'>
                <Skeleton className='h-16 w-full rounded-md' />
                <Skeleton className='h-16 w-full rounded-md' />
                <Skeleton className='h-16 w-full rounded-md' />
              </div>
              <div className='flex flex-col justify-between gap-10'>
                <Skeleton className='h-16 w-16 rounded-full' />
                <Skeleton className='h-16 w-16 rounded-full' />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className=' dark flex flex-col gap-8 w-screen my-5'>
      <div className=' flex justify-between mx-5  md:mx-12  '> 
        <div className='font-bold text-2xl md:text-3xl lg:text-4xl'>Manage Hotels</div>
        <Link to='/updateHotel/addHotel'><Button className='p-1 h-12 w-18 font-medium text-md md:text-lg'><FaPlus/>Add New</Button></Link>
      </div>
        {hotels&&hotels.map((hotel, index) => (
          <Card className=" mx-5 md:mx-12  font-display">
            <CardHeader className='flex flex-col gap-4' >
              <CardTitle className='text-xl md:text-2xl lg:text-3xl'>
                {hotel.name}
              </CardTitle>
              <CardDescription className='md:text-xl'>
                Description: {hotel.description}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex  justify-between sm:text-sm md:text-md lg:text-lg' >
              <div className='grid grid-cols-1 gap-3 w-2/3 items-center md:grid-cols-2 lg:grid-cols-3'>
                <div className='flex justify-evenly items-center rounded-md border border-solid text-center h-16 '><span>Price:</span><span>$ {hotel.pricePerNight}</span></div>
                <div className='flex justify-evenly items-center rounded-md border border-solid text-center h-16'><span>Type :</span><span>{hotel.type}</span></div>
                <div className='flex justify-center items-center rounded-md border border-solid text-center h-16'><FaRegStar/>{hotel.starsRating} Star</div>
              </div>
              <div className='flex flex-col justify-between gap-10'>
                <Link to={`/updateHotel/editHotel/${hotel._id}`} ><Button variant="ghost" className='p-0 rounded-full h-10 w-10  md:h-12 md:w-12'><FiEdit className='h-6 w-6 md:h-8 md:w-8 ' /> </Button></Link>
                <Button variant="ghost" className='p-0 rounded-full h-10 w-10 md:h-12 md:w-12' onClick={(e)=>{e.preventDefault;hotelMutation.mutate(hotel._id)}}><RiDeleteBin6Line className='h-6 w-6 md:h-8 md:w-8  ' /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

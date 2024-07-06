import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { FaStar } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { setSearchResults } from '@/redux/searchResult/searchResultsSlice';
import { saveSortOption } from '@/redux/search/searchSlice';
const backendURI=import.meta.env.VITE_BACKEND_URI;
export default function Hotels() {
    const { hotels,count } = useSelector((state) => state.searchResults);
    const dispatch=useDispatch();
    const searchOptions = useSelector((state) => state.searchOptions);
    const fetchSearch = async () => {
        console.log('fetching....',searchOptions)
        const queryParams = new URLSearchParams();
        queryParams.append("destination", searchOptions.destination || "");
        queryParams.append("checkIn", searchOptions.checkIn || "");
        queryParams.append("checkOut", searchOptions.checkOut || "");
        queryParams.append("adultCount", searchOptions.adultCount || "");
        queryParams.append("childCount", searchOptions.childCount || "");
        queryParams.append("page", searchOptions.page || "");
        queryParams.append("minPrice",searchOptions.minPrice||'0');
        queryParams.append("maxPrice",searchOptions.maxPrice||'1000');
        queryParams.append("sortOption",searchOptions.sortOption||"");
        searchOptions.stars?.forEach((star)=>queryParams.append("stars",star));
        searchOptions.facilities?.forEach((facility)=>queryParams.append("facilities",facility));
        searchOptions.types?.forEach((type)=>queryParams.append("types",type));
        // console.log(searchOptions);
        const token = localStorage.getItem('token');
        const response = await fetch(`${backendURI}/api/hotel/search?${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            return response.json();
        }
        if (!response.ok) {
            throw new Error('Failed to Search hotels');
        }
    }
    const { data, error, isLoading} = useQuery({
        queryKey: ['hotelss',searchOptions],
        queryFn: fetchSearch,
    });
    useEffect(()=>{
        if(data){
            console.log('data fetched: ',data)
            dispatch(setSearchResults(data));
        }
    },[data])

    const truncateText = (text, maxWords) => {
        const words = text.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return text;
    };
    const getFirst3 = (facilities) => {
        let len = facilities.length;
        return facilities.slice(0, Math.min(len, 3))
    }
    if (isLoading) return <div>loading....</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!hotels) {
        return <div>No Hotel Found</div>
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-between'>
                <span className='flex justify-center items-center text-center text-md font-semibold lg:text-lg'>Showing {count} Results</span>
                <span>
                    <select defaultValue={"SortBy"}
                        className="block w-full h-12 my-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e)=>{e.preventDefault();console.log('saving...',e.target.value);dispatch(saveSortOption(e.target.value))}}>
                        <option value="" >Sort By</option>
                        <option value="pricePerNightDesc" >Price High to Low</option>
                        <option value="pricePerNightAsc">Price Low to High</option>
                        <option value="starsRatingDesc">Rating High to Low</option>
                        <option value="starsRatingAsc">Rating Low to High</option>
                    </select>
                </span>
            </div>
            {
                hotels.map((hotel, ind) => (
                    <Card className='lg:px-4 pt-5' key={ind}>
                        <CardContent className='p-0 grid grid-cols-1 lg:grid-cols-2'>
                            <div className='flex justify-center my-2 mx-4'>
                                <img className='object-cover h-72 w-full  xl:h-auto xl:w-full' src={hotel.imageUrls[0]}></img>
                            </div>
                            <div className='flex flex-col px-2'>
                                <div className='flex '>{
                                    Array.from({ length: hotel.starsRating }, (_, index) => (
                                        <FaStar key={index} className='text-yellow-400' />
                                    ))
                                }
                                </div>
                                <div className='flex justify-between'>
                                    <span className='md:text-lg lg:text-xl font-semibold'>{hotel.name}</span>
                                    <div className='border border-solid rounded-lg border-yellow-400 bg-yellow-100 px-2 '>
                                        <span className="w-2 h-2 rounded-full bg-yellow-600 inline-block mr-1"></span>
                                        <span className=''>{hotel.type}</span>
                                    </div>
                                </div>

                                <span className='lg:text-lg' style={{ fontWeight: '450' }}>Price Per Night: ${hotel.pricePerNight}</span>
                                <span className='mt-8 text-sm lg:text-md'>{truncateText(hotel.description, 80)}</span>
                            </div>
                        </CardContent>
                        <CardFooter className='flex flex-col gap-2 lg:flex-row lg:justify-between'>
                            <div className='flex gap-3 mt-4 justify-start'>
                                {getFirst3(hotel.facilities.map((facility, ind) => (
                                    <span key={ind} className='rounded-lg flex text-sm lg:text-md text-center items-center border border-solid px-2 bg-gray-300' style={{ fontWeight: '450' }}>{facility}</span>
                                )))}
                                {hotel.facilities.length > 3 && (<span className='text-sm lg:text-md'>+ {hotel.facilities.length - 3} more</span>)}
                            </div>
                            <Link to={`/hotel/${hotel._id}`}><Button className='flex justify-center w-32  '>View</Button></Link>
                        </CardFooter>
                    </Card>
                ))
            }
        </div>
    )
}

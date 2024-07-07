import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { MdLocationCity } from "react-icons/md";
import { Date_Picker } from './DatePicker';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchResults} from '@/redux/searchResult/searchResultsSlice';
import { saveDestination,saveCheckIn,saveCheckOut,saveAdultCount,saveChildCount, saveHotelId, saveSortOption, resetSearchOption } from '@/redux/search/searchSlice';
export default function SearchBar() {

    const searchOptions = useSelector((state) => state.searchOptions);
    const dispatch = useDispatch();
    const [destination,setDestination]=useState(searchOptions.destination);
    const [adultCount,setAdultCount]=useState(searchOptions.adultCount);
    const [childCount,setChildCount]=useState(searchOptions.childCount);
    const [checkIn,setCheckIn]=useState(searchOptions.checkIn);
    const [checkOut,setCheckOut]=useState(searchOptions.checkOut);
    const search = async (event) => {
        event.preventDefault();
        dispatch(saveAdultCount(adultCount));
        dispatch(saveCheckIn(checkIn));
        dispatch(saveCheckOut(checkOut))
        dispatch(saveDestination(destination));
        dispatch(saveChildCount(childCount))
        sessionStorage.setItem('checkIn',checkIn);
        sessionStorage.setItem('checkOut',checkOut);
        sessionStorage.setItem('childCount',childCount);
        sessionStorage.setItem('adultCount',adultCount);
        dispatch(saveSortOption())
        // await fetchSearch();

    }
    const clear = (event) => {
        event.preventDefault();
        setDestination('');
        setAdultCount(0);
        setChildCount(0);
        setCheckIn('');
        setCheckOut('');

        dispatch(resetSearchOption());
    }
    return (
        <form className='py-3 px-1 my-4  sm:my-8 dark bg-orange-300 grid items-center sm:grid-cols-2 md:grid-cols-3 md:justify-center  xl:grid-cols-5 md:gap-3 sm:min-h-28'
            onSubmit={(event) => search(event)}>
            <div className=" flex justify-center items-center mb-4 md:mb-0">
                <MdLocationCity className='h-8 w-8' />
                <Input
                    type="text"
                    placeholder="Search Destination"
                    className=" pr-4 py-2  border-none placeholder:text-black bg-white rounded-md h-10  sm:w-52 "
                    value={destination}
                    onChange={(e)=>setDestination(e.target.value)}
                />
            </div>
            <div className='flex gap-2 mx-4 justify-evenly'>
                <div className=" flex items-center mb-4 md:mb-0">
                    <Input type='number' min={0} placeholder='Adults' className='h-10 sm:w-24  border-none bg-white placeholder:text-black'
                    value={adultCount}
                    onChange={(e)=>setAdultCount(e.target.value)} />
                </div>
                <div className="flex items-center mb-4 md:mb-0">
                    <Input type='number' min={0} placeholder='Children' className='h-10 sm:w-24 border-none bg-white placeholder:text-black '
                    value={childCount}
                    onChange={(e)=>setChildCount(e.target.value)}  />
                </div>
            </div>
            <div className="flex items-center mb-4 mr-2 md:mb-0">
                <Date_Picker checkIn={checkIn} checkOut={checkOut} isCheckIn={true} func={setCheckIn} />
            </div>
            <div className="flex items-center mb-4 mr-2 md:mb-0">
                <Date_Picker checkIn={checkIn} checkOut={checkOut} isCheckIn={false} func={setCheckOut} />
            </div>
            <div className="flex gap-2 mx-4 justify-evenly" >
                <Button className='w-24 bg-green-500'>Search</Button>
                <Button className='w-24 bg-red-500' onClick={(event)=>clear(event)}>Clear</Button>
            </div>
        </form>

    )
}

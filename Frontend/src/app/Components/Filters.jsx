import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label';
import { FaStar } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { addFacility, addStar, addType, removeFacility, removeStar, removeType, setMinPrice,setMaxPrice } from '@/redux/search/searchSlice';
export default function Filters() {
    const dispatch = useDispatch();
    const { stars, facilities, types, minPrice, maxPrice } = useSelector((state) => state.searchOptions);
    const hotelFacilities = [
        'WiFi',
        'Parking',
        'Swimming Pool',
        'Gym/Fitness Center',
        'Restaurant',
        'Bar/Lounge',
        'Spa/Wellness Center',
        'Room Service',
        'Air Conditioning',
        'Pet-friendly',
        'Family Rooms',
        'Business Center',
        'Conference Facilities',
        'Laundry Service',
        'Airport Shuttle'
    ];
    const hotelTypes = ['Budget', 'Boutique', 'Luxury', 'Ski Resort', 'Business', 'Familiy', 'Romantic', 'Hiking Resort', 'Cabin', 'Beach Resort', 'Golf Resort', 'Motel', 'All Inclusive', 'Pet Friendly', 'Self Catering'];
    const Ratings = ['1', '2', '3', '4', '5'];
    const changeFacilities = (event) => {
        //event.preventDefault();
        const facility = event.target.value;
        const checked = event.target.checked;
        if (checked) dispatch(addFacility(facility));
        else dispatch(removeFacility(facility));

    }
    const changeStars = (event) => {
        const star = event.target.value;
        const checked = event.target.checked;
        if (checked) dispatch(addStar(star));
        else dispatch(removeStar(star));
    }
    const changeTypes = (event) => {
        const type = event.target.value;
        const checked = event.target.checked;
        if (checked) dispatch(addType(type));
        else dispatch(removeType(type));
    }
    const changePrice = (event) => {
        console.log('cliked', event.target.value)
        setPrice(event.target.value)
    }
    return (
        <div className='flex flex-col gap-4 rounded-lg border border-solid p-4 justify-center lg:w-56 xl:w-full'>
            <div className='text-lg font-semibold'>Filters</div>
            <div className=' border border-solid border-gray-600  mb-4 ' ></div>
            <Card>
                <CardHeader>
                    <CardTitle>Price</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col '>
                    <div className='flex flex-col xl:flex-row'>
                        <div className='flex justify-center items-center'>
                            <Label htmlFor='min' className='sm:text-md'>Min</Label>
                            <input id='min' type="number" value={minPrice} onChange={(e)=>dispatch(setMinPrice(e.target.value))} className='w-16 h-8 border border-slate-400  text-center mx-1 rounded-lg'/>
                        </div>
                        <div className='mx-4 flex justify-center items-center'>-</div>
                        <div className='flex justify-center items-center'>
                            <Label htmlFor='max' className='sm:text-md'>Max</Label>
                            <input type="number" value={maxPrice} onChange={(e)=>dispatch(setMaxPrice(e.target.value))} className='w-16 h-8 border border-slate-400  text-center mx-1 rounded-lg'/>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Facilities</CardTitle>
                </CardHeader>
                <CardContent className='flex justify-start '>
                    <div className='flex flex-col justify-start gap-2'>
                        {hotelFacilities.map((facility, index) => (<div className='flex gap-1'>
                            <input
                                id={`facility-${index}`}
                                type='checkbox'
                                value={facility}
                                checked={facilities.includes(facility)}
                                onChange={(e) => changeFacilities(e)}
                            />
                            <Label htmlFor={`facility-${index}`}>{facility}</Label>
                        </div>))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col justify-start gap-2'>
                        {Ratings.map((rating, index) => (<div className='flex gap-1'><input
                            id={`rating-${index}`}
                            type='checkbox'
                            value={rating}
                            checked={stars.includes(rating)}
                            onChange={(e) => changeStars(e)} />
                            <Label htmlFor={`rating-${index}`} className='flex'>{rating} <FaStar className='text-yellow-400' /></Label>
                        </div>))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Types</CardTitle>
                </CardHeader>
                <CardContent className='flex justify-start '>
                    <div className='flex flex-col justify-start gap-2'>
                        {hotelTypes.map((type, index) => (<div className='flex gap-1'><input
                            id={`type-${index}`}
                            value={type}
                            type='checkbox'
                            checked={types.includes(type)}
                            onChange={(e) => changeTypes(e)} />
                            <Label htmlFor={`type-${index}`}>{type}</Label>
                        </div>))}
                    </div>
                </CardContent>
            </Card>
        </div>

    )
}

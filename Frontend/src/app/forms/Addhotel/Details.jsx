import { useFormContext } from 'react-hook-form'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Details() {
    const { register, watch, formState: { errors }, setValue } = useFormContext();
    const typeWatch = watch('type');
    const hotelTypes = ['Budget', 'Boutique', 'Luxury', 'Ski Resort', 'Business', 'Familiy', 'Romantic', 'Hiking Resort', 'Cabin', 'Beach Resort', 'Golf Resort', 'Motel', 'All Inclusive', 'Pet Friendly', 'Self Catering'];
    return (
        <Card  >
            <CardHeader>
                <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Label htmlFor="pricePerNight">Enter Price Per Night</Label>
                <Input

                    id="name"
                    type="number"
                    min={1}
                    placeholder="price (in $)"
                    className='h-12 my-2'
                    {...register('pricePerNight', {
                        required: 'pricePerNight is required'
                    })}
                />
                {errors.pricePerNight && <p className='text-red-500'>{errors.pricePerNight.message}</p>}
                <Label htmlFor="starsRating">Select Star Rating</Label>
                <select
                    class="block w-full h-12 my-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    {...register('starsRating', {
                        required: 'starsRating is required'
                    })}>
                    <option value="" selected>Select star rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Star</option>
                    <option value="3">3 Star</option>
                    <option value="4">4 Star</option>
                    <option value="5">5 Star</option>
                </select>
                {errors.starsRating && <p className='text-red-500 text-sm mt-1'>{errors.starsRating.message}</p>}


                <Label htmlFor="type">Select Type</Label>
                <div className='grid grid-cols-2 my-2 md:grid-cols-5 min-h-[150px]'>
                    {
                        hotelTypes.map((type, index) => (
                            <label key={index} className={
                                typeWatch === type ? 'cursor-pointer bg-orange-300 flex text-sm rounded-full mx-4 my-1 font-semibold justify-center items-center' :
                                    'cursor-pointer flex  text-sm rounded-full mx-4 my-1  justify-center items-center'
                            }>
                                <input
                                    type='radio' value={type}
                                    className='hidden'
                                    {...register("type", {
                                        required: "type is required"
                                    })}>

                                </input>

                                <span>{type}</span>
                            </label>
                        ))
                    }
                </div>
                {errors.type && <p className='text-red-500'>{errors.type.message}</p>}
            </CardContent>
        </Card>
    )
}

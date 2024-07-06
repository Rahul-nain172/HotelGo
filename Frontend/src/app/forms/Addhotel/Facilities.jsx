import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function Facilities() {
    const { register, formState: { errors } } = useFormContext();
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Facilities</CardTitle>
            </CardHeader>
            <CardContent>
                <Label htmlFor="facilities">Choose Facilities</Label>
                <div className='grid grid-cols-2 md:grid-cols-5 gap-3 my-3'>
                    {hotelFacilities.map((facility, index) => (
                        <div key={index}>
                            <input
                                type='checkbox'
                                id={`facility-${index}`}
                                value={facility}
                                className=''
                                {...register("facilities", {
                                    validate: (facilities) => {
                                      if (facilities && facilities.length > 0) {
                                        return true;
                                      } else {
                                        return "At least one facility is required";
                                      }
                                    },
                                  })}
                            />
                            <label
                                htmlFor={`facility-${index}`}
                                className="mx-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {facility}
                            </label>
                        </div>
                    ))}
                </div>
                {errors.facilities && <p className='text-red-500'>{errors.facilities.message}</p>}
            </CardContent>
        </Card>
    );
}

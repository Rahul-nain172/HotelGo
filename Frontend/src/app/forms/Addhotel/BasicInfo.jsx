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
import { Button } from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea'
export default function BasicInfo() {
    const {register,formState:{errors}}=useFormContext();
  return (
    <Card>
        <CardHeader>
            <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
        <Label htmlFor="name">Enter Hotel Name</Label>
            <Input 
                id="name"
                type="text"
                placeholder="hotel name"
                className='h-12 my-2'
                {...register('name',{
                    required: 'name is required'
                })}
            />
            {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
            <Label htmlFor="">Enter City</Label>
            <Input 
                id="city"
                type="text"
                placeholder="city name"
                className='h-12 my-2'
                {...register('city',{
                    required: 'city is required'
                })}
            />
            {errors.city && <p className='text-red-500'>{errors.city.message}</p>}
            <Label htmlFor="country">Enter Country</Label>
            <Input 
                id="country"
                type="text"
                placeholder="country name"
                className='h-12 my-2'
                {...register('country',{
                    required: 'country is required'
                })}
            />
            {errors.country && <p className='text-red-500'>{errors.country.message}</p>}
            <Label htmlFor="description">Enter Description</Label>
            <Textarea 
                id="description"
                type="text"
                placeholder="write description"
                className='h-32 my-2'
                {...register('description',{
                    required: 'description is required'
                })}
            />
            {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
        </CardContent>
    </Card>
  )
}

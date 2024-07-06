
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
export default function GuestInfo() {
    const {register,formState:{errors}}=useFormContext();
  return (
    <Card>
        <CardHeader>
            <CardTitle>Guest Information</CardTitle>
        </CardHeader>
        <CardContent>
        <Label htmlFor="name">Enter Adult Count</Label>
            <Input 
                id="adultCount"
                type="number"
                placeholder="adult"
                className='h-12 my-2'
                {...register('adultCount',{
                    required: 'adultCount is required'
                })}
            />
             {errors.adultCount && <p className='text-red-500'>{errors.adultCount.message}</p>}
            <Label htmlFor="">Enter Child Count</Label>
            <Input 
                id="childCount"
                type="number"
                placeholder="child"
                className='h-12 my-2'
                {...register('childCount',{
                    required: 'childCount is required'
                })}
            />
             {errors.childCount && <p className='text-red-500'>{errors.childCount.message}</p>}
        </CardContent>
    </Card>
  )
}

import { set, useFormContext } from 'react-hook-form'
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
import { Textarea } from '@/components/ui/textarea'
import { RiDeleteBin6Line } from 'react-icons/ri';
export default function Image() {
    const { register, formState: { errors }, watch,setValue } = useFormContext();
    const existingImageUrls = watch("imageUrls");
    const deleteImage=(event,url)=>{
        event.preventDefault();
        console.log('clicked');
        setValue("imageUrls",existingImageUrls.filter((imageUrl)=>imageUrl!==url))
    }
    console.log(existingImageUrls);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Images</CardTitle>
            </CardHeader>
            <CardContent>

                    {
        existingImageUrls && (
            <div className='grid grid-cols-2 md:grid-cols-6 gap-1'>
            {existingImageUrls.map((url, index) => (
                <div key={index} className='relative group flex justify-center items-center mx-2'>
                <span className='min-h-full w-full'>
                    <img src={url} className='w-full h-24 sm:h-32 lg:max-h-32 object-cover group-hover:opacity-10' />
                </span>
                <button onClick={(event)=>deleteImage(event,url)} className=' absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100'>
                   <RiDeleteBin6Line className='h-6 w-6 md:h-8 md:w-8'/>
                </button>
                </div>
            ))}
            </div>
        )
        }

                <input
                    id="imageFiles"
                    type="file"
                    name="imageFiles"
                    accept="image/*"
                    multiple
                    className='h-12 my-2'
                    {...register("imageFiles", {
                        validate: (imageFiles) => {
                            let len = imageFiles.length+(existingImageUrls?.length||0);
                            if (len == 0) {
                                return "Select atleast one Image";
                            }
                            else if (len > 6) {
                                return "Number of Images can't be more than 6"
                            }
                        }
                    })}

                />
                {errors.imageFiles && <p className='text-red-500'>{errors.imageFiles.message}</p>}
            </CardContent>
        </Card>
    )
}

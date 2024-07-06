import React, { useState } from 'react';
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
const ImageGallery = ({ images }) => {
    const [selectedIndex,setSelectedIndex]=useState(0);
    const handlePrev=()=>{
        const len=images.length;
        setSelectedIndex((prev)=>(prev-1+len)%len)
    }
    const handleNext=()=>{
        const len=images.length;
        setSelectedIndex((prev)=>(prev+1)%len)
    }
  return (
    <div className='grid md:grid-cols-7'>
        <div id='preview' className='hidden md:flex md:flex-col md:gap-2 md:mr-1'>
            {images.map((url,index)=>(
                <span className={` border-black ${selectedIndex===index?'border-4':'border-none'} cursor-pointer`} 
                onClick={()=>setSelectedIndex(index)}>
                    <img className='max-h-36 w-full' src={url} alt=""  />
                </span>
            ))}
        </div>
        <div className='md:col-span-6 flex justify-center items-center gap-0 relative '>
            <span className='absolute left-0  rounded-full bg-gray-500 p-2 cursor-pointer' onClick={handlePrev}><GrPrevious className='text-white w-6 h-6 md:w-8 md:h-8'/></span>
            <img src={images[selectedIndex]} alt="" className='h-72 w-auto md:h-[800px]  md:w-3/4 md:rounded-xl object-cover' />
            <span className='absolute right-0 rounded-full bg-gray-500 p-2 cursor-pointer' onClick={handleNext}><GrNext className='text-white w-6 h-6 md:w-8 md:h-8'/></span>
        </div>
    </div>
  );
};

export default ImageGallery;

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
export default function Footer() {
  return (
    <div className='h-44 bg-black flex flex-col justify-center items-center gap-2' >
        <Label htmlFor="email" className='text-white text-2xl text-center'>Subscribe to our NewsLetter</Label>
    <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="email" placeholder="Email" className='text-white' />
        <Button type="submit">Subscribe</Button>
    </div>
    </div>
  )
}

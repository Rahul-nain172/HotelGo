import React from 'react'
import logo from "/logo.png"
import { FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { resetUser } from '@/redux/user/userSlice';
import { useSelector,useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
const backendURI=import.meta.env.VITE_BACKEND_URI;
export default function Navbar() {
  const user=useSelector((state)=>state.user);
  const dispatch=useDispatch();
  const signOut = async () => {
    const token=localStorage.getItem('token');
    try {
        const response = await fetch(`${backendURI}/api/auth/signOut`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        if (response.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshTime');
            dispatch(resetUser());
        }
    }
    catch (error) {
      throw new Error(error);
    }
}
  const handleMenu = () => {
    const navdialog = document.getElementById('navdialog');
    navdialog.classList.toggle('hidden');
  }
  return (
    <>
    <nav className=" dark bg-black  p-3 flex justify-between text-white ">
      <div className='flex items-center gap-2 flex-1'>
        <img className='object-cover  max-w-12 max-h-12 ' src={logo} alt="Image lagegi " />
        <Link to='/'><span className="text-2xl md:text-3xl lg:text-4xl font-bold font-display ">Hotel Go</span></Link>
      </div>
      <div className='hidden md:flex gap-12 items-center font-display'>
       {user.isAdmin&&<span><Link to='/manageHotels'>Manage Hotels </Link></span>}
        <span><Link to='yourBookings'>Your Bookings </Link> </span>
        <span>
          {user.isLoggedIn?<Button variant="ghost" onClick={signOut}>Logout </Button>:<Link to='/auth/signin'>Sign in </Link>}
        </span>
      </div>
      <button className="p-2 md:hidden " onClick={handleMenu}>
        <FaBars />
      </button>
      <div id="navdialog" className="hidden  z-10 fixed inset-0 w-2/3 bg-black text-white p-3 md:hidden">
        <div className="flex justify-between">
          <Link to='/'className="flex flex-col items-center gap-2">
            <img className="object-cover  max-w-12 max-h-12 " src={logo} alt="" />
            <span className="text-2xl md:text-3xl lg:text-4xl  md:font-medium font-display">Hotel Go</span></Link>
          <button className="p-2 " onClick={handleMenu}>
            <RxCross2 className='h-8 w-8'/>
          </button>
        </div>
        <div className="mt-6">
          <Link to='/manageHotels' className=" m-3 p-3 font-medium  hover:bg-gray-200 rounded-lg block" onClick={handleMenu}>Manage Hotels</Link>
          {user.isAdmin&&<Link to='/yourBookings'className=" m-3 p-3 font-medium  hover:bg-gray-200 rounded-lg block" onClick={handleMenu}>Your Bookings</Link>}
          <span className='m-3 p-3'>
          {user.isLoggedIn?<Button onClick={signOut}>Logout </Button>:<Link to='/auth/signin'>Sign in </Link>}
          </span>
        </div>
      </div>
    </nav>
    <Outlet/>
    </>
  )
}

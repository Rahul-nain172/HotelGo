import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {QueryClientProvider,QueryClient} from '@tanstack/react-query'
import { Toaster } from "@/components/ui/toaster"
import { jwtDecode } from "jwt-decode";
import { useEffect } from 'react';
import {useDispatch} from 'react-redux'
import { setUser,resetUser } from "@/redux/user/userSlice";
import SignUp from "./forms/SignUp";
import SignIn from "./forms/SignIn";
import Addhotel from "./forms/Addhotel/Addhotel";

import ViewHotels from "./Components/ViewHotels";
import Home from "./Home";
import Navbar from "./Components/Navbar";
import Edithotel from "./forms/Edithotel/Edithotel";
import Hotelpage from "./Components/Hotelpage";
import BookHotel from "./Components/BookHotel";
import Booking from "./Components/Booking";
import VerifyEmail from "./forms/VerifyEmail";
import ResetPassword from "./forms/ResetPassword";
import ForgotPassword from "./forms/ForgotPassword";
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar/>,
    children: [
      {
        path:'/',
        element:<Home/>,
      },
      {
        path:'/bookHotel/:hotelId',
        element:<BookHotel/>
      },
      {
        path:'/yourBookings',
        element:<Booking/>
      },
      {
        path:'/hotel/:hotelId',
        element:<Hotelpage/>
      },
      {
        path:'/manageHotels',
        element:<ViewHotels/>
      },
      {
        path:'updateHotel/addHotel',
        element:<Addhotel/>
      },
      {
        path:'updateHotel/editHotel/:hotelId',
        element:<Edithotel/>
      }
    ]
  },
  {
    path: 'auth/signup',
    element: <SignUp />
  },
  {
    path: 'auth/signin',
    element: <SignIn />
  },
  {
    path:'/verifyEmail',
    element:<VerifyEmail/>
  },{
    path:'/forgotPassword',
    element:<ForgotPassword/>
  },
  {
    path:'/resetPassword',
    element:<ResetPassword/>
  }
]);

const App = () => {
  // create a client
  const queryClient = new QueryClient()
  const dispatch=useDispatch();
  useEffect(()=>{
    const token=localStorage.getItem('token');
    if(token){
      const decodedToken=jwtDecode(token);
      dispatch(setUser(decodedToken));
    }
  },[])
  useEffect(() => {
    const interval = setInterval(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {

                const currTime = Date.now() / 1000;
                const refreshTime = parseInt(localStorage.getItem('refreshTime'));
                
                if (refreshTime+86400<=currTime) {
                  dispatch(resetUser());//reseting user info
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshTime');
                }
            } catch (error) {
                throw new Error('Error handling token:', error);
            }
        }
    }, 5000);

    return () => clearInterval(interval);
}, [dispatch]);


  return (
    <QueryClientProvider client={queryClient}>
      <Toaster/>
    <RouterProvider router={router}  />
    </QueryClientProvider>
  );
}

export default App;

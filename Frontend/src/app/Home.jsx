import React, { useEffect, useState } from 'react'
import { Outlet, Link } from "react-router-dom";
import { Button } from 'src/components/ui/button';
import ViewHotels from './Components/ViewHotels';
import SearchBar from './Components/SearchBar';
import Hotels from './Components/Hotels';
import Pagination from './Components/Pagination';
import Filters from './Components/Filters';

export default function Home() {
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    return (

        <div className='flex flex-col justify-center mx-4 sm:mx-8 '>
            {/* Hero section here */}
            <SearchBar />
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
                <div className="lg:col-span-1 lg:sticky lg:top-0 lg:h-[1400px]">
                    <div className="filters-dropdown lg:hidden">
                        <button
                            className="block w-full h-12 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onClick={toggleDropdown}
                        >
                           Show Filters
                        </button>
                        {showDropdown && (
                            <div className="dropdown-menu ">
                                <Filters />
                            </div>
                        )}
                    </div>
                    <div className='hidden lg:flex'>
                    <Filters />
                    </div>
                </div>
                <div className="sm:col-span-3 sm:pl-4">
                    <Hotels />
                    <div className='bg-gray-200'>
                    <Pagination />
                    </div>
                </div>
            </div>
        </div>
    )
}

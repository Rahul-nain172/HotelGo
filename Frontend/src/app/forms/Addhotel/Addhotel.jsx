import React, { useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BasicInfo from './BasicInfo';
import Details from './Details';
import Facilities from './Facilities';
import GuestInfo from './GuestInfo';
import Image from './Image';
const backendURI=import.meta.env.VITE_BACKEND_URI;
const createHotel = async (formData, token) => {
  const response = await fetch(`${backendURI}/api/Hotel/addHotel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  if (!response.ok) {
    throw new Error('Failed to add hotel');
  }
  return response.json();
};
const updateHotel = async (formData,token,hotelId) => {
  const response = await fetch(`${backendURI}/api/Hotel/updateHotel/${hotelId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  if (!response.ok) {
    throw new Error('Failed to update hotel');
  }
  const res=await response.json();
  return res;
};

export default function AddHotel(props) {
  const formMethods = useForm();
  const { handleSubmit, reset } = formMethods;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  useEffect(() => {
    reset(props.hotel);
  }, [props.hotel, reset]);
  const hotelMutation = useMutation({
    mutationFn: props.hotel?(({ formData, token }) => updateHotel(formData, token,props.hotel._id)):(({ formData, token }) => createHotel(formData, token)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      navigate('/');
    },
    onError: (error) => {
      throw new Error(error);
    }
  });

  const onSubmit = handleSubmit(async (formDataJson) => {
    let token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      formData.append('name', formDataJson.name);
      formData.append('city', formDataJson.city);
      formData.append('country', formDataJson.country);
      formData.append('description', formDataJson.description);
      formData.append('type', formDataJson.type);
      formData.append('pricePerNight', formDataJson.pricePerNight.toString());
      formData.append('starsRating', formDataJson.starsRating.toString());
      formData.append('adultCount', formDataJson.adultCount.toString());
      formData.append('childCount', formDataJson.childCount.toString());
      formDataJson.facilities.forEach((facility, index) => {
        formData.append(`facilities[${index}]`, facility);
      });
      if (formDataJson.imageUrls) {
        formDataJson.imageUrls.forEach((url, index) => {
          formData.append(`imageUrls[${index}]`, url);
        });
      }
      Array.from(formDataJson.imageFiles).forEach((imageFile) => {
        formData.append('imageFiles', imageFile);
      });

      hotelMutation.mutate({ formData, token });
    } catch (error) {
      throw new Error(error);
    }
  });
  if (hotelMutation.isPending) {
    return (<>ADDDING....</>)
  }
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit}>
        <div className='flex flex-col'>
          <div className='my-4 px-4'><BasicInfo /></div>
          <div className='my-4 px-4'><Details /></div>
          <div className='my-4 px-4'><Facilities /></div>
          <div className='my-4 px-4'><GuestInfo /></div>
          <div className='my-4 px-4'><Image /></div>
          <div className='flex justify-between mx-5'>
          <Button className=''>Back</Button>
          <Button className='w-20' type='submit'>{props.hotel ? "Update" : "Add"}</Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

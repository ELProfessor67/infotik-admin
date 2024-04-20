"use client";
import { Context } from '@/contextapi/ContextProvider';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react'

const ProtectedRoute = ({children}) => {
    const {isAuth} = useContext(Context);
    const router = useRouter();

    useEffect(() => {
        if(isAuth == false){
            router.push('/');
        }
    },[isAuth])

  return (
    children
  )
}

export default ProtectedRoute
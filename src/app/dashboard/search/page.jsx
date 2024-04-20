'use client';

import { isExist } from '@/http';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const page = () => {
    const [link, setLink] = useState('');
    const router = useRouter();
    const [message, setMessage] = useState('')


    const handleSearh = async () => {
        if(!link){
            setMessage("Please Enter Link");
            return
        }
        setMessage("");
        const uid = link.split('/')[link.split('/').length-1];
        const res = await isExist(uid);
        if(res){
            router.push(`/dashboard/posts/${uid}`);
        }else{
            setMessage("No Post Fount");
        }

    }

  return (
    <section className='h-full relative'>
      <div className='py-3 border-t border-b border-white text-center mb-10'>
        <h2 className='inline-block text-2xl text-white'>Search Video</h2>
      </div>

      <div className=''>
        <div className='flex py-2 gap-2 px-2 rounded-md border border-secondary max-w-[50%] mx-auto'>
            <img src='/white-search.png' className='object-contain'/>
            <input type='text' className='text-white w-full bg-primary outline-none border-none' placeholder='Paste video share link' value={link} onChange={(e) => setLink(e.target.value)}/>
        </div>
        <button className='py-2 px-8 rounded-md border border-secondary text-secondary mx-auto   block mt-10' onClick={handleSearh}>Search</button>
        {
            message && <p className='text-white mt-10 text-center'>{message}</p>
        }
      </div>
    </section>
  )
}

export default page
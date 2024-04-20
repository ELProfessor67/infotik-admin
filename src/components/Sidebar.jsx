import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
  return (
    <aside className='w-20 bg-black flex flex-col p-2'>
        <div className='flex justify-center p-2 mt-10'>
            <img src='/iconcolor.png' alt='logo'/>
        </div>
        <ul className='flex-1 flex flex-col gap-5 items-center mt-20'>
            <li>
                <Link href={'/dashboard'}>
                    <img src='/icon1.png' alt='icon' className='object-contain hover:border-b-2 hover:border-[#30A092] pb-1'/>
                </Link>
            </li>
            <li>
                <Link href={'/dashboard/search'}>
                    <img src='/Search.png' alt='icon' className='object-contain hover:border-b-2 hover:border-[#30A092] pb-1'/>
                </Link>
            </li>
        </ul>


        <ul className='flex flex-col gap-5 items-center mt-20'>
            <li>
                <Link href={'/'}>
                    <img src='/user.png' alt='icon' className='object-contain hover:border-b-2 hover:border-[#30A092] pb-1'/>
                </Link>
            </li>
            <li>
                <Link href={'/'}>
                    <img src='/setting.png' alt='icon' className='object-contain hover:border-b-2 hover:border-[#30A092] pb-1'/>
                </Link>
            </li>
        </ul>

    </aside>
  )
}

export default Sidebar
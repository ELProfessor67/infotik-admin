import React from 'react'

const Dialog = ({children,open,onClose}) => {
  return (
    <div className={`absolute top-0 left-0 right-0 bottom-0 bg-black/50 grid place-content-center ${open ? '': 'hidden'}`}>
        <div className='w-[27rem] bg-black p-5 rounded-md relative'>
            <div className='flex justify-end mb-2'>
                <button className='bg-none border-none' onClick={onClose}>
                  <img src='/X.png' className='object-contain'/>
                </button>
            </div>
            <div className=''>
                {children}
            </div>
        </div>
    </div>
  )
}

export default Dialog
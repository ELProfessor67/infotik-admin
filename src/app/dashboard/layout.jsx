import React from 'react'
import Sidebar from '../../components/Sidebar'
import ProtectedRoute from '@/components/ProtectedRoute'

const layout = ({children}) => {
  return (
    <ProtectedRoute>
      <div className='flex bg-primary h-screen'>
        <Sidebar/>
        <div className='h-screen overflow-y-auto relative flex-1'>
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default layout
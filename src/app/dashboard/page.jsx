"use client"
import { Context } from '@/contextapi/ContextProvider'
import Link from 'next/link';
import React, { useContext } from 'react'

const page = () => {
  const {posts} = useContext(Context);
  console.log(posts[0]?.approved)
  return (
    <section>
      <div className='py-3 border-t border-b border-white text-center mb-10'>
        <h2 className='inline-block text-2xl text-white'>All Videos</h2>
      </div>

      <div className='px-5'>


        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-secondary uppercase bg-black ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  uid
                </th>
                <th scope="col" className="px-6 py-3">
                  title
                </th>
                <th scope="col" className="px-6 py-3">
                  commnets
                </th>
                <th scope="col" className="px-6 py-3">
                  likes
                </th>
                <th scope="col" className="px-6 py-3">
                  approved
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {
                posts && posts.map((data) => (
                  <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {data.uid}
                    </th>
                    <td className="px-6 py-4">
                      {data.description}
                    </td>
                    <td className="px-6 py-4">
                      {data.commentsCount}
                    </td>
                    <td className="px-6 py-4">
                      {data.likesCount}
                    </td>
                    <td className="px-6 py-4">
                      {data.approved ? <span className='text-green-500'> &#10004; </span>: <span className='text-red-500'> &#10006; </span>}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/posts/${data.uid}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</Link>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

      </div>
    </section>
  )
}

export default page
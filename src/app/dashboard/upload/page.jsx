'use client';

import Dialog from '@/components/Dialog';
import KeywordBox from '@/components/KeywordBoxstyle';
import { createPost, isExist } from '@/http';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import fileToBlob from "@/utils/fileToBlob"
import generateThumbnailBlob from '@/utils/generateThumbnailBlob';


const allKeyword =[
    '#News',
    '#Politics',
    '#Science',
    '#Technology',
    '#Health',
    '#Environment',
    '#Education',
    '#History',
    '#Sports',
    '#AI',
    '#Business',
    '#Finance',
    '#Travel',
    '#Culture',
    '#Art',
    '#Fashion',
    '#Food',
    '#Cooking',
    '#DIY',
    '#Fitness',
    '#Wellness',
    '#Nature',
    '#Space',
    '#Philosophy',
    '#Psychology',
    '#Sustainability'
  ]


  async function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result.split(',')[1]); // Remove the data URL prefix
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(blob);
    });
}

const page = () => {
    const [link, setLink] = useState('');
    const router = useRouter();
   
    const [selectedyKeword, setSelectedKeyword] = useState([])
    const [keywordOpen, setKeywordOpen] = useState(false);
    const [newsdescription, setnewsdescription] = useState('');
    const [description, setDescription] = useState('')
    const [newslink, setnewslink] = useState('');
    const [video, setVideo] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [thumbnailPrev, setThumbnailPrev] = useState('');
    const [newstitle, setnewstitle] = useState('');
    const [loading, setLoading] = useState(false)
 
    const formRef = useRef()


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

    const handleSelectkeyword = (k) => {
        if(selectedyKeword.length >= 5 && !selectedyKeword.includes(k)){
          return
        }
        setSelectedKeyword(prev => {
          if(prev.includes(k)){
            return prev.filter(data => data != k);
          }else{
            return [...prev,k];
          }
        })
      }


      const handleSelectVideo = async (e) => {
        const [file] = e.target.files;
        const videoBlob = await fileToBlob(file)
        const thumbnailBlob = await generateThumbnailBlob(videoBlob);
        setVideo(videoBlob)
        setThumbnail(thumbnailBlob)

        if(!thumbnail){
          const base64 = await blobToBase64(thumbnailBlob);
      
          setThumbnailPrev(`data:image/jpeg;base64,${base64}`)
        }
        
      }

      const handleThumnailSelect = async (e) => {
        const [file] = e.target.files;
        const thumbnailBlob = await fileToBlob(file);
        setThumbnail(thumbnailBlob);
        const base64 = await blobToBase64(thumbnailBlob);
      
        setThumbnailPrev(`data:image/jpeg;base64,${base64}`)

      }


      const handleSavePost = async () => {
        setLoading(true)
        const res = await createPost(description, video, thumbnail, newstitle, newsdescription, newslink, selectedyKeword);
        
        setDescription('');
        setSelectedKeyword([])
        setnewslink('')
        setVideo('')
        setThumbnail('')
        setThumbnailPrev('')
        formRef.current.reset();
        setLoading(false)
      }

  return (
    <section className='h-full relative'>
      <div className='py-3 border-t border-b border-white text-center mb-10'>
        <h2 className='inline-block text-2xl text-white'>ADD POST</h2>
      </div>

      <form className='max-w-[50%] mx-auto flex flex-col gap-5' ref={formRef}>
        <div>
            <label className='text-white block mb-2'>Select Video</label>
            <div className='flex py-2 gap-2 px-2 rounded-md border border-secondary mx-auto'>
                <input type='file' className='text-white w-full bg-primary outline-none border-none' accept='video/*' placeholder='Paste video share link' onChange={handleSelectVideo}/>
            </div>
        </div>
        <div>
            <label className='text-white block mb-2'>Select Thumbnail</label>
            <div className='flex py-2 gap-2 px-2 rounded-md border border-secondary mx-auto'>
                <input type='file' className='text-white w-full bg-primary outline-none border-none' accept='image/*' placeholder='Paste video share link' onChange={handleThumnailSelect}/>
            </div>
        </div>
        <div>
            <label className='text-white block mb-2'>Title (150 characters)</label>
            <div className='flex py-2 gap-2 px-2 rounded-md border border-secondary mx-auto'>
                <input type='text' className='text-white w-full bg-primary outline-none border-none' placeholder='Paste video share link' value={description} onChange={(e) => setDescription(e.target.value)}/>
            </div>
        </div>
        <div>
            <label className='text-white block mb-2'>News link</label>
            <div className='flex py-2 gap-2 px-2 rounded-md border border-secondary mx-auto'>
                <input type='text' className='text-white w-full bg-primary outline-none border-none' placeholder='Paste video share link' value={newslink} onChange={(e) => setnewslink(e.target.value)}/>
            </div>
        </div>
        <div>
            <label className='text-white block mb-2'>News Description</label>
            <div className='flex py-2 gap-2 px-2 rounded-md border border-secondary mx-auto'>
                <input type='text' className='text-white w-full bg-primary outline-none border-none' placeholder='Paste video share link' value={newsdescription} onChange={(e) => setnewsdescription(e.target.value)}/>
            </div>
        </div>

        <label className='text-white block -mb-3'>Select Keyword</label>
        <div className='relative flex flex-wrap gap-2 justify-center rounded-md border border-secondary px-2 py-6'>
              {
                selectedyKeword.map(data => (
                  <KeywordBox text={data}/>
                ))
              }
              <button className='bg-none border-none outline-none absolute right-2 -top-7' onClick={() => setKeywordOpen(true)} type='button'>
                <img src='/Edit.png' className='object-contain'/>
              </button>
        </div>

        {
          thumbnailPrev && <div className='my-4 flex items-center justify-center'>
            <img src={thumbnailPrev} className='w-[10rem]'/>
          </div>
        }
        <button type='button' className='py-2 px-8 rounded-md border border-secondary text-secondary mx-auto   block mt-10' onClick={handleSavePost} disabled={loading}>
          {loading ? "Loading...": "POST"}
        </button>
        
      </form>

      <Dialog open={keywordOpen} onClose={() => setKeywordOpen(false)}>
          <h4 className='text-center text-white mb-4'>Choose some of your favorite topics
            <br/>
            ({selectedyKeword.length}/5)
          </h4>
        <div className='mt-10 relative flex flex-wrap gap-2 justify-center'>
          {
            allKeyword.map(data => (
              <KeywordBox text={data} selected={selectedyKeword.includes(data)} onClick={() => handleSelectkeyword(data)}/>
            ))
          }
        </div>
        
        
        
        <div className='flex items-center justify-center'>
          <button className='py-2 px-8 rounded-md border border-secondary text-secondary w-[50%] my-5 mt-10 mx-auto'  onClick={() => setKeywordOpen(false)}>
            Done
          </button>
        </div>
      </Dialog>
    </section>

  )
}

export default page
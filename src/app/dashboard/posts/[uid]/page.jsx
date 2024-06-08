"use client"
import Dialog from '@/components/Dialog';
import KeywordBox from '@/components/KeywordBoxstyle';
import { Context } from '@/contextapi/ContextProvider';
import { approvePost, deletePost, fieldUpdate, getSinglePosts, getUserById } from '@/http';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'



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


const page = ({params}) => {

  const [post, setPost] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [kloading, setkLoading] = useState(false);
  const [nloading, setnLoading] = useState(false);
  const [dloading, setdLoading] = useState(false);

  const [denyOpen, setDenyOpen] = useState(false);
  const [keywordOpen, setKeywordOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const [selectedyKeword, setSelectedKeyword] = useState([])
  const [newslink, setNewsLink] = useState('')
  const [description, setDescription] = useState('')
  const [deleteLoading,setdeleteLoading] = useState(false)
  const [denyLoading, setDenyLoading] = useState(false)

  const {nextPost,setNextPost,approvePosts} = useContext(Context);

  const router = useRouter();


  async function getPosts(){
    const res = await getSinglePosts(params.uid);
    if(!res){
      router.push('/dashboard');
    }
    setPost(res);
    setSelectedKeyword(res.hashtags);
    setNewsLink(res.newslink);
    setDescription(res.description);
    const ures = await getUserById(res.creator);
    setUser(ures);
  }

  useEffect(() => {
    getPosts();
  },[])



  const handleApproved = async () => {
    setLoading(true)
    const res = await approvePost(params.uid);
    await getPosts();
    setLoading(false)
   
    const next = approvePosts[nextPost].uid;
    if(nextPost >= approvePost.length){
      setNextPost(0);
    }else{
      setNextPost(nextPost+1)
    }
    router.push(`/dashboard/posts/${next}`)
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

  const keywordUpdate = async (clear=false) => {

      setkLoading(true)
      if(clear){

        const res = await fieldUpdate(params.uid,{hashtags: []});
      }else{
        const res = await fieldUpdate(params.uid,{hashtags: selectedyKeword});

      }
      await getPosts();
      setkLoading(false)
      setKeywordOpen(false)

  }
  const NewsLinkUpdate = async () => {
      setnLoading(true)
      const res = await fieldUpdate(params.uid,{newslink});
      await getPosts();
      setnLoading(false)
      setLinkOpen(false)

  }

  const DescriptionUpdate = async () => {
    setdLoading(true)
    const res = await fieldUpdate(params.uid,{description});
    await getPosts();
    setdLoading(false)
    setDescOpen(false)

  }


  const deletePostHandler = async () => {
    setdeleteLoading(true)
    const res = await deletePost(params.uid);
    router.push('/dashboard');
    setdeleteLoading(false)
  }


  const handleDeny = async () => {
    setDenyLoading(false)
    const res = await approvePost(params.uid);
    await getPosts();
    setDenyLoading(true)
    
    setDenyOpen(false);
    const next = approvePosts[nextPost].uid;
    if(nextPost >= approvePost.length){
      setNextPost(0);
    }else{
      setNextPost(nextPost+1)
    }
    router.push(`/dashboard/posts/${next}`)
  }
  return (
    <section className='h-full relative'>
      <div className='py-3 border-t border-b border-white text-center'>
        <h2 className='inline-block text-2xl text-white'>Verify Video</h2>
      </div>

      <div className='px-20 grid grid-cols-3 h-[80%] relative'>
        <div className='h-full flex items-end relative'>
          {
            post?.approved 
            ? <button className='py-2 px-8 rounded-md border border-red-500 text-red-500 w-[70%] mb-20' onClick={deletePostHandler}>{deleteLoading ? "Loading" : "DELETE"}</button>
            : <button className='py-2 px-8 rounded-md border border-red-500 text-red-500 w-[70%] mb-20' onClick={() => setDenyOpen(true)}>DENY</button>

          }
        </div>
        <div className='h-full bg-primary relative'>
          <video controls poster={post?.media[1]} src={post?.media[0]} className='object-contain h-[calc(100%-0px)] w-full'>
          </video>
        </div>
        <div className='h-full flex flex-col pl-20 pt-10'>
          <div className='flex-1'>
            <div className='flex gap-2 items-center'>
              {
                user?.photoURL ? <img src={user?.photoURL} alt='avatar' className='w-10 h-10 rounded-full'/> : <img src={`/default.png`} alt='avatar' className='w-10 h-10 rounded-full'/>
              }
              <p className='text-white'>@{user?.username}</p>
            </div>

            <div className='mt-10 relative flex flex-wrap gap-2 justify-center'>
              {
                post && post?.hashtags.map(data => (
                  <KeywordBox text={data}/>
                ))
              }
              <button className='bg-none border-none outline-none absolute -right-2 -top-5' onClick={() => setKeywordOpen(true)}>
                <img src='/Edit.png' className='object-contain'/>
              </button>
            </div>

            <div className='mt-10 relative'>
              <h3 className='text-secondary text-2xl mt-2'>{post?.newslink?.split("/")[2]?.slice(0,6)}</h3>
              <div className='border border-secondary flex relative rounded-md'>
                <div className='flex-1 flex items-center  relative px-2'>
                  <input type='text' className='text-white bg-primary w-full outline-none border-none' readOnly={true} value={post?.newslink}/>
                </div>
                
                <Link href={post?.newslink ?? '/'} className='h-full w-14 bg-secondary text-white flex justify-center py-4 rounded-r-md'>
                  <img src='/V.png' className='object-contain'/>
                </Link>
              </div>
              <button className='bg-none border-none outline-none absolute -right-5 -top-0' onClick={() => setLinkOpen(true)}>
                <img src='/Edit.png' className='object-contain'/>
              </button>
            </div>


            <div className='mt-10 relative'>
              <div className='flex relative rounded-md'>
                <div className='flex-1 flex items-center  relative px-2'>
                  <input type='text' className='text-white/90 bg-primary w-full outline-none border-none text-sm' readOnly={true} value={post?.description}/>
                </div>
                
                <button className='h-full w-8 flex justify-center py-4' onClick={() => setDescOpen(true)}>
                  <img src='/Edit.png' className='object-contain'/>
                </button>
              </div>
            </div>
          </div>
          <div className='flex justify-start'>
            {
              post?.approved 
              ? <button className='py-2 px-8 rounded-md border border-secondary text-secondary w-[85%] mb-20' disabled={loading} onClick={handleApproved}>{loading ? 'Loading...' :'PUBLIC CHNAGE'}</button>
              : <button className='py-2 px-8 rounded-md border border-secondary text-secondary w-[85%] mb-20' disabled={loading} onClick={handleApproved}>{loading ? 'Loading...' :'APPROVE'}</button>
            }
          </div>
        </div>
      </div>
      <Dialog open={denyOpen} onClose={() => setDenyOpen(false)}>
       <div className='px-3 flex justify-center flex-col items-center'>
          <h4 className='text-white text-center mb-4'>ARE YOU SURE UOU WANT TO DENY THIS VIDEO?</h4>
          <img src={post?.media[1]} className='w-full h-[27rem]'/>
          <button className='py-2 px-8 rounded-md border border-red-500 text-red-500 w-[100%] mb-5 mt-5' onClick={handleDeny}>{denyLoading ? "Loading..." : "DENY"}</button>
          <button className='py-2 px-8 rounded-md border border-secondary text-secondary w-[50%] mb-5' onClick={() => setDenyOpen(false)}>Cancel</button>
        </div>
      </Dialog>
      <Dialog open={linkOpen} onClose={() => setLinkOpen(false)}>
        <div className='px-1 flex justify-center flex-col items-center mt-5'>
          <textarea placeholder='News Link' className='text-white bg-black w-full p-2 h-[10rem] outline-none' value={newslink} onChange={(e) => setNewsLink(e.target.value)}>

          </textarea>
        </div>
        <div className='flex items-center justify-center'>
          <button className='py-2 px-8 rounded-md border border-secondary text-secondary w-[50%] my-5 mt-10 mx-auto' disabled={nloading} onClick={NewsLinkUpdate}>
              {nloading ? 'Loading...' :'UPDATE'}
          </button>
        </div>
        
      </Dialog>
      <Dialog open={descOpen} onClose={() => setDescOpen(false)}>
        <div className='px-1 flex justify-center flex-col items-center mt-5'>
          <textarea placeholder='News Link' className='text-white bg-black w-full p-2 h-[10rem] outline-none' value={description} onChange={(e) => setDescription(e.target.value)}>

          </textarea>
        </div>
        <div className='flex items-center justify-center'>
          <button className='py-2 px-8 rounded-md border border-secondary text-secondary w-[50%] my-5 mt-10 mx-auto' disabled={dloading} onClick={DescriptionUpdate}>
              {dloading ? 'Loading...' :'UPDATE'}
          </button>
        </div>
        
      </Dialog>

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
        <div className='flex items-center justify-center gap-4'>
          <button className='py-2 px-8 rounded-md border border-secondary text-secondary w-[50%] my-5 mt-10 mx-auto' disabled={kloading} onClick={() => keywordUpdate(false)}>
            {kloading ? 'Loading...' :'UPDATE'}
          </button>
          <button className='py-2 px-8 rounded-md border border-secondary text-secondary w-[50%] my-5 mt-10 mx-auto' disabled={kloading} onClick={() => keywordUpdate(true)}>
            {kloading ? 'Loading...' :'Clear'}
          </button>
        </div>
      </Dialog>
    </section>
  )
}

export default page
import { useUser } from '@clerk/react';
import ChatResume from './ChatResume';
import UploadForm from './UploadResume';
import { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    const {user, isLoaded , isSignedIn} = useUser();
    const [verify, setVerify] = useState(false);

    useEffect(()=>{
      if (isSignedIn) {
      getVerify();
      }
    },[user])

    const getVerify = async () =>{
      try {
        const res = await axios.get(`http://localhost:8000/api/user/verify/${user?.id}`);
        console.log(res.data)
        if (res.data.message === "user id is not found.") {
           setVerify(false);
           return;
        }
        setVerify(res.data.message)
      } catch (error) {
        console.log(error)
      }
    }

    if (!isSignedIn) {
        return <h1>you are not logged in.</h1>
    }

     if (!isLoaded) {
        return <h1>Loading..</h1>
    }
  return (
    <div className='w-full min-h-screen flex flex-col gap-5 justify-center items-center bg-amber-50 overflow-y-scroll'>
      <h1 className='text-3xl font-bold mt-10'>Welcome, {user?.firstName}</h1>

      {user?.id && verify ? <ChatResume/>:<UploadForm/>}
      
    </div>
  )
}

export default HomePage

import { useUser } from '@clerk/react';
import axios from 'axios';
import React, { useState } from 'react'

const ChatResume = () => {
    const [query, setQuery] = useState<string | null>(null);
    const [answer, setAns] = useState<string | null>(null);
    const {user} = useUser();
    const userId = user?.id;

    const OnSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userData  = {
                userId,
                query
            }
            const res = await axios.post("http://localhost:8000/api/user/query",userData);
            console.log(res.data)
            setAns(res.data.response.kwargs.content)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <>
    <form onSubmit={OnSubmitForm} className='w-3/4 p-20 bg-orange-100 rounded-2xl flex flex-col gap-10 justify-center items-center'>
        {/* <input type="text" /> */}
        <p className='font-semibold'>{answer && answer}</p>
       <div className="flex w-full gap-2 items-center">
        <textarea  className='w-3/4 p-2 border rounded' cols={70} name="query" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=> setQuery(e.target.value)} ></textarea>
        <button type='submit' className="w-40  rounded text-white text-2xl font-bold h-10 bg-black">Submit</button>
        <br />
        </div>
    </form>
    </>
  )
}

export default ChatResume

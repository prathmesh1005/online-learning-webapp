"use client"
import React,{useState, useEffect, useCallback } from 'react'
import {useUser} from '@clerk/nextjs'
import axios from 'axios'
import {UserDetailContext} from '../context/UserDetailContext'
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';
const Provider = ({children}) => {

    const {user} = useUser();
    const [userDetail, setUserDetail] = useState();
    const [selectedChapterIndex,setSelectedChapterIndex]=useState(0);
    const CreateNewUser=useCallback(async()=>{
        const result = await axios.post('/api/user',{
            name:user?.fullName,
            email:user?.primaryEmailAddress?.emailAddress
        });
        console.log(result.data);
        setUserDetail(result.data);

    },[user])
    
    useEffect(()=>{
      if (user) {
        CreateNewUser();
      }
    },[user, CreateNewUser])

  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
     <SelectedChapterIndexContext.Provider value={{selectedChapterIndex, setSelectedChapterIndex}}>
    <div>{children}</div>
</SelectedChapterIndexContext.Provider>

    </UserDetailContext.Provider>
  )
}

export default Provider

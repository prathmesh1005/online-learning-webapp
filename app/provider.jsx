"use client"
import React from 'react'

const provider = ({children}) => {

    const {user} = usserUser();
    const CreateNewUser=async()=>{
        const result = await axios.post('/api/user',{``
            name:user?.fullname,
            email:user?.primaryEmailAddress?.emailAddress
        });
        console.log(result.data);
    }

  return (
    <div>{children}</div>
  )
}

export default provider

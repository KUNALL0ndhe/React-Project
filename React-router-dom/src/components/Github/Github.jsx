import React, { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'

const Github = () => {
    const data = useLoaderData()
    
    // const [ data , setData ] = useState([])
    // useEffect( ()=> {
    //     fetch ('https://api.github.com/users/KUNALL0ndhe')
    //     .then((res) => res.json())
    //     .then((data)=> {
            
    //         console.log(data)
    //         setData(data)
    //     })
    // },[])
  return (
    <div className='text-center m-4 bg-gray-600 text-white p-4  text-3xl'>Github Name :{data.login},
    Repository : {data.public_repos}
    <div className="flex justify-center items-center h-screen">
  <img src={data.avatar_url} height="300px" />
</div>
 </div>
  )
}

export default Github

export const githubLoader = async () => {
    const response = await fetch ('https://api.github.com/users/KUNALL0ndhe')
    return response.json();
}
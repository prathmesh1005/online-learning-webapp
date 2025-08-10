'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EnrollCourseCard from './EnrollCourseCard'; // adjust path if needed

function EnrollCourseList() {

const [enrolledCourseList,setEnrolledCourseList]=useState([]);
    useEffect(()=>{
        GetEnrolledCourse();
    },[])
    const GetEnrolledCourse=async()=>{
        const result=await axios.get('/api/enroll-course')
        console.log(result);
        setEnrolledCourseList(result.data);
        
    }
  return enrolledCourseList?.length> 0 &&(
    <div className='mt-3'>
        <h2 className='font-bold text-xl'>Continue Learning Your Courses </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
        {enrolledCourseList?.map((course, index)=>{
            return <EnrollCourseCard 
                course={course?.courses} 
                enrollCourse={course?.enrollCourse} 
                key={course?.cid || course?.id || `enrolled-${index}`}
            />
        })}
        </div>
    </div>
  )
}

export default EnrollCourseList
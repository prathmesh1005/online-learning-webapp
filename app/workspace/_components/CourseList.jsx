'use client'
import React ,{useState}from 'react';
import { Button } from "@/components/ui/button";
import AddNewCourseDialog from './AddNewCourseDialog';
import Image from 'next/image';
function CourseList() {
    const [courseList,setCourseList]=useState([]);
  return (
    <div className='mt-10'>
       <h2 className='font-bold text-3xl'>Course List</h2>

       {courseList?.length==0?
       <div className='flex p-7 items-center justify-center flex-col border rounded-xl mt-2 bg-secondary'>
        <Image src={'/online-education.png'}alt ='edu' width={120} height={120}/>
        <h2 className='my-2 text-xl font-bold'>Looks Like you haven't created any courses yet</h2>
        <AddNewCourseDialog>
           <Button>+ Create your first course </Button>
        </AddNewCourseDialog>
       </div>:
            <div>
                List Of Courses
            </div>}
    </div>
  )
}

export default CourseList
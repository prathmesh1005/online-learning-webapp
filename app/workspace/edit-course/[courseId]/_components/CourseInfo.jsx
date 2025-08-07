import { Button } from '@/components/ui/button';
import { Clock, TrendingUp,Book } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

function CourseInfo({course}) {
    const courseLayout=course?.courseJson.course;
    const GenerateCourseContent=()=>{
        //Call API to generate content
    }
  return (
    <div className='md:flex gap-5 justify-between p-5 rounded-2xl shadow'>
        <div className='flex flex-col gap-3'>
            <h2 className='font-bold text-3xl'>{courseLayout?.name}</h2>
            <p className='line-clamp-2 text-gray-500'>{courseLayout?.description}</p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
                    <Clock className='text-blue-500'/>
                    <section>
                        <h2 className='font-bold'>Duration</h2>
                        <h2>2 Hours</h2>
                    </section>
                </div>
                <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
                    <Book className='text-green-500'/>
                    <section>
                        <h2 className='font-bold'>Chapters</h2>
                        <h2>2 Hours</h2>
                    </section>
                </div>
                <div className='flex gap-5 items-center p-3 rounded-lg shadow'>
                    <TrendingUp className='text-red-500'/>
                    <section>
                        <h2 className='font-bold'>Difficulty Level</h2>
                        <h2>{course?.level}</h2>
                    </section>
                </div>
            </div>
            <Button>Generate Content</Button>
        </div>
        {course?.bannerImageURL && (
  <div className="mt-6 md:mt-0 md:w-[400px] md:h-[240px]">
    <Image
      src={course?.bannerImageURL}
      alt="banner image"
      width={400}
      height={240}
      className="rounded-2xl object-cover w-full h-full"
    />
  </div>
)}

    </div>
  )
}

export default CourseInfo
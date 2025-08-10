import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Progress } from '@/components/ui/progress';
import { PlayCircle } from 'lucide-react';

function EnrollCourseCard({course, enrollCourse}) {
    // Add safety checks for course data
    if (!course) {
        return <div className='shadow rounded-2xl p-3'>Loading...</div>;
    }

    const courseJson = course?.courseJson?.course;
    
    // Add safety check for courseJson
    if (!courseJson) {
        return <div className='shadow rounded-2xl p-3'>Course data not available</div>;
    }

    const CalculatePerProgress = () => {
        try {
            const completedChapters = enrollCourse?.completedChapters?.length || 0;
            const totalChapters = course?.courseContent?.length || 0;
            
            if (totalChapters === 0) return 0;
            
            const percentage = (completedChapters / totalChapters) * 100;
            return Math.round(percentage);
        } catch (error) {
            console.error('Error calculating progress:', error);
            return 0;
        }
    }

    const progressValue = CalculatePerProgress();

    return (
        <div className='shadow rounded-2xl'>
            <Image 
                src={course?.bannerImageURL || '/online-education.png'} 
                alt={course?.name || 'Course'} 
                width={400}
                height={300}
                className='w-full aspect-video rounded-t-xl object-cover'
            />
            <div className='p-3 flex flex-col gap-3'>
                <h2 className='font-bold text-lg'>{courseJson.name || 'Untitled Course'}</h2>
                <p className='line-clamp-3 text-gray-400 text-sm'>{courseJson.description || 'No description available'}</p>
                <div className=''> 
                    <h2 className='flex justify-between text-sm text-primary'>
                        Progress <span>{progressValue}%</span>
                    </h2>
                    <Progress value={progressValue} />
                    <Link href={'/workspace/course/' + (course?.cid || '')}>
                        <Button className={'w-full mt-3'}>
                            <PlayCircle />Continue Learning
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default EnrollCourseCard
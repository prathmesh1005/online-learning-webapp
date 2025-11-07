import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Progress } from '@/components/ui/progress';
import { PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <motion.div 
            className='group bg-card rounded-2xl border border-border hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <div className='relative overflow-hidden'>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                >
                    <Image 
                        src={course?.bannerImageURL || '/online-education.png'} 
                        alt={course?.name || 'Course'} 
                        width={400}
                        height={300}
                        className='w-full aspect-video object-cover'
                    />
                </motion.div>
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </div>
            <div className='p-5 flex flex-col gap-3'>
                <h2 className='font-bold text-lg text-foreground group-hover:text-purple-400 transition-colors line-clamp-2'>
                    {courseJson.name || 'Untitled Course'}
                </h2>
                <p className='line-clamp-2 text-muted-foreground text-sm leading-relaxed'>
                    {courseJson.description || 'No description available'}
                </p>
                <div className='mt-2'> 
                    <div className='flex justify-between items-center text-sm mb-2'>
                        <span className='text-purple-400 font-medium'>Progress</span>
                        <span className='text-purple-500 font-semibold'>{progressValue}%</span>
                    </div>
                    <div className='relative h-2 w-full overflow-hidden rounded-full bg-purple-100 dark:bg-purple-950/30'>
                        <motion.div 
                            className='h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full'
                            initial={{ width: 0 }}
                            animate={{ width: `${progressValue}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                    <Link href={'/workspace/view-course/' + (course?.cid || '')}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button className='w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40'>
                                <PlayCircle className='mr-2' />Continue Learning
                            </Button>
                        </motion.div>
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

export default EnrollCourseCard
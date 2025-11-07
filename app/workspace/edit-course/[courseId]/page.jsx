"use client"
import React, { useEffect,useState, useCallback } from 'react'
import { useParams } from 'next/navigation';
import axios from 'axios';
import CourseInfo from '../_components/CourseInfo';
import ChapterTopicList from '../_components/ChapterTopicList'
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function EditCourse({viewCourse = false }) {
    const { courseId } = useParams();
    const[course,setCourse]=useState();
    const[loading,setLoading]=useState(true);
    
    
    const GetCourseInfo=useCallback(async()=>{
        try {
            setLoading(true);
            const result=await axios.get('/api/courses?courseId='+courseId)
            console.log(result.data);
            setCourse(result.data)
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    },[courseId])
    
    useEffect(()=>{
        GetCourseInfo();
    }, [courseId, GetCourseInfo])

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-64 w-full rounded-3xl" />
                <Skeleton className="h-96 w-full rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Back Button */}
            <div className="flex items-center gap-4">
                <Link href="/workspace">
                    <Button variant="outline" size="sm" className="gap-2 hover:bg-purple-50 dark:hover:bg-purple-950 border-purple-500/20">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>
                {viewCourse && (
                    <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">View Mode</span>
                    </div>
                )}
            </div>

            {/* Course Content */}
            <CourseInfo course={course} viewCourse = {viewCourse} />
            <ChapterTopicList course={course}/>
        </div>
    )
}

export default EditCourse 
"use client"
import React, { useEffect,useState, useCallback } from 'react'
import { useParams } from 'next/navigation';
import axios from 'axios';
import CourseInfo from '../_components/CourseInfo';
import ChapterTopicList from '../_components/ChapterTopicList'

function EditCourse() {
    const { courseId } = useParams();
    const[course,setCourse]=useState();
    
    
    const GetCourseInfo=useCallback(async()=>{
        const result=await axios.get('/api/courses?courseId='+courseId)
         console.log(result.data);
         setCourse(result.data)
         
    },[courseId])
    
    useEffect(()=>{
        GetCourseInfo();
    }, [courseId, GetCourseInfo])
    return (
        <div>
            <CourseInfo course={course}/>
            <ChapterTopicList course={course}/>
        </div>
    )
}

export default EditCourse 
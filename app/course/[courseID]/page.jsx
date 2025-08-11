"use client";

import AppHeader from '@/app/workspace/_components/AppHeader';
import React, { useState, useEffect } from 'react';
import ChapterListSidebar from '../_components/ChapterListSidebar';
import ChapterContent from '../_components/ChapterContent';
import { useParams } from 'next/navigation';
import axios from 'axios';

function Course() {
  const { courseID } = useParams();
  const [courseInfo, setCourseInfo] = useState();

  useEffect(() => {
    GetEnrolledCourseByID();
  }, []);

  const GetEnrolledCourseByID = async () => {
    try {
      if (!courseID) return; // Prevent API call if param isn't loaded yet
      const { data } = await axios.get(`/api/enroll-course?courseId=${courseID}`);
      console.log(data); // Only log to console
      setCourseInfo(data); // Set the course info in state
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  return (
    <div>
      <AppHeader hideSiebar={true} />
      <div className='flex gap-10'>
        <ChapterListSidebar courseInfo={courseInfo} />
        <ChapterContent />
      </div>
    </div>
  );
}

export default Course;

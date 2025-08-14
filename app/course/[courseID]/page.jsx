"use client";

import AppHeader from '@/app/workspace/_components/AppHeader';
import React, { useState, useEffect, useCallback } from 'react';
import ChapterListSidebar from '../_components/ChapterListSidebar';
import ChapterContent from '../_components/ChapterContent';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { SelectedChapterIndexProvider } from '@/context/SelectedChapterIndexContext';

function Course() {
  const { courseID } = useParams();
  const [courseInfo, setCourseInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const silentRefreshData = async () => {
    try {
      if (!courseID) return;
      const { data } = await axios.get(`/api/enroll-course?courseId=${courseID}`);
      setCourseInfo(data);
    } catch (error) {
      console.error("Silent refresh failed:", error);
    }
  };

  const GetEnrolledCourseByID = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!courseID) {
        setError("Course ID not found");
        return;
      }
      
      const { data } = await axios.get(`/api/enroll-course?courseId=${courseID}`);
      console.log('Course data received:', data);
      setCourseInfo(data);
    } catch (error) {
      console.error("Error fetching course:", error);
      setError(error.message || "Failed to fetch course");
    } finally {
      setLoading(false);
    }
  }, [courseID]);

  useEffect(() => {
    if (courseID) {
      GetEnrolledCourseByID();
    }
  }, [courseID, GetEnrolledCourseByID]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader hideSiebar={true} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader hideSiebar={true} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">Error: {error}</p>
            <button 
              onClick={GetEnrolledCourseByID}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SelectedChapterIndexProvider>
      <div className="min-h-screen bg-background">
        <AppHeader hideSiebar={true} />
        <div className='flex gap-10'>
          <ChapterListSidebar courseInfo={courseInfo} />
          <ChapterContent courseInfo={courseInfo} refreshData={silentRefreshData} />
        </div>
      </div>
    </SelectedChapterIndexProvider>
  );
}

export default Course;

"use client";

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { SelectedChapterIndexProvider } from '@/context/SelectedChapterIndexContext';
import LazyLoad from '@/components/ui/lazy-load';
import ChapterContentSkeleton from '@/components/ui/ChapterContentSkeleton';
import { SidebarProvider } from '@/@/components/ui/sidebar';

// Dynamically import components with SSR disabled for better performance
const AppHeader = dynamic(
  () => import('@/app/workspace/_components/AppHeader'),
  { ssr: false, loading: () => <div className="h-16 bg-background"></div> }
);

const ChapterListSidebar = dynamic(
  () => import('../_components/ChapterListSidebar'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-96 bg-sidebar border-r border-sidebar-border h-full p-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-sidebar-accent rounded w-3/4 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }
);

const ChapterContent = dynamic(
  () => import('../_components/ChapterContent'),
  { 
    ssr: false,
    loading: () => <ChapterContentSkeleton />
  }
);

// Loading fallback component
const LoadingFallback = () => (
  <SidebarProvider>
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground text-lg">Loading course...</p>
      </div>
    </div>
  </SidebarProvider>
);

// Simple error fallback component (removed class-based ErrorBoundary to avoid conflicts)
const ErrorFallback = ({ error, retry }) => (
  <div className="flex-1 p-6 bg-background rounded-lg shadow">
    <div className="text-center py-10">
      <h3 className="text-lg font-medium text-destructive">Something went wrong</h3>
      <p className="mt-2 text-muted-foreground">
        {error || "We couldn't load the content. Please try refreshing the page."}
      </p>
      <button
        onClick={retry || (() => window.location.reload())}
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Retry
      </button>
    </div>
  </div>
);

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
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="min-h-screen bg-background">
          <Suspense fallback={<div className="h-16 bg-background border-b border-border"></div>}>
            <AppHeader />
          </Suspense>
          <div className="flex items-center justify-center h-64 pt-16">
            <div className="text-center">
              <p className="text-destructive text-lg mb-4">Error: {error}</p>
              <button 
                onClick={GetEnrolledCourseByID}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <SelectedChapterIndexProvider>
        <div className="flex flex-col h-screen bg-background overflow-hidden">
          <AppHeader />
        
        <div className="flex flex-1 overflow-hidden min-h-0">
          <ChapterListSidebar 
            courseInfo={courseInfo} 
            loading={loading} 
            error={error}
            onRefresh={GetEnrolledCourseByID}
          />
          
          <main className="flex-1 overflow-y-auto min-w-0 transition-all duration-300 ease-in-out">
            <LazyLoad threshold={0.1}>
              <Suspense fallback={
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-3/4"></div>
                    <div className="h-64 bg-muted rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              }>
                <ChapterContent 
                  courseInfo={courseInfo} 
                  refreshData={GetEnrolledCourseByID} 
                />
              </Suspense>
            </LazyLoad>
          </main>
        </div>
        </div>
      </SelectedChapterIndexProvider>
    </SidebarProvider>
  );
}

export default Course;

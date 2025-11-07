'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import EnrollCourseCard from './EnrollCourseCard'; // adjust path if needed
import LazyLoad from '@/components/ui/lazy-load';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

function EnrollCourseList() {

const [enrolledCourseList,setEnrolledCourseList]=useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

    useEffect(()=>{
        GetEnrolledCourse();
    },[])
    
    const GetEnrolledCourse=async(retryCount = 0)=>{
        const maxRetries = 2;
        
        try {
          setLoading(true);
          setError(null);
          
          // Check for cached data first (only use cache on first load)
          if (retryCount === 0) {
            const cachedData = sessionStorage.getItem('enrolledCourses');
            const cacheTimestamp = sessionStorage.getItem('enrolledCoursesTime');
            const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : Infinity;
            
            // Use cache if less than 5 minutes old
            if (cachedData && cacheAge < 5 * 60 * 1000) {
              console.log('✅ Using cached enrolled courses data');
              setEnrolledCourseList(JSON.parse(cachedData));
              setLoading(false);
              return;
            }
          }
          
          // Fetch with increased timeout and better error handling
          const result=await axios.get('/api/enroll-course', {
            timeout: 45000, // Increased to 45 seconds
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          console.log(result);
          const data = result.data || [];
          setEnrolledCourseList(data);
          
          // Cache the successful result
          sessionStorage.setItem('enrolledCourses', JSON.stringify(data));
          sessionStorage.setItem('enrolledCoursesTime', Date.now().toString());
          
        } catch (error) {
          console.error('Error fetching enrolled courses:', error);
          
          // Retry logic for timeout errors
          if (error.code === 'ECONNABORTED' && retryCount < maxRetries) {
            console.log(`Retrying... Attempt ${retryCount + 1} of ${maxRetries}`);
            setError(`Connection slow. Retrying (${retryCount + 1}/${maxRetries})...`);
            setTimeout(() => {
              GetEnrolledCourse(retryCount + 1);
            }, 2000); // Wait 2 seconds before retry
            return;
          }
          
          // More specific error handling
          if (error.code === 'ECONNABORTED') {
            setError('The request is taking too long. Your database might be experiencing delays. Please try again later or contact support if this persists.');
          } else if (error.response) {
            const statusCode = error.response.status;
            if (statusCode === 504) {
              setError('Database connection timeout. Please refresh the page or try again in a moment.');
            } else if (statusCode === 401) {
              setError('Session expired. Please sign in again.');
            } else {
              setError(`Server error (${statusCode}): ${error.response.data?.error || error.message}`);
            }
          } else if (error.request) {
            setError('Unable to reach the server. Please check your internet connection.');
          } else {
            setError(error.message);
          }
          
          setEnrolledCourseList([]);
          setLoading(false);
          
        } finally {
          if (retryCount >= maxRetries || !error || error.code !== 'ECONNABORTED') {
            setLoading(false);
          }
        }
    }
  
  // Show loading skeletons
  if (loading) {
    return (
      <div className='mt-8'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='h-1 w-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full'></div>
          <h2 className='font-semibold text-xl text-foreground'>Continue Learning Your Courses</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='w-full h-[280px] rounded-xl bg-purple-500/10'/>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='mt-8'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='h-1 w-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full'></div>
          <h2 className='font-semibold text-xl text-foreground'>Continue Learning Your Courses</h2>
        </div>
        <div className='text-center py-16 bg-card rounded-2xl border border-red-500/20'>
          <div className='text-6xl mb-4'>⚠️</div>
          <h3 className='text-xl font-semibold text-red-500 mb-2'>Error Loading Enrolled Courses</h3>
          <p className='text-muted-foreground mb-4'>{error}</p>
          <Button 
            onClick={GetEnrolledCourse}
            className='bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='mt-8'>
        {enrolledCourseList?.length > 0 ? (
          <>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-3'>
                <div className='h-1 w-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full'></div>
                <h2 className='font-semibold text-xl text-foreground'>Continue Learning Your Courses</h2>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Clear cache on manual refresh
                  sessionStorage.removeItem('enrolledCourses');
                  sessionStorage.removeItem('enrolledCoursesTime');
                  GetEnrolledCourse();
                }}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
            {enrolledCourseList?.map((course, index)=>{
                return (
                  <LazyLoad
                    key={course?.cid || course?.id || `enrolled-${index}`}
                    fallback={
                      <Skeleton className='w-full h-[280px] rounded-xl bg-purple-500/10'/>
                    }
                    rootMargin='100px'
                    threshold={0.1}
                  >
                    <EnrollCourseCard 
                      course={course?.courses} 
                      enrollCourse={course?.enrollCourse} 
                    />
                  </LazyLoad>
                )
            })}
            </div>
          </>
        ) : (
          <div className='mt-12 text-center py-16 bg-card rounded-2xl border border-border'>
            <div className='text-6xl mb-4'>📚</div>
            <h3 className='text-xl font-semibold text-foreground mb-2'>No Enrolled Courses Yet</h3>
            <p className='text-muted-foreground'>Start your learning journey by exploring available courses</p>
          </div>
        )}
    </div>
  )
}

export default EnrollCourseList
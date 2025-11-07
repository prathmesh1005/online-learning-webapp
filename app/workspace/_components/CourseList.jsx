'use client'
import React ,{useEffect, useState}from 'react';
import { Button } from "@/components/ui/button";
import AddNewCourseDialog from './AddNewCourseDialog';
import CourseCard from './CourseCard';
import Image from 'next/image';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import LazyLoad from '@/components/ui/lazy-load';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';

function CourseList() {
    const [courseList,setCourseList]=useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} =useUser();
    
    useEffect(() =>{
      if (user) {
        GetCourseList();
      }
    } , [user])
    
    const GetCourseList=async(retryCount = 0)=>{
      const maxRetries = 2;
      
      // Check for cached data first (only use cache on first load)
      if (retryCount === 0) {
        const cachedData = sessionStorage.getItem('myCourses');
        const cacheTimestamp = sessionStorage.getItem('myCoursesTime');
        const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : Infinity;
        
        // Use cache if less than 5 minutes old
        if (cachedData && cacheAge < 5 * 60 * 1000) {
          console.log('✅ Using cached courses data');
          setCourseList(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const result=await axios.get('/api/courses', {
          timeout: 45000, // Increased to 45 seconds
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        console.log(result.data);
        const data = result.data || [];
        setCourseList(data);
        
        // Cache the successful result
        sessionStorage.setItem('myCourses', JSON.stringify(data));
        sessionStorage.setItem('myCoursesTime', Date.now().toString());
        
      } catch (error) {
        console.error('Error fetching courses:', error);
        
        // Retry logic for timeout errors
        if (error.code === 'ECONNABORTED' && retryCount < maxRetries) {
          console.log(`Retrying... Attempt ${retryCount + 1} of ${maxRetries}`);
          setError(`Connection slow. Retrying (${retryCount + 1}/${maxRetries})...`);
          setTimeout(() => {
            GetCourseList(retryCount + 1);
          }, 2000);
          return;
        }
        
        // More specific error handling
        if (error.code === 'ECONNABORTED') {
          setError('The request is taking too long. Your database might be experiencing delays. Please try again later.');
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
        
        setCourseList([]);
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
      <div className='mt-10'>
        <div className='mb-6'>
          <h2 className='font-bold text-3xl bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent'>
            My Created Courses
          </h2>
          <p className='text-muted-foreground mt-2'>Manage and track your created courses</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='w-full h-[300px] rounded-xl bg-purple-500/10'/>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='mt-10'>
        <div className='mb-6'>
          <h2 className='font-bold text-3xl bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent'>
            My Created Courses
          </h2>
          <p className='text-muted-foreground mt-2'>Manage and track your created courses</p>
        </div>
        <div className='flex p-7 items-center justify-center flex-col border border-red-500/20 rounded-xl bg-secondary/50'>
          <div className='text-6xl mb-4'>⚠️</div>
          <h2 className='my-2 text-xl font-bold text-red-500'>Error Loading Courses</h2>
          <p className='text-muted-foreground mb-4'>{error}</p>
          <Button 
            onClick={GetCourseList}
            className='bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='mt-10'>
       <div className='mb-6 flex items-start justify-between'>
         <div>
           <h2 className='font-bold text-3xl bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent'>
             My Created Courses
           </h2>
           <p className='text-muted-foreground mt-2'>Manage and track your created courses</p>
         </div>
         <Button 
           variant="outline" 
           size="sm"
           onClick={() => {
             // Clear cache on manual refresh
             sessionStorage.removeItem('myCourses');
             sessionStorage.removeItem('myCoursesTime');
             GetCourseList();
           }}
           disabled={loading}
           className="gap-2"
         >
           <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
           Refresh
         </Button>
       </div>

       {courseList?.length==0?
       <div className='flex p-7 items-center justify-center flex-col border border-purple-500/20 rounded-xl mt-2 bg-secondary/50'>
        <Image src={'/online-education.png'}alt ='edu' width={120} height={120}/>
        <h2 className='my-2 text-xl font-bold'>Looks Like you haven&apos;t created any courses yet</h2>
        <AddNewCourseDialog onCourseCreated={GetCourseList}>
           <Button className='bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 mt-2'>
             + Create your first course 
           </Button>
        </AddNewCourseDialog>
       </div>:
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
             {courseList?.map((course,index) => (
                <LazyLoad
                  key={index}
                  fallback={
                    <Skeleton className='w-full h-[300px] rounded-xl bg-purple-500/10'/>
                  }
                  rootMargin='100px'
                  threshold={0.1}
                >
                  <CourseCard course={course} />
                </LazyLoad>
              ))}

            </div>}
    </div>
  )
}

export default CourseList
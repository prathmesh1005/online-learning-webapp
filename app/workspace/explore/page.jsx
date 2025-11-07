"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import CourseCard from '../_components/CourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import LazyLoad from '@/components/ui/lazy-load';

function Explore() {
    const [courseList,setCourseList]=useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const coursesPerPage = 9; // 3x3 grid
    const {user} =useUser();
    
    useEffect(() =>{
      if (user) {
        GetCourseList();
      }
    } , [user])
    
    const GetCourseList=async()=>{
      try {
        setLoading(true);
        setError(null);
        
        // Check cache first (5 minutes)
        const cacheKey = 'exploreCourses';
        const cacheTimeKey = 'exploreCoursesTime';
        const cached = sessionStorage.getItem(cacheKey);
        const cachedTime = sessionStorage.getItem(cacheTimeKey);
        
        if (cached && cachedTime) {
          const age = Date.now() - parseInt(cachedTime);
          if (age < 5 * 60 * 1000) { // 5 minutes
            console.log('Using cached explore courses');
            setCourseList(JSON.parse(cached));
            setLoading(false);
            return;
          }
        }
        
        const result=await axios.get('/api/courses?courseId=0', {
          timeout: 30000 // 30 second timeout (increased from 10s)
        });
        console.log(result.data);
        const courses = result.data || [];
        setCourseList(courses);
        
        // Cache the results
        sessionStorage.setItem(cacheKey, JSON.stringify(courses));
        sessionStorage.setItem(cacheTimeKey, Date.now().toString());
        
      } catch (error) {
        console.error('Error fetching courses:', error);
        if (error.code === 'ECONNABORTED') {
          setError('Request timeout. The server is taking too long to respond. Please try again.');
        } else {
          setError(error.response?.data?.error || error.message);
        }
        setCourseList([]);
      } finally {
        setLoading(false);
      }
    }
  
  // Filter courses based on search query
  const filteredCourses = courseList.filter(course => 
    course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  
  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Show error state
  if (error) {
    return (
      <div className='pb-10'>
        <div className='mb-8'>
          <h2 className='font-bold text-3xl mb-2 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent'>
            Explore More Courses
          </h2>
          <p className='text-gray-400 text-sm'>Discover new courses and expand your knowledge</p>
        </div>
        
        <div className='text-center py-16 bg-card rounded-2xl border border-red-500/20'>
          <div className='text-6xl mb-4'>⚠️</div>
          <h3 className='text-xl font-semibold text-red-500 mb-2'>Error Loading Courses</h3>
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
    <div className='pb-10 space-y-8'>
        {/* Header Section */}
        <div className='relative overflow-hidden p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl'>
          <div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl'></div>
          
          <div className='relative z-10'>
            <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4'>
              <Search className='h-4 w-4 text-white' />
              <span className='text-white text-sm font-semibold'>Discover</span>
            </div>
            <h1 className='font-bold text-4xl md:text-5xl text-white mb-3 drop-shadow-lg'>
              Explore Courses
            </h1>
            <p className='text-purple-100 text-lg max-w-2xl'>
              Discover new courses, expand your knowledge, and unlock your potential
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className='flex gap-3 max-w-2xl'>
            <div className='flex-1 relative'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
              <Input 
                placeholder="Search for courses by name, topic, or category..." 
                className='pl-12 h-14 border-2 border-purple-500/30 focus:border-purple-500 bg-white dark:bg-gray-900 rounded-xl shadow-sm'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              className='h-14 px-8 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/30'
              onClick={() => setSearchQuery('')}
            >
              {searchQuery ? 'Clear' : <Search className='h-5 w-5'/>}
            </Button>
        </div>

        {/* Courses Grid Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='font-bold text-2xl text-foreground'>Available Courses</h2>
            <p className='text-muted-foreground text-sm mt-1'>
              {searchQuery ? `Found ${filteredCourses.length} courses` : `${courseList.length} courses available`}
            </p>
          </div>
          
          {/* Results summary */}
          {filteredCourses.length > 0 && (
            <div className='text-sm text-muted-foreground'>
              Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length}
            </div>
          )}
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
          {loading ? 
            [0, 1, 2, 3, 4, 5].map((item, index) => (
              <Skeleton key={index} className='w-full h-[300px] rounded-xl bg-purple-500/10'/>
            )) :
            currentCourses.length > 0 ? currentCourses?.map((course, index) => (
              <LazyLoad
                key={course.id || index}
                fallback={
                  <Skeleton className='w-full h-[300px] rounded-xl bg-purple-500/10'/>
                }
                rootMargin='100px'
                threshold={0.1}
              >
                <CourseCard course={course} />
              </LazyLoad>
            )) : (
              <div className='col-span-full text-center py-16 bg-card rounded-2xl border border-border'>
                <div className='text-6xl mb-4'>🔍</div>
                <h3 className='text-xl font-semibold text-foreground mb-2'>
                  {searchQuery ? 'No Courses Found' : 'No Courses Available'}
                </h3>
                <p className='text-muted-foreground'>
                  {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new courses'}
                </p>
                {searchQuery && (
                  <Button 
                    onClick={() => setSearchQuery('')}
                    className='mt-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )
          }
        </div>

        {/* Pagination */}
        {!loading && filteredCourses.length > coursesPerPage && (
          <div className='flex items-center justify-center gap-2 mt-8'>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='h-10 w-10 p-0 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ChevronLeft className='h-5 w-5' />
            </Button>
            
            <div className='flex items-center gap-1'>
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(1)}
                    className='h-10 w-10 p-0 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500'
                  >
                    1
                  </Button>
                  {currentPage > 4 && (
                    <span className='px-2 text-muted-foreground'>...</span>
                  )}
                </>
              )}
              
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === currentPage ||
                  page === currentPage - 1 ||
                  page === currentPage + 1 ||
                  page === currentPage - 2 ||
                  page === currentPage + 2
                )
                .map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className={`h-10 w-10 p-0 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500'
                    }`}
                  >
                    {page}
                  </Button>
                ))
              }
              
              {/* Last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className='px-2 text-muted-foreground'>...</span>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(totalPages)}
                    className='h-10 w-10 p-0 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500'
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='h-10 w-10 p-0 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ChevronRight className='h-5 w-5' />
            </Button>
          </div>
        )}

    </div>
  )
}

export default Explore
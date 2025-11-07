import React, { useState } from 'react'
import Image from 'next/image';
import { PlayCircle, Book, Settings, LoaderCircle, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import axios from 'axios';
import { toast } from "sonner";
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';


function CourseCard({course}) {
    // Handle both full courseJson and direct course properties
    const courseJson = course?.courseJson?.course;
    const [loading, setLoading] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const router = useRouter();
    
    // Fallback to course properties if courseJson is not available (explore page)
    const courseName = courseJson?.name || course?.name;
    const courseDescription = courseJson?.description || course?.description;
    const courseChapters = courseJson?.noOfChapters || course?.noOfChapters || 0;
    
    // Check if course has content - works for both explore and dashboard
    const hasContent = course?.hasContent || (course?.courseContent && course.courseContent.length > 0);
    
    const onEnrollCourse=async()=>{
        try{
         setLoading(true);
         const result=await axios.post('/api/enroll-course',{
             courseId:course?.cid
         });
         console.log(result.data);
         if(result.data.res){
            toast.warning('Already enrolled!', {
              description: 'This course is already in your learning dashboard'
            });
            setLoading(false);
            return;
         }
         
         // Show success dialog instead of simple toast
         setLoading(false);
         setShowSuccessDialog(true);
         
        }  
        catch(error){
            console.error('Enrollment error:', error);
            toast.error('Failed to enroll', {
              description: error.response?.data?.error || 'Please try again later'
            });
            setLoading(false);
        }
    }
    
    const handleGoToDashboard = () => {
      setShowSuccessDialog(false);
      router.push('/workspace');
    };
    
    const handleStartLearning = () => {
      setShowSuccessDialog(false);
      router.push(`/course/${course?.cid}`);
    };
    
    return (
      <>
         <motion.div 
            className='group bg-card rounded-2xl border border-border hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
         >
             <div className='relative overflow-hidden'>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                >
                    <Image src={course?.bannerImageURL} alt={course?.name}
                    width={400}
                    height={300}
                    className='w-full aspect-video object-cover'
                    />
                </motion.div>
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                
                {/* Badge */}
                {course?.level && (
                    <div className='absolute top-3 right-3 px-3 py-1 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full'>
                        {course.level}
                    </div>
                )}
             </div>
            <div className='p-5 flex flex-col gap-3'>
               <h2 className='font-bold text-lg text-foreground group-hover:text-purple-600 transition-colors line-clamp-2'>
                   {courseName}
               </h2>
               <p className='line-clamp-2 text-muted-foreground text-sm leading-relaxed'>
                   {courseDescription}
               </p>
               
               {/* Metadata */}
               <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                   <div className='flex items-center gap-1.5'>
                       <Book className='h-4 w-4 text-purple-600'/>
                       <span>{courseChapters} Chapters</span>
                   </div>
               </div>

               {/* Action Button */}
               <div className='mt-2'>
                   {hasContent ?
                   <Button 
                       size='default' 
                       onClick={onEnrollCourse}
                       disabled={loading}
                       className='w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-300'
                   > 
                       {loading ? (
                           <>
                               <LoaderCircle className='animate-spin h-4 w-4 mr-2' />
                               Enrolling...
                           </>
                       ) : (
                           <>
                               <PlayCircle className='h-4 w-4 mr-2'/>
                               Enroll Now
                           </>
                       )}
                   </Button> :
                   <Link href={'/workspace/edit-course/'+ course?.cid} className='block'> 
                       <Button 
                           size='default' 
                           variant='outline' 
                           className='w-full border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-500'
                       >
                           <Settings className='h-4 w-4 mr-2'/>
                           Generate Course 
                       </Button>
                   </Link>}
                </div>
            </div>
        </motion.div>
        
        {/* Success Enrollment Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0">
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 p-8 text-white">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                  <CheckCircle className="relative h-16 w-16 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">🎉 Enrolled Successfully!</h2>
                  <p className="text-purple-100 text-sm">
                    Course added to your learning dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Course Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-600">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-semibold">You're now enrolled in</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                  {courseName}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {courseDescription}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {courseChapters}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Chapters
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {course?.level || 'All'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Level
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleStartLearning}
                  className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-300 gap-2 group"
                >
                  <PlayCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Start Learning Now
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  onClick={handleGoToDashboard}
                  variant="outline"
                  className="w-full h-12 text-base border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950/30 transition-all duration-300"
                >
                  Go to My Dashboard
                </Button>
              </div>

              {/* Additional Info */}
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                You can access this course anytime from your dashboard
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
}

export default CourseCard
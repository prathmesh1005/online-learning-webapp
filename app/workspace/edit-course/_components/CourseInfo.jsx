import { Button } from '@/components/ui/button';
import { Clock, TrendingUp,Book, PlayCircle, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import CourseSuccessDialog from './CourseSuccessDialog';

function CourseInfo({course,viewCourse}) {
    const courseLayout=course?.courseJson.course;
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const router = useRouter();

    // Poll for progress updates more frequently
    useEffect(() => {
        let interval;
        if (loading && course?.cid) {
            // Start polling immediately
            const pollProgress = async () => {
                try {
                    const response = await axios.get(`/api/course-progress?courseId=${course.cid}`);
                    if (response.data.status !== 'not_found') {
                        setProgress(response.data);
                        
                        // Stop polling if completed or failed
                        if (response.data.status === 'completed' || response.data.status === 'failed') {
                            clearInterval(interval);
                            if (response.data.status === 'completed') {
                                setTimeout(() => {
                                    setLoading(false);
                                    setShowSuccessDialog(true);
                                }, 1000);
                            } else {
                                setLoading(false);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching progress:', error);
                }
            };

            // Poll immediately and then every 1 second for faster updates
            pollProgress();
            interval = setInterval(pollProgress, 1000); // Poll every 1 second for real-time feel
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [loading, course?.cid, router]);

    const GenerateCourseContent=async ()=>{
        //Call API to generate content

        setLoading(true);
        setProgress({
            status: 'starting',
            message: 'Initializing...',
            percentage: 0
        });
        
        try {
            const result= await axios.post('/api/generate-course-content', {
                courseId: course?.cid,
                courseTitle : course?.name,
                courseJson: course?.courseJson,
            });
            console.log(result.data);
            
            // Show completion message
            setProgress({
                status: 'completed',
                message: 'Course generated successfully!',
                percentage: 100,
                stats: result.data.stats
            });
            
            setTimeout(() => {
                setLoading(false);
                setShowSuccessDialog(true);
            }, 1000);
        }
        catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to generate course';
            setProgress({
                status: 'failed',
                message: errorMessage,
                percentage: 0
            });
            console.error("Error generating course content:", error);
            console.error("Error details:", error.response?.data);
            
            // Show user-friendly error message
            alert(`Failed to generate course: ${errorMessage}`);
        }
    };

    return (
        <div className='relative overflow-hidden'>
            {/* Background Decorative Elements */}
            <div className='absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10'></div>
            <div className='absolute bottom-0 left-0 w-72 h-72 bg-purple-400/5 rounded-full blur-3xl -z-10'></div>

            <div className='md:flex gap-8 justify-between p-8 rounded-3xl shadow-xl bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20 border border-purple-500/10'>
                <div className='flex flex-col gap-6 flex-1'>
                    {/* Course Title with Badge */}
                    <div className='space-y-3'>
                        <div className='inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full'>
                            <Sparkles className='h-3 w-3 text-purple-600' />
                            <span className='text-xs font-semibold text-purple-600 dark:text-purple-400'>Course Overview</span>
                        </div>
                        <h2 className='font-bold text-4xl bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent'>
                            {courseLayout?.name}
                        </h2>
                        <p className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3'>
                            {courseLayout?.description}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div className='group relative overflow-hidden flex gap-4 items-center p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105'>
                            <div className='p-3 rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/30'>
                                <Clock className='h-6 w-6'/>
                            </div>
                            <section>
                                <h2 className='font-semibold text-sm text-blue-600 dark:text-blue-400'>Duration</h2>
                                <h2 className='text-xl font-bold text-blue-900 dark:text-blue-100'>2 Hours</h2>
                            </section>
                            <div className='absolute -right-4 -top-4 w-20 h-20 bg-blue-400/10 rounded-full blur-2xl'></div>
                        </div>

                        <div className='group relative overflow-hidden flex gap-4 items-center p-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border border-green-200/50 dark:border-green-800/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105'>
                            <div className='p-3 rounded-xl bg-green-500 text-white shadow-lg shadow-green-500/30'>
                                <Book className='h-6 w-6'/>
                            </div>
                            <section>
                                <h2 className='font-semibold text-sm text-green-600 dark:text-green-400'>Chapters</h2>
                                <h2 className='text-xl font-bold text-green-900 dark:text-green-100'>
                                    {courseLayout?.chapters?.length || 0}
                                </h2>
                            </section>
                            <div className='absolute -right-4 -top-4 w-20 h-20 bg-green-400/10 rounded-full blur-2xl'></div>
                        </div>

                        <div className='group relative overflow-hidden flex gap-4 items-center p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border border-orange-200/50 dark:border-orange-800/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105'>
                            <div className='p-3 rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30'>
                                <TrendingUp className='h-6 w-6'/>
                            </div>
                            <section>
                                <h2 className='font-semibold text-sm text-orange-600 dark:text-orange-400'>Difficulty</h2>
                                <h2 className='text-xl font-bold text-orange-900 dark:text-orange-100 capitalize'>
                                    {course?.level}
                                </h2>
                            </section>
                            <div className='absolute -right-4 -top-4 w-20 h-20 bg-orange-400/10 rounded-full blur-2xl'></div>
                        </div>
                    </div>
                    {!viewCourse? (
                        <div className='space-y-4 mt-6'>
                            <Button 
                                onClick={GenerateCourseContent} 
                                disabled={loading}
                                className='w-full h-14 text-base bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-300'
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                        Generating Course...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className='mr-2 h-5 w-5' />
                                        Generate Content
                                    </>
                                )}
                            </Button>
                        
                        {/* Real-Time Progress Indicator */}
                        {loading && progress && (
                            <div className='p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl border-2 border-purple-300 dark:border-purple-700 space-y-4 shadow-lg'>
                                {/* Status Header */}
                                <div className='flex items-start justify-between gap-3'>
                                    <div className='flex items-center gap-2 flex-1'>
                                        <div className='relative'>
                                            <Loader2 className='h-5 w-5 text-purple-600 dark:text-purple-400 animate-spin' />
                                            <div className='absolute inset-0 h-5 w-5 text-purple-600 dark:text-purple-400 animate-ping opacity-20'></div>
                                        </div>
                                        <div className='flex-1'>
                                            <span className='font-semibold text-purple-800 dark:text-purple-200 text-sm block'>
                                                {progress.message || 'Processing...'}
                                            </span>
                                            {progress.status === 'processing' && progress.completedChapters !== undefined && (
                                                <span className='text-xs text-purple-600 dark:text-purple-400 mt-0.5 block'>
                                                    {progress.completedChapters > 0 
                                                        ? `Completed ${progress.completedChapters}/${progress.totalChapters} chapters` 
                                                        : 'Starting generation...'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-end'>
                                        <span className='text-2xl font-bold text-purple-600 dark:text-purple-400 tabular-nums'>
                                            {progress.percentage || 0}%
                                        </span>
                                        {progress.currentBatch && progress.totalBatches && (
                                            <span className='text-xs text-purple-500 dark:text-purple-400 mt-1'>
                                                Batch {progress.currentBatch}/{progress.totalBatches}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Animated Progress Bar */}
                                <div className='space-y-2'>
                                    <Progress 
                                        value={progress.percentage || 0} 
                                        className='h-3 bg-purple-200 dark:bg-purple-900/50' 
                                    />
                                    
                                    {/* Chapter Progress Indicator */}
                                    {progress.totalChapters && (
                                        <div className='flex items-center justify-between text-xs'>
                                            <div className='flex items-center gap-2 text-purple-600 dark:text-purple-400'>
                                                <Book className='h-3 w-3' />
                                                <span className='font-medium'>
                                                    {progress.completedChapters || 0} / {progress.totalChapters} Chapters
                                                </span>
                                            </div>
                                            {progress.status === 'processing' && (
                                                <span className='text-purple-500 dark:text-purple-400 animate-pulse'>
                                                    ⚡ Generating...
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Completion Stats */}
                                {progress.stats && (
                                    <div className='pt-3 border-t border-purple-300 dark:border-purple-700'>
                                        <div className='grid grid-cols-2 gap-3 text-xs'>
                                            <div className='flex items-center gap-2 text-green-600 dark:text-green-400'>
                                                <span className='text-base'>✅</span>
                                                <span className='font-medium'>
                                                    {progress.stats.successful} Successful
                                                </span>
                                            </div>
                                            {progress.stats.failed > 0 && (
                                                <div className='flex items-center gap-2 text-red-600 dark:text-red-400'>
                                                    <span className='text-base'>❌</span>
                                                    <span className='font-medium'>
                                                        {progress.stats.failed} Failed
                                                    </span>
                                                </div>
                                            )}
                                            <div className='flex items-center gap-2 text-purple-600 dark:text-purple-400 col-span-2'>
                                                <Clock className='h-3 w-3' />
                                                <span className='font-medium'>
                                                    Time: {progress.stats.totalTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Status Messages */}
                                {progress.status === 'completed' && (
                                    <div className='flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300'>
                                        <span className='text-lg'>🎉</span>
                                        <span>Course generated successfully!</span>
                                    </div>
                                )}
                                {progress.status === 'failed' && (
                                    <div className='flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium'>
                                        <span className='text-lg'>⚠️</span>
                                        <span>Generation failed. Please try again.</span>
                                    </div>
                                )}
                            </div>
                        )}
                        </div>
                    ) : (
                        <Link href={'/course/' + (course?.cid || '')} className='w-full'>
                            <Button className='w-full h-14 text-base bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-300 gap-2 group'> 
                                <PlayCircle className='h-5 w-5 group-hover:scale-110 transition-transform' /> 
                                Continue Learning 
                            </Button>
                        </Link>
                    )} 
                    
                </div>

                {/* Course Banner Image */}
                {course?.bannerImageURL && (
                    <div className="mt-6 md:mt-0 md:w-[450px] md:h-full relative group">
                        <div className='absolute inset-0 bg-purple-500/20 rounded-3xl blur-2xl group-hover:bg-purple-500/30 transition-all'></div>
                        <Image
                            src={course?.bannerImageURL}
                            alt="banner image"
                            width={450}
                            height={300}
                            className="relative rounded-3xl object-cover w-full h-full shadow-2xl border border-purple-500/20 group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}
            </div>
            
            {/* Success Dialog */}
            <CourseSuccessDialog 
                open={showSuccessDialog}
                onOpenChange={setShowSuccessDialog}
                courseId={course?.cid}
                courseName={course?.name}
                stats={progress?.stats}
            />
        </div>
    );
}
export default CourseInfo;
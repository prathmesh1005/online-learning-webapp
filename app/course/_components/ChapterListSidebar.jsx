import React from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useSelectedChapterIndex } from '@/context/SelectedChapterIndexContext';


function ChapterListSidebar({ courseInfo }) {

      // Extract joined enroll row from API result
      const enroll = courseInfo?.[0]?.enrollCourseTable || courseInfo?.[0]?.enrollCourse;

    // Debug: Log the entire courseInfo to see the actual structure
    console.log('ChapterListSidebar - Full courseInfo:', courseInfo);

    // Based on console logs, the structure is:
    // courseInfo: [{ courses: { courseContent: [...] }, enrollCourse: {...} }]
    const course = courseInfo?.[0];
    const courseContent = course?.courses?.courseContent;
    const { selectedChapterIndex, setSelectedChapterIndex } = useSelectedChapterIndex()

    console.log('ChapterListSidebar - course:', course);
    console.log('ChapterListSidebar - courseContent:', courseContent);
    console.log('ChapterListSidebar - selectedChapterIndex:', selectedChapterIndex);
    console.log('ChapterListSidebar - enroll:', enroll);

    // If no data, show loading state
    if (!courseInfo || !course) {
        return (
            <div className='w-96 h-screen bg-secondary p-5 overflow-y-auto'>
                <h2 className='my-3 font-bold text-xl'>Chapters (0)</h2>
                <div className='text-center py-8'>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <div className='text-gray-500'>Loading course information...</div>
                </div>
                <div className='mt-4 p-3 bg-white rounded border'>
                    <p className='text-sm'>Debug info:</p>
                    <p className='text-xs'>courseInfo: {JSON.stringify(courseInfo)}</p>
                    <p className='text-xs'>course: {JSON.stringify(course)}</p>
                </div>
            </div>
        );
    }

    // If no course content, show empty state
    if (!courseContent || !Array.isArray(courseContent) || courseContent.length === 0) {
        return (
            <div className='w-96 h-screen bg-secondary p-5 overflow-y-auto'>
                <h2 className='my-3 font-bold text-xl'>Chapters (0)</h2>
                <div className='text-center py-8'>
                    <div className='text-gray-500 text-lg'>No chapters available for this course.</div>
                    <div className='text-gray-400 text-sm mt-2'>Please check back later or contact support.</div>
                </div>
                <div className='mt-4 p-3 bg-white rounded border'>
                    <p className='text-sm'>Debug info:</p>
                    <p className='text-xs'>courseContent: {JSON.stringify(courseContent)}</p>
                    <p className='text-xs'>course.courses: {JSON.stringify(course?.courses)}</p>
                    <p className='text-xs'>course structure: {JSON.stringify(Object.keys(course || {}))}</p>
                </div>
            </div>
        );
    }

    // Normalize to number array for reliable comparison
    let completedChapter = (enroll?.completedChapters || [])
        .map((v)=> Number(v))
        .filter((v)=> Number.isFinite(v));
    
    console.log('ChapterListSidebar - completedChapter:', completedChapter);

    return (
        <div className='w-96 h-screen bg-secondary p-5 overflow-y-auto'>
            <h2 className='my-3 font-bold text-xl'>Chapters ({courseContent.length})</h2>
            <Accordion type="single" collapsible>
                {courseContent.map((chapter, index) => (
                    <AccordionItem 
                        value={chapter?.courseData?.chapterName || `chapter-${index}`} 
                        key={index}
                        onClick={() => setSelectedChapterIndex(index)}
                        className="mb-2"
                    >
                        <AccordionTrigger className= {`text-lg font-medium text-left truncate hover:bg-gray-100 transition-colors
                            ${completedChapter.includes(Number(index)) ? 'bg-green-100 border-green-200' : 'bg-white border-gray-200'}
                            ${selectedChapterIndex === index ? 'ring-2 ring-primary ring-opacity-50' : ''}`}>
                            {index + 1}. {chapter?.courseData?.chapterName || `Chapter ${index + 1}`}
                        </AccordionTrigger>
                        <AccordionContent asChild>
                            <div className="pt-2">
                                {chapter?.courseData?.topics && Array.isArray(chapter.courseData.topics) && chapter.courseData.topics.length > 0 ? (
                                    chapter.courseData.topics.map((topic, topicIndex) => (
                                        <div
                                            key={topicIndex}
                                            className={`p-3 my-1 rounded-lg truncate cursor-pointer hover:bg-gray-50 transition-colors
                                            ${completedChapter.includes(Number(index)) ? 'bg-green-50 border-l-4 border-green-400' : 'bg-white'}`}
                                        >
                                            {topic?.topic || `Topic ${topicIndex + 1}`}
                                        </div>
                                    ))
                                ) : (
                                    <div className='p-3 text-gray-500 text-sm'>No topics available for this chapter</div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default ChapterListSidebar

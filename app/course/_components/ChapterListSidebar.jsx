import React, { useContext } from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext';


function ChapterListSidebar({ courseInfo }) {
    // Debug: Log the entire courseInfo to see the actual structure
    console.log('ChapterListSidebar - Full courseInfo:', courseInfo);
    
    // Based on console logs, the structure is:
    // courseInfo: [{ courses: { courseContent: [...] }, enrollCourse: {...} }]
    const course = courseInfo?.[0];
    const courseContent = course?.courses?.courseContent;
    const {selectedChapterIndex,setSelectedChapterIndex}=useContext(SelectedChapterIndexContext)
    
    console.log('ChapterListSidebar - course:', course);
    console.log('ChapterListSidebar - courseContent:', courseContent);

    // If no data, show loading state
    if (!courseInfo || !course) {
        return (
            <div className='w-80 h-screen bg-secondary p-5'>
                <h2 className='my-3 font-bold text-xl'>Chapters (0)</h2>
                <div className='text-gray-500'>Loading course information...</div>
                <div className='mt-4 p-3 bg-white rounded border'>
                    <p className='text-sm'>Debug info:</p>
                    <p className='text-xs'>courseInfo: {JSON.stringify(courseInfo)}</p>
                </div>
            </div>
        );
    }

    // If no course content, show empty state
    if (!courseContent || !Array.isArray(courseContent) || courseContent.length === 0) {
        return (
            <div className='w-80 h-screen bg-secondary p-5'>
                <h2 className='my-3 font-bold text-xl'>Chapters (0)</h2>
                <div className='text-gray-500'>No chapters available for this course.</div>
                <div className='mt-4 p-3 bg-white rounded border'>
                    <p className='text-sm'>Debug info:</p>
                    <p className='text-xs'>courseContent: {JSON.stringify(courseContent)}</p>
                    <p className='text-xs'>course.courses: {JSON.stringify(course?.courses)}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='w-80 h-screen bg-secondary p-5'>
            <h2 className='my-3 font-bold text-xl'>Chapters ({courseContent.length})</h2>
            <Accordion type="single" collapsible>
                {courseContent.map((chapter, index) => (
                    <AccordionItem value={chapter?.courseData?.chapterName || `chapter-${index}`} key={index}
                    onClick={()=> setSelectedChapterIndex(index)}
                    >
                        <AccordionTrigger className='text-lg font-medium'>
                            {index + 1}. {chapter?.courseData?.chapterName || `Chapter ${index + 1}`}
                        </AccordionTrigger>
                        <AccordionContent asChild>
                            <div>
                                {chapter?.courseData?.topics && Array.isArray(chapter.courseData.topics) ? (
                                    chapter.courseData.topics.map((topic, topicIndex) => (
                                        <h2 key={topicIndex} className='p-3 bg-white my-1 rounded-lg'>
                                            {topic?.topic || `Topic ${topicIndex + 1}`}
                                        </h2>
                                    ))
                                ) : (
                                    <div className='p-3 text-gray-500'>No topics available</div>
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

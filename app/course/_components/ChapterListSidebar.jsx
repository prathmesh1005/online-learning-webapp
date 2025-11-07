import React, { useState } from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useSelectedChapterIndex } from '@/context/SelectedChapterIndexContext';
import { useSidebar } from '@/@/components/ui/sidebar';


function ChapterListSidebar({ courseInfo }) {

      // Extract joined enroll row from API result
      const enroll = courseInfo?.[0]?.enrollCourseTable || courseInfo?.[0]?.enrollCourse;
      
      // Get sidebar state for collapse/expand functionality
      const { open, isMobile } = useSidebar();
      
      // Track the selected topic for visual highlighting
      const [selectedTopic, setSelectedTopic] = useState({ chapterIndex: null, topicIndex: null });

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
            <aside className={`h-full bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
                open ? 'w-96' : 'w-0 overflow-hidden'
            }`}>
                <div className='p-5 border-b border-sidebar-border shrink-0'>
                    <h2 className='font-bold text-xl text-sidebar-foreground whitespace-nowrap'>Chapters (0)</h2>
                </div>
                <div className='flex-1 overflow-y-auto p-5 min-h-0'>
                    <div className='text-center py-8'>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sidebar-primary mx-auto mb-4"></div>
                        <div className='text-sidebar-foreground/70'>Loading course information...</div>
                    </div>
                    <div className='mt-4 p-3 bg-sidebar-accent rounded border border-sidebar-border'>
                        <p className='text-sm text-sidebar-foreground'>Debug info:</p>
                        <p className='text-xs text-sidebar-accent-foreground'>courseInfo: {JSON.stringify(courseInfo)}</p>
                    <p className='text-xs text-sidebar-accent-foreground'>course: {JSON.stringify(course)}</p>
                </div>
                </div>
            </aside>
        );
    }    // If no course content, show empty state
    if (!courseContent || !Array.isArray(courseContent) || courseContent.length === 0) {
        return (
            <aside className={`h-full bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
                open ? 'w-96' : 'w-0 overflow-hidden'
            }`}>
                <div className='p-5 border-b border-sidebar-border shrink-0'>
                    <h2 className='font-bold text-xl text-sidebar-foreground whitespace-nowrap'>Chapters (0)</h2>
                </div>
                <div className='flex-1 overflow-y-auto p-5 min-h-0'>
                    <div className='text-center py-8'>
                        <div className='text-sidebar-foreground/70 text-lg'>No chapters available for this course.</div>
                        <div className='text-sidebar-foreground/50 text-sm mt-2'>Please check back later or contact support.</div>
                    </div>
                    <div className='mt-4 p-3 bg-sidebar-accent rounded border border-sidebar-border'>
                        <p className='text-sm text-sidebar-foreground'>Debug info:</p>
                        <p className='text-xs text-sidebar-accent-foreground'>courseContent: {JSON.stringify(courseContent)}</p>
                        <p className='text-xs text-sidebar-accent-foreground'>course.courses: {JSON.stringify(course?.courses)}</p>
                        <p className='text-xs text-sidebar-accent-foreground'>course structure: {JSON.stringify(Object.keys(course || {}))}</p>
                    </div>
                </div>
            </aside>
        );
    }

    // Normalize to number array for reliable comparison
    let completedChapter = (enroll?.completedChapters || [])
        .map((v)=> Number(v))
        .filter((v)=> Number.isFinite(v));
    
    console.log('ChapterListSidebar - completedChapter:', completedChapter);

    return (
        <aside className={`h-full bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-all duration-300 ease-in-out ${
            open ? 'w-96' : 'w-0 overflow-hidden'
        }`}>
            <div className='p-5 border-b border-sidebar-border shrink-0'>
                <h2 className='font-bold text-xl text-sidebar-foreground whitespace-nowrap'>Chapters ({courseContent.length})</h2>
            </div>
            <div className='flex-1 overflow-y-auto p-5 min-h-0'>
                <Accordion type="single" collapsible>
                {courseContent.map((chapter, index) => (
                    <AccordionItem 
                        value={chapter?.courseData?.chapterName || `chapter-${index}`} 
                        key={index}
                        onClick={() => setSelectedChapterIndex(index)}
                        className="mb-2"
                    >
                        <AccordionTrigger className= {`text-lg font-medium text-left truncate hover:bg-sidebar-accent transition-colors text-sidebar-foreground
                            ${completedChapter.includes(Number(index)) ? 'bg-green-500/10 border-green-500/20' : 'bg-sidebar-accent border-sidebar-border'}
                            ${selectedChapterIndex === index ? 'ring-2 ring-sidebar-primary ring-opacity-50' : ''}`}>
                            {index + 1}. {chapter?.courseData?.chapterName || `Chapter ${index + 1}`}
                        </AccordionTrigger>
                        <AccordionContent asChild>
                            <div className="pt-2">
                                {chapter?.courseData?.topics && Array.isArray(chapter.courseData.topics) && chapter.courseData.topics.length > 0 ? (
                                    chapter.courseData.topics.map((topic, topicIndex) => {
                                        const isSelected = selectedTopic.chapterIndex === index && selectedTopic.topicIndex === topicIndex;
                                        return (
                                        <div
                                            key={topicIndex}
                                            onClick={() => {
                                                // Set the chapter index when topic is clicked
                                                setSelectedChapterIndex(index);
                                                
                                                // Set the selected topic for highlighting
                                                setSelectedTopic({ chapterIndex: index, topicIndex });
                                                
                                                // Scroll to the topic section in the content area
                                                setTimeout(() => {
                                                    const topicElement = document.getElementById(`topic-${index}-${topicIndex}`);
                                                    if (topicElement) {
                                                        topicElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                    }
                                                }, 100);
                                            }}
                                            className={`p-3 my-1 rounded-lg truncate cursor-pointer hover:bg-sidebar-primary/20 hover:border-l-4 hover:border-sidebar-primary transition-all text-sidebar-foreground
                                            ${isSelected ? 'bg-sidebar-primary text-sidebar-primary-foreground border-l-4 border-sidebar-primary shadow-md' : ''}
                                            ${completedChapter.includes(Number(index)) && !isSelected ? 'bg-green-500/10 border-l-4 border-green-400' : ''}
                                            ${!isSelected && !completedChapter.includes(Number(index)) ? 'bg-sidebar-accent border-l-4 border-transparent' : ''}`}
                                        >
                                            {topic?.topic || `Topic ${topicIndex + 1}`}
                                        </div>
                                    )})
                                ) : (
                                    <div className='p-3 text-sidebar-foreground/70 text-sm'>No topics available for this chapter</div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            </div>
        </aside>
    )
}

export default ChapterListSidebar

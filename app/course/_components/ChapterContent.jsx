"use client";

import { Button } from "@/components/ui/button";
import { useSelectedChapterIndex } from "@/context/SelectedChapterIndexContext";
import axios from "axios";
import { CheckCircle, Cross } from "lucide-react";
import { useParams } from "next/navigation";
import YouTube from "react-youtube";
import { toast } from "sonner";
import { useEffect, useState } from "react";

function ChapterContent({courseInfo, refreshData }){
  // Extract joined tables from first row of API response
  const enroll = courseInfo?.[0]?.enrollCourseTable || courseInfo?.[0]?.enrollCourse;
  const { selectedChapterIndex } = useSelectedChapterIndex();
  const { courseID: courseId } = useParams();
  
  // Debug logging
  console.log('ChapterContent - courseInfo:', courseInfo);
  console.log('ChapterContent - enroll:', enroll);
  console.log('ChapterContent - selectedChapterIndex:', selectedChapterIndex);
  console.log('ChapterContent - courseId:', courseId);
  
  // Handle loading state
  if (!courseInfo || courseInfo.length === 0) {
    return (
      <div className="flex-1 p-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }
  
  // Extract course data from API response
  const courseData = courseInfo[0]?.courses_table || courseInfo[0]?.courses;
  const courseContent = courseData?.courseContent;
  
  console.log('ChapterContent - courseData:', courseData);
  console.log('ChapterContent - courseContent:', courseContent);
  
  if (!courseContent || !Array.isArray(courseContent)) {
    return (
      <div className="flex-1 p-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No course content available</p>
          <p className="text-gray-400 text-sm mt-2">Please check back later or contact support.</p>
          <div className="mt-4 p-3 bg-gray-100 rounded text-left text-xs">
            <p>Debug info:</p>
            <p>courseData: {JSON.stringify(courseData)}</p>
            <p>courseContent: {JSON.stringify(courseContent)}</p>
          </div>
        </div>
      </div>
    );
  }
  
  const currentChapter = courseContent[selectedChapterIndex];
  
  console.log('ChapterContent - currentChapter:', currentChapter);
  
  if (!currentChapter) {
    return (
      <div className="flex-1 p-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Chapter not found</p>
          <p className="text-gray-400 text-sm mt-2">Selected chapter index: {selectedChapterIndex}</p>
          <p className="text-gray-400 text-sm">Available chapters: {courseContent.length}</p>
        </div>
      </div>
    );
  }
  
  const topics = currentChapter?.courseData?.topics || [];
  const videoData = currentChapter?.youtubeVideo || [];
  // Track completed chapters locally for optimistic UI and ensure numeric values
  const [localCompleted, setLocalCompleted] = useState([]);
  useEffect(() => {
    const normalized = (enroll?.completedChapters || [])
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v));
    setLocalCompleted(normalized);
  }, [enroll?.completedChapters]);
  
  console.log('ChapterContent - topics:', topics);
  console.log('ChapterContent - videoData:', videoData);
  console.log('ChapterContent - localCompleted (state):', localCompleted);

  const markChapterCompleted = async () => {
      const updatedCompletedChapter = Array.from(new Set([
        ...localCompleted,
        Number(selectedChapterIndex)
      ]));
      
      // Debug logging
      console.log('markChapterCompleted - courseId:', courseId);
      console.log('markChapterCompleted - updatedCompletedChapter:', updatedCompletedChapter);
      
      if (!courseId) {
        toast.error("Course ID is missing. Please refresh the page and try again.");
        return;
      }
      
      try {
        const result = await axios.put('/api/enroll-course', {
          courseId: courseId,
          completedChapter: updatedCompletedChapter
        });
        console.log('Chapter completed result:', result);
        // Optimistic: update local state immediately, then silently refresh
        setLocalCompleted(updatedCompletedChapter);
        await refreshData();
        toast.success("Chapter marked as completed");
      } catch (error) {
        console.error("Error marking chapter as completed:", error);
        console.error("Error details:", error.response?.data);
        toast.error("Failed to mark chapter as completed: " + (error.response?.data?.error || error.message));
      }
  }

    const markInCompleteChapter = async () => {
      const completeChap = localCompleted.filter(item => Number(item) !== Number(selectedChapterIndex));
      try {
        const result = await axios.put('/api/enroll-course', {
          courseId: courseId,
          completedChapter: completeChap
        });
        console.log('Chapter incomplete result:', result);
        // Optimistic update then refresh
        setLocalCompleted(completeChap);
        await refreshData();
        toast.success("Chapter marked as incomplete");
      } catch (error) {
        console.error("Error marking chapter as incomplete:", error);
        toast.error("Failed to mark chapter as incomplete");
      }
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">

      <div className="flex items-center justify-between mb-6">
      <h2 className="font-bold text-2xl">{selectedChapterIndex + 1}. {currentChapter?.courseData?.chapterName}</h2>
      { localCompleted?.includes(Number(selectedChapterIndex))? 
        <Button type="button" onClick={markInCompleteChapter} className="bg-green-600 hover:bg-green-700"> 
          <CheckCircle className="mr-2 h-4 w-4"/> Mark as Incomplete 
        </Button>:
        <Button type="button" variant="outline" onClick={markChapterCompleted}> 
          <Cross className="mr-2 h-4 w-4"/> Mark as Completed 
        </Button>
      }
      </div>
      
      
      <h2 className="my-2 font-bold text-lg">Related Videos 🎬 </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {videoData && videoData.length > 0 ? (
            videoData.map((video,index)=>index<2 && (
              <div key={index}>
                <YouTube
                   videoId={video?.videoId}
                   opts={{
                       height:'250',
                       width:'400',
                   }}
                />  
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No videos available for this chapter
            </div>
          )}
        </div>
        <div className="mt-7">
          {topics && topics.length > 0 ? (
            topics.map((topic,index)=>(
                <div key={index} className="mt-10 p-5 bg-secondary rounded-2xl">
                  <h2 className="font-bold text-2xl text-primary">{index+1}. {topic?.topic}</h2>
                  <div dangerouslySetInnerHTML={{__html:topic?.content}}
                  style={{
                    lineHeight:'2.5'
                  }}
                  ></div>
                </div>     
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No topics available for this chapter
            </div>
          )}
        </div>
    </div>
   )
}

export default ChapterContent;

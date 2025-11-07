"use client";
import { Button } from "@/components/ui/button";
import { useSelectedChapterIndex } from "@/context/SelectedChapterIndexContext";
import axios from "axios";
import { CheckCircle, Clock, BookOpen, Target } from "lucide-react";
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
  
  // Calculate reading time (average 200 words per minute)
  const calculateReadingTime = () => {
    if (!topics || topics.length === 0) return 0;
    const totalWords = topics.reduce((acc, topic) => {
      const text = topic.content?.replace(/<[^>]*>/g, '') || '';
      return acc + text.split(/\s+/).length;
    }, 0);
    return Math.ceil(totalWords / 200);
  };
  
  const readingTime = calculateReadingTime();
  
  // Track completed chapters locally for optimistic UI and ensure numeric values
  const [localCompleted, setLocalCompleted] = useState([]);
  useEffect(() => {
    const normalized = (enroll?.completedChapters || [])
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v));
    setLocalCompleted(normalized);
  }, [enroll?.completedChapters]);
  
  // Add copy buttons to code blocks
  useEffect(() => {
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll('.enhanced-content pre');
      codeBlocks.forEach((block) => {
        // Check if button already exists
        if (block.querySelector('.copy-button')) return;
        
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = '📋 Copy';
        button.style.cssText = `
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          padding: 0.375rem 0.75rem;
          background: rgba(147, 51, 234, 0.9);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        `;
        
        button.addEventListener('mouseenter', () => {
          button.style.background = 'rgba(168, 85, 247, 1)';
          button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
          button.style.background = 'rgba(147, 51, 234, 0.9)';
          button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', () => {
          const code = block.querySelector('code');
          const text = code?.textContent || '';
          navigator.clipboard.writeText(text).then(() => {
            button.innerHTML = '✓ Copied!';
            button.style.background = 'rgba(34, 197, 94, 0.9)';
            setTimeout(() => {
              button.innerHTML = '📋 Copy';
              button.style.background = 'rgba(147, 51, 234, 0.9)';
            }, 2000);
          });
        });
        
        block.style.position = 'relative';
        block.appendChild(button);
      });
    };
    
    // Add buttons after content loads
    const timer = setTimeout(addCopyButtons, 100);
    return () => clearTimeout(timer);
  }, [selectedChapterIndex, topics]);
  
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
    <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-purple-50/20 dark:from-gray-950 dark:to-purple-950/10">
      {/* Chapter Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full mb-3">
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                Chapter {selectedChapterIndex + 1}
              </span>
            </div>
            <h1 className="font-bold text-3xl md:text-4xl bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-3">
              {currentChapter?.courseData?.chapterName}
            </h1>
            
            {/* Chapter Metadata */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-purple-500/10">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-foreground">{topics.length} Topics</span>
              </div>
              
              {readingTime > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-purple-500/10">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-foreground">{readingTime} min read</span>
                </div>
              )}
              
              {videoData.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-purple-500/10">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-foreground">{videoData.length} Videos</span>
                </div>
              )}
            </div>
          </div>
          
          { localCompleted?.includes(Number(selectedChapterIndex))? 
            <Button 
              type="button" 
              onClick={markInCompleteChapter} 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300"
            > 
              <CheckCircle className="mr-2 h-5 w-5"/> 
              Completed
            </Button> :
            <Button 
              type="button" 
              onClick={markChapterCompleted} 
              variant="outline"
              className="border-2 border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-500 text-purple-600 dark:text-purple-400 shadow-sm"
            > 
              <CheckCircle className="mr-2 h-5 w-5"/> 
              Mark Complete
            </Button>
          }
        </div>
        <div className="h-1 w-32 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"></div>
      </div>
      
      {/* Video Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <span className="text-2xl">🎬</span>
          </div>
          <div>
            <h2 className="font-bold text-2xl text-foreground">Related Videos</h2>
            <p className="text-sm text-muted-foreground">Watch these videos to enhance your understanding</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videoData && videoData.length > 0 ? (
            videoData.map((video,index)=>index<2 && (
              <div key={index} className="group relative overflow-hidden rounded-2xl border-2 border-purple-500/20 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 bg-gray-900">
                <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
                <YouTube
                   videoId={video?.videoId}
                   opts={{
                       height:'280',
                       width:'100%',
                       playerVars: {
                         modestbranding: 1,
                       }
                   }}
                   className="relative z-10"
                />  
              </div>
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-12 px-6 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-purple-500/20">
              <div className="p-4 bg-purple-500/10 rounded-full mb-4">
                <span className="text-4xl">📹</span>
              </div>
              <p className="text-muted-foreground text-center">No videos available for this chapter</p>
            </div>
          )}
        </div>
      </div>

      {/* Topics Section */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/30">
            <span className="text-3xl">📚</span>
          </div>
          <div>
            <h2 className="font-bold text-2xl text-foreground">Learning Content</h2>
            <p className="text-sm text-muted-foreground">Master these topics step by step</p>
          </div>
        </div>

        <div className="space-y-10">
          {topics && topics.length > 0 ? (
            topics.map((topic,index)=>(
                <div 
                  key={index} 
                  id={`topic-${selectedChapterIndex}-${index}`}
                  className="group relative overflow-hidden scroll-mt-20"
                >
                  {/* Topic Card */}
                  <div className="relative bg-white dark:bg-gray-900 rounded-3xl border-2 border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
                    
                    {/* Topic Header */}
                    <div className="relative bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 px-8 py-6 border-b-2 border-purple-500/10">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/40 ring-4 ring-purple-500/20">
                          {index+1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-2xl md:text-3xl text-foreground mb-2 group-hover:text-purple-600 transition-colors leading-tight">
                            {topic?.topic}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"></div>
                            <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                              Topic {index+1} of {topics.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Topic Content - Enhanced Typography */}
                    <div className="relative px-8 py-8">
                      <style jsx global>{`
                        .enhanced-content h1 {
                          font-size: 2rem;
                          font-weight: 800;
                          margin-top: 2rem;
                          margin-bottom: 1rem;
                          color: rgb(124 58 237);
                          border-left: 4px solid rgb(124 58 237);
                          padding-left: 1rem;
                          line-height: 1.2;
                        }
                        
                        .enhanced-content h2 {
                          font-size: 1.75rem;
                          font-weight: 700;
                          margin-top: 2rem;
                          margin-bottom: 1rem;
                          color: rgb(147 51 234);
                          border-left: 3px solid rgb(147 51 234);
                          padding-left: 1rem;
                          line-height: 1.3;
                        }
                        
                        .enhanced-content h3 {
                          font-size: 1.5rem;
                          font-weight: 600;
                          margin-top: 1.75rem;
                          margin-bottom: 0.875rem;
                          color: rgb(168 85 247);
                          padding-left: 0.75rem;
                          border-left: 2px solid rgb(168 85 247);
                          line-height: 1.4;
                        }
                        
                        .enhanced-content h4 {
                          font-size: 1.25rem;
                          font-weight: 600;
                          margin-top: 1.5rem;
                          margin-bottom: 0.75rem;
                          color: rgb(192 132 252);
                          line-height: 1.4;
                        }
                        
                        .enhanced-content p {
                          font-size: 1.0625rem;
                          line-height: 1.9;
                          margin-bottom: 1.25rem;
                          color: rgb(71 85 105);
                          text-align: justify;
                        }
                        
                        .dark .enhanced-content p {
                          color: rgb(203 213 225);
                        }
                        
                        .enhanced-content strong {
                          font-weight: 700;
                          color: rgb(30 41 59);
                          background: linear-gradient(to right, rgb(243 232 255), transparent);
                          padding: 0.125rem 0.25rem;
                          border-radius: 0.25rem;
                        }
                        
                        .dark .enhanced-content strong {
                          color: rgb(241 245 249);
                          background: linear-gradient(to right, rgb(88 28 135 / 0.2), transparent);
                        }
                        
                        .enhanced-content ul, .enhanced-content ol {
                          margin-left: 1.5rem;
                          margin-bottom: 1.5rem;
                          margin-top: 1rem;
                        }
                        
                        .enhanced-content ul {
                          list-style-type: none;
                          padding-left: 0;
                        }
                        
                        .enhanced-content ul li {
                          position: relative;
                          padding-left: 2rem;
                          margin-bottom: 0.875rem;
                          line-height: 1.8;
                          color: rgb(71 85 105);
                        }
                        
                        .dark .enhanced-content ul li {
                          color: rgb(203 213 225);
                        }
                        
                        .enhanced-content ul li::before {
                          content: "→";
                          position: absolute;
                          left: 0.5rem;
                          color: rgb(147 51 234);
                          font-weight: bold;
                          font-size: 1.25rem;
                        }
                        
                        .enhanced-content ol {
                          counter-reset: item;
                          list-style-type: none;
                          padding-left: 0;
                        }
                        
                        .enhanced-content ol li {
                          position: relative;
                          padding-left: 2.5rem;
                          margin-bottom: 1rem;
                          line-height: 1.8;
                          color: rgb(71 85 105);
                        }
                        
                        .dark .enhanced-content ol li {
                          color: rgb(203 213 225);
                        }
                        
                        .enhanced-content ol li::before {
                          counter-increment: item;
                          content: counter(item);
                          position: absolute;
                          left: 0;
                          top: 0.125rem;
                          width: 1.75rem;
                          height: 1.75rem;
                          background: linear-gradient(135deg, rgb(147 51 234), rgb(168 85 247));
                          color: white;
                          border-radius: 0.5rem;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          font-weight: bold;
                          font-size: 0.875rem;
                          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.3);
                        }
                        
                        .enhanced-content blockquote {
                          border-left: 4px solid rgb(168 85 247);
                          background: linear-gradient(to right, rgb(243 232 255), rgb(250 245 255));
                          padding: 1.25rem 1.5rem;
                          margin: 1.5rem 0;
                          border-radius: 0.75rem;
                          font-style: italic;
                          color: rgb(88 28 135);
                          box-shadow: 0 2px 8px rgba(168, 85, 247, 0.1);
                        }
                        
                        .dark .enhanced-content blockquote {
                          background: linear-gradient(to right, rgb(88 28 135 / 0.2), rgb(88 28 135 / 0.1));
                          color: rgb(233 213 255);
                        }
                        
                        /* Inline code styling */
                        .enhanced-content code {
                          background: rgb(243 232 255);
                          color: rgb(124 58 237);
                          padding: 0.25rem 0.5rem;
                          border-radius: 0.375rem;
                          font-family: 'Courier New', 'Monaco', monospace;
                          font-size: 0.9375rem;
                          border: 1px solid rgb(233 213 255);
                          font-weight: 500;
                        }
                        
                        .dark .enhanced-content code {
                          background: rgb(88 28 135 / 0.2);
                          color: rgb(216 180 254);
                          border-color: rgb(88 28 135);
                        }
                        
                        /* Code block container - always dark background */
                        .enhanced-content pre {
                          background: #1e1b4b !important;
                          padding: 1.5rem !important;
                          border-radius: 1rem;
                          overflow-x: auto;
                          margin: 1.5rem 0;
                          border: 2px solid rgb(109 40 217);
                          box-shadow: 0 4px 20px rgba(88, 28, 135, 0.4);
                          position: relative;
                        }
                        
                        .dark .enhanced-content pre {
                          background: #1e1b4b !important;
                          border-color: rgb(139 92 246);
                          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
                        }
                        
                        /* Code inside pre blocks - light text on dark bg */
                        .enhanced-content pre code {
                          background: transparent !important;
                          color: rgb(226 232 240) !important;
                          border: none !important;
                          padding: 0 !important;
                          font-size: 0.9375rem;
                          line-height: 1.7;
                          display: block;
                          font-family: 'Courier New', 'Monaco', monospace;
                        }
                        
                        .dark .enhanced-content pre code {
                          color: rgb(226 232 240) !important;
                        }
                        
                        /* SQL, Python, JavaScript, and other code syntax highlighting */
                        .enhanced-content pre code .keyword {
                          color: rgb(196 181 253);
                          font-weight: 600;
                        }
                        
                        .enhanced-content pre code .string {
                          color: rgb(134 239 172);
                        }
                        
                        .enhanced-content pre code .comment {
                          color: rgb(148 163 184);
                          font-style: italic;
                        }
                        
                        .enhanced-content pre code .number {
                          color: rgb(252 165 165);
                        }
                        
                        .enhanced-content table {
                          width: 100%;
                          border-collapse: separate;
                          border-spacing: 0;
                          margin: 1.5rem 0;
                          border-radius: 0.75rem;
                          overflow: hidden;
                          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        }
                        
                        .enhanced-content th {
                          background: linear-gradient(135deg, rgb(147 51 234), rgb(168 85 247));
                          color: white;
                          padding: 1rem;
                          text-align: left;
                          font-weight: 600;
                          font-size: 0.9375rem;
                          text-transform: uppercase;
                          letter-spacing: 0.05em;
                        }
                        
                        .enhanced-content td {
                          padding: 1rem;
                          border-bottom: 1px solid rgb(226 232 240);
                          color: rgb(71 85 105);
                        }
                        
                        .dark .enhanced-content td {
                          border-bottom-color: rgb(51 65 85);
                          color: rgb(203 213 225);
                        }
                        
                        .enhanced-content tr:last-child td {
                          border-bottom: none;
                        }
                        
                        .enhanced-content tr:nth-child(even) {
                          background: rgb(250 245 255);
                        }
                        
                        .dark .enhanced-content tr:nth-child(even) {
                          background: rgb(88 28 135 / 0.1);
                        }
                        
                        .enhanced-content a {
                          color: rgb(124 58 237);
                          font-weight: 600;
                          text-decoration: underline;
                          text-decoration-color: rgb(216 180 254);
                          text-decoration-thickness: 2px;
                          text-underline-offset: 2px;
                          transition: all 0.2s;
                        }
                        
                        .enhanced-content a:hover {
                          color: rgb(147 51 234);
                          text-decoration-color: rgb(147 51 234);
                        }
                        
                        .enhanced-content hr {
                          border: none;
                          height: 2px;
                          background: linear-gradient(to right, transparent, rgb(168 85 247), transparent);
                          margin: 2rem 0;
                        }
                        
                        .enhanced-content img {
                          max-width: 100%;
                          height: auto;
                          border-radius: 1rem;
                          margin: 1.5rem 0;
                          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        }
                        
                        /* Special handling for code blocks with language labels */
                        .enhanced-content pre[class*="language-"],
                        .enhanced-content pre[class*="lang-"] {
                          background: #1e1b4b !important;
                        }
                        
                        /* Ensure all code blocks inside content have dark bg */
                        .enhanced-content div code,
                        .enhanced-content p code,
                        .enhanced-content li code {
                          background: rgb(243 232 255) !important;
                          color: rgb(124 58 237) !important;
                        }
                        
                        .dark .enhanced-content div code,
                        .dark .enhanced-content p code,
                        .dark .enhanced-content li code {
                          background: rgb(88 28 135 / 0.3) !important;
                          color: rgb(216 180 254) !important;
                        }
                        
                        /* Override any white backgrounds in code blocks */
                        .enhanced-content pre,
                        .enhanced-content pre * {
                          background: #1e1b4b !important;
                        }
                        
                        .enhanced-content pre code,
                        .enhanced-content pre code * {
                          color: rgb(226 232 240) !important;
                        }
                        
                        /* Specific fixes for common AI-generated code patterns */
                        .enhanced-content pre {
                          background-color: #1e1b4b !important;
                          color: #e2e8f0 !important;
                        }
                        
                        /* Make sure nested elements don't override */
                        .enhanced-content pre > * {
                          background: transparent !important;
                        }
                      `}</style>
                      
                      <div 
                        className="enhanced-content"
                        dangerouslySetInnerHTML={{__html:topic?.content}}
                      ></div>
                    </div>
                    
                    {/* Topic Footer */}
                    <div className="relative px-8 py-4 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 border-t border-purple-500/10">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Keep learning
                        </span>
                        {index < topics.length - 1 && (
                          <a 
                            href={`#topic-${selectedChapterIndex}-${index+1}`}
                            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 group/link"
                          >
                            Next Topic
                            <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>     
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-purple-500/20">
              <div className="p-6 bg-purple-500/10 rounded-full mb-4">
                <span className="text-6xl">📖</span>
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">No Topics Available</p>
              <p className="text-muted-foreground text-center max-w-md">
                Content for this chapter is being prepared. Please check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
   )
}

export default ChapterContent;

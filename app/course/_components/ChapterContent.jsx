import { Button } from "@/components/ui/button";
import { SelectedChapterIndexContext } from "@/context/SelectedChapterIndexContext";
import axios from "axios";
import { CheckCircle, Cross } from "lucide-react";
import { useParams } from "next/navigation";
import { useContext } from "react";
import YouTube from "react-youtube";

function ChapterContent({courseInfo, refreshData }){
  const {courses , enrollCourse} = courseInfo ?? '';

  const {selectedChapterIndex,setSelectedChapterIndex}=useContext(SelectedChapterIndexContext)
  
  // Handle loading state
  if (!courseInfo || courseInfo.length === 0) {
    return <div className="p-10">Loading...</div>;
  }
  
  // Extract course data from API response
  const courseData = courseInfo[0]?.courses_table || courseInfo[0]?.courses;
  const courseContent = courseData?.courseContent;
  
  if (!courseContent || !Array.isArray(courseContent)) {
    return <div className="p-10">No course content available</div>;
  }
  
  const currentChapter = courseContent[selectedChapterIndex];
  
  if (!currentChapter) {
    return <div className="p-10">Chapter not found</div>;
  }
  
  const topics = currentChapter?.courseData?.topics || [];
  const videoData = currentChapter?.youtubeVideo || [];
  const {courseId} = useParams();
  let completedChapter = enrollCourse?.completedChapter || [];

  const markChapterCompleted = async () => {
      completedChapter.push(selectedChapterIndex);
      const result = await axios.put('/api/enroll-course', {
        courseId: courseId,
        completedChapter: completedChapter
      });
      console.log(result);
      refreshData();
      toast.success("Chapter marked as completed");
  }

    const markInCompleteChapter = async () => {
      const completeChap = completedChapter.filter(item => item !== selectedChapterIndex);
      const result = await axios.put('/api/enroll-course', {
        courseId: courseId,
        completedChapter: completeChap
      });
      console.log(result);
      refreshData();
      toast.success("Chapter marked Incompleted");
  }



  return (
    <div>

      <div className="flex items-center justify-between">
      <h2 className="font-bold text-2xl">{selectedChapterIndex + 1}. {currentChapter?.courseData?.chapterName}</h2>
      { completedChapter?.includes(selectedChapterIndex)? < Button onClick={()=> markChapterCompleted} > 
      <CheckCircle/> Mark as Completed </Button>:
      <Button variant="outline"  onClick= {markInCompleteChapter} > <X/> Mark Incomplete </Button>}
      </div>
      
      
      <h2 className="my-2 font-bold text-lg">Related Videos 🎬 </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {videoData?.map((video,index)=>index<2 && (
            <div key={index}>
              <YouTube
                 videoId={video?.videoId}
                 opts={{
                     height:'250',
                     width:'400',
                 }}
              />  
            </div>
          ))}
        </div>
        <div className="mt-7">
          {topics.map((topic,index)=>(
              <div key={index} className="mt-10 p-5 bg-secondary rounded-2xl">
                <h2 className="font-bold text-2xl text-primary">{index+1}.{topic?.topic}</h2>
                <div dangerouslySetInnerHTML={{__html:topic?.content}}
                style={{
                  lineHeight:'2.5'
                }}
                ></div>
              </div>     
          ))}
        </div>
    </div>
   )
}

export default ChapterContent;

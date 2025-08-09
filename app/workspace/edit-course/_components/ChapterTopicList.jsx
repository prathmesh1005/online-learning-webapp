import React from 'react';
import { Gift } from 'lucide-react';

function ChapterTopicList({ course }) {
  const courseLayout = course?.courseJson?.course;

  return (
    <div>
      <h2 className="font-bold text-3xl mt-10 text-center">Chapters & Topics</h2>

      <div className="flex flex-col items-center mt-10">
        {courseLayout?.chapters.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className="w-full max-w-5xl">

            {/* Chapter Header */}
            <div className="text-center bg-purple-600 text-white py-4 rounded-t-xl">
              <h2 className="text-xl font-semibold">Chapter {chapterIndex + 1}</h2>
              <p>{chapter.chapterName}</p>
              <p>Duration: {chapter.duration || '4 hours'} | No. of Chapters: {chapter.topics?.length}</p>
            </div>

            {/* Topics */}
            <div className="relative">
              {chapter?.topics.map((topic, index) => (
                <div key={index} className="flex flex-col items-center relative">
                  
                  {/* Vertical line */}
                  <div className="h-10 bg-gray-300 w-1" />

                  {/* Node with number and topic */}
                  <div className="flex items-center gap-5">
                    {/* Left side text */}
                    {index % 2 !== 0 && (
                      <p className="w-[300px] text-right text-gray-700">
                        {topic}
                      </p>
                    )}

                    {/* Circle number */}
                    <h2 className="text-center rounded-full bg-gray-300 px-6 py-1 text-sm font-semibold">
                      {index + 1}
                    </h2>

                    {/* Right side text */}
                    {index % 2 === 0 && (
                      <p className="w-[300px] text-left text-gray-700">
                        {topic}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Gift Icon / Finish Box */}
              <div className="flex flex-col items-center">
                <div className="h-10 bg-gray-300 w-1" />
                <div className="flex items-center gap-5">
                  <Gift className="text-center rounded-full bg-gray-300 h-14 w-14 p-2" />
                  <h2 className="p-4 border shadow rounded-xl bg-green-600 text-white">Finish</h2>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterTopicList;

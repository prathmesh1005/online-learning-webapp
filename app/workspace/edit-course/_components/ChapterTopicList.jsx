import React from 'react';
import { Gift, Clock, BookOpen, Sparkles, CheckCircle, Trophy } from 'lucide-react';

function ChapterTopicList({ course }) {
  const courseLayout = course?.courseJson?.course;

  return (
    <div className="relative py-12">
      {/* Background Decorations */}
      <div className='absolute top-20 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10'></div>
      <div className='absolute bottom-20 left-0 w-72 h-72 bg-purple-400/5 rounded-full blur-3xl -z-10'></div>

      {/* Header Section */}
      <div className="text-center mb-16">
        <div className='inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4'>
          <Sparkles className='h-4 w-4 text-purple-600' />
          <span className='text-sm font-semibold text-purple-600 dark:text-purple-400'>Course Curriculum</span>
        </div>
        <h2 className="font-bold text-4xl bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-3">
          Chapters & Topics
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Follow the structured path to complete your learning journey
        </p>
      </div>

      {/* Chapters Container */}
      <div className="flex flex-col items-center gap-12">
        {courseLayout?.chapters.map((chapter, chapterIndex) => (
          <div key={chapterIndex} className="w-full max-w-5xl">

            {/* Chapter Header */}
            <div className="relative overflow-hidden mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
              
              <div className="relative text-center text-white py-8 px-6 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Chapter {chapterIndex + 1}</h2>
                </div>
                <p className="text-xl font-semibold mb-4">{chapter.chapterName}</p>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <Clock className="h-4 w-4" />
                    <span>{chapter.duration || '4 hours'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <BookOpen className="h-4 w-4" />
                    <span>{chapter.topics?.length} Topics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Topics Timeline */}
            <div className="relative px-4">
              {chapter?.topics.map((topic, index) => (
                <div key={index} className="flex flex-col items-center relative">
                  
                  {/* Connecting Line */}
                  <div className="h-12 w-1 bg-gradient-to-b from-purple-400 to-purple-500 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-400 to-purple-500 blur-sm"></div>
                  </div>

                  {/* Topic Node */}
                  <div className="flex items-center gap-6 w-full max-w-4xl group">
                    {/* Left side text (for odd indices) */}
                    {index % 2 !== 0 && (
                      <div className="flex-1 text-right">
                        <div className="inline-block max-w-md p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-purple-200 dark:border-purple-800 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                          <div className="flex items-center justify-end gap-2 mb-1">
                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                              Topic {index + 1}
                            </span>
                            <CheckCircle className="h-3 w-3 text-purple-600" />
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 font-medium">
                            {topic}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Circle Number - Center */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-lg ring-4 ring-purple-100 dark:ring-purple-900 group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                    </div>

                    {/* Right side text (for even indices) */}
                    {index % 2 === 0 && (
                      <div className="flex-1">
                        <div className="inline-block max-w-md p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-purple-200 dark:border-purple-800 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-3 w-3 text-purple-600" />
                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                              Topic {index + 1}
                            </span>
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 font-medium">
                            {topic}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Finish Section */}
              <div className="flex flex-col items-center mt-4">
                <div className="h-12 w-1 bg-gradient-to-b from-purple-500 to-green-500 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500 to-green-500 blur-sm"></div>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative flex items-center gap-6 p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-2xl">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Trophy className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-1">Chapter Complete!</h3>
                      <p className="text-green-100">Great job finishing all topics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Course Completion Badge */}
        <div className="relative group mt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 rounded-3xl shadow-2xl text-white">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Gift className="h-16 w-16" />
            </div>
            <h2 className="text-3xl font-bold">Course Completion</h2>
            <p className="text-purple-100 text-center max-w-md">
              Complete all chapters to earn your certificate and unlock new opportunities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChapterTopicList;

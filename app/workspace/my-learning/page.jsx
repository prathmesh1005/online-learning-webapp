'use client'
import React from 'react'
import EnrollCourseList from '../_components/EnrollCourseList'
import { GraduationCap, Sparkles, Target, TrendingUp } from 'lucide-react'

function MyLearning() {
  return (
    <div className='space-y-8'>
        {/* Hero Section */}
        <div className='relative overflow-hidden p-8 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500 rounded-3xl shadow-2xl'>
          {/* Decorative Elements */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl'></div>
          <div className='absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl'></div>
          <div className='absolute inset-0 bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=")] opacity-30'></div>
          
          {/* Content */}
          <div className='relative z-10 flex items-start justify-between'>
            <div className='flex-1'>
              <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4'>
                <Sparkles className='h-4 w-4 text-white' />
                <span className='text-white text-sm font-semibold'>Your Progress</span>
              </div>
              <h1 className='font-bold text-4xl md:text-5xl text-white mb-3 drop-shadow-lg'>
                My Learning Journey
              </h1>
              <p className='text-purple-100 text-lg mb-6 max-w-2xl'>
                Track your progress, continue where you left off, and achieve your learning goals
              </p>
              <div className='flex flex-wrap gap-4'>
                <div className='flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg'>
                  <Target className='h-5 w-5 text-white' />
                  <span className='text-white font-medium'>Stay Focused</span>
                </div>
                <div className='flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg'>
                  <TrendingUp className='h-5 w-5 text-white' />
                  <span className='text-white font-medium'>Keep Growing</span>
                </div>
              </div>
            </div>
            <div className='hidden lg:block'>
              <div className='p-4 bg-white/10 backdrop-blur-sm rounded-2xl'>
                <GraduationCap className='h-24 w-24 text-white' />
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <EnrollCourseList/>
    </div>
  )
}

export default MyLearning
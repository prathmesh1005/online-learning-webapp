'use client'
import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'
import EnrollCourseList from './_components/EnrollCourseList'

function Workspace() {
  return (
    <main>
      <WelcomeBanner />
      <EnrollCourseList />
      <CourseList />
    </main>
  )
}

export default Workspace
'use client'
import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'

function Workspace() {
  return (
    <main>
      <WelcomeBanner />
      <CourseList />
    </main>
  )
}

export default Workspace
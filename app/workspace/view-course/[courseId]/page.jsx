// import { useParams } from 'next/navigation';
import React from 'react'
import EditCourse from '../../edit-course/[courseId]/page';

function ViewCourse() {
  // const {courseID} = useParams();

  
  return (
    <div>
      <EditCourse viewCourse= {true}/>
    </div>
  )
}

export default ViewCourse

import { db } from "@/config/db";
import { coursesTable, enrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and,desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    const {courseId}=await req.json();
    const user=await currentUser();
    //if Course is already enrolled 
    const enrollCourses=await db.select().from(enrollCourseTable)
        .where(and(eq(enrollCourseTable.userEmail,user?.primaryEmailAddress.emailAddress),
             eq(enrollCourseTable.cid,courseId)));
    
            if(enrollCourses?.length==0){
                const result=await db.insert(enrollCourseTable)
                .values({
                    cid:courseId,
                    userEmail:user.primaryEmailAddress?.emailAddress
                }).returning(enrollCourseTable)

                return NextResponse.json(result);
            }
   return NextResponse.json({'resp':'Already Enrolled'})

}

export async function GET(req) {
  const startTime = Date.now();
  
  try {
    // Check authentication first (fast operation)
    const user = await currentUser();
    
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "User not logged in or email missing" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url); 
    const courseId = searchParams.get('courseId');

    // Add timeout handling at API level with longer timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 35000); // 35 second timeout
    });

    if (courseId) {
      const queryPromise = db
        .select()
        .from(coursesTable)
        .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
        .where(
          and(
            eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress),
            eq(enrollCourseTable.cid, courseId)
          )
        )
        .limit(1); // Add limit for single course query

      const result = await Promise.race([queryPromise, timeoutPromise]);
      return NextResponse.json(result);

    } else {
      const queryPromise = db
        .select()
        .from(coursesTable)
        .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
        .where(eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(enrollCourseTable.id))
        .limit(50); // Add reasonable limit to prevent fetching too much data

      const result = await Promise.race([queryPromise, timeoutPromise]);
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("GET /api/enroll-course failed:", error);
    
    // More informative error messages
    if (error.message === 'Database query timeout') {
      return NextResponse.json(
        { error: "Database query timed out. Please try again." },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to fetch enrolled courses" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const {completedChapter, courseId} = await req.json();

    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const result = await db
      .update(enrollCourseTable)
      .set({completedChapters: completedChapter})
      .where(
        and(
          eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress),
          eq(enrollCourseTable.cid, courseId)
        )
      )
      .returning(enrollCourseTable);

    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT /api/enroll-course failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

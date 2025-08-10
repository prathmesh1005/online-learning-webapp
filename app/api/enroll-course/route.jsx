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

export async function GET() {
  try {
    const user = await currentUser(); 

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not logged in or email missing" }, { status: 401 });
    }

    const result = await db
      .select()
      .from(coursesTable)
      .innerJoin(enrollCourseTable, eq(coursesTable.cid, enrollCourseTable.cid))
      .where(eq(enrollCourseTable.userEmail, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(enrollCourseTable.id)); // 

    return NextResponse.json(result);
  } catch (error) {
    console.error(" GET /api/enroll-course failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
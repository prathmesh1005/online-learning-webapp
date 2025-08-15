import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, desc, ne, sql } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function POST(req) {
    const { courseId, courseContent } = await req.json();

    try {
        const result = await db
            .update(coursesTable)
            .set({ courseContent: courseContent })
            .where(eq(coursesTable.cid, courseId))
            .returning({ updatedId: coursesTable.cid });

        if (result.length === 0) {
            return NextResponse.json({ error: "Course not found or no update occurred" }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Failed to update course content:", error);
        return NextResponse.json({ error: "Failed to update course content" }, { status: 500 });
    }
}

export async function GET(req) {

    const {searchParams}=new URL(req.url);
    const courseId=searchParams.get('courseId')
    const user= await currentUser()

    if(courseId=="0"){
        const result=await db.select().from(coursesTable)
      .where(sql`${coursesTable.courseContent}::jsonb != '{}'::jsonb`)
    console.log(result);
    
    return NextResponse.json(result);

    }
    if(courseId){
    const result=await db.select().from(coursesTable)
        .where(eq(coursesTable.cid,courseId));

    console.log(result);
    
    return NextResponse.json(result[0]);
    }
    else{
        const result=await db.select().from(coursesTable)
        .where(eq(coursesTable.userEmail, user.primaryEmailAddress?.emailAddress))
        .orderBy(desc(coursesTable.id));
    console.log(result);
    
    return NextResponse.json(result);}
   
}
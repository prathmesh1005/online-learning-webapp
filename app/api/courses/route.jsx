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
    try {
        const {searchParams}=new URL(req.url);
        const courseId=searchParams.get('courseId')
        const user= await currentUser()

        // Reduce timeout to 15 seconds for faster failure detection
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Database query timeout')), 15000);
        });

        if(courseId=="0"){
            // Optimize query - only select fields needed for course cards
            const queryPromise = db.select({
                id: coursesTable.id,
                cid: coursesTable.cid,
                name: coursesTable.name,
                description: coursesTable.description,
                noOfChapters: coursesTable.noOfChapters,
                level: coursesTable.level,
                category: coursesTable.category,
                bannerImageURL: coursesTable.bannerImageURL,
                userEmail: coursesTable.userEmail,
                includeVideos: coursesTable.includeVideos,
                hasContent: coursesTable.courseContent // Add this to check if content exists
            }).from(coursesTable)
                .where(sql`${coursesTable.courseContent} IS NOT NULL AND ${coursesTable.courseContent}::jsonb != '{}'::jsonb`)
                .orderBy(desc(coursesTable.id))
                .limit(50); // Reduced from 100
            
            const result = await Promise.race([queryPromise, timeoutPromise]);
            console.log(`Fetched ${result.length} courses for explore`);
            
            // Mark courses as having content for the UI
            const coursesWithFlag = result.map(course => ({
                ...course,
                hasContent: true // All courses here have content since we filtered for it
            }));
            
            return NextResponse.json(coursesWithFlag);
        }
        if(courseId){
            const queryPromise = db.select().from(coursesTable)
                .where(eq(coursesTable.cid,courseId))
                .limit(1);

            const result = await Promise.race([queryPromise, timeoutPromise]);
            console.log(result);
            
            if (result.length === 0) {
                return NextResponse.json({ error: "Course not found" }, { status: 404 });
            }
            
            // Ensure the data is properly serializable
            const courseData = {
                ...result[0],
                courseContent: result[0].courseContent || {},
                courseJson: result[0].courseJson || {}
            };
            
            return NextResponse.json(courseData);
        }
        else{
            if (!user?.primaryEmailAddress?.emailAddress) {
                return NextResponse.json(
                    { error: "User not logged in or email missing" },
                    { status: 401 }
                );
            }

            const queryPromise = db.select().from(coursesTable)
                .where(eq(coursesTable.userEmail, user.primaryEmailAddress?.emailAddress))
                .orderBy(desc(coursesTable.id))
                .limit(50); // Add reasonable limit
            
            const result = await Promise.race([queryPromise, timeoutPromise]);
            console.log(result);
            
            // Ensure all courses are properly serializable
            const serializedResult = result.map(course => ({
                ...course,
                courseContent: course.courseContent || {},
                courseJson: course.courseJson || {}
            }));
            
            return NextResponse.json(serializedResult);
        }
    } catch (error) {
        console.error("GET /api/courses failed:", error);
        
        // More informative error messages
        if (error.message === 'Database query timeout') {
            return NextResponse.json(
                { error: "Database query timed out. Please try again." },
                { status: 504 }
            );
        }
        
        return NextResponse.json(
            { error: error.message || "Failed to fetch courses" },
            { status: 500 }
        );
    }
}
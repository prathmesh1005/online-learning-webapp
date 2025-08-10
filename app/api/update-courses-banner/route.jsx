import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { NextResponse } from "next/server";
import axios from "axios";
import { eq } from "drizzle-orm";

const GenerateImage = async(ImagePrompt) => {
  const BASE_URL='https://aigurulab.tech';
  const result = await axios.post(BASE_URL+'/api/generate-image',
        {
            width: 1024,
            height: 1024,
            input: ImagePrompt,
            model: 'sdxl',
            aspectRatio:"16:9"
        },
        {
            headers: {
                'x-api-key': process?.env?.AI_GURU_LAB_API,
                'Content-Type': 'application/json',
            },
        })
  return result.data.image;
}

export async function POST() {
  try {
    // Get all courses that don't have bannerImageURL
    const courses = await db.select().from(coursesTable);
    
    const updatedCourses = [];
    
    for (const course of courses) {
      if (!course.bannerImageURL || course.bannerImageURL === null) {
        let bannerImageURL = null;
        
        // Try to generate image from course data
        if (course.courseJson?.course?.bannerImagePrompt) {
          try {
            bannerImageURL = await GenerateImage(course.courseJson.course.bannerImagePrompt);
          } catch (error) {
            console.error(`Error generating image for course ${course.id}:`, error);
            bannerImageURL = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1024&h=576&fit=crop";
          }
        } else {
          // Generate a prompt based on course name and category
          const prompt = `Modern, flat-style 2D digital illustration for ${course.name || 'learning course'} in ${course.category || 'education'} category. Include UI/UX elements like mockup screens, text blocks, icons, buttons, and creative workspace tools. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational. Present the banner concept in a 3D perspective.`;
          
          try {
            bannerImageURL = await GenerateImage(prompt);
          } catch (error) {
            console.error(`Error generating image for course ${course.id}:`, error);
            bannerImageURL = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1024&h=576&fit=crop";
          }
        }
        
        // Update the course with bannerImageURL
        await db.update(coursesTable)
          .set({ bannerImageURL: bannerImageURL })
          .where(eq(coursesTable.id, course.id));
        
        updatedCourses.push({
          id: course.id,
          name: course.name,
          bannerImageURL: bannerImageURL
        });
      }
    }
    
    return NextResponse.json({
      message: `Updated ${updatedCourses.length} courses with banner images`,
      updatedCourses: updatedCourses
    });
    
  } catch (error) {
    console.error("Error updating courses:", error);
    return NextResponse.json(
      { error: "Failed to update courses" },
      { status: 500 }
    );
  }
}


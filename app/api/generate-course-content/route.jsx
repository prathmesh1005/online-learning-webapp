import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});



const PROMPT = `Depends on Chapter name and Topic , Generate content for each topic in HTML and give response in JSON format with the following structure:
    Schema:{
    chapterName: <>,
    {
    topic:<>,
    content: <>
    }
    }
    : User Input:`

// Helper function to add delay between API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate content with retry logic
async function generateChapterContent(chapter, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const config = {
                thinkingConfig: {
                    thinkingBudget: -1,
                },
            };
            const model = 'gemini-2.5-pro';
            const contents = [
                {
                    role: 'user',
                    parts: [
                        {
                            text: `${PROMPT} ${JSON.stringify(chapter)}`,
                        },
                    ],
                },
            ];

            const response = await ai.models.generateContent({
                model,
                config,
                contents,
            });

            const rawResponse = response.candidates[0].content.parts[0].text;
            const rawJson = rawResponse.replace('```json', '').replace('```', '');
            const jsonResp = JSON.parse(rawJson);

            const youtubeData = await GetYoutubeVideo(chapter?.chapterName);

            return {
                youtubeVideo: youtubeData,
                courseData: jsonResp,
            };
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed for chapter ${chapter?.chapterName}:`, error);
            
            if (error.status === 429) {
                // Rate limit exceeded, wait longer
                const waitTime = Math.pow(2, attempt) * 15000; // Exponential backoff: 15s, 30s, 60s
                console.log(`Rate limit hit. Waiting ${waitTime/1000} seconds before retry...`);
                await delay(waitTime);
            } else if (attempt === retries - 1) {
                // Last attempt failed, return error response
                return {
                    error: `Failed to generate content for chapter: ${chapter?.chapterName}`,
                    youtubeVideo: await GetYoutubeVideo(chapter?.chapterName),
                    courseData: null
                };
            } else {
                // Other error, wait a bit before retry
                await delay(5000);
            }
        }
    }
}

export async function POST(req) {
    try {
        const { courseId, courseTitle, courseJson } = await req.json();

        // Process chapters sequentially to avoid rate limits
        const CourseContent = [];
        for (let i = 0; i < courseJson?.course?.chapters?.length; i++) {
            const chapter = courseJson.course.chapters[i];
            console.log(`Processing chapter ${i + 1}/${courseJson.course.chapters.length}: ${chapter?.chapterName}`);
            
            const chapterContent = await generateChapterContent(chapter);
            CourseContent.push(chapterContent);
            
            // Add delay between chapters to respect rate limits (except for last chapter)
            if (i < courseJson.course.chapters.length - 1) {
                console.log('Waiting 15 seconds before next chapter...');
                await delay(15000); // 15 second delay between chapters
            }
        }

        console.log("Generated Course Content:", JSON.stringify(CourseContent, null, 2));

        const dbResp = await db
            .update(coursesTable)
            .set({ courseContent: CourseContent })
            .where(eq(coursesTable.cid, courseId));

        console.log("Update result:", dbResp);
        return NextResponse.json({
            courseName: courseTitle,
            CourseContent: CourseContent,
        });

    } catch (error) {
        console.error("Error in POST function:", error);
        return NextResponse.json(
            { error: "Failed to generate course content" },
            { status: 500 }
        );
    }
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const GetYoutubeVideo = async (topic) => {
    const params = {
        part: 'snippet',
        q: topic,
        type: 'video',
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 4,
    }

    const resp = await axios.get(YOUTUBE_BASE_URL, { params });
    const youtubeVideosListResp = resp.data.items;
    const youtubeVideoList = [];
    youtubeVideosListResp.forEach(item => {
        const data = {
            videoId: item.id?.videoId,
            title: item?.snippet?.title,
        }
        youtubeVideoList.push(data);
    });


    console.log("Youtube Videos List:", youtubeVideoList);
    return youtubeVideoList;

}

import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { updateProgress, clearProgress } from "./progress";

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
            const model = "gemini-2.5-flash"
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

            // Try to get YouTube videos, but don't fail if it doesn't work
            let youtubeData = [];
            try {
                youtubeData = await GetYoutubeVideo(chapter?.chapterName);
            } catch (ytError) {
                console.warn(`⚠️ Could not fetch YouTube videos for ${chapter?.chapterName}:`, ytError.message);
                // Continue without YouTube videos
            }

            return {
                youtubeVideo: youtubeData,
                courseData: jsonResp,
            };
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed for chapter ${chapter?.chapterName}:`, error);
            
            if (error.status === 429) {
                // Rate limit exceeded, wait with exponential backoff
                const waitTime = Math.pow(2, attempt) * 10000; // Exponential backoff: 10s, 20s, 40s
                console.log(`⚠️ Rate limit hit. Waiting ${waitTime/1000} seconds before retry...`);
                await delay(waitTime);
            } else if (attempt === retries - 1) {
                // Last attempt failed, return error response
                console.error(`❌ Failed after ${retries} attempts: ${chapter?.chapterName}`);
                return {
                    error: `Failed to generate content for chapter: ${chapter?.chapterName}`,
                    youtubeVideo: await GetYoutubeVideo(chapter?.chapterName).catch(() => []),
                    courseData: null
                };
            } else {
                // Other error, wait a bit before retry
                console.log(`🔄 Retrying in 3 seconds...`);
                await delay(3000); // Reduced from 5s to 3s
            }
        }
    }
}

// Process chapters in parallel batches for faster generation
async function processChaptersInBatches(chapters, batchSize = 3, courseId = null) {
    const results = [];
    const totalBatches = Math.ceil(chapters.length / batchSize);
    const totalChapters = chapters.length;
    
    for (let i = 0; i < chapters.length; i += batchSize) {
        const batch = chapters.slice(i, i + batchSize);
        const currentBatch = Math.floor(i / batchSize) + 1;
        
        console.log(`\n🚀 Processing batch ${currentBatch}/${totalBatches} (${batch.length} chapters)`);
        batch.forEach((chapter, idx) => {
            console.log(`   - Chapter ${i + idx + 1}: ${chapter?.chapterName}`);
        });
        
        // Update progress
        if (courseId) {
            updateProgress(courseId, {
                status: 'processing',
                currentBatch,
                totalBatches,
                completedChapters: i,
                totalChapters,
                message: `Processing chapters ${i + 1}-${Math.min(i + batchSize, totalChapters)}...`,
                percentage: Math.round((i / totalChapters) * 100)
            });
        }
        
        // Process batch in parallel
        const batchPromises = batch.map((chapter, idx) => {
            const chapterNumber = i + idx + 1;
            return generateChapterContent(chapter)
                .then(result => {
                    console.log(`   ✅ Completed: Chapter ${chapterNumber}`);
                    return result;
                })
                .catch(error => {
                    console.error(`   ❌ Failed: Chapter ${chapterNumber}`, error);
                    return {
                        error: `Failed to generate chapter ${chapterNumber}`,
                        youtubeVideo: [],
                        courseData: null
                    };
                });
        });
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Update progress after batch completion
        if (courseId) {
            updateProgress(courseId, {
                status: 'processing',
                currentBatch,
                totalBatches,
                completedChapters: i + batch.length,
                totalChapters,
                message: `Completed ${i + batch.length}/${totalChapters} chapters`,
                percentage: Math.round(((i + batch.length) / totalChapters) * 100)
            });
        }
        
        // Add delay between batches (not between each chapter)
        if (i + batchSize < chapters.length) {
            console.log(`⏳ Waiting 8 seconds before next batch...`);
            await delay(8000); // Reduced from 15s to 8s
        }
    }
    
    return results;
}

export async function POST(req) {
    try {
        const { courseId, courseTitle, courseJson } = await req.json();
        
        // Validate required environment variables
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ GEMINI_API_KEY is not configured");
            return NextResponse.json(
                { error: "Server configuration error", details: "GEMINI_API_KEY is not configured" },
                { status: 500 }
            );
        }
        
        if (!process.env.YOUTUBE_API_KEY) {
            console.warn("⚠️ YOUTUBE_API_KEY is not configured - YouTube videos will not be included");
        }
        
        // Validate input data
        if (!courseId || !courseTitle || !courseJson) {
            console.error("❌ Missing required parameters");
            return NextResponse.json(
                { error: "Missing required parameters", details: "courseId, courseTitle, and courseJson are required" },
                { status: 400 }
            );
        }
        
        if (!courseJson?.course?.chapters || courseJson.course.chapters.length === 0) {
            console.error("❌ No chapters found in course JSON");
            return NextResponse.json(
                { error: "Invalid course data", details: "No chapters found in course JSON" },
                { status: 400 }
            );
        }
        
        const totalChapters = courseJson?.course?.chapters?.length || 0;

        console.log(`\n📚 Starting course generation: ${courseTitle}`);
        console.log(`📊 Total chapters: ${totalChapters}`);
        console.log(`⚡ Using parallel batch processing (3 chapters per batch)\n`);

        // Initialize progress
        updateProgress(courseId, {
            status: 'starting',
            currentBatch: 0,
            totalBatches: Math.ceil(totalChapters / 3),
            completedChapters: 0,
            totalChapters,
            message: 'Initializing course generation...',
            percentage: 0
        });

        const startTime = Date.now();

        // Process chapters in parallel batches with progress tracking
        const CourseContent = await processChaptersInBatches(
            courseJson.course.chapters,
            3, // Process 3 chapters at a time
            courseId // Pass courseId for progress tracking
        );

        const endTime = Date.now();
        const totalTime = ((endTime - startTime) / 1000).toFixed(2);
        
        console.log(`\n✨ Course generation completed in ${totalTime} seconds`);
        console.log(`📈 Average time per chapter: ${(totalTime / totalChapters).toFixed(2)} seconds`);

        // Count successful vs failed chapters
        const successful = CourseContent.filter(c => !c.error).length;
        const failed = CourseContent.filter(c => c.error).length;
        
        console.log(`✅ Successful: ${successful}/${totalChapters}`);
        if (failed > 0) {
            console.log(`⚠️ Failed: ${failed}/${totalChapters}`);
        }

        // Update progress - saving to database
        updateProgress(courseId, {
            status: 'saving',
            completedChapters: totalChapters,
            totalChapters,
            message: 'Saving to database...',
            percentage: 95
        });

        const dbResp = await db
            .update(coursesTable)
            .set({ courseContent: CourseContent })
            .where(eq(coursesTable.cid, courseId));

        console.log("💾 Saved to database");
        
        // Update progress - completed
        updateProgress(courseId, {
            status: 'completed',
            completedChapters: totalChapters,
            totalChapters,
            message: 'Course generation completed!',
            percentage: 100,
            stats: {
                totalChapters,
                successful,
                failed,
                totalTime: `${totalTime}s`,
                avgTimePerChapter: `${(totalTime / totalChapters).toFixed(2)}s`
            }
        });

        // Clear progress after 30 seconds
        setTimeout(() => clearProgress(courseId), 30000);
        
        return NextResponse.json({
            courseName: courseTitle,
            CourseContent: CourseContent,
            stats: {
                totalChapters,
                successful,
                failed,
                totalTime: `${totalTime}s`,
                avgTimePerChapter: `${(totalTime / totalChapters).toFixed(2)}s`
            }
        });

    } catch (error) {
        console.error("❌ Error in POST function:", error);
        console.error("Error stack:", error.stack);
        
        // Try to get courseId from request body
        let courseId;
        try {
            const body = await req.json();
            courseId = body.courseId;
        } catch (e) {
            // Could not parse body
        }
        
        // Update progress - failed
        if (courseId) {
            updateProgress(courseId, {
                status: 'failed',
                message: error.message || 'Course generation failed',
                percentage: 0
            });
        }
        
        // Provide detailed error information
        const errorDetails = {
            message: error.message,
            type: error.constructor.name,
            ...(error.response?.data && { apiError: error.response.data })
        };
        
        return NextResponse.json(
            { 
                error: "Failed to generate course content", 
                details: error.message,
                fullError: JSON.stringify(errorDetails)
            },
            { status: 500 }
        );
    }
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const GetYoutubeVideo = async (topic) => {
    // Check if YouTube API key is configured
    if (!process.env.YOUTUBE_API_KEY) {
        console.warn('⚠️ YouTube API key not configured, skipping video search');
        return [];
    }
    
    try {
        const params = {
            part: 'snippet',
            q: topic,
            type: 'video',
            key: process.env.YOUTUBE_API_KEY,
            maxResults: 4,
        }

        const resp = await axios.get(YOUTUBE_BASE_URL, { params });
        const youtubeVideosListResp = resp.data.items || [];
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
    } catch (error) {
        console.error('Error fetching YouTube videos:', error.message);
        return []; // Return empty array on error
    }
}

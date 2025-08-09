import axios from "axios";
import { ai } from "../geenerate-course-layout/route";
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";



const PROMPT = `Depends on Chapter name and Topic , Generate content for each topic in HTML and give response in JSON format with the following structure:
    Schema:{
    chapterName: <>,
    {
    topic:<>,
    content: <>
    }
    }
    : User Input:`

export async function POST(req) {

    const { courseId, courseTitle, courseJson } = await req.json();

    const promises = courseJson?.course?.chapters?.map(async (chapter) => {
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
    });

    const CourseContent = await Promise.all(promises);

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

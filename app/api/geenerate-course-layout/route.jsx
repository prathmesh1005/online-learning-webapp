import { db } from "@/config/db";  
import { coursesTable } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import {
  GoogleGenAI,
} from '@google/genai';
import { NextResponse } from 'next/server';

const PROMPT = `
Generate a Learning Course based on the following user details.
Make sure the output is strictly in JSON format and follows the schema below.

Include:
- Course Name
- Description
- Category
- Level
- Include Video (boolean)
- Number of Chapters
- Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing the user topic.
  Include UI/UX elements like mockup screens, text blocks, icons, buttons, and creative workspace tools.
  Add symbolic elements related to the user's course, such as sticky notes, design components, and visual aids.
  Use a vibrant color palette (blues, purples, oranges) with a clean, professional look.
  The illustration should feel creative, tech-savvy, and educational.
  Present the banner concept in a 3D perspective.)
- Chapters: Each chapter must include a chapter name, duration, and a list of topics.

Schema:

{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": true/false,
    "noOfChapters": number,
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": ["string"]
      }
    ]
  }
}

User Input:`;



export async function POST(req) {
  const {courseId ,...formData} = await req.json();
  const user = await currentUser() ;
  // To run this code you need to install the following dependencies:
  // npm install @google/genai mime
  // npm install -D @types/node



  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const tools = [
    {
      googleSearch: {
      }
    },
  ];
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    tools,
  };
  const model = 'gemini-2.5-pro';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: PROMPT + JSON.stringify(formData),
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });
  const text =
  response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  console.log("AI Output:", text);

  const RawResp = response?.candidates?.[0]?.content?.parts?.[0]?.text
  const RawJson = RawResp.replace('```json','').replace('```','');
  const JSONResp = JSON.parse(RawJson);

  //Save to Database
  const result = await db.insert(coursesTable).values({
    cid: courseId,
    name: JSONResp.course.name,
    description: JSONResp.course.description,
    noOfChapters: JSONResp.course.noOfChapters,
    includeVideos: JSONResp.course.includeVideo,
    level: JSONResp.course.level,
    category: JSONResp.course.category,
    courseJson: JSONResp,
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  return NextResponse.json({courseId : courseId});
  
}
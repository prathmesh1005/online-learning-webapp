import { db } from "@/config/db";  
import { coursesTable } from '@/config/schema';
import { currentUser } from '@clerk/nextjs/server';
import {
  GoogleGenAI,
} from '@google/genai';
import axios from "axios";
import { NextResponse } from 'next/server';

const PROMPT = `
Generate a Learning Course based on the following user details.
Make sure the output is strictly in JSON format and follows the schema below.
Please keep all string fields under 200 characters. Do not add extra commentary or formatting.

Include:
- Course Name
- Description
- Category
- Level
- Include Video (boolean)
- Number of Chapters
- Banner Image Prompt (Keep under 200 characters. Create a modern, flat-style 2D digital illustration representing the user topic.
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
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
async function getValidAIResponse(ai, model, config, contents, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await ai.models.generateContent({ model, config, contents });
    const RawResp = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log(`AI Output (attempt ${attempt + 1}):`, RawResp);
    
    let RawJson = RawResp;
    if (RawJson && RawJson.includes('```json')) {
      RawJson = RawJson.replace('```json','').replace('```','');
    } else if (RawJson && RawJson.includes('```')) {
      RawJson = RawJson.replace(/```/g, '');
    }
    
    console.log(`Cleaned JSON (attempt ${attempt + 1}):`, RawJson);
    
    try {
      const JSONResp = JSON.parse(RawJson);
      console.log(`Parsed JSON (attempt ${attempt + 1}):`, JSONResp);
      return JSONResp;
    } catch (error) {
      console.error(`JSON Parse Error (attempt ${attempt + 1}):`, error);
      if (attempt === maxRetries) throw error;
      console.log(`Retrying... (attempt ${attempt + 1}/${maxRetries})`);
    }
  }
}

export async function POST(req) {
  const {courseId ,...formData} = await req.json();
  const user = await currentUser() ;
  // To run this code you need to install the following dependencies:
  // npm install @google/genai mime
  // npm install -D @types/node
  

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

  let JSONResp;
  try {
    JSONResp = await getValidAIResponse(ai, model, config, contents);
  } catch (error) {
    console.error("JSON Parse Error after retries:", error);
    return NextResponse.json({ error: "Failed to parse AI response after retries" }, { status: 500 });
  }

  // Generate banner image
  const ImagePrompt = JSONResp.course?.bannerImagePrompt;
  let bannerImageURL = null;
  
  if (ImagePrompt) {
    try {
      bannerImageURL = await GenerateImage(ImagePrompt);
    } catch (error) {
      console.error("Error generating banner image:", error);
      // Use a default image URL if generation fails
      bannerImageURL = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1024&h=576&fit=crop";
    }
  } else {
    // Use a default image URL if no prompt is provided
    bannerImageURL = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1024&h=576&fit=crop";
  }

  //Save to Database
  const result = await db.insert(coursesTable).values({
    cid: courseId,
    name: JSONResp.course.name,
    description: JSONResp.course.description,
    noOfChapters: JSONResp.course.noOfChapters,
    includeVideos: JSONResp.course.includeVideo,
    level: JSONResp.course.level,
    bannerImageURL: bannerImageURL,
    category: JSONResp.course.category,
    courseJson: JSONResp,
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  return NextResponse.json({courseId : courseId});
}

const GenerateImage = async(ImagePrompt) => {
  const BASE_URL='https://aigurulab.tech';
  const result = await axios.post(BASE_URL+'/api/generate-image',
        {
            width: 1024,
            height: 1024,
            input: ImagePrompt,
            model: 'sdxl',//'flux'
            aspectRatio:"16:9"//Applicable to Flux model only
        },
        {
            headers: {
                'x-api-key': process?.env?.AI_GURU_LAB_API, // Your API Key
                'Content-Type': 'application/json', // Content Type
            },
        })
  console.log(result.data.image) //Output Result: Base 64 Image
  return result.data.image; // Return the base64 image string
}
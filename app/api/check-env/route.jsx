import { NextResponse } from 'next/server';

export async function GET() {
    const envCheck = {
        GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
        YOUTUBE_API_KEY: !!process.env.YOUTUBE_API_KEY,
        AI_GURU_LAB_API: !!process.env.AI_GURU_LAB_API,
        timestamp: new Date().toISOString()
    };

    return NextResponse.json({
        status: 'ok',
        environment: envCheck,
        message: 'Environment variables check'
    });
}

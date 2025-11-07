import { NextResponse } from 'next/server';
import { getProgress } from '../generate-course-content/progress';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('courseId');

        if (!courseId) {
            return NextResponse.json(
                { error: 'courseId is required' },
                { status: 400 }
            );
        }

        const progress = getProgress(courseId);
        
        if (!progress) {
            return NextResponse.json({
                status: 'not_found',
                message: 'No generation in progress for this course'
            });
        }

        return NextResponse.json(progress);

    } catch (error) {
        console.error('Error checking progress:', error);
        return NextResponse.json(
            { error: 'Failed to check progress' },
            { status: 500 }
        );
    }
}

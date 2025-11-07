// Progress tracking for course generation
const generationProgress = new Map();

export function updateProgress(courseId, data) {
    generationProgress.set(courseId, {
        ...data,
        timestamp: Date.now()
    });
}

export function getProgress(courseId) {
    return generationProgress.get(courseId);
}

export function clearProgress(courseId) {
    generationProgress.delete(courseId);
}

// Clean up old progress data (older than 1 hour)
setInterval(() => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [courseId, data] of generationProgress.entries()) {
        if (data.timestamp < oneHourAgo) {
            generationProgress.delete(courseId);
        }
    }
}, 5 * 60 * 1000); // Run every 5 minutes

'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

function CourseSuccessDialog({ open, onOpenChange, courseId, courseName, stats }) {
  const router = useRouter();

  React.useEffect(() => {
    if (open) {
      // Trigger confetti animation
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  }, [open]);

  const handleEnrollNow = () => {
    // Redirect to the course view page to start learning
    router.push(`/course/${courseId}`);
  };

  const handleGoToDashboard = () => {
    // Redirect to workspace dashboard
    router.push('/workspace');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 p-8 text-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
              <CheckCircle2 className="relative h-16 w-16 text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">🎉 Course Ready!</h2>
              <p className="text-purple-100 text-sm">
                Your learning journey is about to begin
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Course Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Course Generated Successfully</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
              {courseName}
            </h3>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.successful}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Chapters Created
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.totalTime}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Generation Time
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleEnrollNow}
              className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-300 gap-2 group"
            >
              <PlayCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Start Learning Now
            </Button>
            
            <Button
              onClick={handleGoToDashboard}
              variant="outline"
              className="w-full h-12 text-base border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950/30 transition-all duration-300"
            >
              Go to Dashboard
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            You can access this course anytime from your dashboard
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CourseSuccessDialog;

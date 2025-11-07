'use client';

import React, { Suspense, lazy } from 'react';

// Lazy load the provider to reduce initial bundle size
const WorkspaceProvider = lazy(() => import('./provider'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
  </div>
);

function WorkspaceLayout({ children }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <WorkspaceProvider>
        {children}
      </WorkspaceProvider>
    </Suspense>
  );
}

export default WorkspaceLayout;

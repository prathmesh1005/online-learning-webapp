'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { SidebarProvider } from "@/@/components/ui/sidebar"
import { AppSidebar } from '@/app/workspace/_components/AppSidebar'   
import AppHeader from './_components/AppHeader'  

function WorkspaceProvider({children}) {
  return (
    <SidebarProvider>
        <AppSidebar />
        
      <div className='flex-1 w-full min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-950 dark:to-purple-950/20 relative overflow-hidden'>
           {/* Animated Background Elements */}
           <motion.div
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-400/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
           />
           <motion.div
              className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/5 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -30, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
           />

           <AppHeader />
      <motion.div 
           className='px-6 py-8 max-w-[1600px] mx-auto relative z-10'
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.5 }}
      >
             <AnimatePresence mode="wait">
                {children}
             </AnimatePresence>
      </motion.div>
      </div>
    </SidebarProvider>
  )
}

export default WorkspaceProvider
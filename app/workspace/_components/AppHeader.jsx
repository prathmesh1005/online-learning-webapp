'use client'

import { SidebarTrigger } from '@/@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react'
import { Bell, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function AppHeader({hideSiebar = false}) {
  const [mounted, setMounted] = useState(false);
  
  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className='sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-purple-500/10 shadow-sm'>
      <div className='px-6 py-4 flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          {!hideSiebar && (
            <SidebarTrigger className="hover:bg-purple-100 dark:hover:bg-purple-950 hover:text-purple-600 transition-colors duration-200" />
          )}
          
          {/* Dashboard Button */}
          <Link href="/workspace">
            <Button 
              variant="outline"
              className="flex items-center gap-2 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all duration-200"
            >
              <LayoutDashboard className='h-4 w-4 text-purple-600' />
              <span className='hidden md:inline font-medium'>Dashboard</span>
            </Button>
          </Link>
        </div>

        <div className='flex items-center gap-3'>
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-purple-100 dark:hover:bg-purple-950 hover:text-purple-600 transition-colors duration-200"
          >
            <Bell className='h-5 w-5' />
            <span className="absolute top-1 right-1 h-2 w-2 bg-purple-600 rounded-full"></span>
          </Button>

          {/* User Button - Only render on client */}
          <div className='border-l border-purple-500/10 pl-3'>
            {mounted ? (
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10 ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all"
                  }
                }}
              />
            ) : (
              <div className='h-10 w-10 rounded-full bg-purple-500/10 animate-pulse' />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppHeader
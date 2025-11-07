'use client'
import React from 'react'
import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarContent,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/@/components/ui/sidebar";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Compass, LayoutDashboard, GraduationCap, BookOpen, UserCircle2Icon, WalletCards, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import AddNewCourseDialog from './AddNewCourseDialog';
import { usePathname } from 'next/navigation';

const SideBarOptions=[
  {
    title:'Dashboard',
    icon: LayoutDashboard,
    path:'/workspace'
  },
   {
    title:'My Learning',
    icon: BookOpen,
    path:'/workspace/my-learning'
  },
   {
    title:'Explore Courses',
    icon: Compass,
    path:'/workspace/explore'
  },
   {
    title:'Billing',
    icon: WalletCards,
    path:'/workspace/billing'
  },
   {
    title:'Profile',
    icon: UserCircle2Icon,
    path:'/workspace/profile'
  }
  
]

export function AppSidebar() {
  const path= usePathname();

  return (
    <Sidebar className="border-r border-purple-500/20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <SidebarHeader className="p-6 border-b border-purple-500/10">
        <Link href="/workspace" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full group-hover:bg-purple-500/30 transition-all"></div>
            <GraduationCap className="h-8 w-8 text-purple-600 relative z-10" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              StudyXpert
            </h1>
            <p className="text-xs text-muted-foreground">Learning Platform</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup className="mb-4">
          <AddNewCourseDialog>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-300 gap-2 group">
              <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold">Create New Course</span>
            </Button>
          </AddNewCourseDialog>
        </SidebarGroup>

        <SidebarGroup>
          <div className="px-3 mb-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              Navigation
            </h2>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
               {SideBarOptions.map((item,index)=>(
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    asChild 
                    className={`group relative overflow-hidden transition-all duration-300 ${
                      path === item.path 
                        ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-700 dark:text-purple-400 border-l-4 border-purple-600 shadow-sm' 
                        : 'hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:translate-x-1'
                    }`}
                  >
                     <Link href={item.path} className="flex items-center gap-3 px-4 py-3">
                       <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                         path === item.path
                           ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                           : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50'
                       }`}>
                         <item.icon className="h-5 w-5" />
                       </div>
                       <span className="font-medium text-sm">{item.title}</span>
                       {path === item.path && (
                         <div className="ml-auto">
                           <div className="h-2 w-2 rounded-full bg-purple-600 animate-pulse"></div>
                         </div>
                       )}
                     </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
               ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-purple-500/10">
        <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-1">Upgrade to Pro</h3>
              <p className="text-xs text-muted-foreground mb-3">Unlock premium features and unlimited courses</p>
              <Link href="/workspace/billing">
                <Button size="sm" variant="outline" className="w-full text-xs border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
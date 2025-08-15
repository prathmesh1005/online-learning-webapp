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

const SideBarOptions=[
  {
    title:'Dashboard',
    icon: LayoutDashboard,
    path:'/workspace'
  },
   {
    title:'My Learning',
    icon: LayoutDashboard,
    path:'/workspace/my-courses'
  },
   {
    title:'Explore Courses',
    icon: Compass,
    path:'/workspace/explore'
  },
   {
    title:'AI Tools',
    icon: PencilRulerIcon,
    path:'/workspace/ai-tools'
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
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Compass, LayoutDashboard, PencilRulerIcon, UserCircle2Icon, WalletCards } from 'lucide-react';
import Link from 'next/link';
import AddNewCourseDialog from './AddNewCourseDialog';
import { usePathname } from 'next/navigation';
export function AppSidebar() {
  const path= usePathname();

  return (
    <Sidebar>
      <SidebarHeader className={'p-4'}>
        <Image src={'/logo.svg'} alt='logo' width={130} height={120}/>
        </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <AddNewCourseDialog>
            <Button>Create New Course</Button>
          </AddNewCourseDialog>
          </SidebarGroup>
        <SidebarGroup >
          <SidebarGroupContent>
            <SidebarMenu>
               {SideBarOptions.map((item,index)=>(
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild className={'p-5'}>
                     <Link href={item.path} className={`text-[17px]
                      ${path.includes(item.path)&&'text-primary bg-purple-50'}`}>
                     <item.icon className='h-7 w-7'/>
                     <span>{item.title}</span>
                     </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
               ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
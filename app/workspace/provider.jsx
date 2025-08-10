import React from 'react'

import { SidebarProvider } from "@/@/components/ui/sidebar"
import { AppSidebar } from '@/app/workspace/_components/AppSidebar'   
import AppHeader from './_components/AppHeader'  
function WorkspaceProvider({children}) {
  return (
    <SidebarProvider>
        <AppSidebar />
        
      <div className='w-full'>
           <AppHeader />
      <div className='p-10'>

             {children}
      </div>
      </div>
    </SidebarProvider>
  )
}

export default WorkspaceProvider
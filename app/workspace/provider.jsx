import React from 'react'

import { SidebarProvider, SidebarTrigger } from "@/@/components/ui/sidebar"
import { AppSidebar } from '@/app/workspace/_components/AppSidebar'     
function WorkspaceProvider({children}) {
  return (
    <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
      {children}
    </SidebarProvider>
  )
}

export default WorkspaceProvider
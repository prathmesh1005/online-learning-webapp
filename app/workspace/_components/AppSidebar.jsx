import React from 'react'
import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarContent,
} from "@/@/components/ui/sidebar";


export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
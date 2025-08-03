"use client";
import * as React from "react"

// Basic utility function
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

// Simple mobile hook
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  
  const setOpen = React.useCallback((value) => {
    const openState = typeof value === "function" ? value(open) : value
    if (setOpenProp) {
      setOpenProp(openState)
    } else {
      _setOpen(openState)
    }
  }, [setOpenProp, open])

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo(() => ({
    state,
    open,
    setOpen,
    toggleSidebar,
    isMobile,
    openMobile,
    setOpenMobile,
  }), [state, open, setOpen, toggleSidebar, isMobile, openMobile, setOpenMobile])

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className={cn("flex", className)} style={style} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) {
  const { open, isMobile, openMobile } = useSidebar()
  
  if (isMobile) {
    return (
      <div className={cn("fixed inset-0 z-50", className)} {...props}>
        {children}
      </div>
    )
  }
  
  return (
    <div className={cn("flex", className)} {...props}>
      {children}
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}) {
  const { toggleSidebar } = useSidebar()
  
  return (
    <button
      className={cn("p-2", className)}
      onClick={onClick || toggleSidebar}
      {...props}
    >
      ☰
    </button>
  )
}

function SidebarHeader({
  className,
  ...props
}) {
  return (
    <div
      className={cn("flex h-14 shrink-0 items-center border-b px-4", className)}
      {...props}
    />
  )
}

function SidebarFooter({
  className,
  ...props
}) {
  return (
    <div
      className={cn("flex shrink-0 items-center border-t px-4 py-2", className)}
      {...props}
    />
  )
}

function SidebarContent({
  className,
  ...props
}) {
  return (
    <div
      className={cn("flex flex-1 flex-col gap-2 overflow-hidden", className)}
      {...props}
    />
  )
}

function SidebarGroup({
  className,
  ...props
}) {
  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} 
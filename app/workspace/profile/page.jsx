import { UserProfile } from '@clerk/nextjs'
import React from 'react'
import { User, Settings, Shield, Sparkles } from 'lucide-react'

function Profile() {
  return (
    <div className='space-y-8'>
      {/* Hero Section */}
      <div className='relative overflow-hidden p-8 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-3xl shadow-2xl'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl'></div>
        
        <div className='relative z-10 flex items-start justify-between'>
          <div className='flex-1'>
            <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4'>
              <User className='h-4 w-4 text-white' />
              <span className='text-white text-sm font-semibold'>Account Settings</span>
            </div>
            <h1 className='font-bold text-4xl md:text-5xl text-white mb-3 drop-shadow-lg'>
              Your Profile
            </h1>
            <p className='text-teal-100 text-lg mb-6 max-w-2xl'>
              Manage your account settings, security preferences, and personal information
            </p>
            
            {/* Quick Actions */}
            <div className='flex flex-wrap gap-3'>
              <div className='flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg'>
                <Settings className='h-4 w-4 text-white' />
                <span className='text-white text-sm font-medium'>Customize</span>
              </div>
              <div className='flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg'>
                <Shield className='h-4 w-4 text-white' />
                <span className='text-white text-sm font-medium'>Secure</span>
              </div>
              <div className='flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg'>
                <Sparkles className='h-4 w-4 text-white' />
                <span className='text-white text-sm font-medium'>Personalize</span>
              </div>
            </div>
          </div>
          <div className='hidden lg:block'>
            <div className='p-4 bg-white/10 backdrop-blur-sm rounded-2xl'>
              <User className='h-24 w-24 text-white' />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Component */}
      <div className='bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-purple-500/10'>
        <UserProfile 
          routing="hash"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-0",
            }
          }}
        />
      </div>
    </div>
  )
}

export default Profile
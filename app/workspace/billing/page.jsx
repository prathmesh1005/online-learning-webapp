import { PricingTable } from '@clerk/nextjs'
import React from 'react'
import { Crown, Zap, Sparkles, Check } from 'lucide-react'

function Billing() {
  return (
    <div className='space-y-8'>
      {/* Hero Section */}
      <div className='relative overflow-hidden p-8 bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 rounded-3xl shadow-2xl'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-64 h-64 bg-amber-600/20 rounded-full blur-3xl'></div>
        
        <div className='relative z-10'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4'>
            <Crown className='h-4 w-4 text-white' />
            <span className='text-white text-sm font-semibold'>Premium Plans</span>
          </div>
          <h1 className='font-bold text-4xl md:text-5xl text-white mb-3 drop-shadow-lg'>
            Upgrade Your Learning
          </h1>
          <p className='text-orange-100 text-lg mb-6 max-w-2xl'>
            Choose the perfect plan to unlock premium features and accelerate your learning journey
          </p>
          
          {/* Feature Highlights */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
            <div className='flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl'>
              <div className='p-2 bg-white/20 rounded-lg'>
                <Zap className='h-5 w-5 text-white' />
              </div>
              <div>
                <p className='text-white font-semibold'>Unlimited Access</p>
                <p className='text-orange-100 text-sm'>All courses included</p>
              </div>
            </div>
            <div className='flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl'>
              <div className='p-2 bg-white/20 rounded-lg'>
                <Sparkles className='h-5 w-5 text-white' />
              </div>
              <div>
                <p className='text-white font-semibold'>AI-Powered</p>
                <p className='text-orange-100 text-sm'>Smart recommendations</p>
              </div>
            </div>
            <div className='flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl'>
              <div className='p-2 bg-white/20 rounded-lg'>
                <Check className='h-5 w-5 text-white' />
              </div>
              <div>
                <p className='text-white font-semibold'>Certificates</p>
                <p className='text-orange-100 text-sm'>Industry recognized</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className='bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-purple-500/10'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2'>
            Choose Your Plan
          </h2>
          <p className='text-muted-foreground'>Select the plan that fits your learning goals</p>
        </div>
        <PricingTable/>
      </div>
    </div>
  )
}

export default Billing 
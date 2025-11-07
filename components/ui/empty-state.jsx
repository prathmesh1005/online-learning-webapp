import React from 'react'
import { Button } from './button'

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  actionLabel 
}) {
  return (
    <div className='flex flex-col items-center justify-center py-16 px-6 text-center'>
      <div className='relative mb-6'>
        <div className='absolute inset-0 bg-purple-500/20 rounded-full blur-2xl'></div>
        <div className='relative p-6 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-full border border-purple-500/20'>
          {Icon && <Icon className='h-16 w-16 text-purple-600 dark:text-purple-400' />}
        </div>
      </div>
      
      <h3 className='text-2xl font-bold text-foreground mb-2'>
        {title}
      </h3>
      
      <p className='text-muted-foreground max-w-md mb-6'>
        {description}
      </p>
      
      {action && actionLabel && (
        <Button 
          onClick={action}
          className='bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/30'
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState

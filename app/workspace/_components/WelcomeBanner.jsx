import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

function WelcomeBanner() {
  return (
    <motion.div 
        className='relative p-8 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl overflow-hidden shadow-xl'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
    >
        {/* Animated Decorative elements */}
        <motion.div 
            className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl'
            animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
            }}
            transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        ></motion.div>
        <motion.div 
            className='absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl'
            animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [0, -90, 0]
            }}
            transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        ></motion.div>
        
        {/* Floating Sparkles */}
        {[...Array(5)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute"
                style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.5, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                }}
            >
                <Sparkles className="h-4 w-4 text-white/40" />
            </motion.div>
        ))}
        
        {/* Content */}
        <div className='relative z-10'>
            <motion.h2 
                className='font-bold text-3xl text-white mb-2 drop-shadow-lg'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Welcome to StudyXpert 🎓
            </motion.h2>
            <motion.p 
                className='text-purple-100 text-lg'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                Learn, Create and Explore Your Favourite Courses
            </motion.p>
            <motion.div 
                className='mt-4 flex items-center gap-2'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <motion.div 
                    className='h-1 w-16 bg-white/60 rounded-full'
                    animate={{ width: [0, 64] }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                ></motion.div>
                <span className='text-purple-200 text-sm'>Let&apos;s continue your journey</span>
            </motion.div>
        </div>
    </motion.div>
  )
}

export default WelcomeBanner
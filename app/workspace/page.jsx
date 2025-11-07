'use client'
import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'
import EnrollCourseList from './_components/EnrollCourseList'
import { BookOpen, TrendingUp, Award, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

function Workspace() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.main 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants}>
        <WelcomeBanner />
      </motion.div>

      {/* Quick Stats Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        <motion.div 
          className="group relative overflow-hidden p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
          <div className="relative flex items-center gap-4">
            <motion.div 
              className="p-3 bg-blue-500 rounded-xl shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">In Progress</p>
              <motion.p 
                className="text-2xl font-bold text-blue-900 dark:text-blue-100"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Track
              </motion.p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="group relative overflow-hidden p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200/50 dark:border-purple-800/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          ></motion.div>
          <div className="relative flex items-center gap-4">
            <motion.div 
              className="p-3 bg-purple-500 rounded-xl shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <TrendingUp className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Learning</p>
              <motion.p 
                className="text-2xl font-bold text-purple-900 dark:text-purple-100"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Journey
              </motion.p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="group relative overflow-hidden p-6 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          ></motion.div>
          <div className="relative flex items-center gap-4">
            <motion.div 
              className="p-3 bg-green-500 rounded-xl shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Award className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Achievements</p>
              <motion.p 
                className="text-2xl font-bold text-green-900 dark:text-green-100"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Earn
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enrolled Courses Section */}
      <motion.div variants={itemVariants}>
        <EnrollCourseList />
      </motion.div>

      {/* My Courses Section */}
      <motion.div variants={itemVariants}>
        <CourseList />
      </motion.div>
    </motion.main>
  )
}

export default Workspace
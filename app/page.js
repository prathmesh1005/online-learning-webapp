"use client";
import React, { useEffect, useRef, useState } from "react";
import { UserButton, SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, TrendingUp, Users, Award, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

const HomePage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [particles, setParticles] = useState([]);

  // Generate particles on client-side only to avoid hydration mismatch
  useEffect(() => {
    setParticles(
      [...Array(20)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  const navLinks = [
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'testimonials', label: 'Testimonials' }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Learning",
      description: "Personalized course recommendations based on your learning style and goals"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Courses",
      description: "Access thousands of courses across various topics and skill levels"
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Monitor your learning journey with detailed analytics and insights"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow learners and expert instructors worldwide"
    },
    {
      icon: Award,
      title: "Earn Certificates",
      description: "Get recognized for your achievements with industry-recognized certificates"
    },
    {
      icon: Zap,
      title: "Fast & Interactive",
      description: "Engage with interactive content and hands-on projects"
    }
  ];

  const steps = [
    { step: "01", title: "Sign Up", description: "Create your account in seconds" },
    { step: "02", title: "Choose Course", description: "Browse and select from our vast library" },
    { step: "03", title: "Start Learning", description: "Begin your educational journey today" }
  ];

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl"
        />
      </div>

      {/* Animated Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="fixed top-0 left-0 right-0 bg-black/60 backdrop-blur-xl z-50 border-b border-purple-500/20 shadow-lg shadow-purple-500/5"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="group relative">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="relative z-10 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 bg-clip-text text-2xl font-bold text-transparent transition-all duration-300"
            >
              🎓 StudyXpert
            </motion.span>
            <motion.div
              className="absolute -inset-2 bg-purple-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="relative px-2 py-1 text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium"
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.label}
                {hoveredLink === link.id && (
                  <motion.span
                    className="absolute left-0 bottom-0 h-0.5 w-full bg-gradient-to-r from-purple-500 to-purple-400"
                    layoutId="navUnderline"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{
                      type: "spring",
                      bounce: 0.25,
                      duration: 0.5
                    }}
                  />
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isLoaded && !isSignedIn && (
              <>
                <Link href="/workspace">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 text-purple-400 font-medium hover:text-purple-300 transition-colors"
                  >
                    Sign In
                  </motion.button>
                </Link>
                <SignUpButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg shadow-purple-500/30 transition-all duration-300 overflow-hidden group"
                  >
                    <span className="relative z-10">Get Started</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.button>
                </SignUpButton>
              </>
            )}
            
            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-4">
                <Link href="/workspace">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg shadow-purple-500/30 transition-all duration-300"
                  >
                    Dashboard
                  </motion.button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
        
        {/* Animated bottom border */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Decorative Background Elements */}
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
        />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-4 px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full"
            >
              <motion.span 
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-purple-300 font-medium text-sm"
              >
                ✨ Welcome to the Future of Learning
              </motion.span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <motion.span
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto]"
              >
                Master New Skills
              </motion.span>
              <br />
              <span className="text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">At Your Own Pace</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Join thousands of learners worldwide in accessing high-quality courses designed to help you achieve your goals and advance your career.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/workspace">
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-xl shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Learning Today
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  backgroundColor: "rgba(168, 85, 247, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-purple-500/50 hover:border-purple-400 text-purple-300 rounded-xl font-semibold shadow-lg transition-all duration-300"
              >
                Explore Courses
              </motion.button>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              {[
                { value: "10K+", label: "Active Learners" },
                { value: "500+", label: "Courses" },
                { value: "95%", label: "Satisfaction" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center group cursor-pointer"
                >
                  <motion.div 
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(168, 85, 247, 0.5)",
                        "0 0 40px rgba(168, 85, 247, 0.8)",
                        "0 0 20px rgba(168, 85, 247, 0.5)"
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-gray-400 mt-1 group-hover:text-purple-300 transition-colors">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-black/30 backdrop-blur-sm relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-4 px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full"
            >
              <span className="text-purple-300 font-medium text-sm">Why Choose Us</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl pb-5 font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent"
            >
              Everything You Need to Succeed
            </motion.h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -12,
                  scale: 1.02
                }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="relative group cursor-pointer"
              >
                <motion.div 
                  animate={hoveredFeature === index ? {
                    boxShadow: [
                      "0 0 20px rgba(168, 85, 247, 0.3)",
                      "0 0 40px rgba(168, 85, 247, 0.5)",
                      "0 0 20px rgba(168, 85, 247, 0.3)"
                    ]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`p-8 rounded-2xl border-2 transition-all duration-500 h-full backdrop-blur-sm ${
                    hoveredFeature === index
                      ? 'border-purple-500 bg-purple-500/10 shadow-2xl shadow-purple-500/30'
                      : 'border-purple-500/30 bg-gray-900/50'
                  }`}
                >
                  <motion.div 
                    animate={hoveredFeature === index ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className={`inline-block p-3 rounded-xl mb-4 transition-all duration-300 ${
                      hoveredFeature === index
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50'
                        : 'bg-purple-900/50 text-purple-400'
                    }`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  
                  {/* Animated corner accent */}
                  <motion.div
                    className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={hoveredFeature === index ? {
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-br from-gray-950 to-black relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full"
            >
              <span className="text-purple-300 font-medium text-sm">Simple Process</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent"
            >
              Get Started in 3 Easy Steps
            </motion.h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative text-center group"
              >
                <motion.div 
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 20px rgba(168, 85, 247, 0.3)",
                      "0 0 40px rgba(168, 85, 247, 0.6)",
                      "0 0 20px rgba(168, 85, 247, 0.3)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold text-2xl mb-6 shadow-lg shadow-purple-500/50 relative"
                >
                  <span className="relative z-10">{item.step}</span>
                  <motion.div
                    className="absolute inset-0 rounded-full bg-purple-400"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: index * 0.3
                    }}
                  />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {item.description}
                </p>
                
                {/* Animated connecting line */}
                {index < steps.length - 1 && (
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: (index + 1) * 0.2 }}
                    className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 origin-left"
                  >
                    <motion.div
                      animate={{
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-full h-full bg-gradient-to-r from-purple-500 to-transparent"
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 p-12 md:p-16 text-center shadow-2xl shadow-purple-500/30"
          >
            {/* Animated Decorative Elements */}
            <motion.div 
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 90, 0],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{
                scale: [1.3, 1, 1.3],
                rotate: [0, -90, 0],
                opacity: [0.2, 0.1, 0.2]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl"
            />
            
            {/* Animated particles */}
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                }}
              />
            ))}
            
            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg"
              >
                Ready to Transform Your Future?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto"
              >
                Join thousands of successful learners and start your journey today
              </motion.p>
              <Link href="/workspace">
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 20px 60px rgba(255, 255, 255, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-10 py-5 bg-white text-purple-600 rounded-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 inline-flex items-center gap-3 text-lg overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Get Started Free
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-6 w-6" />
                    </motion.div>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-100 to-white opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black/50 border-t border-purple-500/20 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent cursor-pointer inline-block"
            >
              🎓 StudyXpert
            </motion.span>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mb-4"
          >
            Empowering learners worldwide
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-500"
          >
            © 2025 StudyXpert. All rights reserved.
          </motion.p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
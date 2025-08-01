"use client";
import React, { useEffect, useRef, useState } from "react";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";

const HomePage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const splineRef = useRef(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.39/build/spline-viewer.js';
    script.type = 'module';
    
    script.onload = () => {
      const checkSpline = setInterval(() => {
        const splineViewer = document.querySelector('spline-viewer');
        if (splineViewer) {
          clearInterval(checkSpline);
          splineViewer.addEventListener('load', () => {
            splineViewer.setAttribute('camera-position', '0 150 1800');
            splineViewer.setAttribute('camera-target', '0 100 0');
            splineViewer.setAttribute('auto-rotate', '');
            splineViewer.setAttribute('rotation-speed', '0.8');
          });
        }
      }, 50);
    };

    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const navLinks = [
    { id: 'features', label: 'Features' },
    { id: 'courses', label: 'Courses' },
    { id: 'pricing', label: 'Pricing' }
  ];

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      {/* Animated Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-50 h-16 flex items-center px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-pink-400 transition-colors duration-300">
            StudyXpert
          </Link>
          
          <div className="hidden md:flex items-center h-full space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={`#${link.id}`}
                className="relative px-2 py-1 text-gray-300 hover:text-white transition-colors duration-300"
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.label}
                {hoveredLink === link.id && (
                  <motion.span
                    className="absolute left-0 bottom-0 h-0.5 w-full bg-pink-500"
                    layoutId="navUnderline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      type: "spring",
                      bounce: 0.25,
                      duration: 0.5
                    }}
                  />
                )}
                <span className={`absolute -bottom-1 left-0 h-[1px] w-full bg-pink-500/30 blur-[2px] transition-opacity duration-300 ${
                  hoveredLink === link.id ? 'opacity-100' : 'opacity-0'
                }`}></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/get-started" 
              className="relative overflow-hidden bg-black border border-pink-500/50 hover:border-pink-400 text-pink-400 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 group"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></span>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            
            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-1">
                  <span>Sign Up</span>
                  <span className="text-xs opacity-80">/</span>
                  <span>In</span>
                </button>
              </SignInButton>
            )}
            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
        
        {/* Animated Pink Glow Border */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500/80 to-transparent"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.5
          }}
        />
      </nav>

      {/* 3D Model Background */}
      <div className="w-full h-full absolute inset-0">
        <spline-viewer 
          ref={splineRef}
          url="https://prod.spline.design/b-ceLxgHfxjNwtxn/scene.splinecode"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '64px',
            left: 0,
            zIndex: 0,
          }}
          loading-anim
        />
      </div>
    </div>
  );
};

export default HomePage;
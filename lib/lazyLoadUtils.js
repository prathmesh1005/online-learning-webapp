'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export const useLazyLoad = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);
  const { root = null, rootMargin = '0px', threshold = 0.1 } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [root, rootMargin, threshold]);

  return [ref, isIntersecting];
};

export const LazyImage = ({ src, alt, width, height, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [ref, isInView] = useLazyLoad();

  return (
    <div ref={ref} className={`relative ${className}`}>
      {isInView && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          {...props}
        />
      )}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      )}
    </div>
  );
};

export const withLazyLoad = (Component) => {
  return function LazyLoadWrapper(props) {
    const [ref, isInView] = useLazyLoad();
    
    return (
      <div ref={ref}>
        {isInView && <Component {...props} />}
      </div>
    );
  };
};

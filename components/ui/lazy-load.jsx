'use client';

import { useEffect, useState, useRef } from 'react';

const LazyLoad = ({
  children,
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  fallback = null,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [root, rootMargin, threshold]);

  return (
    <div ref={ref} className={className}>
      {hasBeenVisible ? children : fallback}
    </div>
  );
};

export default LazyLoad;

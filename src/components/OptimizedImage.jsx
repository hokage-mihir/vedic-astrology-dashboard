import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const generateSrcSet = (baseSrc) => {
    const extensions = ['.png', '.jpg', '.jpeg', '.webp'];
    const ext = extensions.find(e => baseSrc.includes(e)) || '.png';
    const baseWithoutExt = baseSrc.replace(ext, '');
    
    return `
      ${baseWithoutExt}-320${ext} 320w,
      ${baseWithoutExt}-640${ext} 640w,
      ${baseWithoutExt}-768${ext} 768w,
      ${baseWithoutExt}-1024${ext} 1024w,
      ${baseWithoutExt}-1280${ext} 1280w,
      ${baseSrc} 1536w
    `.trim();
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || 'auto',
        backgroundColor: '#f3f4f6'
      }}
    >
      {isInView && (
        <img
          src={src}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`
            transition-opacity duration-300 
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};

export default OptimizedImage;
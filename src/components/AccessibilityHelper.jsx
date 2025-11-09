import { useEffect } from 'react';

/**
 * Accessibility helper component that runs in development mode
 * to check for common accessibility issues
 */
const AccessibilityHelper = () => {
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    // Check for missing alt text on images
    const checkImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.alt && !img.getAttribute('aria-label')) {
          console.warn(`⚠️ Image ${index + 1} is missing alt text or aria-label:`, img);
        }
      });
    };

    // Check for proper heading hierarchy
    const checkHeadings = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      
      headings.forEach((heading) => {
        const currentLevel = parseInt(heading.tagName.substring(1));
        if (currentLevel > lastLevel + 1) {
          console.warn(`⚠️ Heading hierarchy skipped: h${lastLevel} to h${currentLevel}`, heading);
        }
        lastLevel = currentLevel;
      });
    };

    // Check for focus management
    const checkFocusManagement = () => {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) {
        console.warn('⚠️ No focusable elements found on the page');
      }
    };

    // Check color contrast (simplified)
    const checkColorContrast = () => {
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
      
      textElements.forEach((element) => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        // Basic check for low contrast (this is simplified)
        if (color === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(248, 248, 248)') {
          console.warn('⚠️ Potential low contrast element:', element);
        }
      });
    };

    // Run checks after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      console.group('🔍 Accessibility Check Results');
      checkImages();
      checkHeadings();
      checkFocusManagement();
      checkColorContrast();
      console.groupEnd();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default AccessibilityHelper;
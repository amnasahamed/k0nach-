/**
 * Performance Monitoring Utility
 * Track and report web vitals and performance metrics
 */

export interface PerformanceMetrics {
  FCP?: number;  // First Contentful Paint
  LCP?: number;  // Largest Contentful Paint
  CLS?: number;  // Cumulative Layout Shift
  FID?: number;  // First Input Delay
  TTFB?: number; // Time to First Byte
}

const metrics: PerformanceMetrics = {};

/**
 * Report Web Vitals to analytics service
 */
export const reportWebVitals = async (metric: any) => {
  // Only send in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('Web Vital:', metric);
    return;
  }

  try {
    // You can integrate with:
    // - Google Analytics
    // - Vercel Analytics
    // - Custom analytics endpoint
    // - Sentry
    // - DataDog
    
    // Example: Send to analytics endpoint
    if (navigator.sendBeacon) {
      const body = JSON.stringify(metric);
      navigator.sendBeacon('/api/metrics', body);
    }
  } catch (error) {
    console.error('Error reporting web vitals:', error);
  }
};

/**
 * Initialize Web Vitals monitoring
 */
export const initWebVitals = () => {
  if ('web-vital' in window) {
    // Web Vitals library is available
    try {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(reportWebVitals);
        getFID(reportWebVitals);
        getFCP(reportWebVitals);
        getLCP(reportWebVitals);
        getTTFB(reportWebVitals);
      });
    } catch (error) {
      console.error('Error initializing Web Vitals:', error);
    }
  }
};

/**
 * Measure component render time
 */
export const measureComponentRender = (componentName: string, fn: () => void) => {
  if (process.env.NODE_ENV !== 'development') return;

  const startTime = performance.now();
  fn();
  const endTime = performance.now();
  
  console.log(`[Performance] ${componentName} rendered in ${(endTime - startTime).toFixed(2)}ms`);
};

/**
 * Measure API call duration
 */
export const measureAPICall = async <T,>(
  endpoint: string,
  fn: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await fn();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Warn if API call is slow
    if (duration > 3000) {
      console.warn(`[Performance] Slow API call: ${endpoint} took ${duration.toFixed(2)}ms`);
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] API call ${endpoint} completed in ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`[Performance] API call ${endpoint} failed after ${(endTime - startTime).toFixed(2)}ms:`, error);
    throw error;
  }
};

/**
 * Get current performance metrics
 */
export const getPerformanceMetrics = (): PerformanceMetrics => {
  if (!window.performance) {
    return {};
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!navigation) {
    return metrics;
  }

  return {
    TTFB: navigation.responseStart - navigation.requestStart,
  };
};

/**
 * Log performance summary on page load
 */
export const logPerformanceSummary = () => {
  if (process.env.NODE_ENV !== 'development') return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const metrics = getPerformanceMetrics();
      console.log('[Performance Summary]', metrics);
      
      // Log resource sizes
      const resources = performance.getEntriesByType('resource');
      const totalSize = resources.reduce((sum, r: any) => sum + (r.transferSize || 0), 0);
      console.log(`[Resources] Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
    }, 0);
  });
};

export default {
  reportWebVitals,
  initWebVitals,
  measureComponentRender,
  measureAPICall,
  getPerformanceMetrics,
  logPerformanceSummary,
};

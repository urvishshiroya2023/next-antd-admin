// Ant Design configuration for React 19 compatibility
import { ConfigProviderProps } from 'antd';

// Suppress React 19 compatibility warnings only in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    // Filter out specific Ant Design React compatibility warnings
    if (
      typeof args[0] === 'string' && 
      (args[0].includes('[antd: compatible]') || 
       args[0].includes('antd v5 support React is 16 ~ 18') ||
       args[0].includes('see https://u.ant.design/v5-for-19'))
    ) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
}

// Enhanced theme configuration with React 19 compatibility
export const antdConfig: ConfigProviderProps = {
  // Suppress warnings at the component level
  warning: {
    strict: false,
  },
  // Ensure compatibility with React 19
  theme: {
    hashed: false, // Disable CSS-in-JS hashing for better compatibility
  },
};

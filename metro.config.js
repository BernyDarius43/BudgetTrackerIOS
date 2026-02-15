// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ✅ Fix Axios to use browser build instead of Node build
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force axios to use the browser build
  if (moduleName === 'axios' || moduleName.startsWith('axios/')) {
    const axiosPath = require.resolve('axios/dist/browser/axios.cjs');
    return {
      filePath: axiosPath,
      type: 'sourceFile',
    };
  }

  // Default resolver
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
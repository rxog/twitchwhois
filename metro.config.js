/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');

module.exports = {
  resolver: {
    extraNodeModules: {
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/modules': path.resolve(__dirname, 'src/modules'),
      '@/routes': path.resolve(__dirname, 'src/routes'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

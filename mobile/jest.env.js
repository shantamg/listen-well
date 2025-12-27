// Set environment variables before any imports
// Skip peer deps check for @testing-library/react-native
// React 19.0.0 and react-test-renderer 19.2.3 are compatible (minor version diff)
process.env.RNTL_SKIP_DEPS_CHECK = 'true';

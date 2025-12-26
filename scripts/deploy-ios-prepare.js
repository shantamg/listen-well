#!/usr/bin/env node

/**
 * Prepares iOS build for TestFlight deployment
 * Run: npm run deploy:ios:prepare
 */

const { execSync } = require('child_process');

console.log('Preparing iOS build for TestFlight...');

try {
  // Update build number
  execSync('node scripts/update-build-number.js', { stdio: 'inherit' });

  // Build for iOS
  execSync('cd mobile && eas build --platform ios --profile production', {
    stdio: 'inherit',
  });

  console.log('iOS build prepared successfully!');
  console.log('Run "npm run deploy:ios:release" to submit to TestFlight');
} catch (error) {
  console.error('Error preparing iOS build:', error.message);
  process.exit(1);
}

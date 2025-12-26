#!/usr/bin/env node

/**
 * Submits the latest Android build to Play Store
 * Run: npm run deploy:android:release
 */

const { execSync } = require('child_process');

console.log('Submitting to Play Store...');

try {
  execSync('cd mobile && eas submit --platform android --latest', {
    stdio: 'inherit',
  });

  console.log('Successfully submitted to Play Store!');
} catch (error) {
  console.error('Error submitting to Play Store:', error.message);
  process.exit(1);
}

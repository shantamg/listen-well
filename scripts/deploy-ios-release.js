#!/usr/bin/env node

/**
 * Submits the latest iOS build to TestFlight
 * Run: npm run deploy:ios:release
 */

const { execSync } = require('child_process');

console.log('Submitting to TestFlight...');

try {
  execSync('cd mobile && eas submit --platform ios --latest', {
    stdio: 'inherit',
  });

  console.log('Successfully submitted to TestFlight!');
} catch (error) {
  console.error('Error submitting to TestFlight:', error.message);
  process.exit(1);
}

#!/usr/bin/env node

/**
 * Updates the build number in mobile/app.json
 * Used before deploying to TestFlight or Play Store
 */

const fs = require('fs');
const path = require('path');

const appJsonPath = path.join(__dirname, '..', 'mobile', 'app.json');

try {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

  // Increment iOS build number
  const currentBuildNumber = parseInt(appJson.expo.ios.buildNumber, 10) || 0;
  appJson.expo.ios.buildNumber = String(currentBuildNumber + 1);

  // Increment Android version code
  const currentVersionCode = appJson.expo.android.versionCode || 0;
  appJson.expo.android.versionCode = currentVersionCode + 1;

  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');

  console.log(`Updated build numbers:`);
  console.log(`  iOS buildNumber: ${appJson.expo.ios.buildNumber}`);
  console.log(`  Android versionCode: ${appJson.expo.android.versionCode}`);
} catch (error) {
  console.error('Error updating build number:', error.message);
  process.exit(1);
}

/**
 * Servvo Mobile App Screenshot Capture via Expo Web
 * Captures key screens with iPhone viewport for pitch deck.
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.env.HOME, 'Desktop/servvo-captures/mobile');
mkdirSync(OUTPUT_DIR, { recursive: true });

const BASE_URL = 'http://localhost:8081';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 }, // iPhone 15 Pro
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // Navigate to the app
  console.log('📱 Loading Servvo mobile app...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000); // Let app fully render

  // Capture whatever screen is showing (should be Welcome)
  console.log('📸 Capturing: Welcome Screen');
  await page.screenshot({ path: join(OUTPUT_DIR, '01-welcome.png') });

  // Try to interact - tap "Get Started" if visible
  try {
    const getStartedBtn = page.getByText('Get Started');
    if (await getStartedBtn.isVisible({ timeout: 2000 })) {
      await getStartedBtn.tap();
      await page.waitForTimeout(1500);
      console.log('📸 Capturing: Onboarding');
      await page.screenshot({ path: join(OUTPUT_DIR, '02-onboarding.png') });
    }
  } catch (e) {
    console.log('   ⚠️  Could not find Get Started button, continuing...');
  }

  // Take a full-page screenshot to see all content
  console.log('📸 Capturing: Full page view');
  await page.screenshot({ path: join(OUTPUT_DIR, '03-full-view.png'), fullPage: true });

  await browser.close();
  console.log(`\n🎉 Done! Mobile screenshots saved to: ${OUTPUT_DIR}`);
  console.log('\n💡 For more screens, manually navigate in the simulator and run:');
  console.log('   xcrun simctl io booted screenshot ~/Desktop/servvo-captures/mobile/FILENAME.png');
}

capture().catch(console.error);

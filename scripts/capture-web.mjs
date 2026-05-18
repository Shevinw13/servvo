/**
 * Servvo Web Portal Screenshot Capture
 * Captures key pages for pitch deck and website.
 * Run: npx playwright test --config=scripts/capture-web.mjs (or just node scripts/capture-web.mjs)
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.env.HOME, 'Desktop/servvo-captures/web');
mkdirSync(OUTPUT_DIR, { recursive: true });

const BASE_URL = 'http://localhost:3000';

const PAGES = [
  { name: '01-onboarding-welcome', path: '/' },
  { name: '02-dashboard', path: '/dashboard' },
  { name: '03-customers', path: '/customers' },
  { name: '04-schedule', path: '/schedule' },
  { name: '05-services', path: '/services' },
  { name: '06-notifications', path: '/notifications' },
  { name: '07-messages', path: '/messages' },
  { name: '08-billing', path: '/billing' },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // Retina quality
  });

  const page = await context.newPage();

  for (const { name, path } of PAGES) {
    const url = `${BASE_URL}${path}`;
    console.log(`📸 Capturing: ${name} (${url})`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
      // Wait a bit for animations to settle
      await page.waitForTimeout(1000);
      
      const filepath = join(OUTPUT_DIR, `${name}.png`);
      await page.screenshot({ path: filepath, fullPage: false });
      console.log(`   ✅ Saved: ${filepath}`);
    } catch (err) {
      console.log(`   ⚠️  Failed: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\n🎉 Done! Screenshots saved to: ${OUTPUT_DIR}`);
}

capture().catch(console.error);

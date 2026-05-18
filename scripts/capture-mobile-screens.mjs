/**
 * Servvo Mobile App - Comprehensive Screen Capture
 * Captures all tabs × all industry verticals via Expo Web.
 * 
 * Screens to capture per vertical:
 * - Home (Dashboard)
 * - Schedule (Appointments)
 * - Messages
 * - Account (Profile)
 * - Billing (inside Account)
 * 
 * Verticals: GreenScape Lawn, Elite Air HVAC, Shield Pest Control
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.env.HOME, 'Desktop/servvo-captures/mobile');
mkdirSync(OUTPUT_DIR, { recursive: true });

const BASE_URL = 'http://localhost:8081';

const VERTICALS = ['lawn_care', 'hvac', 'pest_control'];
const VERTICAL_NAMES = {
  lawn_care: 'greenscape-lawn',
  hvac: 'elite-air-hvac',
  pest_control: 'shield-pest-control',
};

const TABS = ['Home', 'Schedule', 'Messages', 'Account'];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  console.log('📱 Loading Servvo mobile app...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await delay(4000);

  // Capture welcome screen first
  console.log('📸 Capturing: Welcome Screen');
  await page.screenshot({ path: join(OUTPUT_DIR, '00-welcome.png') });

  // Try to get past welcome screen
  try {
    const getStarted = page.getByText('Get Started');
    if (await getStarted.isVisible({ timeout: 3000 })) {
      await getStarted.tap();
      await delay(2000);
      console.log('   → Tapped Get Started');
    }
  } catch (e) {
    console.log('   → No Get Started button found, may already be past welcome');
  }

  // Capture current state
  await page.screenshot({ path: join(OUTPUT_DIR, '00-after-welcome.png') });

  // For each vertical, try to switch and capture all tabs
  for (const vertical of VERTICALS) {
    const verticalName = VERTICAL_NAMES[vertical];
    console.log(`\n🏢 Switching to: ${verticalName}`);

    // Try to find and tap the industry dropdown
    try {
      // Look for the dropdown trigger (provider name text)
      const dropdownTexts = ['GreenScape Lawn', 'Elite Air HVAC', 'Shield Pest Control'];
      for (const text of dropdownTexts) {
        const el = page.getByText(text, { exact: false });
        if (await el.isVisible({ timeout: 1000 })) {
          await el.tap();
          await delay(500);
          break;
        }
      }

      // Now tap the target vertical
      const targetNames = {
        lawn_care: 'GreenScape Lawn',
        hvac: 'Elite Air HVAC',
        pest_control: 'Shield Pest Control',
      };
      const target = page.getByText(targetNames[vertical], { exact: false });
      if (await target.isVisible({ timeout: 2000 })) {
        await target.tap();
        await delay(1500);
      }
    } catch (e) {
      console.log(`   ⚠️  Could not switch vertical: ${e.message}`);
    }

    // Capture each tab
    for (const tab of TABS) {
      try {
        const tabEl = page.getByText(tab, { exact: true });
        if (await tabEl.isVisible({ timeout: 2000 })) {
          await tabEl.tap();
          await delay(1500);
        }
      } catch (e) {
        // Tab might not be clickable
      }

      const filename = `${verticalName}-${tab.toLowerCase()}.png`;
      console.log(`📸 Capturing: ${verticalName} → ${tab}`);
      await page.screenshot({ path: join(OUTPUT_DIR, filename) });

      // If Account tab, also navigate to Billing
      if (tab === 'Account') {
        try {
          const billingLink = page.getByText('Billing', { exact: false });
          if (await billingLink.isVisible({ timeout: 2000 })) {
            await billingLink.tap();
            await delay(1500);
            const billingFilename = `${verticalName}-billing.png`;
            console.log(`📸 Capturing: ${verticalName} → Billing`);
            await page.screenshot({ path: join(OUTPUT_DIR, billingFilename) });

            // Go back to Account
            try {
              const backBtn = page.locator('[aria-label="Back"]').first();
              if (await backBtn.isVisible({ timeout: 1000 })) {
                await backBtn.tap();
                await delay(1000);
              }
            } catch (e) {
              // Try browser back
              await page.goBack();
              await delay(1000);
            }
          }
        } catch (e) {
          console.log(`   ⚠️  Could not navigate to Billing`);
        }
      }
    }
  }

  await browser.close();
  console.log(`\n🎉 Done! All mobile screenshots saved to: ${OUTPUT_DIR}`);
}

capture().catch(console.error);

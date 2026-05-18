/**
 * Servvo Pitch Deck Generator
 * Creates a PPTX with user journeys for:
 * 1. Business Portal (service provider)
 * 2. Mobile App (homeowner) — across all verticals
 */

import PptxGenJS from 'pptxgenjs';
import { join } from 'path';
import { existsSync } from 'fs';

const MOBILE_DIR = join(process.env.HOME, 'Desktop/servvo-captures/mobile');
const WEB_DIR = join(process.env.HOME, 'Desktop/servvo-captures/web');
const OUTPUT = join(process.env.HOME, 'Desktop/servvo-captures/servvo-user-journey.pptx');

// Brand colors
const NAVY = '1B3A5C';
const TEAL = '2BA89D';
const WHITE = 'FFFFFF';
const LIGHT_BG = 'F9F8F4';

function addTitleSlide(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: NAVY };
  
  slide.addText('servvo', {
    x: 0.5, y: 1.5, w: 9, h: 1.2,
    fontSize: 60, fontFace: 'Helvetica Neue',
    color: WHITE, bold: true, align: 'center',
  });
  
  slide.addText('User Journey', {
    x: 0.5, y: 2.7, w: 9, h: 0.8,
    fontSize: 28, fontFace: 'Helvetica Neue',
    color: TEAL, align: 'center',
  });
  
  slide.addText('Better Service Starts at Home', {
    x: 0.5, y: 3.8, w: 9, h: 0.6,
    fontSize: 18, fontFace: 'Helvetica Neue',
    color: 'AABBCC', align: 'center', italic: true,
  });
}

function addSectionDivider(pptx, title, subtitle) {
  const slide = pptx.addSlide();
  slide.background = { color: NAVY };
  
  slide.addText(title, {
    x: 0.5, y: 2.0, w: 9, h: 1.0,
    fontSize: 36, fontFace: 'Helvetica Neue',
    color: WHITE, bold: true, align: 'center',
  });
  
  slide.addText(subtitle, {
    x: 0.5, y: 3.2, w: 9, h: 0.8,
    fontSize: 18, fontFace: 'Helvetica Neue',
    color: TEAL, align: 'center',
  });
}

function addScreenSlide(pptx, imagePath, title, description, isMobile = false) {
  if (!existsSync(imagePath)) {
    console.log(`   ⚠️  Skipping (not found): ${imagePath}`);
    return;
  }
  
  const slide = pptx.addSlide();
  slide.background = { color: LIGHT_BG };
  
  // Title bar at top
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: NAVY },
  });
  
  slide.addText(title, {
    x: 0.5, y: 0.1, w: 6, h: 0.6,
    fontSize: 16, fontFace: 'Helvetica Neue',
    color: WHITE, bold: true,
  });
  
  // Description text
  slide.addText(description, {
    x: 0.3, y: 1.0, w: 3.5, h: 1.5,
    fontSize: 13, fontFace: 'Helvetica Neue',
    color: '333333', valign: 'top',
  });
  
  if (isMobile) {
    // Mobile screenshot — phone-sized, right side
    slide.addImage({
      path: imagePath,
      x: 4.5, y: 0.9, w: 2.8, h: 6.0,
      rounding: true,
    });
    
    // Phone frame hint
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 4.35, y: 0.8, w: 3.1, h: 6.2,
      fill: { type: 'none' },
      line: { color: '333333', width: 2 },
      rectRadius: 0.15,
    });
  } else {
    // Web screenshot — laptop-sized, right side
    slide.addImage({
      path: imagePath,
      x: 3.8, y: 1.0, w: 5.8, h: 3.6,
    });
    
    // Laptop frame hint
    slide.addShape(pptx.ShapeType.rect, {
      x: 3.7, y: 0.9, w: 6.0, h: 3.8,
      fill: { type: 'none' },
      line: { color: '999999', width: 1 },
    });
  }
}

function addJourneyOverview(pptx, title, steps) {
  const slide = pptx.addSlide();
  slide.background = { color: WHITE };
  
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: NAVY },
  });
  
  slide.addText(title, {
    x: 0.5, y: 0.1, w: 9, h: 0.6,
    fontSize: 18, fontFace: 'Helvetica Neue',
    color: WHITE, bold: true,
  });
  
  // Journey steps as a flow
  const stepWidth = 8.5 / steps.length;
  steps.forEach((step, i) => {
    const x = 0.5 + (i * stepWidth);
    const y = 1.5;
    
    // Circle with number
    slide.addText(`${i + 1}`, {
      x: x + (stepWidth / 2) - 0.25, y: y, w: 0.5, h: 0.5,
      fontSize: 14, fontFace: 'Helvetica Neue',
      color: WHITE, bold: true, align: 'center', valign: 'middle',
      shape: pptx.ShapeType.ellipse,
      fill: { color: TEAL },
    });
    
    // Step title
    slide.addText(step.title, {
      x: x, y: y + 0.7, w: stepWidth, h: 0.5,
      fontSize: 11, fontFace: 'Helvetica Neue',
      color: NAVY, bold: true, align: 'center',
    });
    
    // Step description
    slide.addText(step.desc, {
      x: x, y: y + 1.2, w: stepWidth, h: 0.8,
      fontSize: 9, fontFace: 'Helvetica Neue',
      color: '666666', align: 'center', valign: 'top',
    });
    
    // Arrow between steps
    if (i < steps.length - 1) {
      slide.addText('→', {
        x: x + stepWidth - 0.15, y: y + 0.05, w: 0.3, h: 0.4,
        fontSize: 18, color: 'CCCCCC', align: 'center',
      });
    }
  });
}

async function main() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5
  pptx.author = 'Servvo';
  pptx.title = 'Servvo - User Journey';
  
  // Override to standard 10x7.5
  pptx.defineLayout({ name: 'SERVVO', width: 10, height: 7.5 });
  pptx.layout = 'SERVVO';

  // ===== TITLE =====
  addTitleSlide(pptx);

  // ===== BUSINESS PORTAL JOURNEY =====
  addSectionDivider(pptx, 'Business Portal', 'Service Provider Journey');
  
  addJourneyOverview(pptx, 'Business Provider Journey', [
    { title: 'Onboard', desc: 'Set up company, branding, services' },
    { title: 'Dashboard', desc: 'View KPIs, intelligence cards, revenue' },
    { title: 'Customers', desc: 'Manage homeowner relationships' },
    { title: 'Schedule', desc: 'View & manage appointments' },
    { title: 'Notify', desc: 'Send push notifications & promos' },
    { title: 'Message', desc: 'Direct communication with homeowners' },
  ]);

  addScreenSlide(pptx,
    join(WEB_DIR, '01-onboarding-welcome.png'),
    'Step 1: Onboarding',
    'Service providers sign up and configure their business profile, branding, and service offerings through a guided wizard.',
    false
  );

  addScreenSlide(pptx,
    join(WEB_DIR, '02-dashboard.png'),
    'Step 2: Intelligence Dashboard',
    'At-a-glance KPIs: Active Homeowners, Rebooking Rate, Monthly Revenue, Avg/Homeowner, Push Open Rate. Actionable intelligence cards for due-for-service, pending reviews, upsell opportunities, and at-risk customers.',
    false
  );

  addScreenSlide(pptx,
    join(WEB_DIR, '03-customers.png'),
    'Step 3: Customer Management',
    'Full CRM view of all homeowner relationships. See service history, communication logs, payment status, and engagement metrics per customer.',
    false
  );

  addScreenSlide(pptx,
    join(WEB_DIR, '04-schedule.png'),
    'Step 4: Schedule & Services',
    'Calendar view of all upcoming appointments. Manage scheduling, assign crews, and track service completion across all customers.',
    false
  );

  addScreenSlide(pptx,
    join(WEB_DIR, '06-notifications.png'),
    'Step 5: Push Notifications',
    'Compose and send targeted push notifications to homeowners. Select audience segments (All, Due for Service, At-Risk), write message, and schedule delivery.',
    false
  );

  addScreenSlide(pptx,
    join(WEB_DIR, '07-messages.png'),
    'Step 6: Direct Messaging',
    'Real-time messaging with homeowners. Handle service inquiries, send updates, and maintain the personal relationship that drives retention.',
    false
  );

  // ===== MOBILE HOMEOWNER JOURNEY =====
  addSectionDivider(pptx, 'Mobile App', 'Homeowner Journey');
  
  addJourneyOverview(pptx, 'Homeowner Journey', [
    { title: 'Welcome', desc: 'Download app, get started' },
    { title: 'Identify', desc: 'Phone verification' },
    { title: 'Home', desc: 'Dashboard with provider insights' },
    { title: 'Schedule', desc: 'View upcoming appointments' },
    { title: 'Message', desc: 'Chat with service provider' },
    { title: 'Account', desc: 'Profile, billing, preferences' },
  ]);

  addScreenSlide(pptx,
    join(MOBILE_DIR, 'login-get-started.png'),
    'Step 1: Welcome',
    'Premium branded welcome experience. Homeowners see the Servvo identity with key value props: Trusted Professionals, Real-time Updates, Effortless Payments, Personalized Care.',
    true
  );

  addScreenSlide(pptx,
    join(MOBILE_DIR, 'user-identification.png'),
    'Step 2: User Identification',
    'Simple phone-based verification. No passwords, no friction. The homeowner enters their phone number and receives an OTP to confirm identity.',
    true
  );

  // GreenScape Lawn journey
  addSectionDivider(pptx, 'GreenScape Lawn', 'Lawn Care Provider Experience');

  addScreenSlide(pptx,
    join(MOBILE_DIR, 'greenscape-home.png'),
    'Home — GreenScape Lawn',
    'Personalized dashboard showing lawn health insights, upcoming service, and provider relationship. Hero messaging: "Your lawn is looking incredible." Property insight cards show Lawn Health, Last Service, and Seasonal Tips.',
    true
  );

  addScreenSlide(pptx,
    join(MOBILE_DIR, 'greenscape-schedule.png'),
    'Schedule — GreenScape Lawn',
    'Upcoming and past appointments with GreenScape. See service type, date/time, provider name, and status. Easy rebooking and rescheduling.',
    true
  );

  addScreenSlide(pptx,
    join(MOBILE_DIR, 'greenscape-messages.png'),
    'Messages — GreenScape Lawn',
    'Direct messaging with the GreenScape team. Real-time chat for service questions, scheduling changes, or feedback.',
    true
  );

  addScreenSlide(pptx,
    join(MOBILE_DIR, 'greenscape-account.png'),
    'Account — GreenScape Lawn',
    'Profile management, notification preferences, and access to billing. The homeowner controls their experience from one place.',
    true
  );

  addScreenSlide(pptx,
    join(MOBILE_DIR, 'greenscape-billing.png'),
    'Billing — GreenScape Lawn',
    'View invoices, payment history, and manage payment methods. Secure in-app payments with Stripe integration.',
    true
  );

  // Elite Air HVAC journey
  addSectionDivider(pptx, 'Elite Air HVAC', 'HVAC Provider Experience');

  addScreenSlide(pptx,
    join(MOBILE_DIR, 'hvac-home.png'),
    'Home — Elite Air HVAC',
    'Same premium experience, different provider personality. Hero: "Your home feels perfect today." Insight cards show Air Quality, Filter Health, and Energy Efficiency.',
    true
  );

  addScreenSlide(pptx,
    join(MOBILE_DIR, 'hvac-schedule.png'),
    'Schedule — Elite Air HVAC',
    'Seasonal tune-ups, filter replacements, and maintenance visits. The homeowner sees their HVAC care calendar at a glance.',
    true
  );

  // Shield Pest Control journey
  addSectionDivider(pptx, 'Shield Pest Control', 'Pest Control Provider Experience');

  addScreenSlide(pptx,
    join(MOBILE_DIR, 'shield-pest-control-home.png'),
    'Home — Shield Pest Control',
    'Calm, reassuring experience. Hero: "Your home feels protected and peaceful." Insight cards show Protection Status, Last Treatment, and Seasonal Risk.',
    true
  );

  addScreenSlide(pptx,
    join(MOBILE_DIR, 'shield-pest-control-schedule.png'),
    'Schedule — Shield Pest Control',
    'Perimeter protection services, quarterly treatments, and seasonal prevention. Clear visibility into protection coverage.',
    true
  );

  // ===== CLOSING =====
  const closing = pptx.addSlide();
  closing.background = { color: NAVY };
  
  closing.addText('servvo', {
    x: 0.5, y: 2.0, w: 9, h: 1.0,
    fontSize: 48, fontFace: 'Helvetica Neue',
    color: WHITE, bold: true, align: 'center',
  });
  
  closing.addText('One platform. Every home service provider.\nWhite-glove experience for every homeowner.', {
    x: 0.5, y: 3.2, w: 9, h: 1.2,
    fontSize: 18, fontFace: 'Helvetica Neue',
    color: TEAL, align: 'center',
  });
  
  closing.addText('www.servvo.io', {
    x: 0.5, y: 5.0, w: 9, h: 0.5,
    fontSize: 14, fontFace: 'Helvetica Neue',
    color: 'AABBCC', align: 'center',
  });

  // Save
  await pptx.writeFile({ fileName: OUTPUT });
  console.log(`\n🎉 Presentation saved to: ${OUTPUT}`);
}

main().catch(console.error);

/**
 * Servvo Roadmap — Visual PPTX
 * Creates a polished, visual roadmap presentation
 */

import PptxGenJS from 'pptxgenjs';
import { join } from 'path';

const OUTPUT = join(process.env.HOME, 'Desktop/servvo-captures/servvo-roadmap.pptx');

const NAVY = '1B3A5C';
const TEAL = '2BA89D';
const WHITE = 'FFFFFF';
const LIGHT = 'F9F8F4';
const DARK_TEXT = '1A1A1A';
const MUTED = '6B7280';
const GREEN = '059669';
const AMBER = 'D97706';
const RED = 'DC2626';
const BLUE_LIGHT = 'DBEAFE';
const TEAL_LIGHT = 'CCFBF1';
const AMBER_LIGHT = 'FEF3C7';
const PURPLE = '7C3AED';
const PURPLE_LIGHT = 'EDE9FE';

function addTitle(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: NAVY };
  
  slide.addText('servvo', {
    x: 0.5, y: 1.8, w: 9, h: 1.0,
    fontSize: 56, fontFace: 'Helvetica Neue', color: WHITE, bold: true, align: 'center',
  });
  slide.addText('Technical & Product Roadmap', {
    x: 0.5, y: 2.9, w: 9, h: 0.7,
    fontSize: 24, fontFace: 'Helvetica Neue', color: TEAL, align: 'center',
  });
  slide.addText('3-Month Delivery Plan', {
    x: 0.5, y: 3.8, w: 9, h: 0.5,
    fontSize: 16, fontFace: 'Helvetica Neue', color: 'AABBCC', align: 'center',
  });
  slide.addText('June – September 2026', {
    x: 0.5, y: 4.5, w: 9, h: 0.5,
    fontSize: 14, fontFace: 'Helvetica Neue', color: '8899AA', align: 'center',
  });
}

function addVisionSlide(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: WHITE };
  
  // Header
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.7, fill: { color: NAVY } });
  slide.addText('The 3-Layer Architecture', {
    x: 0.4, y: 0.1, w: 9, h: 0.5, fontSize: 16, fontFace: 'Helvetica Neue', color: WHITE, bold: true,
  });

  // Three boxes connected by arrows
  const boxY = 2.0;
  const boxH = 3.5;
  const boxW = 2.6;
  
  // Box 1 - CRM
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.4, y: boxY, w: boxW, h: boxH, fill: { color: BLUE_LIGHT }, line: { color: '93C5FD', width: 1.5 }, rectRadius: 0.1,
  });
  slide.addText('Layer 1', {
    x: 0.4, y: boxY + 0.2, w: boxW, h: 0.4, fontSize: 11, color: MUTED, align: 'center', bold: true,
  });
  slide.addText('CRM Integration', {
    x: 0.4, y: boxY + 0.6, w: boxW, h: 0.5, fontSize: 14, color: DARK_TEXT, align: 'center', bold: true,
  });
  slide.addText('• Jobber (GraphQL)\n• OAuth per business\n• Webhooks (real-time)\n• Custom field sync\n• Bidirectional data\n• Adapter pattern\n  (future CRMs)', {
    x: 0.6, y: boxY + 1.2, w: boxW - 0.4, h: 2.2, fontSize: 10, color: '374151', valign: 'top',
  });

  // Arrow 1→2
  slide.addText('←→', {
    x: 3.1, y: boxY + 1.5, w: 0.7, h: 0.4, fontSize: 16, color: TEAL, align: 'center', bold: true,
  });

  // Box 2 - Portal
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 3.7, y: boxY, w: boxW, h: boxH, fill: { color: TEAL_LIGHT }, line: { color: '5EEAD4', width: 1.5 }, rectRadius: 0.1,
  });
  slide.addText('Layer 2', {
    x: 3.7, y: boxY + 0.2, w: boxW, h: 0.4, fontSize: 11, color: MUTED, align: 'center', bold: true,
  });
  slide.addText('Business Portal', {
    x: 3.7, y: boxY + 0.6, w: boxW, h: 0.5, fontSize: 14, color: DARK_TEXT, align: 'center', bold: true,
  });
  slide.addText('• Intelligence dashboard\n• Customer management\n• Push notifications\n• Branding studio\n• Messaging center\n• Analytics & KPIs\n• Schedule view', {
    x: 3.9, y: boxY + 1.2, w: boxW - 0.4, h: 2.2, fontSize: 10, color: '374151', valign: 'top',
  });

  // Arrow 2→3
  slide.addText('←→', {
    x: 6.4, y: boxY + 1.5, w: 0.7, h: 0.4, fontSize: 16, color: TEAL, align: 'center', bold: true,
  });

  // Box 3 - Mobile
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.0, y: boxY, w: boxW, h: boxH, fill: { color: PURPLE_LIGHT }, line: { color: 'A78BFA', width: 1.5 }, rectRadius: 0.1,
  });
  slide.addText('Layer 3', {
    x: 7.0, y: boxY + 0.2, w: boxW, h: 0.4, fontSize: 11, color: MUTED, align: 'center', bold: true,
  });
  slide.addText('Mobile App', {
    x: 7.0, y: boxY + 0.6, w: boxW, h: 0.5, fontSize: 14, color: DARK_TEXT, align: 'center', bold: true,
  });
  slide.addText('• iOS + Android\n• White-label branding\n• Multi-business toggle\n• Appointments & status\n• In-app payments\n• Messaging\n• Reviews → Google', {
    x: 7.2, y: boxY + 1.2, w: boxW - 0.4, h: 2.2, fontSize: 10, color: '374151', valign: 'top',
  });

  // Bottom callout
  slide.addText('Every action syncs across all 3 layers in real-time', {
    x: 0.4, y: 6.0, w: 9.2, h: 0.5, fontSize: 12, color: TEAL, align: 'center', italic: true,
  });
}

function addTimelineSlide(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: WHITE };
  
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.7, fill: { color: NAVY } });
  slide.addText('12-Week Visual Timeline', {
    x: 0.4, y: 0.1, w: 9, h: 0.5, fontSize: 16, fontFace: 'Helvetica Neue', color: WHITE, bold: true,
  });

  // Timeline bars (Gantt-style)
  const startX = 1.8;
  const barWidth = 7.5;
  const weekWidth = barWidth / 12;
  const barH = 0.55;
  const startY = 1.4;
  const gap = 0.75;

  // Week labels
  for (let i = 1; i <= 12; i++) {
    slide.addText(`${i}`, {
      x: startX + (i - 1) * weekWidth, y: startY - 0.4, w: weekWidth, h: 0.3,
      fontSize: 8, color: MUTED, align: 'center',
    });
  }
  slide.addText('Week', {
    x: 0.3, y: startY - 0.4, w: 1.3, h: 0.3, fontSize: 8, color: MUTED, bold: true,
  });

  // Phase 0: Infrastructure (weeks 1-2)
  const p0Y = startY + 0.1;
  slide.addText('Infrastructure', { x: 0.1, y: p0Y, w: 1.6, h: barH, fontSize: 10, color: DARK_TEXT, bold: true, valign: 'middle' });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: startX, y: p0Y, w: weekWidth * 2, h: barH, fill: { color: '3B82F6' }, rectRadius: 0.05,
  });
  slide.addText('AWS + CI/CD', { x: startX, y: p0Y, w: weekWidth * 2, h: barH, fontSize: 9, color: WHITE, align: 'center', valign: 'middle' });

  // Phase 1: CRM Integration (weeks 2-5)
  const p1Y = p0Y + gap;
  slide.addText('CRM Integration', { x: 0.1, y: p1Y, w: 1.6, h: barH, fontSize: 10, color: DARK_TEXT, bold: true, valign: 'middle' });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: startX + weekWidth * 1, y: p1Y, w: weekWidth * 4, h: barH, fill: { color: GREEN }, rectRadius: 0.05,
  });
  slide.addText('Jobber OAuth + Sync + Webhooks', { x: startX + weekWidth * 1, y: p1Y, w: weekWidth * 4, h: barH, fontSize: 9, color: WHITE, align: 'center', valign: 'middle' });

  // Phase 2: Business Portal (weeks 4-8)
  const p2Y = p1Y + gap;
  slide.addText('Business Portal', { x: 0.1, y: p2Y, w: 1.6, h: barH, fontSize: 10, color: DARK_TEXT, bold: true, valign: 'middle' });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: startX + weekWidth * 3, y: p2Y, w: weekWidth * 5, h: barH, fill: { color: TEAL }, rectRadius: 0.05,
  });
  slide.addText('Real Data + Auth + Notifications', { x: startX + weekWidth * 3, y: p2Y, w: weekWidth * 5, h: barH, fontSize: 9, color: WHITE, align: 'center', valign: 'middle' });

  // Phase 3: Mobile App (weeks 5-10)
  const p3Y = p2Y + gap;
  slide.addText('Mobile App', { x: 0.1, y: p3Y, w: 1.6, h: barH, fontSize: 10, color: DARK_TEXT, bold: true, valign: 'middle' });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: startX + weekWidth * 4, y: p3Y, w: weekWidth * 6, h: barH, fill: { color: PURPLE }, rectRadius: 0.05,
  });
  slide.addText('Real APIs + Payments + App Store', { x: startX + weekWidth * 4, y: p3Y, w: weekWidth * 6, h: barH, fontSize: 9, color: WHITE, align: 'center', valign: 'middle' });

  // Phase 4: Polish & Launch (weeks 9-12)
  const p4Y = p3Y + gap;
  slide.addText('Polish & Launch', { x: 0.1, y: p4Y, w: 1.6, h: barH, fontSize: 10, color: DARK_TEXT, bold: true, valign: 'middle' });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: startX + weekWidth * 8, y: p4Y, w: weekWidth * 4, h: barH, fill: { color: AMBER }, rectRadius: 0.05,
  });
  slide.addText('Testing + Security + Launch', { x: startX + weekWidth * 8, y: p4Y, w: weekWidth * 4, h: barH, fontSize: 9, color: WHITE, align: 'center', valign: 'middle' });

  // Month markers
  const monthY = p4Y + gap + 0.3;
  slide.addShape(pptx.ShapeType.rect, { x: startX, y: monthY, w: weekWidth * 4, h: 0.01, line: { color: MUTED, width: 0.5 } });
  slide.addShape(pptx.ShapeType.rect, { x: startX + weekWidth * 4, y: monthY, w: weekWidth * 4, h: 0.01, line: { color: MUTED, width: 0.5 } });
  slide.addShape(pptx.ShapeType.rect, { x: startX + weekWidth * 8, y: monthY, w: weekWidth * 4, h: 0.01, line: { color: MUTED, width: 0.5 } });
  
  slide.addText('Month 1 (June)', { x: startX, y: monthY + 0.05, w: weekWidth * 4, h: 0.3, fontSize: 9, color: MUTED, align: 'center' });
  slide.addText('Month 2 (July)', { x: startX + weekWidth * 4, y: monthY + 0.05, w: weekWidth * 4, h: 0.3, fontSize: 9, color: MUTED, align: 'center' });
  slide.addText('Month 3 (August)', { x: startX + weekWidth * 8, y: monthY + 0.05, w: weekWidth * 4, h: 0.3, fontSize: 9, color: MUTED, align: 'center' });

  // Key milestone markers
  slide.addText('▼ Jobber Connected', { x: startX + weekWidth * 4.5, y: startY - 0.7, w: 2, h: 0.3, fontSize: 8, color: GREEN, align: 'center' });
  slide.addText('▼ App Store Submit', { x: startX + weekWidth * 8.5, y: startY - 0.7, w: 2, h: 0.3, fontSize: 8, color: PURPLE, align: 'center' });
}

function addInfraSlide(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: WHITE };
  
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.7, fill: { color: '3B82F6' } });
  slide.addText('Phase 0: AWS Infrastructure (Weeks 1–2)', {
    x: 0.4, y: 0.1, w: 9, h: 0.5, fontSize: 16, fontFace: 'Helvetica Neue', color: WHITE, bold: true,
  });

  // Left column - Architecture
  const items = [
    ['ECS Fargate', 'Serverless containers, scales to zero'],
    ['RDS PostgreSQL', 'Multi-AZ, encrypted, auto-backups'],
    ['ElastiCache Redis', 'Sessions, queues, pub/sub'],
    ['S3 + CloudFront', 'Assets, CDN, signed URLs'],
    ['Cognito', 'Business auth + MFA'],
    ['Secrets Manager', 'Auto-rotating credentials'],
    ['WAF', 'Rate limiting, bot protection'],
    ['CloudWatch + X-Ray', 'Monitoring, tracing, alerts'],
  ];

  items.forEach(([ name, desc ], i) => {
    const y = 1.0 + (i * 0.52);
    slide.addText(`●  ${name}`, { x: 0.4, y, w: 2.5, h: 0.4, fontSize: 11, color: DARK_TEXT, bold: true, valign: 'middle' });
    slide.addText(desc, { x: 2.9, y, w: 3.5, h: 0.4, fontSize: 10, color: MUTED, valign: 'middle' });
  });

  // Right column - Key principles
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.5, y: 1.0, w: 3.2, h: 5.5, fill: { color: LIGHT }, rectRadius: 0.1,
  });
  slide.addText('Principles', { x: 6.7, y: 1.2, w: 2.8, h: 0.4, fontSize: 12, color: NAVY, bold: true });
  
  const principles = [
    '🔒 Security-first',
    '💰 Cost-conscious',
    '📈 Scales with demand',
    '🔄 3 environments',
    '🚨 Alerting on all layers',
    '📦 Infrastructure as code',
    '🔁 Zero-downtime deploys',
  ];
  
  principles.forEach((p, i) => {
    slide.addText(p, { x: 6.7, y: 1.7 + (i * 0.5), w: 2.8, h: 0.45, fontSize: 10, color: DARK_TEXT });
  });

  // Cost estimate
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.5, y: 5.6, w: 3.2, h: 0.8, fill: { color: TEAL_LIGHT }, rectRadius: 0.05,
  });
  slide.addText('Est. $150–300/mo at launch', { x: 6.5, y: 5.7, w: 3.2, h: 0.6, fontSize: 11, color: GREEN, align: 'center', bold: true, valign: 'middle' });
}

function addCrmSlide(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: WHITE };
  
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.7, fill: { color: GREEN } });
  slide.addText('Phase 1: CRM Integration — Jobber (Weeks 2–5)', {
    x: 0.4, y: 0.1, w: 9, h: 0.5, fontSize: 16, fontFace: 'Helvetica Neue', color: WHITE, bold: true,
  });

  // Flow diagram
  slide.addText('Integration Flow', { x: 0.4, y: 1.0, w: 3, h: 0.4, fontSize: 12, color: NAVY, bold: true });

  // Jobber box
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.4, y: 1.6, w: 2.2, h: 1.5, fill: { color: BLUE_LIGHT }, rectRadius: 0.08 });
  slide.addText('Jobber\n(per business)', { x: 0.4, y: 1.8, w: 2.2, h: 0.8, fontSize: 11, color: DARK_TEXT, align: 'center', bold: true });
  slide.addText('Clients • Jobs\nInvoices • Visits', { x: 0.4, y: 2.4, w: 2.2, h: 0.6, fontSize: 9, color: MUTED, align: 'center' });

  // Arrow
  slide.addText('OAuth + Webhooks\n←→ GraphQL', { x: 2.7, y: 2.0, w: 1.6, h: 0.8, fontSize: 9, color: TEAL, align: 'center' });

  // Servvo middleware box
  slide.addShape(pptx.ShapeType.roundRect, { x: 4.3, y: 1.6, w: 2.4, h: 1.5, fill: { color: TEAL_LIGHT }, rectRadius: 0.08 });
  slide.addText('Servvo Middleware', { x: 4.3, y: 1.7, w: 2.4, h: 0.5, fontSize: 11, color: DARK_TEXT, align: 'center', bold: true });
  slide.addText('Field Mapper\nSync Queue\nConflict Resolver', { x: 4.3, y: 2.2, w: 2.4, h: 0.8, fontSize: 9, color: MUTED, align: 'center' });

  // Arrow to DB
  slide.addText('→', { x: 6.8, y: 2.1, w: 0.4, h: 0.4, fontSize: 18, color: TEAL, align: 'center' });

  // DB box
  slide.addShape(pptx.ShapeType.roundRect, { x: 7.2, y: 1.6, w: 2.4, h: 1.5, fill: { color: AMBER_LIGHT }, rectRadius: 0.08 });
  slide.addText('PostgreSQL\n(Unified Schema)', { x: 7.2, y: 1.8, w: 2.4, h: 0.8, fontSize: 11, color: DARK_TEXT, align: 'center', bold: true });
  slide.addText('Normalized data\nfor all CRMs', { x: 7.2, y: 2.5, w: 2.4, h: 0.5, fontSize: 9, color: MUTED, align: 'center' });

  // Data mapping table
  slide.addText('Data Mapping', { x: 0.4, y: 3.5, w: 3, h: 0.4, fontSize: 12, color: NAVY, bold: true });
  
  const mappings = [
    ['Jobber Client', '→', 'Customer'],
    ['Jobber Property', '→', 'Property'],
    ['Jobber Job', '→', 'Service'],
    ['Jobber Visit', '→', 'Appointment'],
    ['Jobber Invoice', '→', 'Invoice'],
    ['Custom Fields', '→', 'Dynamic (EAV)'],
  ];

  mappings.forEach(([from, arrow, to], i) => {
    const y = 4.0 + (i * 0.42);
    slide.addText(from, { x: 0.5, y, w: 2.0, h: 0.38, fontSize: 10, color: DARK_TEXT });
    slide.addText(arrow, { x: 2.5, y, w: 0.5, h: 0.38, fontSize: 10, color: TEAL, align: 'center' });
    slide.addText(to, { x: 3.0, y, w: 2.0, h: 0.38, fontSize: 10, color: DARK_TEXT, bold: true });
  });

  // Key features - right side
  slide.addText('Key Capabilities', { x: 5.5, y: 3.5, w: 4, h: 0.4, fontSize: 12, color: NAVY, bold: true });
  
  const features = [
    '✓ Full initial sync on connect',
    '✓ Real-time webhooks (instant updates)',
    '✓ Bidirectional (app actions → CRM)',
    '✓ Custom field discovery + mapping',
    '✓ Rate limit handling (2500/5min)',
    '✓ Retry logic with dead-letter queue',
    '✓ White-glove: same UX for every biz',
    '✓ Adapter pattern for future CRMs',
  ];

  features.forEach((f, i) => {
    slide.addText(f, { x: 5.5, y: 4.0 + (i * 0.42), w: 4.2, h: 0.38, fontSize: 10, color: DARK_TEXT });
  });
}

function addPortalSlide(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: WHITE };
  
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.7, fill: { color: TEAL } });
  slide.addText('Phase 2: Business Portal — Production (Weeks 4–8)', {
    x: 0.4, y: 0.1, w: 9, h: 0.5, fontSize: 16, fontFace: 'Helvetica Neue', color: WHITE, bold: true,
  });

  slide.addText('Mock → Real', { x: 0.4, y: 1.0, w: 4, h: 0.4, fontSize: 12, color: NAVY, bold: true });

  const transitions = [
    ['Dashboard KPIs', 'Real computed metrics from synced data'],
    ['Intelligence Cards', 'At-risk, due-for-service from real appointments'],
    ['Customer List', 'Live data from Jobber sync'],
    ['Push Notifications', 'FCM/APNs delivery to real devices'],
    ['Branding Studio', 'Persisted to DB, consumed by mobile app'],
    ['Messaging', 'WebSocket to real mobile app users'],
    ['Schedule', 'Real appointments from CRM sync'],
  ];

  transitions.forEach(([feature, desc], i) => {
    const y = 1.5 + (i * 0.55);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.4, y, w: 4.5, h: 0.45, fill: { color: i % 2 === 0 ? TEAL_LIGHT : LIGHT }, rectRadius: 0.05,
    });
    slide.addText(feature, { x: 0.6, y, w: 1.8, h: 0.45, fontSize: 10, color: DARK_TEXT, bold: true, valign: 'middle' });
    slide.addText(desc, { x: 2.5, y, w: 2.4, h: 0.45, fontSize: 9, color: MUTED, valign: 'middle' });
  });

  // Right side - new additions
  slide.addText('New Additions', { x: 5.5, y: 1.0, w: 4, h: 0.4, fontSize: 12, color: NAVY, bold: true });

  const additions = [
    ['🔐', 'Business Auth', 'Cognito + MFA'],
    ['📊', 'Real-time Dashboard', 'WebSocket updates'],
    ['💳', 'Servvo Billing', 'Stripe subscription for Servvo'],
    ['📝', 'Audit Logging', 'Compliance-ready'],
    ['👥', 'Team Management', 'Owner, Admin, Viewer roles'],
    ['🔄', 'Sync Health', 'CRM connection monitoring'],
  ];

  additions.forEach(([icon, title, desc], i) => {
    const y = 1.5 + (i * 0.7);
    slide.addText(icon, { x: 5.5, y, w: 0.5, h: 0.5, fontSize: 16, valign: 'middle' });
    slide.addText(title, { x: 6.1, y, w: 2.0, h: 0.35, fontSize: 11, color: DARK_TEXT, bold: true });
    slide.addText(desc, { x: 6.1, y: y + 0.3, w: 3.5, h: 0.3, fontSize: 9, color: MUTED });
  });
}

function addMobileSlide(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: WHITE };
  
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.7, fill: { color: PURPLE } });
  slide.addText('Phase 3: Mobile App — App Store Ready (Weeks 5–10)', {
    x: 0.4, y: 0.1, w: 9, h: 0.5, fontSize: 16, fontFace: 'Helvetica Neue', color: WHITE, bold: true,
  });

  // Left - what becomes real
  slide.addText('Prototype → Production', { x: 0.4, y: 1.0, w: 4, h: 0.4, fontSize: 12, color: NAVY, bold: true });

  const items = [
    ['Auth', 'Real Firebase phone OTP'],
    ['Data', 'Real API calls (no more mocks)'],
    ['Branding', 'Dynamic brand loading per business'],
    ['Payments', 'Stripe (intents, saved methods)'],
    ['Push', 'Real FCM/APNs delivery'],
    ['Messaging', 'Real WebSocket to Servvo API'],
    ['Multi-Biz', 'Toggle between businesses'],
  ];

  items.forEach(([title, desc], i) => {
    const y = 1.5 + (i * 0.52);
    slide.addText(`${title}:`, { x: 0.5, y, w: 1.3, h: 0.45, fontSize: 10, color: PURPLE, bold: true, valign: 'middle' });
    slide.addText(desc, { x: 1.8, y, w: 3.2, h: 0.45, fontSize: 10, color: DARK_TEXT, valign: 'middle' });
  });

  // Right - App Store
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 5.5, y: 1.0, w: 4.2, h: 3.0, fill: { color: PURPLE_LIGHT }, rectRadius: 0.1,
  });
  slide.addText('App Store Submission', { x: 5.7, y: 1.2, w: 3.8, h: 0.4, fontSize: 12, color: PURPLE, bold: true });
  
  const appStore = [
    '• iOS: TestFlight → App Store Connect',
    '• Android: Internal Testing → Production',
    '• Privacy policy + data disclosure',
    '• Accessibility (VoiceOver/TalkBack)',
    '• EAS Build for native binaries',
    '• OTA updates for non-native changes',
  ];
  appStore.forEach((item, i) => {
    slide.addText(item, { x: 5.7, y: 1.7 + (i * 0.38), w: 3.8, h: 0.35, fontSize: 9, color: DARK_TEXT });
  });

  // Bidirectional sync callout
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 5.5, y: 4.3, w: 4.2, h: 1.8, fill: { color: TEAL_LIGHT }, rectRadius: 0.1,
  });
  slide.addText('Bidirectional Sync', { x: 5.7, y: 4.5, w: 3.8, h: 0.4, fontSize: 12, color: TEAL, bold: true });
  slide.addText('Homeowner reschedules\n    → Servvo API updates DB\n    → WebSocket to Business Portal\n    → GraphQL mutation to Jobber\n    → Push to business owner', {
    x: 5.7, y: 4.9, w: 3.8, h: 1.2, fontSize: 9, color: DARK_TEXT, fontFace: 'Courier',
  });
}

function addLaunchSlide(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: WHITE };
  
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.7, fill: { color: AMBER } });
  slide.addText('Phase 4: Polish, Testing & Launch (Weeks 9–12)', {
    x: 0.4, y: 0.1, w: 9, h: 0.5, fontSize: 16, fontFace: 'Helvetica Neue', color: WHITE, bold: true,
  });

  // Performance targets
  slide.addText('Performance Targets', { x: 0.4, y: 1.0, w: 4, h: 0.4, fontSize: 12, color: NAVY, bold: true });

  const metrics = [
    ['API (p50)', '< 200ms'],
    ['API (p99)', '< 1s'],
    ['App cold start', '< 3s'],
    ['Push delivery', '< 5s'],
    ['Webhook processing', '< 2s'],
    ['Dashboard load', '< 1.5s'],
  ];

  metrics.forEach(([metric, target], i) => {
    const y = 1.5 + (i * 0.48);
    slide.addText(metric, { x: 0.5, y, w: 2.2, h: 0.42, fontSize: 10, color: DARK_TEXT });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 2.8, y: y + 0.05, w: 1.2, h: 0.32, fill: { color: TEAL_LIGHT }, rectRadius: 0.05,
    });
    slide.addText(target, { x: 2.8, y, w: 1.2, h: 0.42, fontSize: 10, color: GREEN, align: 'center', bold: true });
  });

  // Testing & security
  slide.addText('Testing & Security', { x: 5.0, y: 1.0, w: 4, h: 0.4, fontSize: 12, color: NAVY, bold: true });
  
  const tests = [
    '✓ End-to-end: Jobber → API → Portal → Mobile',
    '✓ Load test: 50 businesses × 200 customers',
    '✓ Security pen test (OWASP top 10)',
    '✓ Payment flow: test → live cutover',
    '✓ Disaster recovery test (RDS restore)',
    '✓ Uptime monitoring (external, 30s)',
    '✓ On-call rotation + runbook',
  ];

  tests.forEach((t, i) => {
    slide.addText(t, { x: 5.0, y: 1.5 + (i * 0.45), w: 4.8, h: 0.4, fontSize: 10, color: DARK_TEXT });
  });

  // Launch checklist
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.4, y: 5.0, w: 9.2, h: 1.5, fill: { color: AMBER_LIGHT }, rectRadius: 0.1,
  });
  slide.addText('🚀 Launch Criteria', { x: 0.6, y: 5.1, w: 4, h: 0.4, fontSize: 12, color: AMBER, bold: true });
  slide.addText('• First pilot customer onboarded and using all 3 layers\n• All performance targets met\n• Security audit passed\n• App Store approved (both iOS + Android)\n• Monitoring + alerting confirmed working', {
    x: 0.6, y: 5.5, w: 8.8, h: 1.0, fontSize: 10, color: DARK_TEXT,
  });
}

function addClosingSlide(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: NAVY };
  
  slide.addText('servvo', {
    x: 0.5, y: 2.2, w: 9, h: 0.8, fontSize: 44, fontFace: 'Helvetica Neue', color: WHITE, bold: true, align: 'center',
  });
  slide.addText('12 weeks to production.\nOne platform. Every home service provider.', {
    x: 0.5, y: 3.2, w: 9, h: 1.0, fontSize: 18, fontFace: 'Helvetica Neue', color: TEAL, align: 'center',
  });
  slide.addText('CRM Integration → Business Portal → Mobile App\nAll layers. Always talking.', {
    x: 0.5, y: 4.5, w: 9, h: 0.8, fontSize: 14, fontFace: 'Helvetica Neue', color: 'AABBCC', align: 'center',
  });
}

async function main() {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'SERVVO', width: 10, height: 7.5 });
  pptx.layout = 'SERVVO';
  pptx.author = 'Servvo';
  pptx.title = 'Servvo Technical Roadmap';

  addTitle(pptx);
  addVisionSlide(pptx);
  addTimelineSlide(pptx);
  addInfraSlide(pptx);
  addCrmSlide(pptx);
  addPortalSlide(pptx);
  addMobileSlide(pptx);
  addLaunchSlide(pptx);
  addClosingSlide(pptx);

  await pptx.writeFile({ fileName: OUTPUT });
  console.log(`🎉 Roadmap deck saved to: ${OUTPUT}`);
}

main().catch(console.error);

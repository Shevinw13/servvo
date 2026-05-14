# Implementation Plan: Servvo Business Platform

## Overview

This plan implements the Servvo Business Platform — a frontend-only Next.js 14 web application at `apps/web/` in the existing monorepo. The implementation proceeds incrementally: project scaffolding → design tokens → state management → layout → shared components → feature pages → analytics → final integration. All data is mock/local state with no backend dependencies.

## Tasks

- [x] 1. Project scaffolding and configuration
  - [x] 1.1 Initialize Next.js 14 app at `apps/web/` with App Router, TypeScript, Tailwind CSS, and PostCSS
    - Create `package.json` with dependencies: next, react, react-dom, tailwindcss, postcss, autoprefixer, framer-motion, recharts, fast-check, vitest, @testing-library/react, jsdom
    - Create `next.config.js`, `tsconfig.json`, `postcss.config.js`
    - Create `src/app/layout.tsx` (root layout) and `src/app/globals.css` with Tailwind directives
    - _Requirements: 9.1, 9.2_

  - [x] 1.2 Configure Tailwind with Servvo design tokens and shadcn/ui
    - Create `tailwind.config.ts` extending Servvo palette (dark forest green `#2D4A2D`, warm cream backgrounds, soft shadows)
    - Set up CSS custom properties for brand tokens in `globals.css`
    - Initialize shadcn/ui with `components.json` and install base components: Button, Card, Input, Label, Tooltip, Dialog, Tabs, Badge, Switch, Separator
    - _Requirements: 9.1, 9.2, 9.5_

  - [x] 1.3 Set up Vitest testing configuration
    - Create `vitest.config.ts` with jsdom environment
    - Create `src/test/setup.ts` with testing-library setup and Framer Motion mocks
    - Verify test runner works with a trivial test
    - _Requirements: (testing infrastructure)_

- [x] 2. Type definitions and mock data
  - [x] 2.1 Create all TypeScript type definitions
    - Create `src/types/brand.ts` — BrandConfig, ProviderTerminology, MessagingTone, NotificationSettings, NotificationTemplate
    - Create `src/types/onboarding.ts` — OnboardingState
    - Create `src/types/crm.ts` — CRMIntegration, CRMConnectionState
    - Create `src/types/customer.ts` — Customer, ServiceRecord, CustomerMetrics
    - Create `src/types/analytics.ts` — AnalyticsMetrics, EngagementDataPoint, BookingsDataPoint
    - _Requirements: 10.1, 10.4_

  - [x] 2.2 Create mock data and default values
    - Create `src/data/defaults.ts` with DEFAULT_BRAND_CONFIG (primary: #2D4A2D, terminology: Provider)
    - Create `src/data/mockCustomers.ts` with 10+ mock homeowner profiles
    - Create `src/data/mockAnalytics.ts` with 30-day engagement data and weekly bookings
    - Create `src/data/mockNotificationTemplates.ts` with templates for each tone × each notification type
    - Create `src/data/mockCRMIntegrations.ts` with Jobber, Housecall Pro, ServiceTitan entries
    - _Requirements: 10.4, 4.6, 7.1, 8.1_

- [x] 3. Utility functions and state management
  - [x] 3.1 Create utility functions
    - Create `src/lib/utils.ts` with `cn()` helper (clsx + tailwind-merge)
    - Create `src/lib/colorUtils.ts` with hex validation, contrast ratio calculation, color manipulation
    - Create `src/lib/terminology.ts` with terminology substitution helpers
    - _Requirements: 9.7, 3.6_

  - [x] 3.2 Implement BrandConfigContext with useReducer
    - Create `src/contexts/BrandConfigContext.tsx` with BrandConfigState, BrandConfigAction types, reducer, provider, and context
    - Implement all action handlers: SET_BUSINESS_INFO, SET_LOGO, SET_COLORS, SET_TYPOGRAPHY, SET_TERMINOLOGY, SET_IMAGERY_STYLE, SET_MESSAGING_TONE, SET_NOTIFICATIONS, SET_ONBOARDED, RESET
    - Implement state validation on initialization with fallback to defaults
    - Create `src/hooks/useBrandConfig.ts` custom hook
    - _Requirements: 10.1, 10.2, 10.4, 10.5_

  - [ ]* 3.3 Write property test for brand config reducer (Property 1)
    - **Property 1: Brand config reducer correctness**
    - Generate random valid BrandConfigActions and verify dispatched values appear at correct paths with other fields unchanged
    - **Validates: Requirements 3.9, 10.1**

  - [x] 3.4 Implement OnboardingContext
    - Create `src/contexts/OnboardingContext.tsx` with OnboardingState, step management, data accumulation
    - Create `src/hooks/useOnboarding.ts` custom hook
    - _Requirements: 2.14, 10.2_

  - [x] 3.5 Implement CRMContext
    - Create `src/contexts/CRMContext.tsx` with connection state management (connect, disconnect, timestamps)
    - Create `src/hooks/useCRMConnections.ts` custom hook
    - _Requirements: 5.6, 10.2_

  - [ ]* 3.6 Write property test for CRM connect/disconnect round-trip (Property 5)
    - **Property 5: CRM connect/disconnect round-trip**
    - Generate random CRM integration IDs, connect then disconnect, verify return to initial unconnected state
    - **Validates: Requirements 5.5**

  - [ ]* 3.7 Write property test for business information validation (Property 4)
    - **Property 4: Business information validation**
    - Generate random strings for name, email, phone; verify valid formats accepted and invalid rejected with appropriate error messages
    - **Validates: Requirements 2.6**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Layout components and navigation
  - [x] 5.1 Implement Sidebar and TopBar components
    - Create `src/components/layout/Sidebar.tsx` with navigation items: Dashboard, Branding Studio, Customer Experience, CRM Integrations, Notifications, Customers, Analytics, Settings
    - Create `src/components/layout/SidebarItem.tsx` with active state, hover tooltip for collapsed mode
    - Create `src/components/layout/TopBar.tsx` displaying business name from context and avatar placeholder
    - Implement sidebar collapse behavior below 1024px viewport width
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6_

  - [x] 5.2 Implement AppShell and ContentArea
    - Create `src/components/layout/AppShell.tsx` composing Sidebar + TopBar + ContentArea
    - Create `src/components/layout/ContentArea.tsx` with max-width constraints and spacing
    - Create `src/app/(platform)/layout.tsx` using AppShell
    - _Requirements: 1.4, 11.3_

  - [x] 5.3 Implement shared animation components
    - Create `src/components/shared/AnimatedCard.tsx` with Framer Motion entrance animation and stagger delay
    - Create `src/components/shared/PageTransition.tsx` with Framer Motion page transition wrapper
    - Create `src/components/shared/ConfettiCelebration.tsx` with canvas-based confetti animation triggered by prop
    - Create `src/components/shared/DesktopOnlyMessage.tsx` for viewports below 1024px
    - _Requirements: 9.3, 9.4, 9.5, 11.2_

  - [x] 5.4 Implement responsive layout and root routing
    - Create `src/app/page.tsx` with redirect logic (onboarding incomplete → /onboarding, else → /dashboard)
    - Create `src/app/(onboarding)/onboarding/page.tsx` placeholder
    - Create `src/app/(platform)/dashboard/page.tsx` placeholder
    - Apply max-width 1440px constraint and fluid scaling from 1024px–2560px
    - _Requirements: 11.1, 11.2, 11.3_

- [ ] 6. Mobile Preview component
  - [x] 6.1 Implement PhoneFrame and MobilePreview shell
    - Create `src/components/preview/PhoneFrame.tsx` with realistic device bezel at 9:19.5 aspect ratio
    - Create `src/components/preview/MobilePreview.tsx` with panel/overlay mode support
    - Create `src/components/preview/PreviewNavigation.tsx` for navigating between simulated screens
    - _Requirements: 4.1, 4.4, 4.5_

  - [x] 6.2 Implement preview screens
    - Create `src/components/preview/screens/HomeDashboardScreen.tsx` — simulated homeowner home screen with branding applied
    - Create `src/components/preview/screens/ServiceStatusScreen.tsx` — service tracking with provider terminology
    - Create `src/components/preview/screens/ProviderProfileScreen.tsx` — provider card with branding colors
    - Create `src/components/preview/PreviewScreen.tsx` as screen router
    - All screens read from BrandConfigContext and render with current colors, logo, terminology
    - _Requirements: 4.2, 4.3, 4.6_

  - [ ]* 6.3 Write property test for preview reflecting brand config (Property 2)
    - **Property 2: Preview reflects brand config**
    - Generate random valid BrandConfig objects (hex colors, terminology values, logo values) and verify MobilePreview renders elements reflecting those values
    - **Validates: Requirements 2.12, 3.8, 4.3**

- [ ] 7. Onboarding wizard
  - [x] 7.1 Implement OnboardingWizard shell with step management
    - Create `src/components/onboarding/OnboardingWizard.tsx` with step state, forward/backward navigation, progress tracking
    - Create `src/components/onboarding/StepProgressBar.tsx` showing current step / total steps with labels
    - Create `src/components/onboarding/StepTransition.tsx` with Framer Motion slide/fade animation (direction-aware)
    - _Requirements: 2.2, 2.3, 2.4_

  - [x] 7.2 Implement onboarding steps: Welcome, Business Info, Logo Upload
    - Create `src/components/onboarding/WelcomeStep.tsx` — headline, value proposition, CTA button
    - Create `src/components/onboarding/BusinessInfoStep.tsx` — business name, phone, email with inline validation
    - Create `src/components/onboarding/LogoUploadStep.tsx` — drag-and-drop zone, image preview, file validation
    - Create `src/components/branding/LogoUploader.tsx` reusable component (shared with Branding Studio)
    - _Requirements: 2.1, 2.6, 2.7_

  - [x] 7.3 Implement onboarding steps: Brand Colors, Terminology, Imagery Style
    - Create `src/components/onboarding/BrandColorsStep.tsx` — color pickers for primary/accent with preset palettes
    - Create `src/components/onboarding/TerminologyStep.tsx` — selectable cards for Provider, Crew, Team, Service Professional
    - Create `src/components/onboarding/ImageryStyleStep.tsx` — selectable imagery options with visual previews
    - _Requirements: 2.8, 2.9, 2.10_

  - [x] 7.4 Implement onboarding steps: CRM Connection, App Preview, Completion
    - Create `src/components/onboarding/CRMConnectionStep.tsx` — integration cards with mock Connect buttons
    - Create `src/components/onboarding/AppPreviewStep.tsx` — MobilePreview reflecting all onboarding choices
    - Create `src/components/onboarding/CompletionStep.tsx` — congratulatory message with ConfettiCelebration
    - Wire completion to set `isOnboarded: true` in BrandConfigContext and redirect to /dashboard
    - _Requirements: 2.11, 2.12, 2.13_

  - [x] 7.5 Wire onboarding page and back navigation with data preservation
    - Update `src/app/(onboarding)/onboarding/page.tsx` to render OnboardingWizard
    - Create `src/app/(onboarding)/layout.tsx` with minimal layout (no sidebar)
    - Ensure Back button preserves all previously entered data across all steps
    - Persist onboarding data in OnboardingContext so page refresh within session doesn't lose progress
    - _Requirements: 2.5, 2.14_

  - [ ]* 7.6 Write property test for onboarding back navigation (Property 3)
    - **Property 3: Onboarding back navigation preserves data**
    - Generate random form data, navigate forward then backward, verify all field values preserved
    - **Validates: Requirements 2.5**

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Branding Studio
  - [x] 9.1 Implement BrandingStudio page with side-by-side layout
    - Create `src/components/branding/BrandingStudio.tsx` with left editing panel + right MobilePreview
    - Create `src/app/(platform)/branding/page.tsx` rendering BrandingStudio within PageTransition
    - Implement vertical stacking when content area width falls below 900px
    - _Requirements: 3.1, 11.4_

  - [x] 9.2 Implement branding editor panels
    - Create `src/components/branding/ColorPickerPanel.tsx` — hex input, preset swatches, color picker for primary and accent
    - Create `src/components/branding/TypographySelector.tsx` — 3+ font pairing options with live previews
    - Create `src/components/branding/ImagerySelector.tsx` — curated imagery style selection
    - Create `src/components/branding/TerminologySelector.tsx` — Provider/Crew/Team/Service Professional cards
    - Create `src/components/branding/ToneSelector.tsx` — notification tone selection
    - All panels dispatch to BrandConfigContext on change; MobilePreview updates within 300ms
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

- [ ] 10. CRM Integration Center
  - [x] 10.1 Implement CRM Integration page
    - Create `src/components/crm/IntegrationCard.tsx` — CRM logo, name, description, Connect/Disconnect button, status indicator
    - Create `src/components/crm/ConnectionFlow.tsx` — simulated loading state (1-2s delay) followed by success confirmation
    - Create `src/components/crm/IntegrationGrid.tsx` — grid layout of integration cards
    - Create `src/app/(platform)/integrations/page.tsx` rendering IntegrationGrid within PageTransition
    - Display green status indicator and "Connected" label for connected integrations
    - Display last-synced timestamp for connected integrations
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 11. Customer Experience Settings
  - [x] 11.1 Implement Customer Experience page
    - Create `src/components/customer-experience/ToneSelector.tsx` — Professional, Friendly, Luxury, Modern cards with example text
    - Create `src/components/customer-experience/NotificationTemplateEditor.tsx` — editable templates for appointment confirmation, service in-progress, service complete, review request
    - Create `src/components/customer-experience/ServiceStatusMessages.tsx` — configurable messages for each service stage
    - Create `src/components/customer-experience/ReviewRequestSettings.tsx` — toggle + timing configuration
    - Create `src/components/customer-experience/RebookingSettings.tsx` — toggle for auto rebooking suggestions
    - Create `src/app/(platform)/customer-experience/page.tsx` composing all settings sections
    - Tone selection updates notification template previews to reflect selected tone
    - Persist all settings in BrandConfigContext
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ]* 11.2 Write property test for tone-to-template mapping (Property 6)
    - **Property 6: Tone-to-template mapping**
    - Generate random valid tone selections, verify all template previews update to the selected tone's variants with no cross-contamination
    - **Validates: Requirements 6.2**

- [ ] 12. Customer Management
  - [x] 12.1 Implement Customer List page
    - Create `src/components/customers/CustomerCard.tsx` — name, address, last service date, engagement status badge
    - Create `src/components/customers/CustomerList.tsx` — card-based list with search input filtering by name/address
    - Create `src/components/customers/CustomerDetailPanel.tsx` — slide-out panel with profile, service history, engagement metrics
    - Create `src/components/customers/EngagementSummary.tsx` — total customers, active, due for rebooking counts
    - Create `src/app/(platform)/customers/page.tsx` composing CustomerList + EngagementSummary
    - Use card-based layouts with generous spacing (no dense tables)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 12.2 Write property test for customer search filtering (Property 7)
    - **Property 7: Customer search filtering**
    - Generate random customer lists and search queries, verify filtered results contain only matching customers (case-insensitive name/address) with no false exclusions
    - **Validates: Requirements 7.3**

  - [ ]* 12.3 Write property test for engagement summary computation (Property 8)
    - **Property 8: Engagement summary computation**
    - Generate random customer lists with varied engagement statuses, verify totalCustomers = list length, activeCustomers = count of 'active', dueForRebooking = count of 'due_for_rebooking'
    - **Validates: Requirements 7.4**

- [ ] 13. Analytics Dashboard
  - [x] 13.1 Implement Analytics Dashboard page
    - Create `src/components/analytics/CountUpNumber.tsx` — animated count-up from 0 to target value over 1500ms
    - Create `src/components/analytics/MetricCard.tsx` — large spacious card with label, animated value, optional trend indicator
    - Create `src/components/analytics/EngagementChart.tsx` — Recharts line chart for 30-day engagement data
    - Create `src/components/analytics/BookingsChart.tsx` — Recharts bar chart for weekly repeat bookings
    - Create `src/app/(platform)/analytics/page.tsx` composing metric cards + charts with AnimatedCard entrances
    - Create `src/hooks/useCountUp.ts` hook for count-up animation logic
    - Metric cards: total customers, repeat booking rate, average review rating, retention rate, weekly app sessions
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ] 14. Remaining pages and WCAG compliance
  - [x] 14.1 Implement Dashboard, Notifications, and Settings pages
    - Create `src/app/(platform)/dashboard/page.tsx` — overview page with key metrics summary and quick links to sections
    - Create `src/app/(platform)/notifications/page.tsx` — notification preferences overview (reads from BrandConfigContext)
    - Create `src/app/(platform)/settings/page.tsx` — settings overview with links to branding and customer experience
    - _Requirements: 1.1_

  - [x] 14.2 Implement WCAG contrast compliance and accessibility
    - Audit all color combinations against WCAG 2.1 AA thresholds using `colorUtils.ts` contrast ratio function
    - Ensure minimum 44px touch targets on all interactive elements
    - Add proper ARIA labels, roles, and keyboard navigation support across all components
    - _Requirements: 9.4, 9.7_

  - [ ]* 14.3 Write property test for WCAG color contrast (Property 9)
    - **Property 9: Color contrast WCAG compliance**
    - Generate color pairs from the Servvo design token palette, verify computed contrast ratios meet WCAG 2.1 AA thresholds (≥4.5:1 body, ≥3:1 large text)
    - **Validates: Requirements 9.7**

- [ ] 15. Integration wiring and state persistence
  - [x] 15.1 Wire all providers and verify cross-section state persistence
    - Update `src/app/layout.tsx` to wrap app with BrandConfigProvider, OnboardingProvider, CRMProvider
    - Verify navigating between all platform sections preserves brand config, CRM states, and customer experience settings
    - Verify onboarding completion correctly transitions to platform layout
    - Verify state corruption triggers reset to defaults and onboarding welcome screen
    - _Requirements: 10.1, 10.2, 10.3, 10.5_

  - [ ]* 15.2 Write property test for state persistence across navigation (Property 10)
    - **Property 10: State persistence across navigation**
    - Generate random complete BrandConfig objects, simulate navigation (unmount/remount children while provider stays mounted), verify complete state preserved without data loss
    - **Validates: Requirements 10.3, 2.14**

- [x] 16. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All components use Framer Motion for animations, shadcn/ui as base, and Tailwind for styling
- No backend, no APIs, no auth — all data is mock/local state

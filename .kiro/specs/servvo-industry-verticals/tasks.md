# Implementation Plan: Servvo Industry Verticals

## Overview

This plan implements an industry configuration layer for the Servvo mobile app, enabling HVAC and Pest Control verticals alongside the existing Lawn Care experience. The implementation follows a bottom-up approach: define types first, build vertical configs, create the registry and store, wire theme resolution, then update UI components to consume industry-aware data.

## Tasks

- [x] 1. Define industry types and interfaces
  - [ ] 1.1 Create `apps/mobile/src/config/industry.types.ts` with all type definitions
    - Define `IndustryVertical` union type (`'lawn_care' | 'hvac' | 'pest_control'`)
    - Define `IndustryColors`, `IndustryGradients`, `IndustryHero`, `InsightCardConfig`, `ServiceTypeConfig`, `IndustryEvent`, `SeasonalTipsMap` interfaces
    - Define the complete `IndustryConfig` interface with fixed-length tuple for `insightCards` and `Record<number, string>` for `seasonalTips`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Create per-industry vertical configurations
  - [ ] 2.1 Create `apps/mobile/src/config/verticals/lawnCare.ts`
    - Export `lawnCareConfig` implementing `IndustryConfig` with lawn-care-specific colors, gradients, terminology, hero, insight cards, service types, mock appointment, mock events, and seasonal tips for all 12 months
    - _Requirements: 6.1, 6.4, 6.5_

  - [ ] 2.2 Create `apps/mobile/src/config/verticals/hvac.ts`
    - Export `hvacConfig` implementing `IndustryConfig` with HVAC-specific colors (blue palette), terminology ("Technician", "home", "maintenance"), hero, insight cards (Air Quality, Filter Health, Energy Efficiency), service types, mock appointment, mock events, and seasonal tips for all 12 months
    - _Requirements: 6.2, 6.4, 6.5_

  - [ ] 2.3 Create `apps/mobile/src/config/verticals/pestControl.ts`
    - Export `pestControlConfig` implementing `IndustryConfig` with pest-control-specific colors (dark/green palette), terminology ("Specialist", "home", "treatment"), hero, insight cards (Protection Status, Last Treatment, Seasonal Risk), service types, mock appointment, mock events, and seasonal tips for all 12 months
    - _Requirements: 6.3, 6.4, 6.5_

  - [ ]* 2.4 Write property test for industry config structural invariants
    - **Property 1: Industry config structural invariants**
    - For each supported vertical, verify exactly 3 insight cards, non-empty seasonal tip for months 1–12, at least 3 mock events with valid fields, and at least 1 service type with non-empty name and positive duration
    - **Validates: Requirements 1.2, 1.3, 6.4, 6.5, 8.3**

- [ ] 3. Create industry configuration registry
  - [ ] 3.1 Create `apps/mobile/src/config/industryConfigs.ts`
    - Import all three vertical configs
    - Define `INDUSTRY_REGISTRY` as `Record<IndustryVertical, IndustryConfig>`
    - Implement `getIndustryConfig(vertical)` that returns the config or throws for unsupported verticals
    - Implement `getAvailableVerticals()` that returns all supported vertical keys
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 3.2 Write property tests for industry registry
    - **Property 2: Registry returns matching config** — for any valid vertical, `getIndustryConfig(vertical).vertical` equals the requested vertical
    - **Property 3: Registry rejects invalid verticals** — for any string not in the supported set, `getIndustryConfig` throws
    - **Validates: Requirements 2.2, 2.3**

- [ ] 4. Create industry Zustand store
  - [ ] 4.1 Create `apps/mobile/src/stores/industryStore.ts`
    - Define `IndustryStoreState` interface with `currentVertical`, `config`, and `setIndustry` action
    - Initialize with `lawn_care` as default vertical
    - `setIndustry` updates both `currentVertical` and `config` via `getIndustryConfig`
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 4.2 Write property test for industry store
    - **Property 4: Store reflects selected vertical** — after `setIndustry(vertical)`, `currentVertical` equals that vertical and `config` equals `getIndustryConfig(vertical)`
    - **Validates: Requirements 3.3, 3.4**

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement theme resolution and provider integration
  - [ ] 6.1 Create `apps/mobile/src/config/buildIndustryTheme.ts`
    - Implement `buildIndustryTheme(config: IndustryConfig): Theme` that merges config colors and gradients over `defaultTokens` and sets terminology
    - Preserve all non-overridden token values (spacing, typography, border radius, shadows)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 6.2 Write property tests for theme resolution
    - **Property 5: Theme reflects industry config tokens** — `buildIndustryTheme(config).tokens.colors.primary` equals `config.colors.primary`, gradients match, terminology matches
    - **Property 6: Theme preserves non-overridden defaults** — spacing, typography, border radius, and shadow tokens remain identical to `defaultTokens`
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

  - [ ] 6.3 Update `apps/mobile/src/theme/BrandThemeProvider.tsx`
    - Import `useIndustryStore` and `buildIndustryTheme`
    - Resolve theme by first applying `buildIndustryTheme` with industry config, then layering BrandConfig overrides if present
    - Memoize the resolved theme based on both `brandConfig` and `industryConfig`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 6.4 Write property tests for BrandThemeProvider integration
    - **Property 7: BrandConfig overrides layer on industry theme** — when BrandConfig is present, primary and accent colors equal BrandConfig values
    - **Property 8: Absent BrandConfig yields pure industry theme** — when no BrandConfig, resolved theme equals `buildIndustryTheme(config)`
    - **Validates: Requirements 5.2, 5.4**

- [ ] 7. Update utility functions for industry awareness
  - [ ] 7.1 Update `apps/mobile/src/utils/greetingUtils.ts`
    - Add `buildIndustryGreeting(config: IndustryConfig, firstName: string, hour: number): string`
    - Morning (5–11): "Good morning, {firstName}"
    - Afternoon (12–16): "Good afternoon, {firstName}"
    - Evening (17–23, 0–4): "{config.hero.greetingLine}, {firstName}"
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 7.2 Write property test for industry greeting
    - **Property 9: Greeting follows time-of-day rules** — verify correct prefix for each time range and that result is non-empty and contains firstName
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

  - [ ] 7.3 Update `apps/mobile/src/utils/seasonalTips.ts`
    - Add `getIndustrySeasonalTip(config: IndustryConfig, month: number): string`
    - Return `config.seasonalTips[month]` if it exists, otherwise return a generic fallback tip
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 7.4 Write property test for seasonal tip lookup
    - **Property 10: Seasonal tip lookup returns correct month's tip** — for any valid config and month 1–12, returns `config.seasonalTips[month]`
    - **Validates: Requirement 8.1**

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Update UI components for industry integration
  - [ ] 9.1 Generalize the PropertySnapshot component
    - Update `PropertySnapshot` to accept `config: IndustryConfig` and `currentMonth: number` as props
    - Render exactly 3 insight cards from `config.insightCards`
    - For the third card, display the seasonal tip value from `getIndustrySeasonalTip(config, currentMonth)` instead of the static value
    - Display each card's icon, label, and resolved value
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 9.2 Write property test for PropertySnapshot data transformation
    - **Property 11: Third insight card displays seasonal tip** — the third card's display value equals `getIndustrySeasonalTip(config, month)`
    - **Validates: Requirements 9.1, 9.2, 9.4**

  - [ ] 9.3 Update HeroSection to accept `greetingLine` prop
    - Modify HeroSection component to accept an `imageUri` and `greetingLine` prop from the industry config
    - Use `buildIndustryGreeting` for the greeting text
    - _Requirements: 11.1_

  - [ ] 9.4 Create `apps/mobile/src/components/dev/IndustrySwitcher.tsx`
    - Render a pill-style toggle for each available vertical from `getAvailableVerticals()`
    - On press, call `setIndustry` on the industry store
    - Highlight the active vertical's pill with the primary color background
    - Display emoji + short label for each vertical (🌿 Lawn, ❄️ HVAC, 🛡️ Pest)
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 10. Wire DashboardScreen to use industry configuration
  - [ ] 10.1 Update `apps/mobile/src/screens/home/DashboardScreen.tsx`
    - Import and use `useIndustryStore` to get the active `config`
    - Pass `config.hero.imageUri` and `config.hero.greetingLine` to HeroSection
    - Pass `config.mockAppointment` data to NextServiceCard
    - Pass `config` and `currentMonth` to PropertySnapshot
    - Pass `config.mockEvents` to ActivityTimeline
    - Add IndustrySwitcher component to the dashboard for demo purposes
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The design uses TypeScript throughout — all implementation follows the existing React Native + Zustand patterns in the codebase
- This is frontend-only with mock data; no backend changes required

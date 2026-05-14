# Implementation Plan: Servvo UI Redesign

## Overview

This plan implements a frontend-only visual and interaction redesign of the Servvo mobile app. The implementation proceeds bottom-up: dependencies → tokens → utilities → hooks → core UI components → home screen components → screen integration → onboarding polish. Each step builds on the previous, ensuring no orphaned code.

## Tasks

- [x] 1. Install dependencies and extend design tokens
  - [x] 1.1 Install new runtime dependencies (react-native-reanimated, expo-image, expo-linear-gradient)
    - Add `react-native-reanimated ~3.16.0`, `expo-image ~2.0.0`, `expo-linear-gradient ~14.0.0` to `apps/mobile/package.json` dependencies
    - Add the Reanimated Babel plugin to `babel.config.js`
    - Run install to update lockfile
    - _Requirements: 9.5_

  - [x] 1.2 Extend design tokens with gradients, enhanced shadows, typography variants, and animation constants
    - Add `gradients` (heroOverlay, buttonPrimary), enhanced `shadows` (sm, md, lg with elevation/offset/radius/opacity), new `typography` variants (display, subtitle, displayNumber, bodyEmphasis, button), and `animation` constants (press, buttonPress, skeleton, entrance, transition, success) to `apps/mobile/src/theme/tokens.ts`
    - Update `apps/mobile/src/theme/defaultTheme.ts` to include the new token categories in the theme object
    - _Requirements: 6.1, 6.2, 6.6, 7.1, 7.2, 7.3, 12.1, 12.2, 12.4, 12.5_

  - [ ]* 1.3 Write property test for typography vertical rhythm (Property 11)
    - **Property 11: Typography vertical rhythm**
    - Verify that all typography token variants have lineHeight values that are positive integers divisible by 4
    - Test file: `apps/mobile/src/theme/__tests__/tokens.property.test.ts`
    - **Validates: Requirements 12.5**

- [x] 2. Create utility functions
  - [x] 2.1 Implement colorUtils (withOpacity, darken, contrastRatio)
    - Create `apps/mobile/src/utils/colorUtils.ts`
    - `withOpacity(hexColor, opacity)` → converts hex to rgba string
    - `darken(hexColor, amount)` → darkens hex by percentage (0-1)
    - `contrastRatio(foreground, background)` → computes WCAG contrast ratio
    - Validate hex input; return original color unchanged if parsing fails
    - _Requirements: 1.4, 4.3, 6.3, 8.2, 8.4, 12.3, 13.4_

  - [ ]* 2.2 Write property test for text contrast compliance (Property 2)
    - **Property 2: Text contrast compliance**
    - For any valid theme color configuration, verify body-level text variants maintain minimum 4.5:1 contrast ratio
    - Test file: `apps/mobile/src/utils/__tests__/colorUtils.property.test.ts`
    - **Validates: Requirements 1.4, 12.3**

  - [ ]* 2.3 Write property test for color derivation from theme primary (Property 6)
    - **Property 6: Color derivation from theme primary**
    - For any valid hex color as primary, verify all derived colors are computed via withOpacity/darken with no hardcoded values
    - Test file: `apps/mobile/src/theme/__tests__/brandTheme.property.test.ts`
    - **Validates: Requirements 4.3, 6.3, 8.2, 8.4, 13.1, 13.4**

  - [x] 2.4 Implement greetingUtils (getTimeOfDayGreeting, buildGreeting)
    - Create `apps/mobile/src/utils/greetingUtils.ts`
    - `getTimeOfDayGreeting(hour)` → returns 'morning' (5-11), 'afternoon' (12-16), 'evening' (17-23, 0-4)
    - `buildGreeting(firstName, hour)` → returns personalized greeting string containing the name and time segment
    - _Requirements: 1.3_

  - [ ]* 2.5 Write property test for time-of-day greeting correctness (Property 1)
    - **Property 1: Time-of-day greeting correctness**
    - For any non-empty first name and hour 0-23, verify buildGreeting returns a string containing the name and correct time segment
    - Test file: `apps/mobile/src/utils/__tests__/greetingUtils.property.test.ts`
    - **Validates: Requirements 1.3**

  - [x] 2.6 Implement seasonalTips (getSeasonalTip)
    - Create `apps/mobile/src/utils/seasonalTips.ts`
    - `getSeasonalTip(month)` → maps month 1-12 to a relevant lawn care tip string
    - _Requirements: 3.3_

  - [ ]* 2.7 Write property test for seasonal tip coverage (Property 4)
    - **Property 4: Seasonal tip coverage**
    - For any month value 1-12, verify getSeasonalTip returns a non-empty string
    - Test file: `apps/mobile/src/utils/__tests__/seasonalTips.property.test.ts`
    - **Validates: Requirements 3.3**

- [x] 3. Create animation hooks
  - [x] 3.1 Implement usePressAnimation hook
    - Create `apps/mobile/src/hooks/usePressAnimation.ts`
    - Accept config: scalePressed (default 0.98), opacityPressed (default 0.7), duration (default 100ms), disabled flag, springConfig (damping: 0.6, stiffness: 300)
    - Return animatedStyle, onPressIn, onPressOut handlers
    - When disabled=true, return no-op handlers and static style (scale 1.0, opacity 1.0)
    - Use Reanimated SharedValue + withSpring for release, withTiming for press-in
    - _Requirements: 2.4, 4.4, 9.5, 15.1, 15.2, 15.3, 15.4_

  - [ ]* 3.2 Write property test for disabled state suppresses press animation (Property 13)
    - **Property 13: Disabled state suppresses press animation**
    - For any interactive component in disabled/loading state, verify press handler does not trigger scale/opacity changes
    - Test file: `apps/mobile/src/hooks/__tests__/usePressAnimation.property.test.ts`
    - **Validates: Requirements 15.4**

  - [x] 3.3 Implement useSkeletonAnimation hook
    - Create `apps/mobile/src/hooks/useSkeletonAnimation.ts`
    - Return animatedStyle that pulses opacity between 0.3 and 0.7 over 1.2s using Reanimated loop + withTiming
    - _Requirements: 9.2, 14.3_

  - [x] 3.4 Implement useEntranceAnimation hook
    - Create `apps/mobile/src/hooks/useEntranceAnimation.ts`
    - Accept config: initialScale (default 0.8), duration (default 300ms), delay (default 0)
    - Animate from initialScale/opacity 0 to scale 1.0/opacity 1.0 using withSpring on mount
    - _Requirements: 9.3_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [-] 5. Redesign core UI components
  - [x] 5.1 Redesign Button component with gradient and spring press animation
    - Update `apps/mobile/src/components/ui/Button.tsx`
    - Primary variant: minHeight 52, borderRadius 14, LinearGradient background (primary → 10% darker via darken util)
    - Font: size 17, weight 600, letterSpacing 0.3
    - Integrate usePressAnimation with scalePressed=0.96, durationIn=150ms, durationOut=200ms
    - Suppress animation when disabled or loading
    - Preserve existing variant/disabled/loading API
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 15.4_

  - [ ]* 5.2 Write unit tests for Button component
    - Verify minHeight, borderRadius, font properties for primary variant
    - Verify disabled state does not trigger animation
    - Test file: `apps/mobile/src/components/ui/__tests__/Button.test.tsx`
    - _Requirements: 6.1, 6.2, 6.6_

  - [x] 5.3 Redesign Card component with enhanced shadows and top highlight
    - Update `apps/mobile/src/components/ui/Card.tsx`
    - Remove border (borderWidth: 0)
    - Default variant: shadow offset 4px, blur 12px, opacity 0.08
    - Elevated variant: shadow offset 8px, blur 24px, opacity 0.12 + 1px top highlight (white at 50% opacity)
    - borderRadius: 16
    - Add optional `onPress` prop; when provided, wrap in Animated.View with usePressAnimation
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 5.4 Write unit tests for Card component
    - Verify shadow values for default and elevated variants
    - Verify no border is rendered
    - Verify top highlight on elevated variant
    - Test file: `apps/mobile/src/components/ui/__tests__/Card.test.tsx`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 5.5 Extend Typography component with new variants
    - Update `apps/mobile/src/components/ui/Typography.tsx`
    - Add variants: display (36/700/42), subtitle (14/600/18/letterSpacing 0.5), displayNumber (32/300/40), bodyEmphasis (16/600/24)
    - Preserve all existing variants
    - _Requirements: 12.1, 12.2, 12.4_

  - [x] 5.6 Create StatusPill component
    - Create `apps/mobile/src/components/ui/StatusPill.tsx`
    - Props: status ('confirmed' | 'scheduled' | 'en_route' | 'completed'), animated (boolean)
    - Color mapping: confirmed/completed → green, scheduled → blue, en_route → amber
    - When animated=true, use useEntranceAnimation (0.8→1.0 scale, 300ms)
    - _Requirements: 2.2, 9.3_

  - [ ]* 5.7 Write unit tests for StatusPill component
    - Verify correct color mapping for each status value
    - Test file: `apps/mobile/src/components/ui/__tests__/StatusPill.test.tsx`
    - _Requirements: 2.2_

  - [x] 5.8 Create EmptyState component
    - Create `apps/mobile/src/components/ui/EmptyState.tsx`
    - Props: screenType ('appointments' | 'messages' | 'payments' | 'activity' | 'properties'), onAction, actionLabel
    - Map each screenType to contextual icon, warm headline, supportive body message
    - Render CTA button only when onAction is provided
    - Headlines must not use generic phrases ("No data", "Nothing here", "Empty")
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 5.9 Write property test for empty state content mapping (Property 9)
    - **Property 9: Empty state content mapping**
    - For any valid screenType, verify EmptyState renders a non-empty headline without generic phrases and a non-null icon
    - Test file: `apps/mobile/src/components/ui/__tests__/EmptyState.property.test.tsx`
    - **Validates: Requirements 10.1, 10.2**

  - [x] 5.10 Create LoadingSkeleton component
    - Create `apps/mobile/src/components/ui/LoadingSkeleton.tsx`
    - Props: width, height, borderRadius (defaults to match target component tokens), style
    - Render rounded rectangle with useSkeletonAnimation for shimmer pulse
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ]* 5.11 Write property test for skeleton shape matching (Property 12)
    - **Property 12: Skeleton shape matching**
    - For any component type with a skeleton placeholder, verify skeleton borderRadius equals the component's token borderRadius
    - Test file: `apps/mobile/src/components/ui/__tests__/LoadingSkeleton.test.tsx`
    - **Validates: Requirements 14.2**

  - [x] 5.12 Create ImageWithFallback component
    - Create `apps/mobile/src/components/ui/ImageWithFallback.tsx`
    - Props: uri, fallbackIcon (default 'image'), style, borderRadius
    - Use Expo Image for optimized loading
    - On error: show branded placeholder (primary at 5% opacity bg + Feather icon)
    - _Requirements: 8.3, 8.4_

  - [x] 5.13 Create SuccessCheckmark component
    - Create `apps/mobile/src/components/ui/SuccessCheckmark.tsx`
    - Props: visible, onComplete callback
    - Animated checkmark with draw-on effect over 400ms using Reanimated
    - Trigger onComplete after animation finishes
    - _Requirements: 9.4_

- [x] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Create Home Screen components
  - [x] 7.1 Create HeroSection component
    - Create `apps/mobile/src/components/home/HeroSection.tsx`
    - Props: imageUri, firstName
    - Full-width Expo Image with minHeight 220
    - LinearGradient overlay (transparent → background color)
    - Personalized greeting using buildGreeting util
    - Position absolute for parallax-style layering (stationary during scroll)
    - Ensure greeting text has minimum 4.5:1 contrast ratio over gradient
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 8.1_

  - [ ]* 7.2 Write unit tests for HeroSection
    - Verify greeting text contains user's first name
    - Verify image renders with minHeight 220
    - Test file: `apps/mobile/src/components/home/__tests__/HeroSection.test.tsx`
    - _Requirements: 1.1, 1.3_

  - [x] 7.3 Create NextServiceCard component
    - Create `apps/mobile/src/components/home/NextServiceCard.tsx`
    - Props: appointment (Appointment | null), onPress
    - When appointment exists: show ProviderAvatar (40px min diameter, circular, primary-tinted border), StatusPill, structured layout with date/time/serviceType/providerName
    - Use usePressAnimation with scalePressed=0.97 for tactile feedback
    - When appointment is null: render EmptyState with booking CTA
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 8.2_

  - [ ]* 7.4 Write property test for appointment data completeness (Property 3)
    - **Property 3: Appointment data completeness**
    - For any valid appointment object, verify NextServiceCard render output contains all four data fields
    - Test file: `apps/mobile/src/components/home/__tests__/NextServiceCard.property.test.tsx`
    - **Validates: Requirements 2.3**

  - [x] 7.5 Create PropertySnapshot component
    - Create `apps/mobile/src/components/home/PropertySnapshot.tsx`
    - Props: healthStatus, lastServiceDate, currentMonth
    - Render 3 compact cards in horizontal row with icons: health indicator (colored), last service date, seasonal tip (from getSeasonalTip)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 7.6 Create QuickActions component
    - Create `apps/mobile/src/components/home/QuickActions.tsx`
    - Props: actions (QuickActionItem[])
    - Render max 4 items in horizontal row regardless of array length
    - Each item: 64x64 min touch target, filled icon container (primary at 10% opacity bg, primary icon), caption label below
    - Use usePressAnimation for press feedback on each item
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 7.7 Write property test for quick actions maximum constraint (Property 5)
    - **Property 5: Quick actions maximum constraint**
    - For any array of QuickActionItem objects (length 0 to N), verify at most 4 items are rendered
    - Test file: `apps/mobile/src/components/home/__tests__/QuickActions.property.test.tsx`
    - **Validates: Requirements 4.1**

  - [x] 7.8 Create ActivityTimeline component
    - Create `apps/mobile/src/components/home/ActivityTimeline.tsx`
    - Props: events (ServiceEvent[])
    - Show max 5 events in reverse chronological order (sort by timestamp descending)
    - Each event: status icon (checkmark for completed, clock for scheduled), title, relative timestamp
    - Vertical line connecting events
    - Empty state when no events: warm welcome message
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 7.9 Write property tests for ActivityTimeline (Properties 7, 8)
    - **Property 7: Timeline ordering and cap**
    - For any array of ServiceEvent objects, verify at most 5 rendered in strictly descending chronological order
    - **Property 8: Timeline event completeness**
    - For any valid ServiceEvent, verify rendered item contains title and relative timestamp
    - Test file: `apps/mobile/src/components/home/__tests__/ActivityTimeline.property.test.tsx`
    - **Validates: Requirements 5.1, 5.2**

  - [x] 7.10 Create HomeScreenSkeleton component
    - Create `apps/mobile/src/components/home/HomeScreenSkeleton.tsx`
    - Render LoadingSkeleton placeholders matching layout dimensions of HeroSection, NextServiceCard, PropertySnapshot, and QuickActions
    - Use same borderRadius values as target components
    - _Requirements: 14.1, 14.2_

- [ ] 8. Rebuild DashboardScreen with new components
  - [x] 8.1 Create mock data file for Home Screen
    - Create `apps/mobile/src/data/mockHomeData.ts`
    - Define mockAppointment, mockEvents (5 items), mockProperty, mockUser with realistic lawn care data
    - Use Unsplash URLs for images
    - _Requirements: 2.3, 5.1, 8.1_

  - [x] 8.2 Rebuild DashboardScreen with all new Home Screen components
    - Update `apps/mobile/src/screens/home/DashboardScreen.tsx`
    - Compose: HeroSection (absolute, stationary) → ScrollView with NextServiceCard, PropertySnapshot, QuickActions, ActivityTimeline
    - Implement loading state: show HomeScreenSkeleton while isLoading=true
    - Crossfade transition: fade in real content over 200ms while fading out skeleton
    - Wire mock data to all components
    - Wire QuickActions to navigation
    - _Requirements: 1.1, 1.5, 2.3, 3.4, 4.1, 5.1, 14.1, 14.4_

  - [x] 8.3 Update ui/index.ts barrel export with all new components
    - Add exports for StatusPill, EmptyState, LoadingSkeleton, ImageWithFallback, SuccessCheckmark
    - _Requirements: N/A (code organization)_

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Onboarding polish and empty states
  - [ ] 10.1 Add step progress indicator to onboarding flow
    - Update onboarding screens in `apps/mobile/src/screens/onboarding/`
    - Add dot/segmented bar progress indicator showing current step and total steps
    - Animate transitions between steps with horizontal slide + fade over 300ms
    - _Requirements: 11.1, 11.4_

  - [ ]* 10.2 Write property test for onboarding progress indicator accuracy (Property 10)
    - **Property 10: Onboarding progress indicator accuracy**
    - For any (currentStep, totalSteps) pair where 1 ≤ currentStep ≤ totalSteps, verify exactly totalSteps indicators rendered with currentStep marked active
    - Test file: `apps/mobile/src/screens/onboarding/__tests__/ProgressIndicator.property.test.tsx`
    - **Validates: Requirements 11.1**

  - [ ] 10.3 Add celebration animation to onboarding completion
    - Add SuccessCheckmark + confetti-style particle animation on final step completion
    - Animation lasts 1.5 seconds with scaled-up checkmark
    - _Requirements: 11.3_

  - [ ] 10.4 Update empty states across all screens
    - Replace generic empty states in appointments, messages, payments, and profile screens with the new EmptyState component
    - Use appropriate screenType for each screen
    - Add contextual CTA buttons where actionable next steps exist
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 11. White-label integration and final wiring
  - [ ] 11.1 Ensure all new components derive colors from theme primary
    - Verify Button gradient, StatusPill colors, QuickActions icon containers, Avatar borders, and ImageWithFallback placeholders all use withOpacity/darken from the theme's primary color
    - No hardcoded color values in any new component
    - Update BrandThemeProvider if needed to expose gradient tokens derived from primary
    - _Requirements: 13.1, 13.4, 13.5_

  - [ ] 11.2 Apply pressed states consistently to all interactive elements
    - Audit all Pressable components (cards, list items, quick actions, navigation elements)
    - Ensure all use usePressAnimation hook with consistent config (scale 0.98, opacity 0.7, spring release)
    - Verify disabled/loading elements do not animate
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [x] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All code is TypeScript (React Native / Expo)
- No backend changes — all data is mock data
- The existing BrandThemeProvider + Zustand pattern is preserved and extended

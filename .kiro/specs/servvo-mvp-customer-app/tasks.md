# Implementation Plan: Servvo MVP Customer App

## Overview

This plan implements the Servvo MVP Customer App — a white-label mobile experience for homeowners to manage lawn care services. The implementation is split into backend (NestJS + PostgreSQL) and frontend (React Native Expo + TypeScript), with incremental integration at each stage. Tasks are ordered so each builds on the previous, with no orphaned code.

## Tasks

- [x] 1. Project scaffolding and shared infrastructure
  - [x] 1.1 Initialize Expo (TypeScript) project and NestJS backend monorepo structure
    - Create Expo app with TypeScript template under `apps/mobile`
    - Create NestJS app under `apps/backend`
    - Configure shared tsconfig paths and workspace scripts
    - _Requirements: 14.5_

  - [x] 1.2 Set up database configuration, TypeORM, and initial migration
    - Configure TypeORM with PostgreSQL connection (env-based)
    - Create initial migration with all tables from the design schema: businesses, brand_configs, users, properties, appointments, service_status_events, messages, invoices, payments, payment_methods, reviews, service_photos, device_tokens, notification_preferences
    - Define all entity classes with relations
    - _Requirements: 2.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1_

  - [x] 1.3 Set up Redis connection and Bull queue module
    - Configure Redis client for caching and pub/sub
    - Set up Bull queue for notification jobs
    - _Requirements: 6.2, 12.2_

  - [x] 1.4 Set up testing infrastructure
    - Configure Jest for backend unit and integration tests
    - Configure Jest + React Native Testing Library for mobile
    - Install and configure fast-check for property-based tests
    - Create test directory structure: tests/properties, tests/unit, tests/integration
    - _Requirements: All_

- [x] 2. Design system and branding layer
  - [x] 2.1 Implement design tokens and default theme
    - Create `theme/tokens.ts` with colors, spacing, borderRadius, shadows, typography from design
    - Create `theme/defaultTheme.ts` with fallback values
    - _Requirements: 14.1, 14.2_

  - [x] 2.2 Implement BrandThemeProvider and brand config store
    - Create Zustand `brandStore.ts` to hold BrandConfig
    - Create `BrandThemeProvider.tsx` that merges brand colors/terminology into theme context
    - Implement `useBrandConfig` hook
    - _Requirements: 3.1, 3.3, 3.5_

  - [x] 2.3 Implement UI primitives (Card, Button, Input, Badge, Avatar, Typography)
    - Build each component using theme tokens
    - Ensure large cards, soft shadows, rounded corners, generous whitespace per design spec
    - _Requirements: 14.1, 14.2_

  - [x] 2.4 Implement terminology resolver utility
    - Create `utils/terminology.ts` that resolves Service_Professional references from brand config
    - _Requirements: 3.4_

  - [ ]* 2.5 Write property test for brand config application (Property 4)
    - **Property 4: Brand Config Application**
    - For any valid brand config, resolved theme tokens reflect configured colors and terminology
    - **Validates: Requirements 3.3, 3.4**

- [x] 3. Authentication module (backend + frontend)
  - [x] 3.1 Implement backend auth module with Firebase token verification
    - Create auth module with `POST /auth/verify-token`, `POST /auth/logout`, `GET /auth/session`
    - Implement Firebase Admin SDK token verification
    - Create JWT session token issuance (30-day expiry)
    - Implement AuthGuard for protected routes
    - _Requirements: 1.2, 13.1, 13.4_

  - [x] 3.2 Implement frontend auth flow screens (Welcome, PhoneInput, OTP)
    - Create `WelcomeScreen.tsx` with branded splash
    - Create `PhoneInputScreen.tsx` with phone number validation and Firebase phone auth trigger
    - Create `OTPScreen.tsx` with code input, 5-minute timer, resend logic
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 3.3 Implement auth store, auth service, and API client with interceptor
    - Create Zustand `authStore.ts` for token/session state
    - Create `services/auth.service.ts` for Firebase + backend auth calls
    - Create `services/api.ts` Axios instance with auth token interceptor and 401 redirect
    - Implement secure token storage (expo-secure-store)
    - _Requirements: 13.1, 13.3, 13.4_

  - [x] 3.4 Implement AuthStack navigation
    - Create `navigation/AuthStack.tsx` routing Welcome → PhoneInput → OTP
    - Handle auth state to skip auth if session valid
    - _Requirements: 1.2, 13.1_

  - [ ]* 3.5 Write property tests for auth (Properties 1, 2, 17)
    - **Property 1: OTP Time-Based Validity**
    - **Property 2: OTP Invalidation on Re-Request**
    - **Property 17: Session Time Validity**
    - **Validates: Requirements 1.2, 1.4, 1.5, 13.1**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Onboarding flow
  - [x] 5.1 Implement backend users module with onboarding endpoints
    - Create users module with `GET /users/me`, `PUT /users/me`, `POST /users/me/onboarding`, `GET /users/me/onboarding-status`
    - Implement validation: name and address required, reject empty/whitespace
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 5.2 Implement backend properties module
    - Create properties module with `GET /properties`, `POST /properties`, `PUT /properties/:id`
    - _Requirements: 2.3, 9.1_

  - [x] 5.3 Implement frontend onboarding screens
    - Create `ProfileSetupScreen.tsx` (name, email fields)
    - Create `PropertySetupScreen.tsx` (address, property details)
    - Create `ConfirmationScreen.tsx` with success state
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

  - [x] 5.4 Implement OnboardingStack navigation
    - Create `navigation/OnboardingStack.tsx` routing Profile → Property → Confirmation → Dashboard
    - Gate main app behind onboarding completion check
    - _Requirements: 2.1, 2.5_

  - [ ]* 5.5 Write property test for onboarding validation (Property 3)
    - **Property 3: Onboarding Required Field Validation**
    - For any submission with empty/null/whitespace name or address, system rejects with validation error
    - **Validates: Requirements 2.4**

- [x] 6. Business branding backend
  - [x] 6.1 Implement backend businesses module
    - Create businesses module with `GET /businesses/:id/brand-config`
    - Implement brand config caching in Redis
    - Return default branding as fallback when config unavailable
    - _Requirements: 3.1, 3.2, 3.5_

  - [x] 6.2 Implement backend media module
    - Create media module with `GET /media/:key` for signed S3 URL generation
    - _Requirements: 3.2, 9.3_

- [x] 7. Home dashboard
  - [x] 7.1 Implement MainTabNavigator
    - Create `navigation/MainTabNavigator.tsx` with Home, Appointments, Messages, Billing, Profile tabs
    - Apply branded tab bar styling
    - _Requirements: 4.1, 14.1_

  - [x] 7.2 Implement DashboardScreen
    - Build next upcoming service card (service type, date, arrival window, provider name)
    - Display current service status with StatusProgressBar component
    - Build quick action buttons (message, pay invoice, book again, view history)
    - Build recent activity feed (last 5 events, reverse chronological)
    - Show "Book a service" prompt when no upcoming appointments
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 7.3 Write property tests for dashboard (Properties 5, 6)
    - **Property 5: Dashboard Next Appointment Selection**
    - **Property 6: Activity Feed Recency**
    - **Validates: Requirements 4.1, 4.4**

- [x] 8. Appointment management
  - [x] 8.1 Implement backend appointments module
    - Create appointments module with `GET /appointments` (pagination, upcoming/past filter), `GET /appointments/:id`, `POST /appointments/:id/reschedule`, `POST /appointments/:id/cancel`, `GET /appointments/next`
    - Implement time-based partitioning logic (upcoming vs past based on scheduled_date)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 8.2 Implement frontend appointment screens
    - Create `AppointmentsScreen.tsx` with Upcoming/Past tabs
    - Create `AppointmentCard.tsx` component
    - Create `AppointmentDetailScreen.tsx` with full details and status
    - Create `RescheduleScreen.tsx` with date/time picker
    - Implement cancel confirmation flow
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 8.3 Implement appointment Zustand store and service layer
    - Create `stores/appointmentStore.ts`
    - Create `services/appointments.service.ts`
    - Create `hooks/useAppointments.ts`
    - _Requirements: 5.1, 5.2_

  - [ ]* 8.4 Write property test for appointment partitioning (Property 7)
    - **Property 7: Appointment Time-Based Partitioning**
    - For any set of appointments, upcoming/past split is correct and exhaustive
    - **Validates: Requirements 5.1**

- [ ] 9. Service status tracking (real-time)
  - [ ] 9.1 Implement backend service-status module with WebSocket gateway
    - Create service-status module with `GET /appointments/:id/status`
    - Implement NestJS WebSocket gateway with Socket.IO
    - Handle `subscribe:appointment` / `unsubscribe:appointment` client events
    - Emit `status:update` server events via Redis pub/sub
    - Implement Twilio webhook endpoint for SMS-based status updates from providers
    - _Requirements: 6.1, 6.2, 6.4_

  - [ ] 9.2 Implement frontend WebSocket service and status components
    - Create `services/websocket.service.ts` with auto-reconnect (exponential backoff)
    - Create `hooks/useWebSocket.ts`
    - Create `StatusProgressBar.tsx` showing stage progression
    - Create `StatusBadge.tsx` for compact status display
    - Update AppointmentDetailScreen to show real-time status
    - Display arrival window when status is "On The Way"
    - _Requirements: 6.1, 6.2, 6.4, 6.5_

  - [ ]* 9.3 Write property test for status progress (Property 8)
    - **Property 8: Status Progress Representation**
    - For any valid ServiceStatus, progress bar marks preceding stages completed and current as active
    - **Validates: Requirements 6.1**

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Two-way messaging
  - [ ] 11.1 Implement backend messages module
    - Create messages module with `GET /messages` (pagination), `POST /messages`
    - Implement WebSocket `message:new` event emission
    - Implement automated message generation on status change events
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 11.2 Implement frontend messaging screen and components
    - Create `MessagesScreen.tsx` with conversation thread
    - Create `MessageBubble.tsx` (customer vs business vs system styling)
    - Create `MessageInput.tsx` with send button
    - Create `stores/messageStore.ts`
    - Create `services/messages.service.ts`
    - Subscribe to `message:new` WebSocket events for real-time delivery
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 11.3 Write property tests for messaging (Properties 9, 10)
    - **Property 9: Message Rendering Completeness**
    - **Property 10: Automated Message Generation from Status Changes**
    - **Validates: Requirements 7.2, 7.4**

- [ ] 12. Billing and payments
  - [ ] 12.1 Implement backend invoices and payments modules
    - Create invoices module with `GET /invoices` (status filter, pagination), `GET /invoices/:id`
    - Create payments module with `POST /payments/intent`, `POST /payments/confirm`, `GET /payments/methods`, `POST /payments/methods`, `DELETE /payments/methods/:id`, `GET /payments/history`
    - Integrate Stripe SDK for PaymentIntent creation and confirmation
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ] 12.2 Implement frontend billing screens and components
    - Create `BillingScreen.tsx` with invoice list and payment history tabs
    - Create `InvoiceCard.tsx` component
    - Create `InvoiceDetailScreen.tsx` with payment action
    - Create `PaymentScreen.tsx` with Stripe React Native SDK integration
    - Create `PaymentMethodCard.tsx` for saved methods display
    - Implement save/remove payment method flows
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 12.3 Write property test for billing rendering (Property 11)
    - **Property 11: List Rendering Completeness**
    - For any invoice/payment, rendered list item contains all required fields
    - **Validates: Requirements 8.1, 8.6**

- [ ] 13. Service history and property timeline
  - [ ] 13.1 Implement service history frontend
    - Create `ServiceTimeline.tsx` component for property timeline view
    - Add service history tab/section to profile or dedicated screen
    - Display chronological list of past services with details, photos, provider notes
    - Implement service type filter
    - Integrate with appointments and media endpoints
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 13.2 Write property tests for service history (Properties 12, 13)
    - **Property 12: Service History Chronological Ordering**
    - **Property 13: Service Type Filtering**
    - **Validates: Requirements 9.1, 9.5**

- [ ] 14. Reviews and ratings
  - [ ] 14.1 Implement backend reviews module
    - Create reviews module with `POST /reviews`, `GET /reviews`, `GET /appointments/:id/review`
    - Validate rating 1-5, reject out-of-range
    - _Requirements: 10.2, 10.3, 10.5_

  - [ ] 14.2 Implement frontend review flow
    - Create `ReviewFlowScreen.tsx` with star rating (1-5) and optional comment
    - Show thank-you confirmation on submit
    - Allow access to review from service history
    - Display submitted reviews in service history
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 14.3 Write property test for review validation (Property 14)
    - **Property 14: Review Validation**
    - For any rating 1-5, system accepts. For any rating outside 1-5, system rejects.
    - **Validates: Requirements 10.3**

- [ ] 15. Rebooking and service requests
  - [ ] 15.1 Implement backend bookings module
    - Create bookings module with `GET /bookings/available-dates`, `GET /bookings/available-windows`, `POST /bookings`, `GET /bookings/recommendations`
    - _Requirements: 11.2, 11.3, 11.4, 11.5_

  - [ ] 15.2 Implement frontend rebooking screen
    - Create `RebookingScreen.tsx` with calendar date picker, time window selection
    - Pre-populate service type from past service when rebooking
    - Show booking confirmation on submit
    - Display seasonal recommendations when available
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 15.3 Write property test for rebooking pre-population (Property 15)
    - **Property 15: Rebooking Pre-Population**
    - For any past service selected for rebooking, form pre-populates with that service_type
    - **Validates: Requirements 11.1**

- [ ] 16. Push notifications
  - [ ] 16.1 Implement backend notifications module
    - Create notifications module with `POST /notifications/register-device`, `GET /notifications/preferences`, `PUT /notifications/preferences`
    - Implement Bull queue consumers for FCM push delivery
    - Trigger notifications on: status changes, new messages, invoice reminders, review requests, appointment confirmations
    - _Requirements: 12.1, 12.2, 12.4_

  - [ ] 16.2 Implement frontend notification handling
    - Create `hooks/useNotifications.ts` for permission request and device token registration
    - Implement deep-link routing from notification tap to relevant screen
    - Create `NotificationPrefsScreen.tsx` for category enable/disable toggles
    - Handle denied permission gracefully with in-app fallback
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ]* 16.3 Write property test for notification deep-link routing (Property 16)
    - **Property 16: Notification Deep-Link Routing**
    - For any notification type, tapping navigates to the correct corresponding screen
    - **Validates: Requirements 12.3**

- [ ] 17. Profile and settings
  - [ ] 17.1 Implement ProfileScreen and logout
    - Create `ProfileScreen.tsx` with profile info display, edit capability
    - Implement logout flow (clear session, navigate to welcome)
    - Link to NotificationPrefsScreen
    - _Requirements: 13.3, 12.4_

- [ ] 18. Premium visual polish and error handling
  - [ ] 18.1 Implement global error boundary and error handling patterns
    - Create React error boundary with friendly fallback UI and "Try Again" button
    - Implement offline banner and network error handling
    - Implement toast notifications for API errors
    - _Requirements: 14.4_

  - [ ] 18.2 Implement screen transitions and animations
    - Add smooth navigation transitions between screens
    - Add loading states and skeleton screens
    - Ensure premium feel with consistent spacing, shadows, and typography
    - _Requirements: 14.1, 14.4_

  - [ ] 18.3 Implement BrandedHeader and BrandedLogo components
    - Create `BrandedHeader.tsx` displaying business logo
    - Create `BrandedLogo.tsx` for onboarding and splash
    - _Requirements: 3.2, 14.1_

- [ ] 19. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The tech stack is TypeScript throughout: React Native (Expo) for mobile, NestJS for backend
- All 17 correctness properties are covered across property test sub-tasks

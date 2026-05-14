# Requirements Document

## Introduction

This document defines the requirements for a frontend-only UI/UX redesign of the Servvo mobile app. The app is functionally complete but needs to feel premium, warm, and evocative of a luxury hospitality experience — the goal being that users react with "Wait… this is for a local lawn care company?" No backend changes, no new API calls, no database modifications. All data is mock data. The redesign targets emotional resonance, visual depth, and premium interaction quality across the existing React Native (Expo + TypeScript) codebase.

## Glossary

- **Home_Screen**: The primary dashboard screen displayed after authentication, showing personalized greetings, next service info, property snapshot, quick actions, and activity timeline
- **Hero_Section**: The top area of the Home_Screen featuring a full-width lawn image with gradient overlay and personalized emotional greeting
- **Next_Service_Card**: A card component on the Home_Screen displaying upcoming appointment details with provider avatar and status indicator
- **Property_Snapshot**: A section on the Home_Screen showing lawn health status, last service date, and seasonal tips
- **Quick_Actions**: A set of large, premium-styled action buttons on the Home_Screen for common tasks
- **Activity_Timeline**: A chronological list of recent service events with visual status indicators
- **Button_Component**: The reusable Button UI component used throughout the app
- **Card_Component**: The reusable Card UI component used for content containers throughout the app
- **Typography_System**: The set of text styles, weights, and hierarchy rules applied across the app
- **Design_Token_System**: The centralized theme configuration including colors, spacing, shadows, border radii, and typography scales
- **Micro_Interaction**: Animated feedback including transitions, loading skeletons, status animations, and success states
- **Empty_State**: The UI displayed when a screen or section has no data to show
- **Onboarding_Flow**: The multi-step setup flow for new users including profile and property setup
- **White_Label_System**: The dynamic theming infrastructure that allows brand-specific colors, terminology, and imagery
- **Loading_Skeleton**: A placeholder animation shown while content is loading, using shapes that mirror the final layout
- **Status_Pill**: A small rounded badge indicating the current state of a service (e.g., "Confirmed", "En Route", "Completed")
- **Provider_Avatar**: A circular image showing the service provider's photo
- **Gradient_Overlay**: A semi-transparent color layer applied over images to ensure text readability

## Requirements

### Requirement 1: Home Screen Hero Section

**User Story:** As a homeowner, I want to see a beautiful, personalized hero section when I open the app, so that I feel proud of my property and emotionally connected to the service.

#### Acceptance Criteria

1. WHEN the Home_Screen loads, THE Hero_Section SHALL display a full-width lawn photograph with a minimum height of 220 logical pixels
2. WHEN the Home_Screen loads, THE Hero_Section SHALL render a Gradient_Overlay from transparent at the top to the background color at the bottom over the lawn photograph
3. WHEN the Home_Screen loads, THE Hero_Section SHALL display a personalized greeting that includes the homeowner's first name and a time-of-day-appropriate message (morning, afternoon, evening)
4. THE Hero_Section SHALL position the greeting text over the Gradient_Overlay with sufficient contrast for readability (minimum 4.5:1 contrast ratio)
5. WHEN the user scrolls down, THE Hero_Section SHALL remain stationary while content scrolls over it (parallax-style layering)

### Requirement 2: Next Service Card Redesign

**User Story:** As a homeowner, I want to see rich details about my upcoming service at a glance, so that I feel confident about who is coming and when.

#### Acceptance Criteria

1. WHEN an upcoming appointment exists, THE Next_Service_Card SHALL display the Provider_Avatar as a circular image with a minimum diameter of 40 logical pixels
2. WHEN an upcoming appointment exists, THE Next_Service_Card SHALL display a Status_Pill indicating the current appointment state using color-coded backgrounds (confirmed: green, scheduled: blue, en route: amber)
3. WHEN an upcoming appointment exists, THE Next_Service_Card SHALL display the service date, time, service type, and provider name in a structured layout with clear visual hierarchy
4. WHEN the user presses the Next_Service_Card, THE Next_Service_Card SHALL provide tactile feedback through a scale-down animation of 0.97 scale factor
5. IF no upcoming appointment exists, THEN THE Next_Service_Card SHALL display a warm empty state message encouraging the homeowner to book a service

### Requirement 3: Property Snapshot Section

**User Story:** As a homeowner, I want to see a quick overview of my property's health and care history, so that I feel informed and reassured about my lawn's condition.

#### Acceptance Criteria

1. WHEN the Home_Screen loads, THE Property_Snapshot SHALL display a lawn health indicator using a labeled status (e.g., "Thriving", "Good", "Needs Attention") with a corresponding color
2. WHEN the Home_Screen loads, THE Property_Snapshot SHALL display the date of the last completed service
3. WHEN the Home_Screen loads, THE Property_Snapshot SHALL display one seasonal tip relevant to the current month
4. THE Property_Snapshot SHALL present the three data points (health, last service, seasonal tip) in a horizontal row of compact cards with icons

### Requirement 4: Quick Actions Redesign

**User Story:** As a homeowner, I want quick access to common tasks through large, visually appealing action buttons, so that I can navigate efficiently while the app feels premium.

#### Acceptance Criteria

1. THE Quick_Actions SHALL display a maximum of 4 action items in a single horizontal row
2. THE Quick_Actions SHALL render each action item with a minimum touch target of 64x64 logical pixels
3. THE Quick_Actions SHALL use filled icon containers with the primary color at 10% opacity as background and the primary color for the icon
4. WHEN the user presses a Quick_Action item, THE Quick_Actions SHALL animate the item with a scale-down press effect and opacity change within 100 milliseconds
5. THE Quick_Actions SHALL display a label below each icon using the caption typography variant with medium font weight

### Requirement 5: Activity Timeline

**User Story:** As a homeowner, I want to see a timeline of recent service activity, so that I feel informed about what has been done on my property.

#### Acceptance Criteria

1. WHEN the Home_Screen loads, THE Activity_Timeline SHALL display the 5 most recent service events in reverse chronological order
2. THE Activity_Timeline SHALL display each event with a status icon (checkmark for completed, clock for scheduled), event title, and relative timestamp
3. THE Activity_Timeline SHALL connect events visually with a vertical line between status icons
4. IF no service events exist, THEN THE Activity_Timeline SHALL display a warm welcome message indicating that activity will appear after the first service

### Requirement 6: Button Component Redesign

**User Story:** As a homeowner, I want buttons that feel substantial and premium when I interact with them, so that the app feels high-quality and trustworthy.

#### Acceptance Criteria

1. THE Button_Component SHALL render with a minimum height of 52 logical pixels for the primary variant
2. THE Button_Component SHALL use a border radius of 14 logical pixels for softer corners
3. THE Button_Component SHALL apply a subtle vertical gradient on the primary variant (primary color to a 10% darker shade)
4. WHEN the user presses the Button_Component, THE Button_Component SHALL animate to 0.96 scale with a 150-millisecond spring animation
5. WHEN the user releases the Button_Component, THE Button_Component SHALL animate back to 1.0 scale with a 200-millisecond spring animation
6. THE Button_Component SHALL use font size 17 with semi-bold weight (600) and letter spacing of 0.3 for the label text

### Requirement 7: Card Component Redesign

**User Story:** As a homeowner, I want content cards that feel layered and premium with visible depth, so that the interface feels modern and polished.

#### Acceptance Criteria

1. THE Card_Component SHALL apply a shadow with vertical offset of 4 pixels, blur radius of 12 pixels, and opacity of 0.08 for the default variant
2. THE Card_Component SHALL apply a shadow with vertical offset of 8 pixels, blur radius of 24 pixels, and opacity of 0.12 for the elevated variant
3. THE Card_Component SHALL use a border radius of 16 logical pixels
4. THE Card_Component SHALL remove the visible border and rely solely on shadow and background color for visual separation
5. WHEN the Card_Component variant is elevated, THE Card_Component SHALL render with a 1-pixel top highlight (white at 50% opacity) to simulate light reflection

### Requirement 8: Imagery Strategy

**User Story:** As a homeowner, I want to see beautiful lawn and outdoor imagery throughout the app, so that I feel proud of my property and connected to the outdoor lifestyle.

#### Acceptance Criteria

1. THE Home_Screen SHALL display at least one high-quality lawn photograph with warm outdoor lighting characteristics
2. WHEN a service provider is referenced, THE app SHALL display a Provider_Avatar with a circular frame and a subtle border in the primary color at 20% opacity
3. THE app SHALL use placeholder images with warm, natural outdoor lighting tones (golden hour aesthetic) for all image placeholders
4. IF an image fails to load, THEN THE app SHALL display a branded placeholder with the primary color at 5% opacity and a landscape icon

### Requirement 9: Micro-Interactions and Animations

**User Story:** As a homeowner, I want smooth, elegant animations throughout the app, so that interactions feel responsive and the experience feels polished.

#### Acceptance Criteria

1. WHEN navigating between screens, THE app SHALL apply a shared-element-style transition with a duration between 250 and 350 milliseconds
2. WHEN content is loading, THE app SHALL display Loading_Skeleton placeholders that pulse with an opacity animation cycling between 0.3 and 0.7 over 1.2 seconds
3. WHEN a service status changes, THE app SHALL animate the Status_Pill with a scale-up entrance animation (0.8 to 1.0 scale) over 300 milliseconds
4. WHEN an action completes successfully, THE app SHALL display an animated checkmark with a draw-on effect over 400 milliseconds
5. THE app SHALL use React Native Reanimated for all animations to ensure 60fps performance on the native thread

### Requirement 10: Empty States

**User Story:** As a homeowner, I want empty screens to feel warm and encouraging rather than cold and generic, so that I feel welcomed even when there is no data.

#### Acceptance Criteria

1. WHEN a screen has no data to display, THE Empty_State SHALL show a contextual illustration or icon relevant to the screen's purpose
2. WHEN a screen has no data to display, THE Empty_State SHALL display a warm, relationship-focused headline (e.g., "Your service story starts here" instead of "No appointments")
3. WHEN a screen has no data to display, THE Empty_State SHALL display a supportive body message that sets expectations for what will appear
4. WHEN a screen has no data to display, THE Empty_State SHALL include a primary call-to-action button when an actionable next step exists

### Requirement 11: Onboarding Polish

**User Story:** As a new homeowner, I want the onboarding flow to feel guided, visually rich, and emotionally rewarding, so that I feel confident I made the right choice.

#### Acceptance Criteria

1. WHILE the user is in the Onboarding_Flow, THE Onboarding_Flow SHALL display a step progress indicator showing current step and total steps using dots or a segmented bar
2. WHILE the user is in the Onboarding_Flow, THE Onboarding_Flow SHALL display a contextual illustration or photograph relevant to the current step
3. WHEN the user completes the final onboarding step, THE Onboarding_Flow SHALL display an animated celebration moment with a scaled-up checkmark and confetti-style particle animation lasting 1.5 seconds
4. WHEN the user transitions between onboarding steps, THE Onboarding_Flow SHALL animate the transition with a horizontal slide and fade effect over 300 milliseconds

### Requirement 12: Typography Hierarchy Enhancement

**User Story:** As a homeowner, I want text throughout the app to have clear visual hierarchy and premium weight variation, so that information is easy to scan and the app feels editorially designed.

#### Acceptance Criteria

1. THE Typography_System SHALL define a display variant with font size 36, font weight 700, and line height 42 for hero-level headings
2. THE Typography_System SHALL define a subtitle variant with font size 14, font weight 600, line height 18, and letter spacing 0.5 for section labels
3. THE Typography_System SHALL maintain a minimum contrast ratio of 4.5:1 between text color and background color for all body text variants
4. THE Typography_System SHALL use font weight 300 (light) for large display numbers and font weight 600 (semi-bold) for emphasis within body text
5. THE Typography_System SHALL apply consistent vertical rhythm with line heights that are multiples of 4 logical pixels

### Requirement 13: White-Label Branding Support

**User Story:** As a business owner using Servvo's platform, I want the app to adapt its visual identity to my brand, so that my customers see my brand rather than a generic app.

#### Acceptance Criteria

1. THE White_Label_System SHALL support dynamic override of primary color, accent color, and background color through the existing BrandConfig interface
2. THE White_Label_System SHALL support configurable terminology for service provider labels (e.g., "Provider", "Crew", "Team", "Technician") applied consistently across all screens
3. THE White_Label_System SHALL support a configurable business logo displayed in the onboarding flow and profile screen
4. THE White_Label_System SHALL derive all component colors (button backgrounds, status indicators, icon tints) from the configured primary and accent colors without hardcoded color values
5. WHEN a brand configuration is applied, THE White_Label_System SHALL update all themed components within the same render cycle without visible flicker

### Requirement 14: Loading and Transition States

**User Story:** As a homeowner, I want the app to feel responsive and polished even while loading, so that I never feel like the app is broken or slow.

#### Acceptance Criteria

1. WHEN the Home_Screen is loading, THE Home_Screen SHALL display Loading_Skeleton placeholders that match the layout dimensions of the Hero_Section, Next_Service_Card, Property_Snapshot, and Quick_Actions
2. THE Loading_Skeleton SHALL use rounded rectangles with the same border radius as the target components
3. THE Loading_Skeleton SHALL animate with a shimmer effect moving left-to-right at a consistent speed across all skeleton elements
4. WHEN content finishes loading, THE app SHALL fade in the real content over 200 milliseconds while fading out the skeleton

### Requirement 15: Pressed and Interactive States

**User Story:** As a homeowner, I want every interactive element to respond visually when I touch it, so that the app feels alive and responsive to my input.

#### Acceptance Criteria

1. WHEN the user presses any interactive card or list item, THE app SHALL reduce the element's opacity to 0.7 and scale to 0.98 within 100 milliseconds
2. WHEN the user releases an interactive element, THE app SHALL restore full opacity and scale with a spring animation (damping: 0.6, stiffness: 300)
3. THE app SHALL apply pressed states consistently to all Pressable components including cards, list items, quick actions, and navigation elements
4. THE app SHALL not apply pressed state animations to elements that are in a disabled or loading state

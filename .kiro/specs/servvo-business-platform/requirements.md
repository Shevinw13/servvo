# Requirements Document

## Introduction

The Servvo Business Platform is a web application where home service business owners (lawn care, HVAC, pest control, and more) onboard their company, connect their CRM, configure white-label branding, manage the homeowner experience, send push notifications, and view intelligence dashboards. The platform lives at `apps/web/` in the existing Servvo monorepo and uses Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion. Backend integration, AWS infrastructure, and CRM sync logic are handled separately — this spec covers the frontend UI only. The platform supports any home service vertical, not just lawn care.

## Glossary

- **Platform**: The Servvo Business Platform web application at `apps/web/`
- **Business_Owner**: The primary user — an owner/operator of a home service company (lawn care, HVAC, pest control, or any recurring service vertical)
- **Onboarding_Flow**: The multi-step guided wizard that collects business information, CRM connection, and branding preferences
- **Branding_Studio**: The section where the Business_Owner configures white-label branding (logo, colors, typography, imagery, terminology)
- **Mobile_Preview**: A phone mockup component that renders a simulated customer app reflecting current branding in real-time
- **CRM_Integration**: Real OAuth 2.0 connection to external CRM systems (Jobber first), enabling bidirectional data sync
- **Jobber_API**: Jobber's GraphQL API accessed via OAuth 2.0, supporting Clients, Properties, Jobs, Visits, Invoices, Quotes, and Custom Fields with webhook subscriptions for real-time events
- **Customer_Experience_Settings**: The section where the Business_Owner configures messaging tone, notifications, and service communication
- **Intelligence_Dashboard**: The section displaying real-time computed KPIs (Active Homeowners, Rebooking Rate, Revenue, At-Risk Customers) and actionable intelligence cards
- **Customer_List**: Real homeowner data synced from CRM, with engagement metrics and action capabilities
- **Provider_Terminology**: The configurable term used to refer to service professionals (Provider, Crew, Team, or Service Professional)
- **Brand_Config**: The per-Business customization of logo, colors, terminology, imagery, and communication tone, persisted to database and served to mobile app
- **Sidebar_Navigation**: The persistent left sidebar containing all primary navigation items
- **Webhook**: Real-time event notification from Jobber to Servvo when data changes (new client, job status change, invoice paid)
- **Bidirectional_Sync**: Data flows both ways — CRM changes propagate to Servvo, and homeowner app actions propagate back to CRM

## Requirements

### Requirement 1: Application Shell and Navigation

**User Story:** As a Business_Owner, I want a clean, premium navigation layout, so that I can easily access all platform sections without confusion.

#### Acceptance Criteria

1. THE Platform SHALL render a persistent Sidebar_Navigation containing the following items in order: Dashboard, Branding Studio, Customer Experience, CRM Integrations, Notifications, Customers, Analytics, Settings
2. THE Platform SHALL render a top navigation bar displaying the business name and a user avatar placeholder
3. WHEN the Business_Owner clicks a Sidebar_Navigation item, THE Platform SHALL navigate to the corresponding section and visually indicate the active item
4. THE Platform SHALL render the central content area to the right of the Sidebar_Navigation with adequate spacing and maximum width constraints
5. THE Sidebar_Navigation SHALL collapse to an icon-only mode on viewport widths below 1024px
6. WHEN the Business_Owner hovers over a collapsed Sidebar_Navigation item, THE Platform SHALL display a tooltip with the item label

### Requirement 2: Business Onboarding Flow

**User Story:** As a Business_Owner, I want a guided onboarding experience that collects my business details and branding preferences step by step, so that I can set up my branded customer app without technical knowledge.

#### Acceptance Criteria

1. WHEN the Business_Owner first visits the Platform, THE Onboarding_Flow SHALL display a welcome screen with a headline, value proposition, and a primary call-to-action button
2. THE Onboarding_Flow SHALL present steps in the following order: Welcome, Business Information, Logo Upload, Brand Colors, Provider_Terminology, Imagery Style, CRM Connection, App Preview, Completion
3. THE Onboarding_Flow SHALL display a progress indicator showing the current step number and total steps
4. WHEN the Business_Owner completes a step and clicks "Continue", THE Onboarding_Flow SHALL animate the transition to the next step using a smooth slide or fade animation
5. WHEN the Business_Owner clicks "Back", THE Onboarding_Flow SHALL navigate to the previous step preserving all previously entered data
6. WHEN the Business_Owner reaches the Business Information step, THE Onboarding_Flow SHALL collect business name, phone number, and email address with inline validation
7. WHEN the Business_Owner reaches the Logo Upload step, THE Onboarding_Flow SHALL display a drag-and-drop upload zone that accepts image files and shows a preview of the uploaded logo
8. WHEN the Business_Owner reaches the Brand Colors step, THE Onboarding_Flow SHALL display a color picker for primary color and accent color with preset palette suggestions
9. WHEN the Business_Owner reaches the Provider_Terminology step, THE Onboarding_Flow SHALL display selectable cards for "Provider", "Crew", "Team", and "Service Professional"
10. WHEN the Business_Owner reaches the Imagery Style step, THE Onboarding_Flow SHALL display selectable imagery style options with visual previews
11. WHEN the Business_Owner reaches the CRM Connection step, THE Onboarding_Flow SHALL display integration cards for Jobber, Housecall Pro, and ServiceTitan with a mock "Connect" button on each
12. WHEN the Business_Owner reaches the App Preview step, THE Onboarding_Flow SHALL display the Mobile_Preview reflecting all branding choices made during onboarding
13. WHEN the Business_Owner completes the final step, THE Onboarding_Flow SHALL display a celebration moment with confetti animation and a congratulatory message
14. THE Onboarding_Flow SHALL persist all entered data in local state so that refreshing the page does not lose progress within the same session

### Requirement 3: White-Label Branding Studio

**User Story:** As a Business_Owner, I want a dedicated branding studio where I can customize my customer app's look and feel, so that my business appears premium and uniquely mine.

#### Acceptance Criteria

1. THE Branding_Studio SHALL display a side-by-side layout with editing controls on the left and the Mobile_Preview on the right
2. THE Branding_Studio SHALL provide a logo upload section with drag-and-drop support and a preview of the current logo
3. THE Branding_Studio SHALL provide color pickers for primary color and accent color with hex input fields and preset swatches
4. THE Branding_Studio SHALL provide a typography selection section with at least three font pairing options displayed as previews
5. THE Branding_Studio SHALL provide an imagery configuration section where the Business_Owner selects from curated imagery styles
6. THE Branding_Studio SHALL provide a Provider_Terminology selector with options: Provider, Crew, Team, Service Professional
7. THE Branding_Studio SHALL provide a notification tone selector with at least three tone options
8. WHEN the Business_Owner changes any branding setting, THE Mobile_Preview SHALL update within 300ms to reflect the change
9. THE Branding_Studio SHALL store all branding choices in the Brand_Config local state object
10. WHEN the Business_Owner navigates away from the Branding_Studio and returns, THE Branding_Studio SHALL restore all previously configured settings from local state

### Requirement 4: Live Mobile App Preview

**User Story:** As a Business_Owner, I want to see a live phone mockup of my branded customer app, so that I can visualize exactly what my homeowners will experience.

#### Acceptance Criteria

1. THE Mobile_Preview SHALL render inside a realistic phone frame (device bezel) at a fixed aspect ratio of approximately 9:19.5
2. THE Mobile_Preview SHALL display simulated homeowner screens including a home dashboard, service status, and provider profile
3. WHEN the Brand_Config changes, THE Mobile_Preview SHALL re-render with the updated logo, colors, typography, and Provider_Terminology within 300ms
4. THE Mobile_Preview SHALL be interactive, allowing the Business_Owner to tap through simulated screens within the phone frame
5. THE Platform SHALL support displaying the Mobile_Preview as a persistent side panel or as a toggleable overlay accessible from any section
6. THE Mobile_Preview SHALL display placeholder content using Mock_Data that represents realistic lawn care service scenarios

### Requirement 5: CRM Integration Center

**User Story:** As a Business_Owner, I want to see which CRM tools I can connect, so that I understand how Servvo integrates with my existing workflow.

#### Acceptance Criteria

1. THE CRM_Integration_Center SHALL display integration cards for Jobber, Housecall Pro, and ServiceTitan, each showing the CRM logo, name, and a brief description
2. WHEN the Business_Owner clicks "Connect" on an integration card, THE CRM_Integration_Center SHALL display a simulated connection flow with a loading state followed by a success confirmation
3. WHILE an integration is in a "connected" state, THE CRM_Integration_Center SHALL display a green status indicator and a "Connected" label on the corresponding card
4. WHILE an integration is in a "connected" state, THE CRM_Integration_Center SHALL display a "Disconnect" button and a last-synced timestamp
5. WHEN the Business_Owner clicks "Disconnect", THE CRM_Integration_Center SHALL revert the card to its unconnected state with a "Connect" button
6. THE CRM_Integration_Center SHALL persist integration connection states in local state

### Requirement 6: Customer Experience Settings

**User Story:** As a Business_Owner, I want to configure how my customers are communicated with, so that messaging matches my brand personality.

#### Acceptance Criteria

1. THE Customer_Experience_Settings SHALL provide a messaging tone selector with options: Professional, Friendly, Luxury, and Modern, displayed as selectable cards with example text previews
2. WHEN the Business_Owner selects a messaging tone, THE Customer_Experience_Settings SHALL update all notification template previews to reflect the selected tone
3. THE Customer_Experience_Settings SHALL display editable notification templates for: appointment confirmation, service in-progress, service complete, and review request
4. THE Customer_Experience_Settings SHALL provide service status message configuration showing the messages homeowners see at each service stage
5. THE Customer_Experience_Settings SHALL provide a review request settings section with toggle controls for automatic review requests and timing configuration
6. THE Customer_Experience_Settings SHALL provide rebooking flow settings with toggle controls for automatic rebooking suggestions
7. THE Customer_Experience_Settings SHALL persist all settings in local state

### Requirement 7: Customer Management

**User Story:** As a Business_Owner, I want a simple view of my customers, so that I can see engagement at a glance without needing a full CRM.

#### Acceptance Criteria

1. THE Customer_List SHALL display a list of mock homeowner profiles with name, property address, last service date, and engagement status
2. WHEN the Business_Owner clicks on a customer row, THE Customer_List SHALL display a detail panel showing the homeowner profile, service history, and engagement metrics
3. THE Customer_List SHALL provide a search input that filters customers by name or address
4. THE Customer_List SHALL display an engagement overview summary showing total customers, active customers, and customers due for rebooking
5. THE Customer_List SHALL use card-based layouts with generous spacing rather than dense table rows

### Requirement 8: Analytics Dashboard

**User Story:** As a Business_Owner, I want to see how my customers are engaging with my branded app, so that I can understand the value Servvo provides.

#### Acceptance Criteria

1. THE Analytics_Dashboard SHALL display metric cards for: total customers, repeat booking rate, average review rating, homeowner retention rate, and app usage (sessions per week)
2. THE Analytics_Dashboard SHALL display a line chart showing customer engagement over the past 30 days using Mock_Data
3. THE Analytics_Dashboard SHALL display a bar chart showing repeat bookings by week using Mock_Data
4. THE Analytics_Dashboard SHALL use large, spacious card layouts with soft shadows and premium typography
5. THE Analytics_Dashboard SHALL animate metric values on initial load using a count-up animation
6. THE Analytics_Dashboard SHALL render charts using a charting library compatible with React (such as Recharts or similar)

### Requirement 9: Visual Design and Animation Standards

**User Story:** As a Business_Owner, I want the platform to feel modern and premium, so that I trust Servvo as a high-quality partner for my business.

#### Acceptance Criteria

1. THE Platform SHALL use Tailwind CSS utility classes consistent with the existing Servvo design token palette (dark forest green primary, warm cream backgrounds, soft shadows)
2. THE Platform SHALL use shadcn/ui components as the base component library, customized with Servvo brand tokens
3. THE Platform SHALL apply Framer Motion animations for page transitions, card entrances, hover states, and interactive feedback
4. THE Platform SHALL maintain a minimum touch target size of 44px for all interactive elements
5. THE Platform SHALL use a spacious layout with minimum 24px padding between content sections and 16px padding within cards
6. THE Platform SHALL avoid dense tables, enterprise-style clutter, and technical admin patterns in favor of card-based, editorial layouts
7. THE Platform SHALL render all text with sufficient contrast ratios meeting WCAG 2.1 AA standards (4.5:1 for body text, 3:1 for large text)

### Requirement 10: State Management and Data Persistence

**User Story:** As a Business_Owner, I want my configuration choices to persist during my session, so that I do not lose work when navigating between sections.

#### Acceptance Criteria

1. THE Platform SHALL store all Brand_Config data in a React context or state management solution accessible across all sections
2. THE Platform SHALL store onboarding progress, branding choices, CRM connection states, and customer experience settings in local state
3. WHEN the Business_Owner navigates between sections, THE Platform SHALL preserve all previously entered data without loss
4. THE Platform SHALL initialize with sensible default values for all configurable settings (default primary color: #2D4A2D, default terminology: "Provider")
5. IF the local state becomes corrupted or unreadable, THEN THE Platform SHALL reset to default values and display the onboarding welcome screen

### Requirement 11: Responsive Layout

**User Story:** As a Business_Owner, I want the platform to work well on my laptop and large monitor, so that I can manage my business from any device I use at my desk.

#### Acceptance Criteria

1. THE Platform SHALL support viewport widths from 1024px to 2560px with fluid content scaling
2. WHILE the viewport width is below 1024px, THE Platform SHALL display a message recommending desktop use rather than attempting a full mobile layout
3. THE Platform SHALL constrain content width to a maximum of 1440px centered within the viewport on ultra-wide displays
4. THE Branding_Studio side-by-side layout SHALL stack vertically when the content area width falls below 900px

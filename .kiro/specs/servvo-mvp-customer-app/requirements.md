# Requirements Document

## Introduction

Servvo MVP Customer App is a white-glove, branded mobile experience for homeowners of home service businesses (lawn care, HVAC, pest control, and any recurring service vertical). It provides modern communication, service transparency, appointment management, payments, and engagement tools. The app is powered by Servvo infrastructure but presents as the service business's own branded experience — homeowners see their provider's brand, not Servvo. Built with React Native (Expo + TypeScript). Backend and infrastructure are handled separately.

The app supports multi-business homeowners — a single person can use services from multiple providers (e.g., GreenScape Lawn AND Elite Air HVAC), both powered by Servvo, switching between them via a dropdown. Reviews submitted in-app also prompt for Google Reviews.

## Glossary

- **Customer_App**: The React Native mobile application used by homeowners to interact with their lawn care service provider's branded experience
- **Homeowner**: The end user of the Customer_App who receives lawn care services
- **Business**: The lawn care company that uses Servvo to power their customer experience
- **Service_Professional**: The configurable term for the person performing lawn care services (also: Provider, Crew, Team — terminology is set per Business)
- **Dashboard**: The home screen of the Customer_App showing upcoming services, quick actions, and recent activity
- **OTP**: One-Time Password sent via SMS for phone number verification during authentication
- **Service_Status**: The progression of a service appointment through stages: Scheduled → Provider Assigned → On The Way → Arrived → In Progress → Completed
- **Arrival_Window**: The estimated time range during which the Service_Professional is expected to arrive
- **Invoice**: A billing document generated for services rendered, viewable and payable within the Customer_App
- **Property**: The homeowner's home/lawn associated with their account, set up during onboarding
- **Brand_Config**: The per-Business customization of logo, colors, terminology, imagery, and communication tone
- **Push_Notification**: A mobile notification delivered via Firebase Cloud Messaging to the Homeowner's device

## Requirements

### Requirement 1: Phone Number Authentication

**User Story:** As a Homeowner, I want to log in using my phone number and a one-time code, so that I can securely access my account without remembering a password.

#### Acceptance Criteria

1. WHEN the Homeowner enters a valid phone number, THE Customer_App SHALL send an OTP to that phone number via SMS
2. WHEN the Homeowner enters a valid OTP within 5 minutes of issuance, THE Customer_App SHALL authenticate the Homeowner and grant access to the application
3. IF the Homeowner enters an invalid OTP, THEN THE Customer_App SHALL display an error message indicating the code is incorrect and allow retry
4. IF the OTP expires after 5 minutes, THEN THE Customer_App SHALL prompt the Homeowner to request a new code
5. WHEN the Homeowner requests a new OTP, THE Customer_App SHALL invalidate any previously issued OTP for that phone number

### Requirement 2: Onboarding and Profile Setup

**User Story:** As a Homeowner, I want to set up my profile and property information after first login, so that my lawn care business can provide personalized service.

#### Acceptance Criteria

1. WHEN the Homeowner authenticates for the first time, THE Customer_App SHALL present the onboarding flow in sequence: Profile Setup → Property Setup → Confirmation
2. WHEN the Homeowner submits profile information (name, email), THE Customer_App SHALL save the profile and advance to Property Setup
3. WHEN the Homeowner submits property information (address, property details), THE Customer_App SHALL save the property and display a confirmation screen
4. THE Customer_App SHALL require name and address as mandatory fields before completing onboarding
5. WHEN onboarding is complete, THE Customer_App SHALL navigate the Homeowner to the Dashboard

### Requirement 3: Business Branding

**User Story:** As a Homeowner, I want the app to look and feel like my lawn care company's own app, so that I trust the experience and feel connected to my provider.

#### Acceptance Criteria

1. WHEN the Customer_App loads, THE Customer_App SHALL apply the Brand_Config (logo, colors, terminology, imagery) associated with the Homeowner's Business
2. THE Customer_App SHALL display the Business logo in the header and onboarding screens
3. THE Customer_App SHALL use the Business-configured color palette for primary UI elements, buttons, and accents
4. THE Customer_App SHALL use the Business-configured terminology for Service_Professional references throughout all screens
5. IF the Brand_Config is unavailable, THEN THE Customer_App SHALL display default Servvo branding as a fallback

### Requirement 4: Home Dashboard

**User Story:** As a Homeowner, I want to see my upcoming service, provider status, and quick actions on one screen, so that I can stay informed without navigating through multiple pages.

#### Acceptance Criteria

1. WHEN the Homeowner opens the Customer_App, THE Dashboard SHALL display the next upcoming service card with service type, date, Arrival_Window, and assigned Service_Professional name
2. THE Dashboard SHALL display the current Service_Status of the next upcoming appointment
3. THE Dashboard SHALL provide quick action buttons for: message Service_Professional, pay invoice, book again, and view history
4. THE Dashboard SHALL display a recent activity feed showing the last 5 service-related events
5. IF no upcoming service exists, THEN THE Dashboard SHALL display a prompt to book a service

### Requirement 5: Appointment Management

**User Story:** As a Homeowner, I want to view, reschedule, and cancel my appointments, so that I can manage my lawn care schedule conveniently.

#### Acceptance Criteria

1. THE Customer_App SHALL display appointments in two tabs: Upcoming and Past
2. WHEN the Homeowner selects an appointment, THE Customer_App SHALL display appointment details including service type, date, time, Service_Professional, and Service_Status
3. WHEN the Homeowner requests to reschedule an upcoming appointment, THE Customer_App SHALL present available date and time options and submit the reschedule request
4. WHEN the Homeowner requests to cancel an upcoming appointment, THE Customer_App SHALL confirm the cancellation intent and submit the cancellation request
5. IF a reschedule or cancellation request is submitted, THEN THE Customer_App SHALL display a confirmation message and update the appointment status

### Requirement 6: Service Status Tracking

**User Story:** As a Homeowner, I want to see real-time status updates for my service appointment, so that I know when my provider is on the way and when the job is done.

#### Acceptance Criteria

1. THE Customer_App SHALL display Service_Status as a visual progression through stages: Scheduled → Provider Assigned → On The Way → Arrived → In Progress → Completed
2. WHEN the Service_Status changes, THE Customer_App SHALL update the status display within 10 seconds of the status change event
3. WHEN the Service_Status changes, THE Customer_App SHALL send a Push_Notification to the Homeowner with the updated status
4. THE Customer_App SHALL display the Arrival_Window when the Service_Status is "On The Way"
5. WHEN the Service_Status reaches "Completed", THE Customer_App SHALL display a completion summary with service details
6. WHEN the Service_Status changes to "On The Way", THE Customer_App SHALL display a map card showing the route from the Service_Professional's origin to the Homeowner's property with an estimated arrival time (e.g., "Arriving in ~12 min")
7. THE map card SHALL display a static route visualization (not live GPS tracking) calculated once when the status changes to "On The Way"
8. THE map card SHALL display an ETA countdown that updates based on the initial route calculation
9. WHEN the Service_Status changes from "On The Way" to "Arrived", THE Customer_App SHALL dismiss the map card and display an "Arrived" confirmation

### Requirement 7: Two-Way Messaging

**User Story:** As a Homeowner, I want to message my lawn care team and receive automated updates, so that I can communicate easily without phone calls.

#### Acceptance Criteria

1. THE Customer_App SHALL provide a messaging interface for two-way communication between the Homeowner and the Business
2. WHEN the Homeowner sends a message, THE Customer_App SHALL deliver the message to the Business and display it in the conversation thread with a sent timestamp
3. WHEN the Business sends a message, THE Customer_App SHALL display the message in the conversation thread and send a Push_Notification to the Homeowner
4. THE Customer_App SHALL display automated service update messages (status changes, appointment confirmations) in the messaging thread
5. WHEN the Homeowner receives a new message while the app is in the background, THE Customer_App SHALL deliver a Push_Notification with a message preview

### Requirement 8: Invoice Viewing and Payment

**User Story:** As a Homeowner, I want to view my invoices and pay them securely within the app, so that I can manage billing without switching to another platform.

#### Acceptance Criteria

1. THE Customer_App SHALL display a list of invoices with status (paid, unpaid, overdue), amount, date, and service description
2. WHEN the Homeowner selects an unpaid invoice, THE Customer_App SHALL display invoice details and a payment option
3. WHEN the Homeowner initiates payment, THE Customer_App SHALL process the payment securely via Stripe and display a payment confirmation
4. IF payment processing fails, THEN THE Customer_App SHALL display an error message with the failure reason and allow retry
5. THE Customer_App SHALL allow the Homeowner to save payment methods for future use
6. THE Customer_App SHALL display payment history with date, amount, invoice reference, and payment method used

### Requirement 9: Service History and Property Timeline

**User Story:** As a Homeowner, I want to view my complete service history with photos and notes, so that I can track the care my property has received over time.

#### Acceptance Criteria

1. THE Customer_App SHALL display a chronological list of all past services for the Homeowner's Property
2. WHEN the Homeowner selects a past service, THE Customer_App SHALL display service details including date, service type, Service_Professional name, duration, and any provider notes
3. WHERE lawn photos are available for a service, THE Customer_App SHALL display the photos in the service detail view
4. THE Customer_App SHALL present the service history as a property timeline showing the progression of care over time
5. THE Customer_App SHALL allow the Homeowner to scroll through the timeline and filter by service type

### Requirement 10: Reviews and Ratings

**User Story:** As a Homeowner, I want to rate and review my service after completion, so that I can provide feedback and help my lawn care company improve.

#### Acceptance Criteria

1. WHEN a service reaches "Completed" status, THE Customer_App SHALL send a Push_Notification prompting the Homeowner to rate the service
2. WHEN the Homeowner opens the review flow, THE Customer_App SHALL present a star rating (1-5) and an optional text comment field
3. WHEN the Homeowner submits a review, THE Customer_App SHALL save the review and display a thank-you confirmation
4. IF the Homeowner dismisses the review prompt, THEN THE Customer_App SHALL allow access to the review from the service history at any later time
5. THE Customer_App SHALL display the Homeowner's submitted reviews in their service history

### Requirement 11: Rebooking and Service Requests

**User Story:** As a Homeowner, I want to rebook a previous service or request a new one, so that I can easily schedule recurring lawn care without starting from scratch.

#### Acceptance Criteria

1. WHEN the Homeowner selects "Book Again" from the Dashboard or a past service, THE Customer_App SHALL pre-populate the booking form with the previous service type
2. THE Customer_App SHALL present available dates in a calendar view for service selection
3. WHEN the Homeowner selects a date, THE Customer_App SHALL display available time windows for that date
4. WHEN the Homeowner confirms the booking, THE Customer_App SHALL submit the service request and display a confirmation with the selected date and time window
5. WHERE seasonal recommendations are available, THE Customer_App SHALL display recommended services based on the current season and property history

### Requirement 12: Push Notifications

**User Story:** As a Homeowner, I want to receive timely push notifications about my service, so that I stay informed without needing to open the app.

#### Acceptance Criteria

1. WHEN the Homeowner first opens the Customer_App, THE Customer_App SHALL request permission to send Push_Notifications
2. THE Customer_App SHALL deliver Push_Notifications for: service status changes, new messages, invoice reminders, review requests, and appointment confirmations
3. WHEN the Homeowner taps a Push_Notification, THE Customer_App SHALL navigate to the relevant screen (appointment detail, message thread, invoice, or review flow)
4. THE Customer_App SHALL allow the Homeowner to configure notification preferences (enable/disable by category) in the account settings
5. IF the Homeowner denies notification permission, THEN THE Customer_App SHALL continue to function and display in-app notifications as a fallback

### Requirement 13: Secure Session Management

**User Story:** As a Homeowner, I want my session to remain active so I don't have to log in every time, while knowing my account is secure.

#### Acceptance Criteria

1. WHEN the Homeowner authenticates successfully, THE Customer_App SHALL maintain an active session for 30 days without requiring re-authentication
2. WHEN the session expires, THE Customer_App SHALL prompt the Homeowner to re-authenticate via OTP
3. WHEN the Homeowner selects "Log Out" from account settings, THE Customer_App SHALL end the session and return to the welcome screen
4. THE Customer_App SHALL store authentication tokens securely using the device's secure storage (Keychain on iOS, Keystore on Android)

### Requirement 14: Premium Visual Design

**User Story:** As a Homeowner, I want the app to feel modern, calm, and premium, so that I associate quality with my lawn care provider.

#### Acceptance Criteria

1. THE Customer_App SHALL use a design system with large cards, soft shadows, rounded corners, generous whitespace, and premium typography
2. THE Customer_App SHALL use a color palette of deep blue primary, green accents, white backgrounds, and subtle gray surfaces as defaults
3. THE Customer_App SHALL display high-quality lawn and property imagery in onboarding, dashboard, and service history screens
4. THE Customer_App SHALL implement smooth transitions and animations between screens
5. THE Customer_App SHALL render all screens in a mobile-first layout optimized for iOS and Android devices

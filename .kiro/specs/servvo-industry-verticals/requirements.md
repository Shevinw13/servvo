# Requirements Document

## Introduction

This document defines the requirements for the Servvo Industry Verticals feature, which adds HVAC and Pest Control industry variations to the existing Servvo mobile app alongside the current Lawn Care experience. The same codebase, components, and navigation are reused — an industry configuration object drives different theme colors, hero copy, imagery, mock data, property insight cards, activity events, and seasonal tips. This is a frontend-only feature using mock data.

## Glossary

- **Industry_Config**: A complete configuration object that bundles all per-vertical content (colors, gradients, terminology, hero section, insight cards, service types, mock data, and seasonal tips) for a single industry vertical.
- **Industry_Vertical**: One of the supported industry types: `lawn_care`, `hvac`, or `pest_control`.
- **Industry_Registry**: A lookup map from `IndustryVertical` keys to their corresponding `IndustryConfig` objects.
- **Industry_Store**: A Zustand state store that holds the currently active `IndustryVertical` and its resolved `IndustryConfig`.
- **Industry_Theme**: A `Theme` object produced by merging an `IndustryConfig`'s color and gradient tokens over the app's default design tokens.
- **BrandThemeProvider**: The React context provider that resolves and distributes the active theme to all child components.
- **Insight_Card**: A single property insight card definition containing an icon, label, value, and optional background tint.
- **Seasonal_Tip**: A short advisory string mapped to a calendar month (1–12) within an `IndustryConfig`.
- **Industry_Greeting**: A personalized greeting string that varies by time of day and uses the industry's hero greeting line for evening hours.
- **PropertySnapshot**: A UI component that renders exactly three insight cards sourced from the active `IndustryConfig`.
- **Industry_Switcher**: A developer-facing toggle component that allows switching between industry verticals at runtime for demo purposes.
- **DashboardScreen**: The main screen of the mobile app that displays the hero section, next service card, property snapshot, and activity timeline.

## Requirements

### Requirement 1: Industry Configuration Types

**User Story:** As a developer, I want a well-defined type system for industry configurations, so that all verticals share a consistent structure and the compiler catches missing fields.

#### Acceptance Criteria

1. THE Industry_Config type SHALL define fields for vertical identifier, display name, colors, gradients, terminology, hero section, insight cards, service types, mock appointment, mock events, and seasonal tips.
2. THE Industry_Config type SHALL constrain the `insightCards` field to a fixed-length tuple of exactly three Insight_Card elements.
3. THE Industry_Config type SHALL constrain the `seasonalTips` field to a record keyed by month numbers 1 through 12.
4. THE Industry_Vertical type SHALL be a union of the string literals `lawn_care`, `hvac`, and `pest_control`.

### Requirement 2: Industry Configuration Registry

**User Story:** As a developer, I want a centralized registry of industry configurations, so that any part of the app can retrieve the correct config by vertical identifier.

#### Acceptance Criteria

1. THE Industry_Registry SHALL contain one entry for each supported Industry_Vertical.
2. WHEN `getIndustryConfig` is called with a valid Industry_Vertical, THE Industry_Registry SHALL return the corresponding Industry_Config object.
3. WHEN `getIndustryConfig` is called with an unsupported vertical value, THE Industry_Registry SHALL throw an error with a descriptive message.
4. WHEN `getAvailableVerticals` is called, THE Industry_Registry SHALL return an array containing all supported Industry_Vertical values.

### Requirement 3: Industry Store

**User Story:** As a developer, I want a reactive state store for the active industry vertical, so that switching verticals triggers re-renders across all consuming components.

#### Acceptance Criteria

1. THE Industry_Store SHALL initialize with `lawn_care` as the default Industry_Vertical.
2. THE Industry_Store SHALL expose the current Industry_Vertical and its resolved Industry_Config as readable state.
3. WHEN `setIndustry` is called with a valid Industry_Vertical, THE Industry_Store SHALL update both the `currentVertical` and `config` state to reflect the new vertical.
4. WHEN `setIndustry` is called with the same vertical that is already active, THE Industry_Store SHALL produce a state equivalent to the current state.

### Requirement 4: Industry Theme Resolution

**User Story:** As a developer, I want to derive a complete theme from an industry config, so that all UI components render with the correct industry-specific colors and gradients.

#### Acceptance Criteria

1. WHEN `buildIndustryTheme` is called with a valid Industry_Config, THE function SHALL return a Theme object with color tokens overridden by the config's `colors` field.
2. WHEN `buildIndustryTheme` is called with a valid Industry_Config, THE function SHALL return a Theme object with gradient tokens set from the config's `gradients` field.
3. WHEN `buildIndustryTheme` is called with a valid Industry_Config, THE function SHALL return a Theme object with terminology set from the config's `terminology.serviceProvider` field.
4. WHEN `buildIndustryTheme` is called with a valid Industry_Config, THE function SHALL preserve all non-overridden default token values including spacing, typography, border radius, and shadows.

### Requirement 5: BrandThemeProvider Integration

**User Story:** As a developer, I want the BrandThemeProvider to integrate industry configuration, so that the resolved theme reflects both the active industry vertical and any portal brand overrides.

#### Acceptance Criteria

1. THE BrandThemeProvider SHALL resolve the theme by first applying `buildIndustryTheme` with the current Industry_Config from the Industry_Store.
2. WHEN a BrandConfig from the portal is present, THE BrandThemeProvider SHALL layer portal color overrides on top of the industry-resolved theme.
3. WHEN the Industry_Store's config changes, THE BrandThemeProvider SHALL recompute the theme and trigger re-renders in consuming components.
4. WHEN no BrandConfig is present, THE BrandThemeProvider SHALL use the industry-resolved theme without modification.

### Requirement 6: Per-Industry Mock Data

**User Story:** As a product stakeholder, I want each industry vertical to have realistic mock data, so that demos and development accurately represent the end-user experience for each vertical.

#### Acceptance Criteria

1. THE `lawn_care` Industry_Config SHALL contain mock data with lawn-care-specific service types, appointment details, activity events, and seasonal tips.
2. THE `hvac` Industry_Config SHALL contain mock data with HVAC-specific service types, appointment details, activity events, and seasonal tips.
3. THE `pest_control` Industry_Config SHALL contain mock data with pest-control-specific service types, appointment details, activity events, and seasonal tips.
4. FOR EACH Industry_Config, THE `mockEvents` field SHALL contain at least three events with non-empty titles, valid timestamps, and a status of either `completed` or `scheduled`.
5. FOR EACH Industry_Config, THE `serviceTypes` field SHALL contain at least one service type with a non-empty name and a positive duration value.

### Requirement 7: Industry-Aware Greeting

**User Story:** As a customer, I want to see a personalized greeting that reflects both the time of day and my service industry, so that the app feels tailored to my experience.

#### Acceptance Criteria

1. WHEN the current hour is between 5 and 11 inclusive, THE `buildIndustryGreeting` function SHALL return `"Good morning, {firstName}"`.
2. WHEN the current hour is between 12 and 16 inclusive, THE `buildIndustryGreeting` function SHALL return `"Good afternoon, {firstName}"`.
3. WHEN the current hour is between 17 and 23 or between 0 and 4 inclusive, THE `buildIndustryGreeting` function SHALL return `"{config.hero.greetingLine}, {firstName}"`.
4. FOR ALL valid inputs, THE `buildIndustryGreeting` function SHALL return a non-empty string.

### Requirement 8: Industry-Aware Seasonal Tips

**User Story:** As a customer, I want to see seasonal tips relevant to my service industry and the current month, so that I receive timely and useful advice.

#### Acceptance Criteria

1. WHEN `getIndustrySeasonalTip` is called with a valid Industry_Config and a month in range 1–12, THE function SHALL return the tip string from `config.seasonalTips` for that month.
2. WHEN `getIndustrySeasonalTip` is called with a month that has no entry in `seasonalTips`, THE function SHALL return a generic fallback tip string.
3. FOR ALL valid Industry_Config objects, THE `seasonalTips` field SHALL contain a non-empty string for each month 1 through 12.

### Requirement 9: Generalized PropertySnapshot Component

**User Story:** As a customer, I want to see property insight cards that are relevant to my service industry, so that I get a quick overview of my property's status in terms I understand.

#### Acceptance Criteria

1. THE PropertySnapshot component SHALL render exactly three insight cards sourced from the active Industry_Config's `insightCards` array.
2. WHEN rendering the third insight card, THE PropertySnapshot component SHALL display the current month's seasonal tip as the card's value instead of the static config value.
3. WHEN the Industry_Config changes, THE PropertySnapshot component SHALL re-render with the new config's insight cards and seasonal tip.
4. FOR EACH insight card rendered, THE PropertySnapshot component SHALL display the card's icon, label, and resolved value.

### Requirement 10: Industry Switcher Component

**User Story:** As a developer or product stakeholder, I want a simple toggle to switch between industry verticals at runtime, so that I can demo all verticals without rebuilding the app.

#### Acceptance Criteria

1. THE Industry_Switcher SHALL display a selectable option for each available Industry_Vertical returned by `getAvailableVerticals`.
2. WHEN a user taps an industry option, THE Industry_Switcher SHALL call `setIndustry` on the Industry_Store with the selected vertical.
3. THE Industry_Switcher SHALL visually indicate which vertical is currently active by applying the primary color as the background of the active pill.
4. WHEN the active vertical changes, THE Industry_Switcher SHALL update its visual state to reflect the new selection.

### Requirement 11: DashboardScreen Industry Integration

**User Story:** As a customer, I want the dashboard to display content specific to my service industry, so that the entire experience feels purpose-built for my needs.

#### Acceptance Criteria

1. THE DashboardScreen SHALL source its hero image and greeting line from the active Industry_Config.
2. THE DashboardScreen SHALL display the next service card using the active Industry_Config's `mockAppointment` data.
3. THE DashboardScreen SHALL render the PropertySnapshot component with the active Industry_Config.
4. THE DashboardScreen SHALL render the activity timeline using the active Industry_Config's `mockEvents`.
5. WHEN the active Industry_Vertical changes, THE DashboardScreen SHALL re-render all sections with the new vertical's configuration data.

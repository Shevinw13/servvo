# Servvo Technical & Product Roadmap

**Timeline:** 3 Months (12 Weeks)  
**Target:** Production-ready MVP with Jobber integration, business portal, and App Store-published mobile apps  
**Architecture:** AWS-hosted, multi-tenant, multi-environment, cost-conscious

---

## Executive Summary

Servvo is the customer experience layer for home service businesses. We connect to their existing CRM (starting with Jobber), give them a branded business portal with intelligence and engagement tools, and provide their homeowners with a premium white-label mobile app (iOS + Android).

**The 3 layers — always talking:**
```
Layer 1: CRM Integration (Jobber) ←→ Layer 2: Business Portal ←→ Layer 3: Mobile App (iOS/Android)
```

Every action by a homeowner in the app reflects back to the business portal AND syncs to the CRM. Every change in the CRM propagates through to the portal and mobile app.

---

## Phase 0: Infrastructure Foundation (Weeks 1–2)

### AWS Architecture (Cost-Conscious)

| Component | Service | Rationale |
|-----------|---------|-----------|
| Compute | ECS Fargate (NestJS API) | No server management, scales to zero when idle |
| Database | RDS PostgreSQL (db.t4g.micro → t4g.small) | Start small, vertical scaling path |
| Cache/Queue | ElastiCache Redis (cache.t4g.micro) | Session store, Bull queues, pub/sub |
| Object Storage | S3 | Business logos, service photos, app assets |
| CDN | CloudFront | Static assets, image delivery |
| Auth | Cognito + Firebase Auth | Phone OTP for homeowners, Cognito for business users |
| Secrets | Secrets Manager | API keys, OAuth tokens, DB credentials |
| DNS/SSL | Route 53 + ACM | Custom domains, auto-renewing certs |
| Notifications | SNS + FCM/APNs | Push notification delivery |
| Email | SES | Transactional emails, business communications |
| Monitoring | CloudWatch + X-Ray | Logs, metrics, distributed tracing |
| IaC | CDK (TypeScript) | Infrastructure as code, repeatable environments |

### Multi-Environment Strategy

| Environment | Purpose | Infra |
|-------------|---------|-------|
| `dev` | Active development, frequent deploys | Minimal (single-AZ, smallest instances) |
| `staging` | QA, integration testing, demo | Mirrors prod architecture at reduced scale |
| `prod` | Live customers | Multi-AZ, auto-scaling, backups |

### Security Priorities

- VPC with private subnets for DB/cache, public subnets only for ALB
- IAM roles with least-privilege (no access keys in code)
- Secrets Manager for all credentials (rotated automatically)
- WAF on ALB (rate limiting, bot protection, SQL injection rules)
- RDS encryption at rest + in transit
- S3 bucket policies (no public access, signed URLs for uploads)
- Security groups: API → DB only, no direct internet → DB
- HTTPS everywhere (ACM certs, forced TLS 1.2+)
- Dependency scanning in CI (npm audit, Snyk/Dependabot)
- Container image scanning (ECR native scanning)

### Alerting & Observability

- CloudWatch Alarms: API latency p99 > 2s, error rate > 5%, CPU > 80%
- RDS Alarms: storage < 20%, connections > 80%, replication lag
- Application-level: failed webhook deliveries, sync failures, payment failures
- PagerDuty/Slack integration for critical alerts
- Structured JSON logging with correlation IDs
- X-Ray tracing for cross-service calls

### CI/CD Pipeline

- GitHub Actions: lint → test → build → deploy
- Branch strategy: `main` → prod, `develop` → staging, feature branches → dev
- Docker builds with layer caching
- Database migrations run automatically on deploy
- Rollback capability (ECS task definition revisions)

### Deliverables

- [ ] CDK stack for all environments
- [ ] VPC, subnets, security groups
- [ ] RDS PostgreSQL provisioned
- [ ] ElastiCache Redis provisioned
- [ ] ECS Fargate cluster + service
- [ ] ALB with HTTPS
- [ ] S3 buckets (assets, uploads)
- [ ] CloudFront distribution
- [ ] Secrets Manager entries
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] CloudWatch dashboards + alarms
- [ ] WAF rules

---

## Phase 1: CRM Integration — Jobber (Weeks 2–5)

### Jobber API Overview

- **Protocol:** GraphQL
- **Auth:** OAuth 2.0 (per-business connection)
- **Rate Limits:** 2,500 requests per 5 minutes per account
- **Webhooks:** Real-time events when data changes in Jobber
- **Key Objects:** Clients, Properties, Jobs, Visits, Invoices, Quotes, Custom Fields
- **Custom Fields:** App can configure up to 5 per object type, supports read-only and editable

### Integration Architecture

```
┌─────────────┐     OAuth 2.0      ┌──────────────┐
│   Jobber    │◄──────────────────►│  Servvo API  │
│  (per biz)  │                    │  (NestJS)    │
│             │───── Webhooks ────►│              │
│             │◄── GraphQL Sync ───│              │
└─────────────┘                    └──────────────┘
                                          │
                                   ┌──────┴──────┐
                                   │  PostgreSQL  │
                                   │  (unified    │
                                   │   schema)    │
                                   └─────────────┘
```

### Data Mapping Strategy

**Mandatory Fields (always synced):**

| Jobber Object | Servvo Entity | Key Fields |
|---------------|---------------|------------|
| Client | Customer | name, email, phone, billing address |
| Property | Property | address, coordinates, notes |
| Job | Service | type, status, assigned team, dates |
| Visit | Appointment | date, time window, status, assigned |
| Invoice | Invoice | amount, status, line items, due date |
| Quote | Quote | amount, line items, status |

**Custom Fields (dynamic per business):**

- On OAuth connect, query all `customFieldConfigurations` for the account
- Store field definitions in a `custom_field_definitions` table (per business)
- Store values in a `custom_field_values` table (EAV pattern)
- Display custom fields in business portal and optionally in mobile app
- Servvo can create its own read-only custom fields on Jobber objects (e.g., "Servvo App Status", "Last App Engagement")

### Sync Strategy

**Initial Sync (on connect):**
1. Business completes OAuth flow
2. Full pull of all Clients, Properties, Jobs, Visits, Invoices
3. Paginated GraphQL queries (respect rate limits)
4. Background job (Bull queue) processes in batches
5. Status shown in business portal: "Syncing... 245/1,200 customers"

**Ongoing Sync (bidirectional):**
- **Jobber → Servvo:** Webhooks for real-time updates (new client, job status change, invoice paid)
- **Servvo → Jobber:** GraphQL mutations when homeowner takes action (reschedule, payment, review)
- **Conflict Resolution:** Last-write-wins with Jobber as source of truth for operational data, Servvo as source of truth for engagement data

**Webhook Events to Subscribe:**
- `CLIENT_CREATE`, `CLIENT_UPDATE`
- `JOB_CREATE`, `JOB_UPDATE`
- `VISIT_CREATE`, `VISIT_UPDATE`, `VISIT_COMPLETE`
- `INVOICE_CREATE`, `INVOICE_UPDATE`

### Middleware Design

```typescript
// Sync engine architecture
JobberSyncService
├── OAuthManager (token storage, refresh, per-business)
├── WebhookProcessor (validate, parse, route)
├── FieldMapper (Jobber schema → Servvo schema, handles custom fields)
├── SyncQueue (Bull queue, retries, dead letter)
├── ConflictResolver (timestamp-based, field-level merge)
└── SyncStatusTracker (per-business sync health dashboard)
```

### White-Glove Consistency

Every business gets the same experience regardless of how they configured Jobber:
- Normalize data into Servvo's unified schema
- Map Jobber's custom fields to Servvo's display system
- Handle missing/optional data gracefully (no broken UI)
- Business-specific terminology applied at render time, not storage time

### Deliverables

- [ ] OAuth 2.0 flow (connect/disconnect in business portal)
- [ ] Jobber GraphQL client with rate limiting
- [ ] Webhook endpoint with signature validation
- [ ] Full initial sync (paginated, background job)
- [ ] Real-time webhook processing
- [ ] Bidirectional sync (Servvo actions → Jobber mutations)
- [ ] Custom field discovery and mapping
- [ ] Sync health dashboard (business portal)
- [ ] Error handling and retry logic
- [ ] Data normalization layer

---

## Phase 2: Business Portal — Production (Weeks 4–8)

### What Exists (Mock)

We have a fully designed and functional prototype with:
- Onboarding wizard (9 steps)
- Dashboard with KPIs and intelligence cards
- Customer management
- Branding studio with mobile preview
- Push notification composer
- CRM integration UI
- Schedule view
- Services page

### What Needs to Become Real

| Feature | Mock → Production |
|---------|-------------------|
| Dashboard KPIs | Pull from real synced data (customer count, rebooking rate, revenue) |
| Intelligence Cards | Computed from actual appointment/engagement data |
| Customer List | Real customer data from Jobber sync |
| Push Notifications | Actually delivered via FCM/APNs through Servvo API |
| Branding Studio | Persisted to DB, consumed by mobile app at runtime |
| CRM Integration | Real OAuth flow + sync status |
| Schedule | Real appointments from Jobber sync |
| Messaging | Real WebSocket messaging to mobile app users |

### Business Portal Auth

- Email/password + MFA via AWS Cognito
- Business user management (owner can invite team members)
- Role-based access: Owner, Admin, Viewer

### Real-Time Data Pipeline

```
Jobber Webhook → Servvo API → PostgreSQL → WebSocket → Business Portal
                                         → Push → Mobile App
```

Dashboard auto-refreshes when data changes. No manual polling.

### Key Metrics (Computed Real-Time)

- Active Homeowners (have the app installed + used in last 30 days)
- Rebooking Rate (% of customers who book again within configured window)
- Monthly Revenue (sum of paid invoices this month)
- Avg Revenue per Homeowner
- Push Notification Open Rate
- Google Review Rate (reviews prompted vs submitted)
- At-Risk Score (no engagement in X days, configurable)

### Deliverables

- [ ] Business user auth (Cognito)
- [ ] Dashboard connected to real data
- [ ] Customer list from synced Jobber data
- [ ] Real push notification delivery
- [ ] Branding config persisted + served to mobile app
- [ ] Real-time WebSocket updates on dashboard
- [ ] Messaging system (portal → mobile, bidirectional)
- [ ] Schedule view with real appointment data
- [ ] Billing/subscription management (Stripe for Servvo's own billing)
- [ ] Audit logging for compliance

---

## Phase 3: Mobile App — App Store Ready (Weeks 5–10)

### What Exists (Prototype)

Complete React Native (Expo) app with:
- Auth flow (phone OTP)
- Onboarding
- Dashboard with hero, service card, property insights
- Appointments (list, detail, reschedule)
- Messaging (WebSocket)
- Billing (invoices, payments)
- Reviews (in-app + Google redirect)
- Notifications
- Profile
- Multi-vertical support (industry configs)
- Provider switcher (for homeowners with multiple services)

### What Needs to Become Real

| Feature | Prototype → Production |
|---------|------------------------|
| Auth | Real Firebase phone OTP (already architected) |
| Data | Real API calls to Servvo backend (replace mock data) |
| Branding | Load brand config from API on login (colors, logo, terminology) |
| Messaging | Real WebSocket to Servvo API (already have gateway) |
| Payments | Real Stripe integration (payment intents, saved methods) |
| Notifications | Real FCM push delivery |
| Provider Switcher | Query all businesses the homeowner is associated with |
| Reviews | Submit to Servvo + redirect to Google Reviews |

### Arrival Map & ETA (MVP approach — no provider app needed)

When the business marks status as "On The Way" (via portal or CRM webhook):
1. Push notification: "Joe is on the way — arriving in ~12 minutes"
2. App shows a map card with static route (Google Maps Directions API)
3. ETA countdown displayed on the card
4. When status changes to "Arrived" → map dismissed, "Arrived" confirmation shown

No live GPS tracking (that requires a provider app). This is calculated once on status change and gives the homeowner a premium "Uber-like" feel without the infrastructure cost.

### Multi-Business Experience

A single homeowner might use GreenScape Lawn AND Elite Air HVAC — both powered by Servvo. The app handles this:

1. On login, query all business associations for this phone number
2. Default to most recently active business
3. Dropdown switcher shows all associated businesses
4. Each switch loads that business's brand config + data
5. Separate notification channels per business
6. Unified billing view (optional) or per-business

### App Store Submission

- **iOS:** Apple Developer Account, App Store Connect, TestFlight for beta
- **Android:** Google Play Console, internal testing track
- **App Review Requirements:**
  - Privacy policy
  - Data usage disclosure
  - Push notification justification
  - Payment processing compliance (PCI via Stripe)
  - Accessibility (VoiceOver/TalkBack support)
- **EAS Build:** Expo Application Services for native builds
- **OTA Updates:** Expo Updates for non-native code pushes (skip app review for UI fixes)

### Bidirectional Sync (App → Portal → CRM)

When a homeowner takes an action:
```
Homeowner reschedules → Servvo API → Updates DB → 
  → WebSocket to Business Portal (real-time)
  → GraphQL mutation to Jobber (async, queued)
  → Push notification to business owner
```

### Deliverables

- [ ] Replace all mock data with real API calls
- [ ] Dynamic brand loading per business
- [ ] Real phone auth (Firebase)
- [ ] Real payments (Stripe)
- [ ] Real push notifications (FCM/APNs)
- [ ] Real messaging (WebSocket)
- [ ] Multi-business switcher (production)
- [ ] App Store assets (screenshots, descriptions, keywords)
- [ ] TestFlight beta → App Store submission
- [ ] Google Play internal testing → production
- [ ] Privacy policy + terms of service
- [ ] Accessibility audit (VoiceOver, Dynamic Type)

---

## Phase 4: Polish, Testing & Launch (Weeks 9–12)

### End-to-End Testing

- Full integration test: Jobber change → Servvo API → Portal update → Mobile push
- Load testing: Simulate 50 businesses × 200 customers each
- Security pen test (OWASP top 10)
- Payment flow testing (Stripe test mode → live mode cutover)

### Performance Targets

| Metric | Target |
|--------|--------|
| API response (p50) | < 200ms |
| API response (p99) | < 1s |
| Mobile app cold start | < 3s |
| Push notification delivery | < 5s |
| Webhook processing | < 2s |
| Dashboard load | < 1.5s |

### Cost Optimization

- RDS: Start db.t4g.micro ($12/mo), scale as needed
- Fargate: Spot instances for dev/staging, on-demand for prod
- S3: Intelligent-Tiering for uploaded assets
- CloudFront: Aggressive caching for brand assets (1hr TTL)
- Lambda@Edge: Image resizing on-the-fly (no pre-processing)
- Reserved capacity: Evaluate after month 2 for predictable workloads
- **Estimated monthly cost at launch:** $150–300/mo for infrastructure

### Pre-Launch Checklist

- [ ] Uptime monitoring (external, every 30s)
- [ ] Disaster recovery tested (RDS snapshot restore)
- [ ] Runbook for common incidents
- [ ] On-call rotation configured
- [ ] Rate limiting on all public endpoints
- [ ] CORS properly configured
- [ ] API versioning strategy documented
- [ ] Data backup strategy (daily RDS snapshots, 30-day retention)
- [ ] GDPR/privacy compliance (data export, deletion)
- [ ] First business customer onboarded (pilot)

---

## Week-by-Week Timeline

```
Week 1  │ AWS infra setup (CDK), CI/CD pipeline, environments
Week 2  │ Database schema (production), Redis, ECS deployment
Week 3  │ Jobber OAuth flow, GraphQL client, initial sync
Week 4  │ Jobber webhooks, bidirectional sync, field mapping
Week 5  │ Business portal auth (Cognito), real data connections
Week 6  │ Portal dashboard + customers + notifications (real)
Week 7  │ Mobile app: real auth, real API, brand loading
Week 8  │ Mobile app: payments, messaging, push (real)
Week 9  │ Multi-business support, provider switcher (production)
Week 10 │ App Store prep, TestFlight, Google Play internal
Week 11 │ Integration testing, load testing, security audit
Week 12 │ Bug fixes, polish, pilot customer, launch
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Jobber API rate limits | Queue-based sync, exponential backoff, batch queries |
| Jobber API changes | Version pinning, adapter pattern, integration tests |
| App Store rejection | Early TestFlight submission (week 8), address feedback fast |
| Data sync conflicts | Last-write-wins + conflict log for manual review |
| Scale beyond expectations | Fargate auto-scaling, RDS read replicas ready |
| Cost overrun | CloudWatch billing alerts, monthly cost review |
| Single-CRM dependency | Abstract integration layer (adapter pattern) for future CRMs |

---

## Future (Post-Launch, Month 4+)

- Housecall Pro integration (REST API)
- ServiceTitan integration
- AI-powered insights (churn prediction, upsell recommendations)
- Homeowner-to-homeowner referrals
- Automated review generation campaigns
- Business marketplace (Servvo network)
- White-label web portal (custom domain per business)
- Advanced analytics (cohort analysis, LTV predictions)
- Multi-language support
- Stripe Connect for marketplace payments (Servvo takes %)

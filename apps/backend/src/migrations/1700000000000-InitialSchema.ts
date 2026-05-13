import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enums
    await queryRunner.query(`
      CREATE TYPE "service_status_enum" AS ENUM (
        'scheduled', 'provider_assigned', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "invoice_status_enum" AS ENUM ('unpaid', 'paid', 'overdue')
    `);
    await queryRunner.query(`
      CREATE TYPE "sender_type_enum" AS ENUM ('customer', 'business', 'system')
    `);

    // Create uuid extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // 1. businesses
    await queryRunner.query(`
      CREATE TABLE "businesses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "slug" varchar NOT NULL,
        "crm_config" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_businesses_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_businesses" PRIMARY KEY ("id")
      )
    `);

    // 2. brand_configs
    await queryRunner.query(`
      CREATE TABLE "brand_configs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "business_id" uuid NOT NULL,
        "logo_url" varchar,
        "primary_color" varchar,
        "accent_color" varchar,
        "service_provider_term" varchar,
        "imagery" jsonb,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_brand_configs" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_brand_configs_business_id" UNIQUE ("business_id"),
        CONSTRAINT "FK_brand_configs_business" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE
      )
    `);

    // 3. users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "business_id" uuid NOT NULL,
        "firebase_uid" varchar NOT NULL,
        "phone" varchar NOT NULL,
        "name" varchar,
        "email" varchar,
        "onboarding_complete" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "last_login_at" TIMESTAMP,
        CONSTRAINT "UQ_users_firebase_uid" UNIQUE ("firebase_uid"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "FK_users_business" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE
      )
    `);

    // 4. properties
    await queryRunner.query(`
      CREATE TABLE "properties" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "address_line1" varchar NOT NULL,
        "address_line2" varchar,
        "city" varchar NOT NULL,
        "state" varchar NOT NULL,
        "zip" varchar NOT NULL,
        "details" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_properties" PRIMARY KEY ("id"),
        CONSTRAINT "FK_properties_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // 5. appointments
    await queryRunner.query(`
      CREATE TABLE "appointments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "business_id" uuid NOT NULL,
        "property_id" uuid,
        "service_type" varchar NOT NULL,
        "status" varchar NOT NULL DEFAULT 'scheduled',
        "scheduled_date" TIMESTAMP NOT NULL,
        "arrival_window_start" varchar,
        "arrival_window_end" varchar,
        "provider_name" varchar,
        "provider_notes" text,
        "duration_minutes" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_appointments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_appointments_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_appointments_business" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_appointments_property" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL
      )
    `);

    // 6. service_status_events
    await queryRunner.query(`
      CREATE TABLE "service_status_events" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "appointment_id" uuid NOT NULL,
        "status" varchar NOT NULL,
        "occurred_at" TIMESTAMP NOT NULL,
        "metadata" jsonb,
        CONSTRAINT "PK_service_status_events" PRIMARY KEY ("id"),
        CONSTRAINT "FK_service_status_events_appointment" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE
      )
    `);

    // 7. messages
    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "business_id" uuid NOT NULL,
        "sender_type" varchar NOT NULL,
        "content" text NOT NULL,
        "is_automated" boolean NOT NULL DEFAULT false,
        "is_read" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_messages" PRIMARY KEY ("id"),
        CONSTRAINT "FK_messages_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_messages_business" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE
      )
    `);

    // 8. invoices
    await queryRunner.query(`
      CREATE TABLE "invoices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "business_id" uuid NOT NULL,
        "appointment_id" uuid,
        "status" varchar NOT NULL DEFAULT 'unpaid',
        "amount_cents" integer NOT NULL,
        "currency" varchar NOT NULL DEFAULT 'usd',
        "description" varchar,
        "due_date" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_invoices" PRIMARY KEY ("id"),
        CONSTRAINT "FK_invoices_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_invoices_business" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_invoices_appointment" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL
      )
    `);

    // 9. payments
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "invoice_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "stripe_payment_intent_id" varchar,
        "amount_cents" integer NOT NULL,
        "status" varchar NOT NULL,
        "payment_method_type" varchar,
        "payment_method_last4" varchar,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_payments_invoice" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_payments_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // 10. payment_methods
    await queryRunner.query(`
      CREATE TABLE "payment_methods" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "stripe_payment_method_id" varchar NOT NULL,
        "type" varchar NOT NULL,
        "last4" varchar NOT NULL,
        "brand" varchar,
        "exp_month" integer NOT NULL,
        "exp_year" integer NOT NULL,
        "is_default" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payment_methods" PRIMARY KEY ("id"),
        CONSTRAINT "FK_payment_methods_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // 11. reviews
    await queryRunner.query(`
      CREATE TABLE "reviews" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "appointment_id" uuid NOT NULL,
        "rating" integer NOT NULL,
        "comment" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_reviews" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_reviews_appointment_id" UNIQUE ("appointment_id"),
        CONSTRAINT "FK_reviews_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_reviews_appointment" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE
      )
    `);

    // 12. service_photos
    await queryRunner.query(`
      CREATE TABLE "service_photos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "appointment_id" uuid NOT NULL,
        "s3_key" varchar NOT NULL,
        "caption" varchar,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_service_photos" PRIMARY KEY ("id"),
        CONSTRAINT "FK_service_photos_appointment" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE
      )
    `);

    // 13. device_tokens
    await queryRunner.query(`
      CREATE TABLE "device_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "token" varchar NOT NULL,
        "platform" varchar NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "last_used_at" TIMESTAMP,
        CONSTRAINT "PK_device_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "FK_device_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // 14. notification_preferences
    await queryRunner.query(`
      CREATE TABLE "notification_preferences" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "status_changes" boolean NOT NULL DEFAULT true,
        "new_messages" boolean NOT NULL DEFAULT true,
        "invoice_reminders" boolean NOT NULL DEFAULT true,
        "review_requests" boolean NOT NULL DEFAULT true,
        "appointment_confirmations" boolean NOT NULL DEFAULT true,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notification_preferences" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_notification_preferences_user_id" UNIQUE ("user_id"),
        CONSTRAINT "FK_notification_preferences_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create indexes for common queries
    await queryRunner.query(`CREATE INDEX "IDX_users_business_id" ON "users" ("business_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_users_firebase_uid" ON "users" ("firebase_uid")`);
    await queryRunner.query(`CREATE INDEX "IDX_appointments_user_id" ON "appointments" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_appointments_business_id" ON "appointments" ("business_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_appointments_scheduled_date" ON "appointments" ("scheduled_date")`);
    await queryRunner.query(`CREATE INDEX "IDX_appointments_status" ON "appointments" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_messages_user_id" ON "messages" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_messages_business_id" ON "messages" ("business_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_messages_created_at" ON "messages" ("created_at")`);
    await queryRunner.query(`CREATE INDEX "IDX_invoices_user_id" ON "invoices" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_invoices_status" ON "invoices" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_payments_invoice_id" ON "payments" ("invoice_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_service_status_events_appointment_id" ON "service_status_events" ("appointment_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_device_tokens_user_id" ON "device_tokens" ("user_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_device_tokens_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_service_status_events_appointment_id"`);
    await queryRunner.query(`DROP INDEX "IDX_payments_invoice_id"`);
    await queryRunner.query(`DROP INDEX "IDX_invoices_status"`);
    await queryRunner.query(`DROP INDEX "IDX_invoices_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_messages_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_messages_business_id"`);
    await queryRunner.query(`DROP INDEX "IDX_messages_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_appointments_status"`);
    await queryRunner.query(`DROP INDEX "IDX_appointments_scheduled_date"`);
    await queryRunner.query(`DROP INDEX "IDX_appointments_business_id"`);
    await queryRunner.query(`DROP INDEX "IDX_appointments_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_users_firebase_uid"`);
    await queryRunner.query(`DROP INDEX "IDX_users_business_id"`);

    // Drop tables in reverse order (respecting FK constraints)
    await queryRunner.query(`DROP TABLE "notification_preferences"`);
    await queryRunner.query(`DROP TABLE "device_tokens"`);
    await queryRunner.query(`DROP TABLE "service_photos"`);
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "payment_methods"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "service_status_events"`);
    await queryRunner.query(`DROP TABLE "appointments"`);
    await queryRunner.query(`DROP TABLE "properties"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "brand_configs"`);
    await queryRunner.query(`DROP TABLE "businesses"`);

    // Drop enums
    await queryRunner.query(`DROP TYPE "sender_type_enum"`);
    await queryRunner.query(`DROP TYPE "invoice_status_enum"`);
    await queryRunner.query(`DROP TYPE "service_status_enum"`);
  }
}

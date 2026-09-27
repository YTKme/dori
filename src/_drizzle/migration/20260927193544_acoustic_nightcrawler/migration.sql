CREATE TABLE "dori_account" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"type" text,
	"industry" text,
	"website" text,
	"phone" text,
	"email" text,
	"fax" text,
	"annual_revenue" numeric(15,2),
	"number_of_employees" integer,
	"rating" text,
	"ownership" text,
	"ticker_symbol" text,
	"description" text,
	"parent_account_id" uuid,
	"billing_street" text,
	"billing_city" text,
	"billing_state" text,
	"billing_postal_code" text,
	"billing_country" text,
	"shipping_street" text,
	"shipping_city" text,
	"shipping_state" text,
	"shipping_postal_code" text,
	"shipping_country" text
);
--> statement-breakpoint
CREATE TABLE "dori_activity" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"type" text DEFAULT 'task' NOT NULL,
	"subject" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'open' NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"due_date" date,
	"activity_date" timestamp,
	"duration_minutes" integer,
	"is_closed" boolean DEFAULT false NOT NULL,
	"account_id" uuid,
	"contact_id" uuid,
	"lead_id" uuid,
	"opportunity_id" uuid,
	"case_id" uuid,
	"campaign_id" uuid
);
--> statement-breakpoint
CREATE TABLE "betterauth_account" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "betterauth_invitation" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"team_id" uuid,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"inviter_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "betterauth_member" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "betterauth_organization" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "betterauth_session" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"active_organization_id" uuid,
	"active_team_id" uuid
);
--> statement-breakpoint
CREATE TABLE "betterauth_team_member" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"team_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"membership_key" text UNIQUE,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "betterauth_team" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" text NOT NULL,
	"member_count" integer DEFAULT 0 NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "betterauth_user" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"username" text UNIQUE,
	"display_username" text
);
--> statement-breakpoint
CREATE TABLE "betterauth_verification" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dori_campaign_member" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"campaign_id" uuid NOT NULL,
	"lead_id" uuid,
	"contact_id" uuid,
	"status" text DEFAULT 'sent' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dori_campaign" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"type" text,
	"status" text DEFAULT 'planned' NOT NULL,
	"start_date" date,
	"end_date" date,
	"budgeted_cost" numeric(15,2),
	"actual_cost" numeric(15,2),
	"expected_revenue" numeric(15,2),
	"expected_response" numeric(5,2),
	"is_active" boolean DEFAULT true NOT NULL,
	"parent_campaign_id" uuid,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "dori_case_comment" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"case_id" uuid NOT NULL,
	"body" text NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dori_case" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"case_number" text,
	"subject" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'new' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"origin" text,
	"type" text,
	"reason" text,
	"account_id" uuid,
	"contact_id" uuid,
	"parent_case_id" uuid,
	"is_closed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dori_contact" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"account_id" uuid,
	"salutation" text,
	"first_name" text,
	"last_name" text NOT NULL,
	"title" text,
	"department" text,
	"email" text,
	"phone" text,
	"mobile" text,
	"fax" text,
	"mailing_street" text,
	"mailing_city" text,
	"mailing_state" text,
	"mailing_postal_code" text,
	"mailing_country" text,
	"reports_to_id" uuid,
	"lead_source" text,
	"birthdate" date,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "dori_lead" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"salutation" text,
	"first_name" text,
	"last_name" text NOT NULL,
	"company" text NOT NULL,
	"title" text,
	"email" text,
	"phone" text,
	"mobile" text,
	"website" text,
	"lead_source" text,
	"status" text DEFAULT 'new' NOT NULL,
	"rating" text,
	"industry" text,
	"annual_revenue" numeric(15,2),
	"number_of_employees" integer,
	"street" text,
	"city" text,
	"state" text,
	"postal_code" text,
	"country" text,
	"description" text,
	"is_converted" boolean DEFAULT false NOT NULL,
	"converted_at" timestamp,
	"converted_account_id" uuid,
	"converted_contact_id" uuid,
	"converted_opportunity_id" uuid
);
--> statement-breakpoint
CREATE TABLE "dori_note" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"title" text,
	"body" text NOT NULL,
	"account_id" uuid,
	"contact_id" uuid,
	"lead_id" uuid,
	"opportunity_id" uuid,
	"case_id" uuid
);
--> statement-breakpoint
CREATE TABLE "dori_opportunity_contact_role" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"opportunity_id" uuid NOT NULL,
	"contact_id" uuid NOT NULL,
	"role" text,
	"is_primary" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dori_opportunity_line_item" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"opportunity_id" uuid NOT NULL,
	"product_id" uuid,
	"price_book_entry_id" uuid,
	"quantity" numeric(15,2) DEFAULT '1' NOT NULL,
	"unit_price" numeric(15,2) NOT NULL,
	"discount" numeric(5,2) DEFAULT '0',
	"description" text
);
--> statement-breakpoint
CREATE TABLE "dori_opportunity_stage" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"probability" numeric(5,2) DEFAULT '0' NOT NULL,
	"is_won" boolean DEFAULT false NOT NULL,
	"is_closed" boolean DEFAULT false NOT NULL,
	"forecast_category" text
);
--> statement-breakpoint
CREATE TABLE "dori_opportunity" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"account_id" uuid,
	"stage_id" uuid,
	"amount" numeric(15,2),
	"currency_code" text DEFAULT 'USD' NOT NULL,
	"close_date" date,
	"probability" numeric(5,2),
	"type" text,
	"lead_source" text,
	"next_step" text,
	"forecast_category" text,
	"is_closed" boolean DEFAULT false NOT NULL,
	"is_won" boolean DEFAULT false NOT NULL,
	"description" text,
	"campaign_id" uuid
);
--> statement-breakpoint
CREATE TABLE "dori_personal_access_token" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"token_hash" text NOT NULL UNIQUE,
	"token_prefix" text NOT NULL,
	"last_four" text,
	"scopes" text,
	"expires_at" timestamp,
	"last_used_at" timestamp,
	"revoked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "dori_price_book_entry" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"price_book_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"unit_price" numeric(15,2) NOT NULL,
	"currency_code" text DEFAULT 'USD' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dori_price_book" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"description" text,
	"is_standard" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dori_product" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"product_code" text,
	"description" text,
	"family" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dori_quote_line_item" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"quote_id" uuid NOT NULL,
	"product_id" uuid,
	"quantity" numeric(15,2) DEFAULT '1' NOT NULL,
	"unit_price" numeric(15,2) NOT NULL,
	"discount" numeric(5,2) DEFAULT '0',
	"description" text
);
--> statement-breakpoint
CREATE TABLE "dori_quote" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"organization_id" uuid NOT NULL,
	"owner_id" uuid,
	"created_by_id" uuid,
	"updated_by_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" text NOT NULL,
	"quote_number" text,
	"opportunity_id" uuid,
	"account_id" uuid,
	"contact_id" uuid,
	"status" text DEFAULT 'draft' NOT NULL,
	"expiration_date" date,
	"subtotal" numeric(15,2) DEFAULT '0',
	"discount" numeric(15,2) DEFAULT '0',
	"tax" numeric(15,2) DEFAULT '0',
	"shipping" numeric(15,2) DEFAULT '0',
	"grand_total" numeric(15,2) DEFAULT '0',
	"currency_code" text DEFAULT 'USD' NOT NULL,
	"billing_street" text,
	"billing_city" text,
	"billing_state" text,
	"billing_postal_code" text,
	"billing_country" text,
	"shipping_street" text,
	"shipping_city" text,
	"shipping_state" text,
	"shipping_postal_code" text,
	"shipping_country" text,
	"description" text
);
--> statement-breakpoint
CREATE INDEX "dori_account_organization_id_idx" ON "dori_account" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_account_name_idx" ON "dori_account" ("organization_id","name");--> statement-breakpoint
CREATE INDEX "dori_activity_organization_id_idx" ON "dori_activity" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_activity_owner_id_idx" ON "dori_activity" ("owner_id");--> statement-breakpoint
CREATE INDEX "dori_activity_due_date_idx" ON "dori_activity" ("organization_id","due_date");--> statement-breakpoint
CREATE INDEX "betterauth_account_user_id_idx" ON "betterauth_account" ("user_id");--> statement-breakpoint
CREATE INDEX "betterauth_invitation_organization_id_idx" ON "betterauth_invitation" ("organization_id");--> statement-breakpoint
CREATE INDEX "betterauth_invitation_email_idx" ON "betterauth_invitation" ("email");--> statement-breakpoint
CREATE INDEX "betterauth_member_organization_id_idx" ON "betterauth_member" ("organization_id");--> statement-breakpoint
CREATE INDEX "betterauth_member_user_id_idx" ON "betterauth_member" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "betterauth_organization_slug_uidx" ON "betterauth_organization" ("slug");--> statement-breakpoint
CREATE INDEX "betterauth_session_user_id_idx" ON "betterauth_session" ("user_id");--> statement-breakpoint
CREATE INDEX "betterauth_team_member_team_id_idx" ON "betterauth_team_member" ("team_id");--> statement-breakpoint
CREATE INDEX "betterauth_team_member_user_id_idx" ON "betterauth_team_member" ("user_id");--> statement-breakpoint
CREATE INDEX "betterauth_team_organization_id_idx" ON "betterauth_team" ("organization_id");--> statement-breakpoint
CREATE INDEX "betterauth_verification_identifier_idx" ON "betterauth_verification" ("identifier");--> statement-breakpoint
CREATE INDEX "dori_campaign_member_organization_id_idx" ON "dori_campaign_member" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_campaign_member_campaign_id_idx" ON "dori_campaign_member" ("campaign_id");--> statement-breakpoint
CREATE INDEX "dori_campaign_organization_id_idx" ON "dori_campaign" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_campaign_status_idx" ON "dori_campaign" ("organization_id","status");--> statement-breakpoint
CREATE INDEX "dori_case_comment_organization_id_idx" ON "dori_case_comment" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_case_comment_case_id_idx" ON "dori_case_comment" ("case_id");--> statement-breakpoint
CREATE INDEX "dori_case_organization_id_idx" ON "dori_case" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_case_status_idx" ON "dori_case" ("organization_id","status");--> statement-breakpoint
CREATE INDEX "dori_case_account_id_idx" ON "dori_case" ("account_id");--> statement-breakpoint
CREATE INDEX "dori_contact_organization_id_idx" ON "dori_contact" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_contact_account_id_idx" ON "dori_contact" ("account_id");--> statement-breakpoint
CREATE INDEX "dori_contact_name_idx" ON "dori_contact" ("organization_id","last_name");--> statement-breakpoint
CREATE INDEX "dori_lead_organization_id_idx" ON "dori_lead" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_lead_status_idx" ON "dori_lead" ("organization_id","status");--> statement-breakpoint
CREATE INDEX "dori_note_organization_id_idx" ON "dori_note" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_opp_contact_role_organization_id_idx" ON "dori_opportunity_contact_role" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_opp_contact_role_opportunity_id_idx" ON "dori_opportunity_contact_role" ("opportunity_id");--> statement-breakpoint
CREATE INDEX "dori_opp_contact_role_contact_id_idx" ON "dori_opportunity_contact_role" ("contact_id");--> statement-breakpoint
CREATE INDEX "dori_opp_line_item_organization_id_idx" ON "dori_opportunity_line_item" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_opp_line_item_opportunity_id_idx" ON "dori_opportunity_line_item" ("opportunity_id");--> statement-breakpoint
CREATE INDEX "dori_opportunity_stage_organization_id_idx" ON "dori_opportunity_stage" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_opportunity_stage_order_idx" ON "dori_opportunity_stage" ("organization_id","display_order");--> statement-breakpoint
CREATE INDEX "dori_opportunity_organization_id_idx" ON "dori_opportunity" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_opportunity_account_id_idx" ON "dori_opportunity" ("account_id");--> statement-breakpoint
CREATE INDEX "dori_opportunity_stage_id_idx" ON "dori_opportunity" ("stage_id");--> statement-breakpoint
CREATE INDEX "dori_pat_organization_id_idx" ON "dori_personal_access_token" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_pat_owner_id_idx" ON "dori_personal_access_token" ("owner_id");--> statement-breakpoint
CREATE INDEX "dori_pat_token_hash_idx" ON "dori_personal_access_token" ("token_hash");--> statement-breakpoint
CREATE INDEX "dori_price_book_entry_organization_id_idx" ON "dori_price_book_entry" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_price_book_entry_price_book_id_idx" ON "dori_price_book_entry" ("price_book_id");--> statement-breakpoint
CREATE INDEX "dori_price_book_entry_product_id_idx" ON "dori_price_book_entry" ("product_id");--> statement-breakpoint
CREATE INDEX "dori_price_book_organization_id_idx" ON "dori_price_book" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_product_organization_id_idx" ON "dori_product" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_product_code_idx" ON "dori_product" ("organization_id","product_code");--> statement-breakpoint
CREATE INDEX "dori_quote_line_item_organization_id_idx" ON "dori_quote_line_item" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_quote_line_item_quote_id_idx" ON "dori_quote_line_item" ("quote_id");--> statement-breakpoint
CREATE INDEX "dori_quote_organization_id_idx" ON "dori_quote" ("organization_id");--> statement-breakpoint
CREATE INDEX "dori_quote_opportunity_id_idx" ON "dori_quote" ("opportunity_id");--> statement-breakpoint
CREATE INDEX "dori_quote_account_id_idx" ON "dori_quote" ("account_id");--> statement-breakpoint
ALTER TABLE "dori_account" ADD CONSTRAINT "dori_account_organization_id_betterauth_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_account" ADD CONSTRAINT "dori_account_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_account" ADD CONSTRAINT "dori_account_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_account" ADD CONSTRAINT "dori_account_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_account" ADD CONSTRAINT "dori_account_parent_account_id_dori_account_id_fkey" FOREIGN KEY ("parent_account_id") REFERENCES "dori_account"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_activity" ADD CONSTRAINT "dori_activity_organization_id_betterauth_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_activity" ADD CONSTRAINT "dori_activity_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_activity" ADD CONSTRAINT "dori_activity_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_activity" ADD CONSTRAINT "dori_activity_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_activity" ADD CONSTRAINT "dori_activity_account_id_dori_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "dori_account"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_activity" ADD CONSTRAINT "dori_activity_contact_id_dori_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "dori_contact"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_activity" ADD CONSTRAINT "dori_activity_lead_id_dori_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "dori_lead"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_activity" ADD CONSTRAINT "dori_activity_opportunity_id_dori_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "dori_opportunity"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_activity" ADD CONSTRAINT "dori_activity_case_id_dori_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "dori_case"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_activity" ADD CONSTRAINT "dori_activity_campaign_id_dori_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "dori_campaign"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "betterauth_account" ADD CONSTRAINT "betterauth_account_user_id_betterauth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "betterauth_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "betterauth_invitation" ADD CONSTRAINT "betterauth_invitation_PFpy0LHpnxfX_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "betterauth_invitation" ADD CONSTRAINT "betterauth_invitation_inviter_id_betterauth_user_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "betterauth_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "betterauth_member" ADD CONSTRAINT "betterauth_member_dxLYhIN3JT9K_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "betterauth_member" ADD CONSTRAINT "betterauth_member_user_id_betterauth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "betterauth_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "betterauth_session" ADD CONSTRAINT "betterauth_session_user_id_betterauth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "betterauth_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "betterauth_team_member" ADD CONSTRAINT "betterauth_team_member_team_id_betterauth_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "betterauth_team"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "betterauth_team_member" ADD CONSTRAINT "betterauth_team_member_user_id_betterauth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "betterauth_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "betterauth_team" ADD CONSTRAINT "betterauth_team_organization_id_betterauth_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_campaign_member" ADD CONSTRAINT "dori_campaign_member_4e4HMvY9XvpH_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_campaign_member" ADD CONSTRAINT "dori_campaign_member_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_campaign_member" ADD CONSTRAINT "dori_campaign_member_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_campaign_member" ADD CONSTRAINT "dori_campaign_member_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_campaign_member" ADD CONSTRAINT "dori_campaign_member_campaign_id_dori_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "dori_campaign"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_campaign_member" ADD CONSTRAINT "dori_campaign_member_lead_id_dori_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "dori_lead"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_campaign_member" ADD CONSTRAINT "dori_campaign_member_contact_id_dori_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "dori_contact"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_campaign" ADD CONSTRAINT "dori_campaign_organization_id_betterauth_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_campaign" ADD CONSTRAINT "dori_campaign_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_campaign" ADD CONSTRAINT "dori_campaign_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_campaign" ADD CONSTRAINT "dori_campaign_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_campaign" ADD CONSTRAINT "dori_campaign_parent_campaign_id_dori_campaign_id_fkey" FOREIGN KEY ("parent_campaign_id") REFERENCES "dori_campaign"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_case_comment" ADD CONSTRAINT "dori_case_comment_4jyYxQdNFtUU_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_case_comment" ADD CONSTRAINT "dori_case_comment_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_case_comment" ADD CONSTRAINT "dori_case_comment_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_case_comment" ADD CONSTRAINT "dori_case_comment_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_case_comment" ADD CONSTRAINT "dori_case_comment_case_id_dori_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "dori_case"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_case" ADD CONSTRAINT "dori_case_organization_id_betterauth_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_case" ADD CONSTRAINT "dori_case_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_case" ADD CONSTRAINT "dori_case_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_case" ADD CONSTRAINT "dori_case_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_case" ADD CONSTRAINT "dori_case_account_id_dori_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "dori_account"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_case" ADD CONSTRAINT "dori_case_contact_id_dori_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "dori_contact"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_case" ADD CONSTRAINT "dori_case_parent_case_id_dori_case_id_fkey" FOREIGN KEY ("parent_case_id") REFERENCES "dori_case"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_contact" ADD CONSTRAINT "dori_contact_organization_id_betterauth_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_contact" ADD CONSTRAINT "dori_contact_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_contact" ADD CONSTRAINT "dori_contact_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_contact" ADD CONSTRAINT "dori_contact_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_contact" ADD CONSTRAINT "dori_contact_account_id_dori_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "dori_account"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_contact" ADD CONSTRAINT "dori_contact_reports_to_id_dori_contact_id_fkey" FOREIGN KEY ("reports_to_id") REFERENCES "dori_contact"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_lead" ADD CONSTRAINT "dori_lead_organization_id_betterauth_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_lead" ADD CONSTRAINT "dori_lead_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_lead" ADD CONSTRAINT "dori_lead_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_lead" ADD CONSTRAINT "dori_lead_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_lead" ADD CONSTRAINT "dori_lead_converted_account_id_dori_account_id_fkey" FOREIGN KEY ("converted_account_id") REFERENCES "dori_account"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_lead" ADD CONSTRAINT "dori_lead_converted_contact_id_dori_contact_id_fkey" FOREIGN KEY ("converted_contact_id") REFERENCES "dori_contact"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_lead" ADD CONSTRAINT "dori_lead_converted_opportunity_id_dori_opportunity_id_fkey" FOREIGN KEY ("converted_opportunity_id") REFERENCES "dori_opportunity"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_note" ADD CONSTRAINT "dori_note_organization_id_betterauth_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_note" ADD CONSTRAINT "dori_note_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_note" ADD CONSTRAINT "dori_note_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_note" ADD CONSTRAINT "dori_note_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_note" ADD CONSTRAINT "dori_note_account_id_dori_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "dori_account"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_note" ADD CONSTRAINT "dori_note_contact_id_dori_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "dori_contact"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_note" ADD CONSTRAINT "dori_note_lead_id_dori_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "dori_lead"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_note" ADD CONSTRAINT "dori_note_opportunity_id_dori_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "dori_opportunity"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_note" ADD CONSTRAINT "dori_note_case_id_dori_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "dori_case"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_opportunity_contact_role" ADD CONSTRAINT "dori_opportunity_contact_role_VNy9GHiEzbH5_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_opportunity_contact_role" ADD CONSTRAINT "dori_opportunity_contact_role_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity_contact_role" ADD CONSTRAINT "dori_opportunity_contact_role_Q1jdaKyQnhcO_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity_contact_role" ADD CONSTRAINT "dori_opportunity_contact_role_7xt7DlnLt925_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity_contact_role" ADD CONSTRAINT "dori_opportunity_contact_role_OXmYZS8kctmd_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "dori_opportunity"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_opportunity_contact_role" ADD CONSTRAINT "dori_opportunity_contact_role_contact_id_dori_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "dori_contact"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_opportunity_line_item" ADD CONSTRAINT "dori_opportunity_line_item_lyU1TmBRxSi4_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_opportunity_line_item" ADD CONSTRAINT "dori_opportunity_line_item_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity_line_item" ADD CONSTRAINT "dori_opportunity_line_item_ZHkgNNvPMyE7_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity_line_item" ADD CONSTRAINT "dori_opportunity_line_item_CwBG3uBmFp74_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity_line_item" ADD CONSTRAINT "dori_opportunity_line_item_2blf7s9UZL6O_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "dori_opportunity"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_opportunity_line_item" ADD CONSTRAINT "dori_opportunity_line_item_product_id_dori_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "dori_product"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity_line_item" ADD CONSTRAINT "dori_opportunity_line_item_obdEJxh1kiuU_fkey" FOREIGN KEY ("price_book_entry_id") REFERENCES "dori_price_book_entry"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity_stage" ADD CONSTRAINT "dori_opportunity_stage_u75KrEqzfnF0_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_opportunity_stage" ADD CONSTRAINT "dori_opportunity_stage_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity_stage" ADD CONSTRAINT "dori_opportunity_stage_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity_stage" ADD CONSTRAINT "dori_opportunity_stage_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity" ADD CONSTRAINT "dori_opportunity_af0PeQfyC3QD_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_opportunity" ADD CONSTRAINT "dori_opportunity_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity" ADD CONSTRAINT "dori_opportunity_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity" ADD CONSTRAINT "dori_opportunity_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity" ADD CONSTRAINT "dori_opportunity_account_id_dori_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "dori_account"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity" ADD CONSTRAINT "dori_opportunity_stage_id_dori_opportunity_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "dori_opportunity_stage"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_opportunity" ADD CONSTRAINT "dori_opportunity_campaign_id_dori_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "dori_campaign"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_personal_access_token" ADD CONSTRAINT "dori_personal_access_token_DLwKQV7atiN1_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_personal_access_token" ADD CONSTRAINT "dori_personal_access_token_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_personal_access_token" ADD CONSTRAINT "dori_personal_access_token_hTWZLm18HZ94_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_personal_access_token" ADD CONSTRAINT "dori_personal_access_token_UJep136FAPC1_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_price_book_entry" ADD CONSTRAINT "dori_price_book_entry_I02g15bihASI_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_price_book_entry" ADD CONSTRAINT "dori_price_book_entry_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_price_book_entry" ADD CONSTRAINT "dori_price_book_entry_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_price_book_entry" ADD CONSTRAINT "dori_price_book_entry_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_price_book_entry" ADD CONSTRAINT "dori_price_book_entry_price_book_id_dori_price_book_id_fkey" FOREIGN KEY ("price_book_id") REFERENCES "dori_price_book"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_price_book_entry" ADD CONSTRAINT "dori_price_book_entry_product_id_dori_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "dori_product"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_price_book" ADD CONSTRAINT "dori_price_book_organization_id_betterauth_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_price_book" ADD CONSTRAINT "dori_price_book_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_price_book" ADD CONSTRAINT "dori_price_book_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_price_book" ADD CONSTRAINT "dori_price_book_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_product" ADD CONSTRAINT "dori_product_organization_id_betterauth_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_product" ADD CONSTRAINT "dori_product_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_product" ADD CONSTRAINT "dori_product_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_product" ADD CONSTRAINT "dori_product_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_quote_line_item" ADD CONSTRAINT "dori_quote_line_item_s1IE1Il0c5z7_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_quote_line_item" ADD CONSTRAINT "dori_quote_line_item_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_quote_line_item" ADD CONSTRAINT "dori_quote_line_item_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_quote_line_item" ADD CONSTRAINT "dori_quote_line_item_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_quote_line_item" ADD CONSTRAINT "dori_quote_line_item_quote_id_dori_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "dori_quote"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_quote_line_item" ADD CONSTRAINT "dori_quote_line_item_product_id_dori_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "dori_product"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_quote" ADD CONSTRAINT "dori_quote_organization_id_betterauth_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "betterauth_organization"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dori_quote" ADD CONSTRAINT "dori_quote_owner_id_betterauth_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_quote" ADD CONSTRAINT "dori_quote_created_by_id_betterauth_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_quote" ADD CONSTRAINT "dori_quote_updated_by_id_betterauth_user_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "betterauth_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_quote" ADD CONSTRAINT "dori_quote_opportunity_id_dori_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "dori_opportunity"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_quote" ADD CONSTRAINT "dori_quote_account_id_dori_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "dori_account"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "dori_quote" ADD CONSTRAINT "dori_quote_contact_id_dori_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "dori_contact"("id") ON DELETE SET NULL;
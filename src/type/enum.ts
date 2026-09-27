/**
 * CRM Picklist Enumerations
 *
 * Single source of truth for the picklist values used both as drizzle
 * column `.$type<>()` hints and as Zod `z.enum()` validators at the API
 * boundary. Kept as `const` tuples so both a runtime array and a literal
 * union type are available.
 */

export const ACCOUNT_TYPE = [
  "prospect",
  "customer",
  "partner",
  "reseller",
  "competitor",
  "other",
] as const;
export type AccountType = (typeof ACCOUNT_TYPE)[number];

export const RATING = ["hot", "warm", "cold"] as const;
export type Rating = (typeof RATING)[number];

export const LEAD_STATUS = [
  "new",
  "contacted",
  "working",
  "qualified",
  "unqualified",
] as const;
export type LeadStatus = (typeof LEAD_STATUS)[number];

export const LEAD_SOURCE = [
  "web",
  "phone_inquiry",
  "partner_referral",
  "purchased_list",
  "advertisement",
  "email_campaign",
  "trade_show",
  "other",
] as const;
export type LeadSource = (typeof LEAD_SOURCE)[number];

export const OPPORTUNITY_TYPE = [
  "new_business",
  "existing_business",
  "renewal",
  "upgrade",
] as const;
export type OpportunityType = (typeof OPPORTUNITY_TYPE)[number];

export const FORECAST_CATEGORY = [
  "pipeline",
  "best_case",
  "commit",
  "closed",
  "omitted",
] as const;
export type ForecastCategory = (typeof FORECAST_CATEGORY)[number];

export const QUOTE_STATUS = [
  "draft",
  "needs_review",
  "in_review",
  "approved",
  "rejected",
  "presented",
  "accepted",
  "denied",
] as const;
export type QuoteStatus = (typeof QUOTE_STATUS)[number];

export const CASE_STATUS = [
  "new",
  "working",
  "escalated",
  "on_hold",
  "closed",
] as const;
export type CaseStatus = (typeof CASE_STATUS)[number];

export const CASE_PRIORITY = ["low", "medium", "high", "critical"] as const;
export type CasePriority = (typeof CASE_PRIORITY)[number];

export const CASE_ORIGIN = [
  "email",
  "phone",
  "web",
  "chat",
  "social",
] as const;
export type CaseOrigin = (typeof CASE_ORIGIN)[number];

export const CASE_TYPE = [
  "question",
  "problem",
  "feature_request",
  "incident",
] as const;
export type CaseType = (typeof CASE_TYPE)[number];

export const CAMPAIGN_TYPE = [
  "email",
  "webinar",
  "trade_show",
  "advertisement",
  "telemarketing",
  "referral_program",
  "other",
] as const;
export type CampaignType = (typeof CAMPAIGN_TYPE)[number];

export const CAMPAIGN_STATUS = [
  "planned",
  "in_progress",
  "completed",
  "aborted",
] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUS)[number];

export const CAMPAIGN_MEMBER_STATUS = [
  "sent",
  "responded",
  "registered",
  "attended",
  "bounced",
] as const;
export type CampaignMemberStatus = (typeof CAMPAIGN_MEMBER_STATUS)[number];

export const ACTIVITY_TYPE = [
  "task",
  "call",
  "meeting",
  "email",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPE)[number];

export const ACTIVITY_STATUS = [
  "open",
  "in_progress",
  "completed",
  "deferred",
  "cancelled",
] as const;
export type ActivityStatus = (typeof ACTIVITY_STATUS)[number];

export const ACTIVITY_PRIORITY = ["low", "normal", "high"] as const;
export type ActivityPriority = (typeof ACTIVITY_PRIORITY)[number];

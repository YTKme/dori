/**
 * CRM Resource Registry
 *
 * One declarative config per top-level entity. The generic list / form /
 * detail views read these, so adding or adjusting an entity's UI is a
 * data change, not new components.
 */

import {
  ACCOUNT_TYPE,
  ACTIVITY_PRIORITY,
  ACTIVITY_STATUS,
  ACTIVITY_TYPE,
  CAMPAIGN_STATUS,
  CAMPAIGN_TYPE,
  CASE_ORIGIN,
  CASE_PRIORITY,
  CASE_STATUS,
  CASE_TYPE,
  FORECAST_CATEGORY,
  LEAD_SOURCE,
  LEAD_STATUS,
  OPPORTUNITY_TYPE,
  QUOTE_STATUS,
  RATING,
} from "~/type/enum";
import type { ResourceUI } from "./types";

function fullName(record: Record<string, any>): string {
  const name = [record.firstName, record.lastName].filter(Boolean).join(" ");
  return name || record.company || "(no name)";
}

const address = (prefix: string) => [
  { name: `${prefix}Street`, label: "Street", section: "Address" },
  { name: `${prefix}City`, label: "City", section: "Address" },
  { name: `${prefix}State`, label: "State/Province", section: "Address" },
  { name: `${prefix}PostalCode`, label: "Postal code", section: "Address" },
  { name: `${prefix}Country`, label: "Country", section: "Address" },
];

export const resources: Record<string, ResourceUI> = {
  lead: {
    entity: "lead",
    singular: "Lead",
    plural: "Leads",
    titleField: "lastName",
    getTitle: fullName,
    searchPlaceholder: "Search leads…",
    columns: [
      { name: "company", label: "Company" },
      { name: "email", label: "Email" },
      { name: "status", label: "Status", type: "badge" },
      { name: "rating", label: "Rating", type: "badge" },
      { name: "createdAt", label: "Created", type: "date" },
    ],
    related: [
      { entity: "activity", label: "Activities", foreignKey: "leadId" },
      { entity: "note", label: "Notes", foreignKey: "leadId" },
    ],
    fields: [
      { name: "salutation", label: "Salutation" },
      { name: "firstName", label: "First name" },
      { name: "lastName", label: "Last name", required: true },
      { name: "company", label: "Company", required: true },
      { name: "title", label: "Title" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone" },
      { name: "mobile", label: "Mobile" },
      { name: "website", label: "Website" },
      { name: "status", label: "Status", type: "select", options: LEAD_STATUS },
      { name: "leadSource", label: "Source", type: "select", options: LEAD_SOURCE },
      { name: "rating", label: "Rating", type: "select", options: RATING },
      { name: "industry", label: "Industry" },
      { name: "annualRevenue", label: "Annual revenue", type: "money" },
      { name: "numberOfEmployees", label: "Employees", type: "number" },
      ...address(""),
      { name: "description", label: "Description", type: "textarea" },
    ],
  },

  account: {
    entity: "account",
    singular: "Account",
    plural: "Accounts",
    titleField: "name",
    searchPlaceholder: "Search accounts…",
    columns: [
      { name: "type", label: "Type", type: "badge" },
      { name: "industry", label: "Industry" },
      { name: "phone", label: "Phone" },
      { name: "website", label: "Website" },
      { name: "createdAt", label: "Created", type: "date" },
    ],
    related: [
      { entity: "contact", label: "Contacts", foreignKey: "accountId" },
      { entity: "opportunity", label: "Opportunities", foreignKey: "accountId" },
      { entity: "case", label: "Cases", foreignKey: "accountId" },
      { entity: "quote", label: "Quotes", foreignKey: "accountId" },
      { entity: "activity", label: "Activities", foreignKey: "accountId" },
      { entity: "note", label: "Notes", foreignKey: "accountId" },
    ],
    fields: [
      { name: "name", label: "Account name", required: true },
      { name: "type", label: "Type", type: "select", options: ACCOUNT_TYPE },
      { name: "industry", label: "Industry" },
      { name: "website", label: "Website" },
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email", type: "email" },
      { name: "fax", label: "Fax" },
      { name: "annualRevenue", label: "Annual revenue", type: "money" },
      { name: "numberOfEmployees", label: "Employees", type: "number" },
      { name: "rating", label: "Rating", type: "select", options: RATING },
      { name: "ownership", label: "Ownership" },
      { name: "tickerSymbol", label: "Ticker" },
      { name: "description", label: "Description", type: "textarea" },
      ...address("billing").map((f) => ({ ...f, section: "Billing address" })),
      ...address("shipping").map((f) => ({ ...f, section: "Shipping address" })),
    ],
  },

  contact: {
    entity: "contact",
    singular: "Contact",
    plural: "Contacts",
    titleField: "lastName",
    getTitle: fullName,
    searchPlaceholder: "Search contacts…",
    detailExpand: ["account"],
    columns: [
      { name: "title", label: "Title" },
      { name: "email", label: "Email" },
      { name: "phone", label: "Phone" },
      { name: "department", label: "Department" },
      { name: "createdAt", label: "Created", type: "date" },
    ],
    related: [
      { entity: "activity", label: "Activities", foreignKey: "contactId" },
      { entity: "note", label: "Notes", foreignKey: "contactId" },
    ],
    fields: [
      { name: "salutation", label: "Salutation" },
      { name: "firstName", label: "First name" },
      { name: "lastName", label: "Last name", required: true },
      { name: "accountId", label: "Account", type: "reference", reference: "account" },
      { name: "title", label: "Title" },
      { name: "department", label: "Department" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone" },
      { name: "mobile", label: "Mobile" },
      { name: "leadSource", label: "Source", type: "select", options: LEAD_SOURCE },
      { name: "birthdate", label: "Birthdate", type: "date" },
      ...address("mailing").map((f) => ({ ...f, section: "Mailing address" })),
      { name: "description", label: "Description", type: "textarea" },
    ],
  },

  opportunity: {
    entity: "opportunity",
    singular: "Opportunity",
    plural: "Opportunities",
    titleField: "name",
    searchPlaceholder: "Search opportunities…",
    detailExpand: ["account", "stage"],
    columns: [
      { name: "amount", label: "Amount", type: "money" },
      { name: "probability", label: "Probability", type: "number" },
      { name: "closeDate", label: "Close date", type: "date" },
      { name: "type", label: "Type", type: "badge" },
      { name: "createdAt", label: "Created", type: "date" },
    ],
    related: [
      { entity: "quote", label: "Quotes", foreignKey: "opportunityId" },
      { entity: "activity", label: "Activities", foreignKey: "opportunityId" },
      { entity: "note", label: "Notes", foreignKey: "opportunityId" },
    ],
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "accountId", label: "Account", type: "reference", reference: "account" },
      { name: "stageId", label: "Stage", type: "reference", reference: "opportunity-stage" },
      { name: "amount", label: "Amount", type: "money" },
      { name: "currencyCode", label: "Currency" },
      { name: "closeDate", label: "Close date", type: "date" },
      { name: "probability", label: "Probability (%)", type: "number" },
      { name: "type", label: "Type", type: "select", options: OPPORTUNITY_TYPE },
      { name: "leadSource", label: "Source", type: "select", options: LEAD_SOURCE },
      { name: "forecastCategory", label: "Forecast", type: "select", options: FORECAST_CATEGORY },
      { name: "campaignId", label: "Campaign", type: "reference", reference: "campaign" },
      { name: "nextStep", label: "Next step" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },

  product: {
    entity: "product",
    singular: "Product",
    plural: "Products",
    titleField: "name",
    searchPlaceholder: "Search products…",
    columns: [
      { name: "productCode", label: "Code" },
      { name: "family", label: "Family" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "createdAt", label: "Created", type: "date" },
    ],
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "productCode", label: "Product code" },
      { name: "family", label: "Family" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },

  "price-book": {
    entity: "price-book",
    singular: "Price Book",
    plural: "Price Books",
    titleField: "name",
    searchPlaceholder: "Search price books…",
    columns: [
      { name: "isStandard", label: "Standard", type: "boolean" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "createdAt", label: "Created", type: "date" },
    ],
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "isStandard", label: "Standard price book", type: "boolean" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },

  quote: {
    entity: "quote",
    singular: "Quote",
    plural: "Quotes",
    titleField: "name",
    searchPlaceholder: "Search quotes…",
    detailExpand: ["account", "opportunity"],
    columns: [
      { name: "status", label: "Status", type: "badge" },
      { name: "grandTotal", label: "Total", type: "money" },
      { name: "expirationDate", label: "Expires", type: "date" },
      { name: "createdAt", label: "Created", type: "date" },
    ],
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "quoteNumber", label: "Quote number" },
      { name: "opportunityId", label: "Opportunity", type: "reference", reference: "opportunity" },
      { name: "accountId", label: "Account", type: "reference", reference: "account" },
      { name: "contactId", label: "Contact", type: "reference", reference: "contact" },
      { name: "status", label: "Status", type: "select", options: QUOTE_STATUS },
      { name: "expirationDate", label: "Expiration date", type: "date" },
      { name: "subtotal", label: "Subtotal", type: "money" },
      { name: "discount", label: "Discount", type: "money" },
      { name: "tax", label: "Tax", type: "money" },
      { name: "shipping", label: "Shipping", type: "money" },
      { name: "grandTotal", label: "Grand total", type: "money" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },

  case: {
    entity: "case",
    singular: "Case",
    plural: "Cases",
    titleField: "subject",
    searchPlaceholder: "Search cases…",
    detailExpand: ["account", "contact"],
    columns: [
      { name: "status", label: "Status", type: "badge" },
      { name: "priority", label: "Priority", type: "badge" },
      { name: "origin", label: "Origin", type: "badge" },
      { name: "createdAt", label: "Created", type: "date" },
    ],
    related: [
      { entity: "activity", label: "Activities", foreignKey: "caseId" },
      { entity: "note", label: "Notes", foreignKey: "caseId" },
    ],
    fields: [
      { name: "subject", label: "Subject", required: true },
      { name: "status", label: "Status", type: "select", options: CASE_STATUS },
      { name: "priority", label: "Priority", type: "select", options: CASE_PRIORITY },
      { name: "origin", label: "Origin", type: "select", options: CASE_ORIGIN },
      { name: "type", label: "Type", type: "select", options: CASE_TYPE },
      { name: "reason", label: "Reason" },
      { name: "accountId", label: "Account", type: "reference", reference: "account" },
      { name: "contactId", label: "Contact", type: "reference", reference: "contact" },
      { name: "isClosed", label: "Closed", type: "boolean" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },

  campaign: {
    entity: "campaign",
    singular: "Campaign",
    plural: "Campaigns",
    titleField: "name",
    searchPlaceholder: "Search campaigns…",
    columns: [
      { name: "type", label: "Type", type: "badge" },
      { name: "status", label: "Status", type: "badge" },
      { name: "startDate", label: "Start", type: "date" },
      { name: "endDate", label: "End", type: "date" },
    ],
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "type", label: "Type", type: "select", options: CAMPAIGN_TYPE },
      { name: "status", label: "Status", type: "select", options: CAMPAIGN_STATUS },
      { name: "startDate", label: "Start date", type: "date" },
      { name: "endDate", label: "End date", type: "date" },
      { name: "budgetedCost", label: "Budgeted cost", type: "money" },
      { name: "actualCost", label: "Actual cost", type: "money" },
      { name: "expectedRevenue", label: "Expected revenue", type: "money" },
      { name: "isActive", label: "Active", type: "boolean" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },

  activity: {
    entity: "activity",
    singular: "Activity",
    plural: "Activities",
    titleField: "subject",
    searchPlaceholder: "Search activities…",
    columns: [
      { name: "type", label: "Type", type: "badge" },
      { name: "status", label: "Status", type: "badge" },
      { name: "priority", label: "Priority", type: "badge" },
      { name: "dueDate", label: "Due", type: "date" },
    ],
    fields: [
      { name: "type", label: "Type", type: "select", options: ACTIVITY_TYPE },
      { name: "subject", label: "Subject", required: true },
      { name: "status", label: "Status", type: "select", options: ACTIVITY_STATUS },
      { name: "priority", label: "Priority", type: "select", options: ACTIVITY_PRIORITY },
      { name: "dueDate", label: "Due date", type: "date" },
      { name: "activityDate", label: "Activity date", type: "datetime" },
      { name: "durationMinutes", label: "Duration (min)", type: "number" },
      { name: "accountId", label: "Account", type: "reference", reference: "account" },
      { name: "contactId", label: "Contact", type: "reference", reference: "contact" },
      { name: "leadId", label: "Lead", type: "reference", reference: "lead" },
      { name: "opportunityId", label: "Opportunity", type: "reference", reference: "opportunity" },
      { name: "caseId", label: "Case", type: "reference", reference: "case" },
      { name: "isClosed", label: "Closed", type: "boolean" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },

  note: {
    entity: "note",
    singular: "Note",
    plural: "Notes",
    titleField: "title",
    getTitle: (record) => record.title || "(untitled note)",
    searchPlaceholder: "Search notes…",
    columns: [{ name: "createdAt", label: "Created", type: "date" }],
    fields: [
      { name: "title", label: "Title" },
      { name: "body", label: "Body", type: "textarea", required: true },
      { name: "accountId", label: "Account", type: "reference", reference: "account" },
      { name: "contactId", label: "Contact", type: "reference", reference: "contact" },
      { name: "leadId", label: "Lead", type: "reference", reference: "lead" },
      { name: "opportunityId", label: "Opportunity", type: "reference", reference: "opportunity" },
      { name: "caseId", label: "Case", type: "reference", reference: "case" },
    ],
  },
};

export function getResource(entity: string): ResourceUI | undefined {
  return resources[entity];
}

export function resourceTitle(
  resource: ResourceUI,
  record: Record<string, any>,
): string {
  if (resource.getTitle) return resource.getTitle(record);
  return String(record[resource.titleField] ?? "(untitled)");
}

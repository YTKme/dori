/**
 * Lead Conversion
 *
 * Atomically converts a lead into an account + contact (+ optional
 * opportunity) and marks the lead converted, all within one transaction.
 */

import { and, eq, isNull } from "drizzle-orm";

import { drizzleClient } from "../_drizzle/client";
import { accountTable } from "../_drizzle/schema/account";
import { contactTable } from "../_drizzle/schema/contact";
import { leadTable } from "../_drizzle/schema/lead";
import { opportunityTable } from "../_drizzle/schema/opportunity";

import { apiError } from "./http";

type ConvertParams = {
  id: string;
  organizationId: string;
  actorId?: string | null;
  createOpportunity?: boolean;
  opportunityName?: string;
  stageId?: string | null;
};

async function convertLead(params: ConvertParams) {
  return drizzleClient.transaction(async (tx) => {
    const rows = await tx
      .select()
      .from(leadTable)
      .where(
        and(
          eq(leadTable.id, params.id),
          eq(leadTable.organizationId, params.organizationId),
          isNull(leadTable.deletedAt),
        ),
      )
      .limit(1);

    const lead = rows[0];
    if (!lead) throw apiError.notFound("Lead not found.");
    if (lead.isConverted) throw apiError.conflict("Lead is already converted.");

    const base = {
      organizationId: params.organizationId,
      ownerId: lead.ownerId ?? params.actorId ?? null,
      createdById: params.actorId ?? null,
      updatedById: params.actorId ?? null,
    };

    const [account] = await tx
      .insert(accountTable)
      .values({
        ...base,
        name: lead.company,
        industry: lead.industry,
        phone: lead.phone,
        website: lead.website,
        annualRevenue: lead.annualRevenue,
        numberOfEmployees: lead.numberOfEmployees,
        billingStreet: lead.street,
        billingCity: lead.city,
        billingState: lead.state,
        billingPostalCode: lead.postalCode,
        billingCountry: lead.country,
      })
      .returning();

    const [contact] = await tx
      .insert(contactTable)
      .values({
        ...base,
        accountId: account.id,
        salutation: lead.salutation,
        firstName: lead.firstName,
        lastName: lead.lastName,
        title: lead.title,
        email: lead.email,
        phone: lead.phone,
        mobile: lead.mobile,
        leadSource: lead.leadSource,
      })
      .returning();

    let opportunity = null;
    if (params.createOpportunity !== false) {
      const [created] = await tx
        .insert(opportunityTable)
        .values({
          ...base,
          name: params.opportunityName || `${lead.company} - New Opportunity`,
          accountId: account.id,
          stageId: params.stageId ?? null,
          leadSource: lead.leadSource,
        })
        .returning();
      opportunity = created;
    }

    const [updatedLead] = await tx
      .update(leadTable)
      .set({
        isConverted: true,
        convertedAt: new Date(),
        convertedAccountId: account.id,
        convertedContactId: contact.id,
        convertedOpportunityId: opportunity?.id ?? null,
        status: "qualified",
        updatedById: params.actorId ?? null,
      })
      .where(eq(leadTable.id, lead.id))
      .returning();

    return { lead: updatedLead, account, contact, opportunity };
  });
}

export { convertLead };

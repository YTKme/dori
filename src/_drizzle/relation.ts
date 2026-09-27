/**
 * Relations (drizzle relations v2)
 *
 * Single source of truth registering every table for the `.query` API
 * and declaring the relations used by the data-access `expand` option.
 * Self-referential relations (parent/child hierarchies) are intentionally
 * omitted here — the foreign keys still enforce integrity and hierarchy
 * can be fetched explicitly when needed.
 *
 * https://orm.drizzle.team/docs/relations-v1-v2
 */

import { defineRelations } from "drizzle-orm";

import {
  betterauthMemberTable,
  betterauthOrganizationTable,
  betterauthUserTable,
} from "./schema/better-auth";
import { accountTable } from "./schema/account";
import { activityTable } from "./schema/activity";
import { campaignTable } from "./schema/campaign";
import { campaignMemberTable } from "./schema/campaign-member";
import { caseTable } from "./schema/case";
import { caseCommentTable } from "./schema/case-comment";
import { contactTable } from "./schema/contact";
import { leadTable } from "./schema/lead";
import { noteTable } from "./schema/note";
import { opportunityTable } from "./schema/opportunity";
import { opportunityContactRoleTable } from "./schema/opportunity-contact-role";
import { opportunityLineItemTable } from "./schema/opportunity-line-item";
import { opportunityStageTable } from "./schema/opportunity-stage";
import { personalAccessTokenTable } from "./schema/personal-access-token";
import { priceBookTable } from "./schema/price-book";
import { priceBookEntryTable } from "./schema/price-book-entry";
import { productTable } from "./schema/product";
import { quoteTable } from "./schema/quote";
import { quoteLineItemTable } from "./schema/quote-line-item";

const relation = defineRelations(
  {
    // Identity / tenancy
    betterauthUserTable,
    betterauthOrganizationTable,
    betterauthMemberTable,
    // CRM
    accountTable,
    contactTable,
    leadTable,
    opportunityStageTable,
    opportunityTable,
    opportunityContactRoleTable,
    productTable,
    priceBookTable,
    priceBookEntryTable,
    opportunityLineItemTable,
    quoteTable,
    quoteLineItemTable,
    caseTable,
    caseCommentTable,
    campaignTable,
    campaignMemberTable,
    activityTable,
    noteTable,
    personalAccessTokenTable,
  },
  (r) => ({
    /* Organization / Member */
    betterauthOrganizationTable: {
      memberList: r.many.betterauthMemberTable(),
    },
    betterauthMemberTable: {
      organization: r.one.betterauthOrganizationTable({
        from: r.betterauthMemberTable.organizationId,
        to: r.betterauthOrganizationTable.id,
      }),
      user: r.one.betterauthUserTable({
        from: r.betterauthMemberTable.userId,
        to: r.betterauthUserTable.id,
      }),
    },

    /* Account */
    accountTable: {
      owner: r.one.betterauthUserTable({
        from: r.accountTable.ownerId,
        to: r.betterauthUserTable.id,
      }),
      contactList: r.many.contactTable(),
      opportunityList: r.many.opportunityTable(),
      caseList: r.many.caseTable(),
      quoteList: r.many.quoteTable(),
      activityList: r.many.activityTable(),
      noteList: r.many.noteTable(),
    },

    /* Contact */
    contactTable: {
      owner: r.one.betterauthUserTable({
        from: r.contactTable.ownerId,
        to: r.betterauthUserTable.id,
      }),
      account: r.one.accountTable({
        from: r.contactTable.accountId,
        to: r.accountTable.id,
      }),
      opportunityContactRoleList: r.many.opportunityContactRoleTable(),
      campaignMemberList: r.many.campaignMemberTable(),
      activityList: r.many.activityTable(),
      noteList: r.many.noteTable(),
    },

    /* Lead */
    leadTable: {
      owner: r.one.betterauthUserTable({
        from: r.leadTable.ownerId,
        to: r.betterauthUserTable.id,
      }),
      convertedAccount: r.one.accountTable({
        from: r.leadTable.convertedAccountId,
        to: r.accountTable.id,
      }),
      convertedContact: r.one.contactTable({
        from: r.leadTable.convertedContactId,
        to: r.contactTable.id,
      }),
      convertedOpportunity: r.one.opportunityTable({
        from: r.leadTable.convertedOpportunityId,
        to: r.opportunityTable.id,
      }),
      campaignMemberList: r.many.campaignMemberTable(),
      activityList: r.many.activityTable(),
      noteList: r.many.noteTable(),
    },

    /* Opportunity Stage */
    opportunityStageTable: {
      opportunityList: r.many.opportunityTable(),
    },

    /* Opportunity */
    opportunityTable: {
      owner: r.one.betterauthUserTable({
        from: r.opportunityTable.ownerId,
        to: r.betterauthUserTable.id,
      }),
      account: r.one.accountTable({
        from: r.opportunityTable.accountId,
        to: r.accountTable.id,
      }),
      stage: r.one.opportunityStageTable({
        from: r.opportunityTable.stageId,
        to: r.opportunityStageTable.id,
      }),
      campaign: r.one.campaignTable({
        from: r.opportunityTable.campaignId,
        to: r.campaignTable.id,
      }),
      lineItemList: r.many.opportunityLineItemTable(),
      contactRoleList: r.many.opportunityContactRoleTable(),
      quoteList: r.many.quoteTable(),
      activityList: r.many.activityTable(),
      noteList: r.many.noteTable(),
    },

    /* Opportunity Contact Role */
    opportunityContactRoleTable: {
      opportunity: r.one.opportunityTable({
        from: r.opportunityContactRoleTable.opportunityId,
        to: r.opportunityTable.id,
      }),
      contact: r.one.contactTable({
        from: r.opportunityContactRoleTable.contactId,
        to: r.contactTable.id,
      }),
    },

    /* Product */
    productTable: {
      owner: r.one.betterauthUserTable({
        from: r.productTable.ownerId,
        to: r.betterauthUserTable.id,
      }),
      priceBookEntryList: r.many.priceBookEntryTable(),
    },

    /* Price Book */
    priceBookTable: {
      owner: r.one.betterauthUserTable({
        from: r.priceBookTable.ownerId,
        to: r.betterauthUserTable.id,
      }),
      entryList: r.many.priceBookEntryTable(),
    },

    /* Price Book Entry */
    priceBookEntryTable: {
      priceBook: r.one.priceBookTable({
        from: r.priceBookEntryTable.priceBookId,
        to: r.priceBookTable.id,
      }),
      product: r.one.productTable({
        from: r.priceBookEntryTable.productId,
        to: r.productTable.id,
      }),
    },

    /* Opportunity Line Item */
    opportunityLineItemTable: {
      opportunity: r.one.opportunityTable({
        from: r.opportunityLineItemTable.opportunityId,
        to: r.opportunityTable.id,
      }),
      product: r.one.productTable({
        from: r.opportunityLineItemTable.productId,
        to: r.productTable.id,
      }),
      priceBookEntry: r.one.priceBookEntryTable({
        from: r.opportunityLineItemTable.priceBookEntryId,
        to: r.priceBookEntryTable.id,
      }),
    },

    /* Quote */
    quoteTable: {
      owner: r.one.betterauthUserTable({
        from: r.quoteTable.ownerId,
        to: r.betterauthUserTable.id,
      }),
      opportunity: r.one.opportunityTable({
        from: r.quoteTable.opportunityId,
        to: r.opportunityTable.id,
      }),
      account: r.one.accountTable({
        from: r.quoteTable.accountId,
        to: r.accountTable.id,
      }),
      contact: r.one.contactTable({
        from: r.quoteTable.contactId,
        to: r.contactTable.id,
      }),
      lineItemList: r.many.quoteLineItemTable(),
    },

    /* Quote Line Item */
    quoteLineItemTable: {
      quote: r.one.quoteTable({
        from: r.quoteLineItemTable.quoteId,
        to: r.quoteTable.id,
      }),
      product: r.one.productTable({
        from: r.quoteLineItemTable.productId,
        to: r.productTable.id,
      }),
    },

    /* Case */
    caseTable: {
      owner: r.one.betterauthUserTable({
        from: r.caseTable.ownerId,
        to: r.betterauthUserTable.id,
      }),
      account: r.one.accountTable({
        from: r.caseTable.accountId,
        to: r.accountTable.id,
      }),
      contact: r.one.contactTable({
        from: r.caseTable.contactId,
        to: r.contactTable.id,
      }),
      commentList: r.many.caseCommentTable(),
      activityList: r.many.activityTable(),
      noteList: r.many.noteTable(),
    },

    /* Case Comment */
    caseCommentTable: {
      case: r.one.caseTable({
        from: r.caseCommentTable.caseId,
        to: r.caseTable.id,
      }),
    },

    /* Campaign */
    campaignTable: {
      owner: r.one.betterauthUserTable({
        from: r.campaignTable.ownerId,
        to: r.betterauthUserTable.id,
      }),
      memberList: r.many.campaignMemberTable(),
      opportunityList: r.many.opportunityTable(),
    },

    /* Campaign Member */
    campaignMemberTable: {
      campaign: r.one.campaignTable({
        from: r.campaignMemberTable.campaignId,
        to: r.campaignTable.id,
      }),
      lead: r.one.leadTable({
        from: r.campaignMemberTable.leadId,
        to: r.leadTable.id,
      }),
      contact: r.one.contactTable({
        from: r.campaignMemberTable.contactId,
        to: r.contactTable.id,
      }),
    },

    /* Activity */
    activityTable: {
      owner: r.one.betterauthUserTable({
        from: r.activityTable.ownerId,
        to: r.betterauthUserTable.id,
      }),
      account: r.one.accountTable({
        from: r.activityTable.accountId,
        to: r.accountTable.id,
      }),
      contact: r.one.contactTable({
        from: r.activityTable.contactId,
        to: r.contactTable.id,
      }),
      lead: r.one.leadTable({
        from: r.activityTable.leadId,
        to: r.leadTable.id,
      }),
      opportunity: r.one.opportunityTable({
        from: r.activityTable.opportunityId,
        to: r.opportunityTable.id,
      }),
      case: r.one.caseTable({
        from: r.activityTable.caseId,
        to: r.caseTable.id,
      }),
      campaign: r.one.campaignTable({
        from: r.activityTable.campaignId,
        to: r.campaignTable.id,
      }),
    },

    /* Note */
    noteTable: {
      owner: r.one.betterauthUserTable({
        from: r.noteTable.ownerId,
        to: r.betterauthUserTable.id,
      }),
      account: r.one.accountTable({
        from: r.noteTable.accountId,
        to: r.accountTable.id,
      }),
      contact: r.one.contactTable({
        from: r.noteTable.contactId,
        to: r.contactTable.id,
      }),
      lead: r.one.leadTable({
        from: r.noteTable.leadId,
        to: r.leadTable.id,
      }),
      opportunity: r.one.opportunityTable({
        from: r.noteTable.opportunityId,
        to: r.opportunityTable.id,
      }),
      case: r.one.caseTable({
        from: r.noteTable.caseId,
        to: r.caseTable.id,
      }),
    },

    /* Personal Access Token */
    personalAccessTokenTable: {
      owner: r.one.betterauthUserTable({
        from: r.personalAccessTokenTable.ownerId,
        to: r.betterauthUserTable.id,
      }),
    },
  }),
);

export { relation };

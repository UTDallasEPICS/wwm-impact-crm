// importer/handlerMap.ts

import { normalizeName } from "./utils/normalize";

import {
  handleConstituents,
  handleAddresses,
  handleEmails,
  handlePhones,
  handleDonations,
  handleSoftCredits,
  handleNotes,
  handleTasks,
  handleInteractions,
  handleWalletItems,
  handleRecurringDonations,
  handleRecurringDonationPayments,
  handleRefunds,
  handleFunds,
  handleCampaigns,
  handleAppeals,
  handlePledges,
  handlePledgePayments,
  handleTributes,
  handleRelationships,
  handleRelationshipRoles,
  handleFileAttachments,
  handleProcessingInfos,
  handleEmailInterests,
  handleCustomFields,
  handleCustomValues,
  handleHouseholds,
  handleHouseholdMembers,
  handleTransactionProcessorAccounts,
  handleTransactions
} from "./handlers";

export const handlerMap = {
  constituents: handleConstituents,
  addresses: handleAddresses,
  emails: handleEmails,
  phones: handlePhones,
  donations: handleDonations,
  softcredits: handleSoftCredits,
  notes: handleNotes,
  tasks: handleTasks,
  interactions: handleInteractions,
  walletitems: handleWalletItems,
  recurringdonations: handleRecurringDonations,
  recurringdonationpayments: handleRecurringDonationPayments,
  refunds: handleRefunds,
  funds: handleFunds,
  campaigns: handleCampaigns,
  appeals: handleAppeals,
  pledges: handlePledges,
  pledgepayments: handlePledgePayments,
  tributes: handleTributes,
  relationships: handleRelationships,
  relationshiproles: handleRelationshipRoles,
  fileattachments: handleFileAttachments,
  processinginfos: handleProcessingInfos,
  emailinterests: handleEmailInterests,
  customfields: handleCustomFields,
  customvalues: handleCustomValues,
  households: handleHouseholds,
  householdmembers: handleHouseholdMembers,
  transactionprocessoraccounts: handleTransactionProcessorAccounts,
  transactions: handleTransactions,
};

export function getHandler(filename: string) {
  const name = normalizeName(filename);
  return handlerMap[name];
}

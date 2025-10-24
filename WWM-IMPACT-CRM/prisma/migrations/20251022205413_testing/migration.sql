/*
  Warnings:

  - The primary key for the `Campaign` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Donation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `Donation` table. All the data in the column will be lost.
  - The primary key for the `Donor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Fund` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `constituentId` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Constituent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountNumber" TEXT NOT NULL,
    "type" TEXT,
    "status" TEXT,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "fullName" TEXT,
    "informalName" TEXT,
    "formalName" TEXT,
    "recognitionName" TEXT,
    "sortName" TEXT,
    "prefix" TEXT,
    "suffix" TEXT,
    "birthdate" DATETIME,
    "gender" TEXT,
    "jobTitle" TEXT,
    "employer" TEXT,
    "website" TEXT,
    "facebookId" TEXT,
    "twitterId" TEXT,
    "linkedInId" TEXT,
    "envelopeName" TEXT,
    "communicationChannelPreferred" TEXT,
    "emailInterestIsActive" BOOLEAN,
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT,
    "createdDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT
);

-- CreateTable
CREATE TABLE "Household" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "fullName" TEXT,
    "informalName" TEXT,
    "formalName" TEXT,
    "recognitionName" TEXT,
    "sortName" TEXT,
    "status" TEXT,
    "headId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "HouseholdMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "householdId" TEXT NOT NULL,
    "constituentId" TEXT NOT NULL,
    "role" TEXT,
    CONSTRAINT "HouseholdMember_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HouseholdMember_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "constituentId" TEXT NOT NULL,
    "type" TEXT,
    "value" TEXT NOT NULL,
    "isPrimary" BOOLEAN DEFAULT false,
    "isBad" BOOLEAN DEFAULT false,
    "createdName" TEXT,
    "lastModifiedName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Email_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Phone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "constituentId" TEXT NOT NULL,
    "type" TEXT,
    "number" TEXT NOT NULL,
    "extension" TEXT,
    "isPrimary" BOOLEAN DEFAULT false,
    CONSTRAINT "Phone_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "constituentId" TEXT NOT NULL,
    "type" TEXT,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "county" TEXT,
    "country" TEXT,
    "isPrimary" BOOLEAN DEFAULT false,
    "isBad" BOOLEAN DEFAULT false,
    CONSTRAINT "Address_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Appeal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Appeal_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Designation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "ProcessingInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "donationId" TEXT NOT NULL,
    "token" TEXT,
    "amount" INTEGER,
    "transactionNumber" INTEGER,
    "transactionProcessorAccountNumber" INTEGER,
    CONSTRAINT "ProcessingInfo_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT,
    "note" TEXT,
    "donationId" TEXT NOT NULL,
    "constituentId" TEXT NOT NULL,
    CONSTRAINT "Refund_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Refund_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pledge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "constituentId" TEXT NOT NULL,
    "fundId" TEXT,
    "amount" INTEGER NOT NULL,
    "frequency" TEXT NOT NULL,
    "firstInstallmentDate" DATETIME NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    "acknowledgmentStatus" BOOLEAN,
    CONSTRAINT "Pledge_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Pledge_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PledgePayment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pledgeId" TEXT NOT NULL,
    "donationId" TEXT,
    "amount" INTEGER NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT,
    "nonDeductible" INTEGER,
    "referenceDesignationNumber" INTEGER,
    "note" TEXT,
    CONSTRAINT "PledgePayment_pledgeId_fkey" FOREIGN KEY ("pledgeId") REFERENCES "Pledge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PledgePayment_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecurringDonation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "constituentId" TEXT NOT NULL,
    "fundId" TEXT,
    "designationId" TEXT,
    "amount" INTEGER NOT NULL,
    "frequency" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    CONSTRAINT "RecurringDonation_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecurringDonation_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RecurringDonation_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecurringDonationPayment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recurringId" TEXT NOT NULL,
    "donationId" TEXT,
    "amount" INTEGER NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT,
    "nonDeductible" INTEGER,
    "referenceDesignationNumber" INTEGER,
    "note" TEXT,
    CONSTRAINT "RecurringDonationPayment_recurringId_fkey" FOREIGN KEY ("recurringId") REFERENCES "RecurringDonation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecurringDonationPayment_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SoftCredit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "donationId" TEXT NOT NULL,
    "creditedToId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    "acknowledged" BOOLEAN DEFAULT false,
    "reference" INTEGER,
    CONSTRAINT "SoftCredit_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SoftCredit_creditedToId_fkey" FOREIGN KEY ("creditedToId") REFERENCES "Constituent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FileAttachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "createdDateUtc" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "designationNumber" INTEGER,
    "interactionId" TEXT,
    "noteId" TEXT,
    "taskId" TEXT,
    "transactionNumber" INTEGER,
    "constituentId" TEXT,
    "donationId" TEXT,
    "interactionLinkId" TEXT,
    "taskLinkId" TEXT,
    CONSTRAINT "FileAttachment_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FileAttachment_interactionLinkId_fkey" FOREIGN KEY ("interactionLinkId") REFERENCES "Interaction" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FileAttachment_taskLinkId_fkey" FOREIGN KEY ("taskLinkId") REFERENCES "Task" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FileAttachment_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "constituentId" TEXT NOT NULL,
    "subject" TEXT,
    "channel" TEXT,
    "type" TEXT,
    "status" TEXT,
    "date" DATETIME,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT,
    "purpose" TEXT,
    "readinessForAsk" TEXT,
    "reasonForInterest" TEXT,
    "invitedBy" TEXT,
    "askAmount" INTEGER,
    "askByWhen" DATETIME,
    "teamLeader" TEXT,
    "tableCaptains" TEXT,
    "levelsOfInterest" TEXT,
    "inbound" BOOLEAN,
    CONSTRAINT "Interaction_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ambassadors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "interactionId" TEXT NOT NULL,
    CONSTRAINT "Ambassadors_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "constituentId" TEXT,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "shouldApplySoftCredit" BOOLEAN DEFAULT false,
    "status" TEXT,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedDate" DATETIME,
    CONSTRAINT "Task_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tribute" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "note" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "notificants" INTEGER,
    "constituentId" TEXT NOT NULL,
    CONSTRAINT "Tribute_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TributeHonor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tributeId" TEXT NOT NULL,
    "constituentId" TEXT NOT NULL,
    "note" TEXT,
    CONSTRAINT "TributeHonor_tributeId_fkey" FOREIGN KEY ("tributeId") REFERENCES "Tribute" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TributeHonor_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WalletItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "constituentId" TEXT NOT NULL,
    "designationNumber" INTEGER,
    "creditCardType" TEXT,
    "creditCardNumberMasked" TEXT,
    "creditCardExpiration" DATETIME,
    "eftAccountType" TEXT,
    "eftAccountNumberMasked" TEXT,
    "eftRoutingNumberMasked" TEXT,
    "paymentMethodToken" TEXT,
    CONSTRAINT "WalletItem_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TransactionProcessorAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "stripeAccountId" TEXT,
    "appliesTo" TEXT,
    "categoryName" TEXT,
    "dataType" TEXT,
    "type" TEXT
);

-- CreateTable
CREATE TABLE "EmailInterest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "constituentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailInterest_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "appliesTo" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "picklist" JSONB,
    "helpText" TEXT
);

-- CreateTable
CREATE TABLE "CustomValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fieldId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "valueString" TEXT,
    "valueInt" INTEGER,
    "valueFloat" REAL,
    "valueBool" BOOLEAN,
    "valueDate" DATETIME,
    "valueJson" JSONB,
    CONSTRAINT "CustomValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "CustomField" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "isActive" BOOLEAN DEFAULT true
);
INSERT INTO "new_Campaign" ("endDate", "id", "name", "startDate") SELECT "endDate", "id", "name", "startDate" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE TABLE "new_Donation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionNumber" INTEGER,
    "constituentId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "nonDeductible" INTEGER,
    "method" TEXT,
    "inKindType" TEXT,
    "inKindDescription" TEXT,
    "inKindMarketValue" INTEGER,
    "campaignId" TEXT,
    "appealId" TEXT,
    "fundId" TEXT,
    "designationId" TEXT,
    "donorId" TEXT NOT NULL,
    "interactionLinkId" TEXT,
    "tributeId" TEXT,
    "processorAccountId" TEXT,
    "acknowledgmentStatus" BOOLEAN,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT,
    "note" TEXT,
    "isCompanyMatch" BOOLEAN DEFAULT false,
    "paymentToken" TEXT,
    CONSTRAINT "Donation_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Donation_appealId_fkey" FOREIGN KEY ("appealId") REFERENCES "Appeal" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Donation_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Donation_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Donation_tributeId_fkey" FOREIGN KEY ("tributeId") REFERENCES "Tribute" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Donation_interactionLinkId_fkey" FOREIGN KEY ("interactionLinkId") REFERENCES "Interaction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Donation" ("amount", "campaignId", "donorId", "fundId", "id") SELECT "amount", "campaignId", "donorId", "fundId", "id" FROM "Donation";
DROP TABLE "Donation";
ALTER TABLE "new_Donation" RENAME TO "Donation";
CREATE UNIQUE INDEX "Donation_transactionNumber_key" ON "Donation"("transactionNumber");
CREATE INDEX "Donation_constituentId_idx" ON "Donation"("constituentId");
CREATE INDEX "Donation_campaignId_appealId_fundId_designationId_idx" ON "Donation"("campaignId", "appealId", "fundId", "designationId");
CREATE TABLE "new_Donor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "Donor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Donor" ("email", "firstName", "id", "lastName", "organizationId") SELECT "email", "firstName", "id", "lastName", "organizationId" FROM "Donor";
DROP TABLE "Donor";
ALTER TABLE "new_Donor" RENAME TO "Donor";
CREATE UNIQUE INDEX "Donor_organizationId_email_key" ON "Donor"("organizationId", "email");
CREATE TABLE "new_Fund" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "isDefault" BOOLEAN DEFAULT false,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "Fund_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Fund" ("id", "name", "organizationId") SELECT "id", "name", "organizationId" FROM "Fund";
DROP TABLE "Fund";
ALTER TABLE "new_Fund" RENAME TO "Fund";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Constituent_accountNumber_key" ON "Constituent"("accountNumber");

-- CreateIndex
CREATE INDEX "HouseholdMember_constituentId_idx" ON "HouseholdMember"("constituentId");

-- CreateIndex
CREATE UNIQUE INDEX "HouseholdMember_householdId_constituentId_key" ON "HouseholdMember"("householdId", "constituentId");

-- CreateIndex
CREATE INDEX "Email_constituentId_idx" ON "Email"("constituentId");

-- CreateIndex
CREATE INDEX "Phone_constituentId_idx" ON "Phone"("constituentId");

-- CreateIndex
CREATE INDEX "Address_constituentId_idx" ON "Address"("constituentId");

-- CreateIndex
CREATE INDEX "Appeal_campaignId_idx" ON "Appeal"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Designation_number_key" ON "Designation"("number");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessingInfo_donationId_key" ON "ProcessingInfo"("donationId");

-- CreateIndex
CREATE INDEX "Refund_donationId_idx" ON "Refund"("donationId");

-- CreateIndex
CREATE INDEX "Pledge_constituentId_idx" ON "Pledge"("constituentId");

-- CreateIndex
CREATE INDEX "PledgePayment_pledgeId_idx" ON "PledgePayment"("pledgeId");

-- CreateIndex
CREATE INDEX "PledgePayment_donationId_idx" ON "PledgePayment"("donationId");

-- CreateIndex
CREATE INDEX "RecurringDonation_constituentId_idx" ON "RecurringDonation"("constituentId");

-- CreateIndex
CREATE INDEX "RecurringDonationPayment_recurringId_idx" ON "RecurringDonationPayment"("recurringId");

-- CreateIndex
CREATE INDEX "RecurringDonationPayment_donationId_idx" ON "RecurringDonationPayment"("donationId");

-- CreateIndex
CREATE INDEX "SoftCredit_donationId_idx" ON "SoftCredit"("donationId");

-- CreateIndex
CREATE INDEX "SoftCredit_creditedToId_idx" ON "SoftCredit"("creditedToId");

-- CreateIndex
CREATE INDEX "FileAttachment_donationId_idx" ON "FileAttachment"("donationId");

-- CreateIndex
CREATE INDEX "FileAttachment_interactionLinkId_idx" ON "FileAttachment"("interactionLinkId");

-- CreateIndex
CREATE INDEX "FileAttachment_taskLinkId_idx" ON "FileAttachment"("taskLinkId");

-- CreateIndex
CREATE INDEX "Interaction_constituentId_idx" ON "Interaction"("constituentId");

-- CreateIndex
CREATE INDEX "TributeHonor_tributeId_idx" ON "TributeHonor"("tributeId");

-- CreateIndex
CREATE INDEX "TributeHonor_constituentId_idx" ON "TributeHonor"("constituentId");

-- CreateIndex
CREATE INDEX "WalletItem_constituentId_idx" ON "WalletItem"("constituentId");

-- CreateIndex
CREATE INDEX "EmailInterest_constituentId_idx" ON "EmailInterest"("constituentId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomField_name_appliesTo_key" ON "CustomField"("name", "appliesTo");

-- CreateIndex
CREATE INDEX "CustomValue_entityType_entityId_idx" ON "CustomValue"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomValue_fieldId_entityType_entityId_key" ON "CustomValue"("fieldId", "entityType", "entityId");

-- CreateTable
CREATE TABLE "BloomerangUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STANDARD',
    "accountNum" TEXT NOT NULL,
    "note" TEXT,
    "purpose" TEXT,
    "transactions" INTEGER,
    "inbound" BOOLEAN,
    "subject" TEXT,
    "channel" TEXT,
    "reasonForInterest" TEXT,
    "level" TEXT,
    "createdDate" DATETIME,
    "createdName" TEXT,
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT,
    "askAmounts" INTEGER,
    "country" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "language" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "sortName" TEXT,
    "timeZone" TEXT
);

-- CreateTable
CREATE TABLE "user" (
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL PRIMARY KEY,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Donor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "constituentId" TEXT NOT NULL,
    CONSTRAINT "Donor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Donor_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'CUSTOM',
    "config" JSONB NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Report_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BloomerangUserOrganization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "BloomerangUserOrganization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BloomerangUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BloomerangUserOrganization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fund" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "isDefault" BOOLEAN DEFAULT false,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "Fund_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "accountNumber" TEXT NOT NULL,
    "name" TEXT,
    "fullName" TEXT,
    "informalName" TEXT,
    "formalName" TEXT,
    "envelopeName" TEXT,
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
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "isActive" BOOLEAN DEFAULT true
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
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionNumber" INTEGER,
    "amount" REAL NOT NULL,
    "nonDeductible" INTEGER,
    "method" TEXT,
    "inKindType" TEXT,
    "inKindDescription" TEXT,
    "inKindMarketValue" INTEGER,
    "checkDate" DATETIME,
    "checkNumber" TEXT,
    "date" DATETIME,
    "campaignId" TEXT,
    "appealId" TEXT,
    "fundId" TEXT,
    "designationId" TEXT,
    "donorId" TEXT NOT NULL,
    "interactionLinkId" TEXT,
    "tributeId" TEXT,
    "processorAccountId" TEXT,
    "constituentId" TEXT NOT NULL,
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
    "date" DATETIME,
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
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT,
    "acknowledgmentStatus" BOOLEAN,
    "note" TEXT,
    CONSTRAINT "Pledge_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Pledge_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PledgePayment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pledgeId" TEXT NOT NULL,
    "donationId" TEXT,
    "transactionNumber" INTEGER,
    "amount" INTEGER NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT,
    "nonDeductible" INTEGER,
    "referenceDesignationNumber" INTEGER,
    "acknowledgmentStatus" BOOLEAN,
    "checkDate" DATETIME,
    "checkNumber" TEXT,
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
    "note" TEXT,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT,
    "acknowledgmentStatus" BOOLEAN,
    CONSTRAINT "RecurringDonation_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecurringDonation_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RecurringDonation_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecurringDonationPayment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recurringId" TEXT NOT NULL,
    "donationId" TEXT,
    "transactionNumber" INTEGER,
    "amount" INTEGER NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT,
    "nonDeductible" INTEGER,
    "referenceDesignationNumber" INTEGER,
    "acknowledgmentStatus" BOOLEAN,
    "note" TEXT,
    CONSTRAINT "RecurringDonationPayment_recurringId_fkey" FOREIGN KEY ("recurringId") REFERENCES "RecurringDonation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecurringDonationPayment_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountNumber1" TEXT NOT NULL,
    "accountNumber2" TEXT NOT NULL,
    "role1" TEXT,
    "role2" TEXT,
    "relationshipRole" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT
);

-- CreateTable
CREATE TABLE "SoftCredit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "donationId" TEXT NOT NULL,
    "interactionId" TEXT,
    "creditedToId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "designationNumber" INTEGER,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT,
    "acknowledged" BOOLEAN DEFAULT false,
    "reference" INTEGER,
    "note" TEXT,
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
    "askers" TEXT,
    "askAmount" INTEGER,
    "askByWhen" DATETIME,
    "teamLeader" TEXT,
    "tableCaptains" TEXT,
    "levelsOfInterest" TEXT,
    "inbound" BOOLEAN,
    "note" TEXT,
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
CREATE TABLE "Bucket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "interactionId" TEXT NOT NULL,
    CONSTRAINT "Bucket_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "constituentId" TEXT,
    "note" TEXT NOT NULL,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    CONSTRAINT "Note_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "constituentId" TEXT,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "note" TEXT,
    "shouldApplySoftCredit" BOOLEAN DEFAULT false,
    "status" BOOLEAN,
    "eventStatus" TEXT,
    "eventType" TEXT,
    "purpose" TEXT,
    "subject" TEXT,
    "ambassador" TEXT,
    "askers" TEXT,
    "askAmount" INTEGER,
    "buckets" TEXT,
    "channel" TEXT,
    "invitedBy" TEXT,
    "levelsOfInterest" TEXT,
    "readinessForAsk" TEXT,
    "teamLeader" TEXT,
    "tableCaptains" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "userName" TEXT,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdName" TEXT,
    "lastModifiedDate" DATETIME,
    "lastModifiedName" TEXT,
    "completedDate" DATETIME,
    "date" DATETIME,
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

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "BloomerangUser_email_key" ON "BloomerangUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BloomerangUser_accountNum_key" ON "BloomerangUser"("accountNum");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_constituentId_key" ON "Donor"("constituentId");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_organizationId_email_key" ON "Donor"("organizationId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "BloomerangUserOrganization_userId_organizationId_key" ON "BloomerangUserOrganization"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Constituent_accountNumber_key" ON "Constituent"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Household_accountNumber_key" ON "Household"("accountNumber");

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
CREATE UNIQUE INDEX "Donation_transactionNumber_key" ON "Donation"("transactionNumber");

-- CreateIndex
CREATE INDEX "Donation_constituentId_idx" ON "Donation"("constituentId");

-- CreateIndex
CREATE INDEX "Donation_campaignId_appealId_fundId_designationId_idx" ON "Donation"("campaignId", "appealId", "fundId", "designationId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessingInfo_donationId_key" ON "ProcessingInfo"("donationId");

-- CreateIndex
CREATE INDEX "Refund_donationId_idx" ON "Refund"("donationId");

-- CreateIndex
CREATE INDEX "Refund_constituentId_idx" ON "Refund"("constituentId");

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
CREATE INDEX "Relationship_accountNumber1_idx" ON "Relationship"("accountNumber1");

-- CreateIndex
CREATE INDEX "Relationship_accountNumber2_idx" ON "Relationship"("accountNumber2");

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
CREATE INDEX "Ambassadors_interactionId_idx" ON "Ambassadors"("interactionId");

-- CreateIndex
CREATE INDEX "Bucket_interactionId_idx" ON "Bucket"("interactionId");

-- CreateIndex
CREATE INDEX "Note_constituentId_idx" ON "Note"("constituentId");

-- CreateIndex
CREATE INDEX "Task_constituentId_idx" ON "Task"("constituentId");

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

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

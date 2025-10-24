/*
  Warnings:

  - Added the required column `constituentId` to the `Donor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountNum` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `askAmounts` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Donor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "constituentId" TEXT NOT NULL,
    CONSTRAINT "Donor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Donor_constituentId_fkey" FOREIGN KEY ("constituentId") REFERENCES "Constituent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Donor" ("email", "firstName", "id", "lastName", "organizationId") SELECT "email", "firstName", "id", "lastName", "organizationId" FROM "Donor";
DROP TABLE "Donor";
ALTER TABLE "new_Donor" RENAME TO "Donor";
CREATE UNIQUE INDEX "Donor_constituentId_key" ON "Donor"("constituentId");
CREATE UNIQUE INDEX "Donor_organizationId_email_key" ON "Donor"("organizationId", "email");
CREATE TABLE "new_User" (
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
    "askAmounts" INTEGER NOT NULL
);
INSERT INTO "new_User" ("email", "id", "password", "role", "username") SELECT "email", "id", "password", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_accountNum_key" ON "User"("accountNum");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

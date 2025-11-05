-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STANDARD',
    "accountNum" TEXT,
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
INSERT INTO "new_User" ("accountNum", "askAmounts", "channel", "country", "createdDate", "createdName", "email", "id", "inbound", "isActive", "language", "lastModifiedDate", "lastModifiedName", "level", "name", "note", "password", "phone", "purpose", "reasonForInterest", "role", "sortName", "subject", "timeZone", "transactions", "username") SELECT "accountNum", "askAmounts", "channel", "country", "createdDate", "createdName", "email", "id", "inbound", "isActive", "language", "lastModifiedDate", "lastModifiedName", "level", "name", "note", "password", "phone", "purpose", "reasonForInterest", "role", "sortName", "subject", "timeZone", "transactions", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_accountNum_key" ON "User"("accountNum");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

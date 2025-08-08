/*
  Warnings:

  - You are about to drop the column `content` on the `Cv` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Biography" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    CONSTRAINT "Biography_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    CONSTRAINT "Skill_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "description" TEXT,
    "cvId" TEXT NOT NULL,
    CONSTRAINT "Education_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "cvId" TEXT NOT NULL,
    CONSTRAINT "Project_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "description" TEXT,
    "cvId" TEXT NOT NULL,
    CONSTRAINT "WorkExperience_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Cv" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cv" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Cv_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cv" ("createdAt", "id", "title", "updatedAt", "userId") SELECT "createdAt", "id", "title", "updatedAt", "userId" FROM "Cv";
DROP TABLE "Cv";
ALTER TABLE "new_Cv" RENAME TO "Cv";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Biography_cvId_key" ON "Biography"("cvId");

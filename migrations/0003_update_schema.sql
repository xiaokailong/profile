-- Migration: Update schema - Add gender field, remove linkedin and blog fields
-- Description: 
-- 1. Add gender field (required)
-- 2. Remove linkedin field
-- 3. Remove blog field

-- Step 1: Create new table with updated structure
CREATE TABLE "Profile_new" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL UNIQUE,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "title" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "gender" TEXT NOT NULL DEFAULT '男',
    "avatar" TEXT,
    "summary" TEXT,
    "github" TEXT,
    "website" TEXT,
    "skills" TEXT,
    "experiences" TEXT,
    "education" TEXT,
    "projects" TEXT,
    "certifications" TEXT,
    "languages" TEXT
);

-- Step 2: Migrate existing data (linkedin and blog fields are dropped, gender defaults to '男')
INSERT INTO "Profile_new" (
    id, userId, createdAt, updatedAt, name, nameEn, title, email, phone, location,
    gender, avatar, summary, github, website, skills, experiences,
    education, projects, certifications, languages
)
SELECT 
    id, userId, createdAt, updatedAt, name, nameEn, title, email, phone, location,
    '男', avatar, summary, github, website, skills, experiences,
    education, projects, certifications, languages
FROM "Profile";

-- Step 3: Drop old table
DROP TABLE "Profile";

-- Step 4: Rename new table
ALTER TABLE "Profile_new" RENAME TO "Profile";

-- Step 5: Create index on userId for fast lookup
CREATE INDEX "Profile_userId_idx" ON "Profile"("userId");

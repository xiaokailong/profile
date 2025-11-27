-- Migration: Add userId field and convert id to auto-increment
-- Step 1: Create new table with improved structure

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
    "avatar" TEXT,
    "summary" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "website" TEXT,
    "blog" TEXT,
    "skills" TEXT,
    "experiences" TEXT,
    "education" TEXT,
    "projects" TEXT,
    "certifications" TEXT,
    "languages" TEXT
);

-- Step 2: Migrate existing data (id becomes userId)
INSERT INTO "Profile_new" (
    userId, createdAt, updatedAt, name, nameEn, title, email, phone, location, 
    avatar, summary, github, linkedin, website, blog, skills, experiences, 
    education, projects, certifications, languages
)
SELECT 
    id, createdAt, updatedAt, name, nameEn, title, email, phone, location,
    avatar, summary, github, linkedin, website, blog, skills, experiences,
    education, projects, certifications, languages
FROM "Profile";

-- Step 3: Drop old table
DROP TABLE "Profile";

-- Step 4: Rename new table
ALTER TABLE "Profile_new" RENAME TO "Profile";

-- Step 5: Create index on userId for fast lookup
CREATE INDEX "Profile_userId_idx" ON "Profile"("userId");

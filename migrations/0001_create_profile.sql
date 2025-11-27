-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
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

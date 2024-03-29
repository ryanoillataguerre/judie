/*
  Warnings:

  - You are about to drop the column `grade_year` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Purpose" AS ENUM ('PERSONAL', 'TEST_PREP', 'CLASSES', 'HOMESCHOOLING');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "grade_year";

-- CreateTable
CREATE TABLE "user_profiles" (
    "purpose" "Purpose",
    "prep_for_test" TEXT,
    "grade_year" "GradeYear",
    "country" TEXT,
    "state" TEXT,
    "subjects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_profiles_user_id_idx" ON "user_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_id_email_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "password",
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

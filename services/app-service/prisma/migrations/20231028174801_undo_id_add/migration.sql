/*
  Warnings:

  - You are about to drop the column `id` on the `user_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "id",
ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_id");

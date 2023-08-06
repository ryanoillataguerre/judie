/*
  Warnings:

  - Made the column `organization_id` on table `rooms` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_organization_id_fkey";

-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "organization_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

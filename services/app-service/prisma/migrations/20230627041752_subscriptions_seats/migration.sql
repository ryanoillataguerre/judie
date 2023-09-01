-- AlterEnum
ALTER TYPE "SubscriptionType" ADD VALUE 'SEAT';

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "organization_id" TEXT,
ALTER COLUMN "stripe_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

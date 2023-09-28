-- DropIndex
DROP INDEX "users_id_email_idx";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

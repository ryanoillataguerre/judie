-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('EMAIL_PASS', 'GOOGLE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'EMAIL_PASS';

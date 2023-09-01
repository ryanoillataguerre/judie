-- AlterTable
ALTER TABLE "users" ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "parental_consent" BOOLEAN,
ADD COLUMN     "parental_consent_email" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

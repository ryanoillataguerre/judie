-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMINISTRATOR', 'TEACHER', 'STUDENT', 'JUDIE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "district" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT';

-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('TUTOR', 'LESSON', 'PRACTICE');

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "mode" "Mode" DEFAULT 'TUTOR';

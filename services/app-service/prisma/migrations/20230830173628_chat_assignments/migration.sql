-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "tags" TEXT[];

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assignments_id_chat_id_idx" ON "assignments"("id", "chat_id");

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

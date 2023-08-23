-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "chat_folder_id" TEXT;

-- CreateTable
CREATE TABLE "chat_folders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "chat_folders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chat_folders_id_user_id_idx" ON "chat_folders"("id", "user_id");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_chat_folder_id_fkey" FOREIGN KEY ("chat_folder_id") REFERENCES "chat_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_folders" ADD CONSTRAINT "chat_folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

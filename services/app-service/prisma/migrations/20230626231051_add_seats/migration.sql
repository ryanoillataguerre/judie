-- CreateTable
CREATE TABLE "seats" (
    "id" TEXT NOT NULL,
    "school_id" TEXT,
    "organization_id" TEXT,
    "count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "seats_id_school_id_organization_id_idx" ON "seats"("id", "school_id", "organization_id");

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

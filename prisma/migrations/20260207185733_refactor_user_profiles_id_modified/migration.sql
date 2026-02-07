-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_id_fkey";

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

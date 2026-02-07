/*
  Warnings:

  - You are about to drop the column `userId` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Teacher` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_userId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- DropIndex
DROP INDEX "Parent_userId_key";

-- DropIndex
DROP INDEX "Student_userId_key";

-- DropIndex
DROP INDEX "Teacher_userId_key";

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

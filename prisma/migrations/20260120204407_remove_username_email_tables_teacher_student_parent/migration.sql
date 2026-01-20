/*
  Warnings:

  - You are about to drop the column `email` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Teacher` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Parent_email_key";

-- DropIndex
DROP INDEX "Parent_username_key";

-- DropIndex
DROP INDEX "Student_email_key";

-- DropIndex
DROP INDEX "Student_username_key";

-- DropIndex
DROP INDEX "Teacher_email_key";

-- DropIndex
DROP INDEX "Teacher_username_key";

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "email",
DROP COLUMN "username";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "email",
DROP COLUMN "username";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "email",
DROP COLUMN "username";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "studentId" TEXT,
ADD COLUMN     "teacherId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

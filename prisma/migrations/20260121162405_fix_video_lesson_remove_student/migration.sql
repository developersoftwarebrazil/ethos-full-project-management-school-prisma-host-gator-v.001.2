/*
  Warnings:

  - You are about to drop the column `studentId` on the `VideoLesson` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "VideoLesson" DROP CONSTRAINT "VideoLesson_studentId_fkey";

-- AlterTable
ALTER TABLE "VideoLesson" DROP COLUMN "studentId";

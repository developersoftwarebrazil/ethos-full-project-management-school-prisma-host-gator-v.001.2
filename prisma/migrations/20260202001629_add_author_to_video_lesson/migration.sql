/*
  Warnings:

  - Added the required column `authorId` to the `VideoLesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorName` to the `VideoLesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorRole` to the `VideoLesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoLesson" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "authorName" TEXT NOT NULL,
ADD COLUMN     "authorRole" TEXT NOT NULL;

/*
  Warnings:

  - Added the required column `videoUrl` to the `VideoLesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoLesson" ADD COLUMN     "videoUrl" TEXT NOT NULL;

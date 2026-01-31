/*
  Warnings:

  - You are about to alter the column `duration` on the `VideoLesson` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "VideoLesson" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "duration" SET DATA TYPE INTEGER;

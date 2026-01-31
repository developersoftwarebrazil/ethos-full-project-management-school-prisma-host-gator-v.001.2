/*
  Warnings:

  - You are about to drop the column `published` on the `VideoLesson` table. All the data in the column will be lost.
  - Added the required column `publicId` to the `VideoLesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoLesson" DROP COLUMN "published",
ADD COLUMN     "publicId" TEXT NOT NULL,
ALTER COLUMN "duration" SET DATA TYPE DOUBLE PRECISION;

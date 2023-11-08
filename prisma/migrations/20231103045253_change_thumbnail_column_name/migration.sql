/*
  Warnings:

  - You are about to drop the column `thumnailUrl` on the `Content` table. All the data in the column will be lost.
  - Added the required column `thumbnailUrl` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "thumnailUrl",
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL;

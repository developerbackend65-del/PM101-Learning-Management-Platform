/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "USER_STATUS" AS ENUM ('Active', 'Ban', 'Delete');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isDeleted",
ADD COLUMN     "bannedAt" TIMESTAMP(3),
ADD COLUMN     "status" "USER_STATUS" NOT NULL DEFAULT 'Active';

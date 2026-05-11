/*
  Warnings:

  - Added the required column `price` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "EVENT_TYPE" ADD VALUE 'RESTORE_ACCOUNT';

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

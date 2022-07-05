/*
  Warnings:

  - The `opened_hints` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "opened_hints",
ADD COLUMN     "opened_hints" INTEGER NOT NULL DEFAULT 0;

/*
  Warnings:

  - You are about to drop the `Admin_Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Admin_User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin_Token" DROP CONSTRAINT "Admin_Token_creator_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Admin_Token";

-- DropTable
DROP TABLE "Admin_User";

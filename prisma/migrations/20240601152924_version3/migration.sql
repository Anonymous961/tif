/*
  Warnings:

  - You are about to drop the column `communityId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_communityId_fkey";

-- AlterTable
ALTER TABLE "community" ADD COLUMN     "owners" BIGINT[];

-- AlterTable
ALTER TABLE "user" DROP COLUMN "communityId";

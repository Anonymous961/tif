/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `community` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `communityId` to the `member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "community" DROP CONSTRAINT "community_memberId_fkey";

-- DropForeignKey
ALTER TABLE "role" DROP CONSTRAINT "role_memberId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_memberId_fkey";

-- AlterTable
ALTER TABLE "member" ADD COLUMN     "communityId" BIGINT NOT NULL,
ADD COLUMN     "roleId" BIGINT NOT NULL,
ADD COLUMN     "userId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "community_slug_key" ON "community"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

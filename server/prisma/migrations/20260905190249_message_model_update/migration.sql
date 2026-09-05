/*
  Warnings:

  - The values [USER,ASSISTANT] on the enum `MessageRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Message` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MessageRole_new" AS ENUM ('user', 'assistant', 'system');
ALTER TABLE "Message" ALTER COLUMN "role" TYPE "MessageRole_new" USING ("role"::text::"MessageRole_new");
ALTER TYPE "MessageRole" RENAME TO "MessageRole_old";
ALTER TYPE "MessageRole_new" RENAME TO "MessageRole";
DROP TYPE "public"."MessageRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "content",
DROP COLUMN "metadata",
DROP COLUMN "status",
DROP COLUMN "updatedAt";

-- DropEnum
DROP TYPE "MessageStatus";

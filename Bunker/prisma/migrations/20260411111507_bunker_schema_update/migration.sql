/*
  Warnings:

  - The values [ACTIVE,NOT_ACTIVE] on the enum `DeckStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [MIK,IN_GAME] on the enum `PlayerStatus` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Deck` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `secret_key` on the `Deck` table. All the data in the column will be lost.
  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[secret_key]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[room_id,name]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[join_code]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[host_id]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `player_id` to the `Deck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Deck` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Player` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updated_at` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `join_code` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('LOBBY', 'STARTING', 'IN_PROGRESS', 'FINISHED', 'CLOSED');

-- AlterEnum
BEGIN;
CREATE TYPE "DeckStatus_new" AS ENUM ('HIDDEN', 'REVEALED', 'DISCARDED');
ALTER TABLE "Deck" ALTER COLUMN "status" TYPE "DeckStatus_new" USING ("status"::text::"DeckStatus_new");
ALTER TYPE "DeckStatus" RENAME TO "DeckStatus_old";
ALTER TYPE "DeckStatus_new" RENAME TO "DeckStatus";
DROP TYPE "public"."DeckStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PlayerStatus_new" AS ENUM ('JOINED', 'READY', 'PLAYING', 'DISCONNECTED', 'LEFT', 'KICKED');
ALTER TABLE "public"."Player" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Player" ALTER COLUMN "status" TYPE "PlayerStatus_new" USING ("status"::text::"PlayerStatus_new");
ALTER TYPE "PlayerStatus" RENAME TO "PlayerStatus_old";
ALTER TYPE "PlayerStatus_new" RENAME TO "PlayerStatus";
DROP TYPE "public"."PlayerStatus_old";
ALTER TABLE "Player" ALTER COLUMN "status" SET DEFAULT 'JOINED';
COMMIT;

-- DropForeignKey
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_card_id_fkey";

-- DropForeignKey
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_secret_key_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_room_id_fkey";

-- DropIndex
DROP INDEX "Player_name_key";

-- AlterTable
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_pkey",
DROP COLUMN "secret_key",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "player_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'HIDDEN',
ADD CONSTRAINT "Deck_pkey" PRIMARY KEY ("player_id", "card_id");

-- AlterTable
ALTER TABLE "Player" DROP CONSTRAINT "Player_pkey",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'JOINED',
ADD CONSTRAINT "Player_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "join_code" TEXT NOT NULL,
ADD COLUMN     "status" "RoomStatus" NOT NULL DEFAULT 'LOBBY',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "host_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Card_category_idx" ON "Card"("category");

-- CreateIndex
CREATE INDEX "Deck_card_id_idx" ON "Deck"("card_id");

-- CreateIndex
CREATE INDEX "Deck_status_idx" ON "Deck"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Player_secret_key_key" ON "Player"("secret_key");

-- CreateIndex
CREATE INDEX "Player_room_id_idx" ON "Player"("room_id");

-- CreateIndex
CREATE INDEX "Player_status_idx" ON "Player"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Player_room_id_name_key" ON "Player"("room_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Room_join_code_key" ON "Room"("join_code");

-- CreateIndex
CREATE UNIQUE INDEX "Room_host_id_key" ON "Room"("host_id");

-- CreateIndex
CREATE INDEX "Room_apocalypse_idx" ON "Room"("apocalypse");

-- CreateIndex
CREATE INDEX "Room_status_idx" ON "Room"("status");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Card"("card_id") ON DELETE CASCADE ON UPDATE CASCADE;

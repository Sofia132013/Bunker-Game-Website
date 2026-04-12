/*
  Warnings:

  - You are about to drop the column `created_at` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Player` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Player_room_id_idx";

-- DropIndex
DROP INDEX "Player_room_id_name_key";

-- DropIndex
DROP INDEX "Player_status_idx";

-- DropIndex
DROP INDEX "Room_apocalypse_idx";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

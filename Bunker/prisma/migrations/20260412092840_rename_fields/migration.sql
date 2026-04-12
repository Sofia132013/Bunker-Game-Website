/*
  Warnings:

  - You are about to drop the column `room_id` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `lobby_id` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LobbyStatus" AS ENUM ('LOBBY', 'STARTING', 'IN_PROGRESS', 'FINISHED', 'CLOSED');

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_room_id_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_apocalypse_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_host_id_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "room_id",
ADD COLUMN     "lobby_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "Room";

-- DropEnum
DROP TYPE "RoomStatus";

-- CreateTable
CREATE TABLE "Lobby" (
    "id" TEXT NOT NULL,
    "join_code" TEXT NOT NULL,
    "lobby_name" TEXT NOT NULL,
    "apocalypse" TEXT NOT NULL,
    "host_id" TEXT,
    "max_players" INTEGER NOT NULL DEFAULT 10,
    "status" "LobbyStatus" NOT NULL DEFAULT 'LOBBY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lobby_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lobby_join_code_key" ON "Lobby"("join_code");

-- CreateIndex
CREATE UNIQUE INDEX "Lobby_host_id_key" ON "Lobby"("host_id");

-- CreateIndex
CREATE INDEX "Lobby_status_idx" ON "Lobby"("status");

-- AddForeignKey
ALTER TABLE "Lobby" ADD CONSTRAINT "Lobby_apocalypse_fkey" FOREIGN KEY ("apocalypse") REFERENCES "Apocalypse"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lobby" ADD CONSTRAINT "Lobby_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_lobby_id_fkey" FOREIGN KEY ("lobby_id") REFERENCES "Lobby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

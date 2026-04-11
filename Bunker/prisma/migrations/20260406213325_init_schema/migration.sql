-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('MIK', 'READY', 'IN_GAME');

-- CreateEnum
CREATE TYPE "DeckStatus" AS ENUM ('ACTIVE', 'NOT_ACTIVE');

-- CreateTable
CREATE TABLE "Player" (
    "secret_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "PlayerStatus" NOT NULL DEFAULT 'MIK',
    "room_id" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("secret_key")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "apocalypse" TEXT NOT NULL,
    "host_id" TEXT NOT NULL,
    "max_players" INTEGER NOT NULL DEFAULT 10,
    "room_name" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apocalypse" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Apocalypse_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Deck" (
    "secret_key" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "status" "DeckStatus" NOT NULL,

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("secret_key","card_id")
);

-- CreateTable
CREATE TABLE "Card" (
    "card_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("card_id")
);

-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_apocalypse_fkey" FOREIGN KEY ("apocalypse") REFERENCES "Apocalypse"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_secret_key_fkey" FOREIGN KEY ("secret_key") REFERENCES "Player"("secret_key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Card"("card_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_category_fkey" FOREIGN KEY ("category") REFERENCES "Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

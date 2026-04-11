import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding");

  
  await prisma.deck.deleteMany();
  await prisma.player.deleteMany();
  await prisma.room.deleteMany();
  await prisma.card.deleteMany();
  await prisma.category.deleteMany();
  await prisma.apocalypse.deleteMany();

  
  await prisma.category.createMany({
    data: [
        { name: "PROFESSION" },
        { name: "AGE" }, 
        { name: "HEALTH" },
        { name: "HOBBY" },
        { name: "PHOBIA" },
        { name: "FACT1"},
        { name: "FACT2"},
        { name: "BAGGAGE"},
        { name: "SPECIAL"},
    ],
    skipDuplicates: true,
  });

  await prisma.apocalypse.createMany({
    data: [
      { name: "SUCCI_LECTURE" },
    ],
  });

  await prisma.card.createMany({
    data: [
      { card_id: "c1", category: "PROFESSION", description: "Doctor" },
      { card_id: "c2", category: "AGE", description: "Engineer" },
      { card_id: "c3", category: "HEALTH", description: "Asthma" },
      { card_id: "c4", category: "HOBBY", description: "Fishing" },
      { card_id: "c5", category: "PHOBIA", description: "Fear of heights" },
      { card_id: "c6", category: "FACT1", description: "Fishing" },
      { card_id: "c7", category: "FACT2", description: "Fear of heights" },
      { card_id: "c8", category: "BAGGAGE", description: "Fishing" },
      { card_id: "c9", category: "SPECIAL", description: "Fear of heights" },
    ],
  });


  const room = await prisma.room.create({
    data: {
      apocalypse: "SUCCI_LECTURE",
      host_id: "host-1",
      room_name: "Test Room",
      max_players: 10,
    },
  });

  const player1 = await prisma.player.create({
    data: {
      secret_key: "player-1",
      name: "Alice",
      status: "MIK",
      room_id: room.id,
    },
  });

  const player2 = await prisma.player.create({
    data: {
      secret_key: "player-2",
      name: "Bob",
      status: "READY",
      room_id: room.id,
    },
  });

  await prisma.deck.createMany({
    data: [
      {
        secret_key: player1.secret_key,
        card_id: "c1",
        status: "ACTIVE",
      },
      {
        secret_key: player1.secret_key,
        card_id: "c3",
        status: "ACTIVE",
      },
      {
        secret_key: player2.secret_key,
        card_id: "c2",
        status: "ACTIVE",
      },
      {
        secret_key: player2.secret_key,
        card_id: "c5",
        status: "NOT_ACTIVE",
      },
    ],
  });

  console.log("Seeding finished");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
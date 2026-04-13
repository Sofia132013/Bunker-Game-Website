import prisma from "../lib/prisma.js";
import crypto from 'crypto';

function getAllCards() {
    return prisma.card.findMany();
}

function getCardById(cardId) {
    return prisma.card.findUnique({
        where: { card_id: cardId }
    });
}

async function createCard(data) {
    const existing = await prisma.card.findFirst({
        where: {
            category: data.category,
            description: data.description
        }
    });

    if (existing) {
        throw new Error("Card already exists");
    }
    return prisma.card.create({
        data: {
            card_id: crypto.randomUUID(),
            category: data.category,
            description: data.description
        }
    });
}

function updateCard(cardId, data) {
    return prisma.card.update({
        where: { card_id: cardId },
        data
    });
}

function deleteCard(cardId) {
    return prisma.card.delete({
        where: { card_id: cardId }
    });
}

export default {
    getAllCards,
    getCardById,
    createCard,
    updateCard,
    deleteCard
};
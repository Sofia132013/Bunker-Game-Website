import cardService from '../services/card.service.js';


export async function getAllCards(req, res) {
    try {
        const cards = await cardService.getAllCards();
        res.json(cards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getCard(req, res) {
  try {
    const card = await cardService.getCardById(req.params.cardId);

    if (!card) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Card not found',
      });
    }

    return res.json(card);
  } catch (error) {
    console.error('getCard error:', error);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch card',
    });
  }
}

export async function createCard(req, res) {
  try {
    const card = await cardService.createCard(req.body);
    return res.status(201).json(card);
  } catch (error) {
    console.error('createCard error:', error);
    console.log(req.body);
    
    if (error.message === "Card already exists") {
      return res.status(400).json({
        error: "CARD_ALREADY_EXISTS",
        message: "Card with same category and description already exists"
      });
    }

    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create card',
    });
  }
}

export async function updateCard(req, res) {
  try {
    const card = await cardService.updateCard(
      req.params.cardId,
      req.body
    );

    return res.json(card);
  } catch (error) {
    console.error('updateCard error:', error);

    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to update card',
    });
  }
}

export async function deleteCard(req, res) {
  try {
    await cardService.deleteCard(req.params.cardId);
    return res.json({ message: 'Card deleted' });
  } catch (error) {
    console.error('deleteCard error:', error);

    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to delete card',
    });
  }
}
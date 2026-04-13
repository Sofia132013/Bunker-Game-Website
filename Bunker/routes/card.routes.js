import Joi from 'joi';
import { Router } from 'express';
import validPipe from '../middlewares/validPipe.js';
import { getAllCards } from '../controllers/card.controller.js';
import { getCard } from '../controllers/card.controller.js';
import { createCard } from '../controllers/card.controller.js';
import { updateCard } from '../controllers/card.controller.js';
import { deleteCard } from '../controllers/card.controller.js';


const router = Router();

const createCardSchema = Joi.object({
  category: Joi.string().trim().required(),
  description: Joi.string().trim().required()
});
const updateCardSchema = Joi.object({
  category: Joi.string().trim(),
  description: Joi.string().trim()
});


router.get('/', getAllCards);
router.get('/:cardId', getCard);
router.post(
  '/',
  validPipe(createCardSchema),
  createCard
);
router.patch(
  '/:cardId',
  validPipe(updateCardSchema),
  updateCard
);
router.delete('/:cardId', deleteCard);

export default router;
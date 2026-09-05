// internal-imports
import { authenticate, validateZodSchema } from '@/core/index.js';
import { checkConversationOwnership } from './middleware.js';
import { controller } from './controller.js';
import {
  conversationIdSchema,
  createMessageSchema,
  listConversationsSchema,
  updateConversationSchema,
} from './zod.js';

// external-imports
import { Router, type RequestHandler } from 'express';

// router for module
export const router = Router();

// @route GET /
router.get(
  '/',
  authenticate,
  validateZodSchema(listConversationsSchema),
  controller.listConversations as RequestHandler
);

// @route GET /:id
router.get(
  '/:id',
  authenticate,
  validateZodSchema(conversationIdSchema),
  checkConversationOwnership as RequestHandler,
  controller.listMessages as RequestHandler
);

// @route POST /
router.post('/', authenticate, controller.createConversation as RequestHandler);

// @route POST /:id
router.post(
  '/:id',
  authenticate,
  validateZodSchema(createMessageSchema),
  checkConversationOwnership as RequestHandler,
  controller.createMessage as RequestHandler
);

// @route PATCH /:id
router.patch(
  '/:id',
  authenticate,
  validateZodSchema(updateConversationSchema),
  checkConversationOwnership as RequestHandler,
  controller.updateConversation as RequestHandler
);

// @route DELETE /:id
router.delete(
  '/:id',
  authenticate,
  validateZodSchema(conversationIdSchema),
  checkConversationOwnership as RequestHandler,
  controller.deleteConversation as RequestHandler
);

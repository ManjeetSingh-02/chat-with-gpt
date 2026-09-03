// internal-imports
import { ErrorResponse, prisma, type Authenticated, type Validated } from '@/core/index.js';
import type { conversationIdSchema } from './zod.js';

// external-imports
import type { Request, Response, NextFunction } from 'express';

// middleware to check if user owns the conversation
export async function checkConversationOwnership(
  request: Request & Authenticated & Validated<typeof conversationIdSchema>,
  _response: Response,
  next: NextFunction
) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: request.validated.params.id,
      userId: request.user.id,
    },
  });

  if (!conversation)
    throw new ErrorResponse({
      code: 404,
      message: 'Conversation not found',
    });

  next();
}

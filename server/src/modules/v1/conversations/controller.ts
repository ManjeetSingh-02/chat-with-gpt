// internal-imports
import {
  ErrorResponse,
  OPENAI_CONFIG,
  prisma,
  SuccessResponse,
  type Authenticated,
  type Prisma,
  type Validated,
} from '@/core/index.js';
import type {
  conversationIdSchema,
  listConversationsSchema,
  updateConversationSchema,
  createMessageSchema,
} from './zod.js';

// external-imports
import { openai } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  pipeUIMessageStreamToResponse,
  streamText,
  toUIMessageStream,
  validateUIMessages,
} from 'ai';
import type { Request, Response } from 'express';

// controller for module
export const controller = {
  // @controller GET /
  listConversations: async (
    request: Request & Authenticated & Validated<typeof listConversationsSchema>,
    response: Response
  ) => {
    // find all conversations
    const conversations = await prisma.conversation.findMany({
      where: {
        userId: request.user.id,
        isArchived: request.validated.query.isArchived,
        isPinned: request.validated.query.isPinned,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        isArchived: true,
        isPinned: true,
        title: true,
        updatedAt: true,
      },
    });

    // return response with success
    return response.status(200).json(
      new SuccessResponse({
        message: 'Conversations retrieved successfully',
        data: conversations,
        meta: {
          total: conversations.length,
          pinned: conversations.filter(c => c.isPinned).length,
          archived: conversations.filter(c => c.isArchived).length,
        },
      })
    );
  },

  // @controller POST /
  createConversation: async (request: Request & Authenticated, response: Response) => {
    // create a new conversation
    const conversation = await prisma.conversation.create({
      data: {
        userId: request.user.id,
      },
    });

    // return response with success
    return response.status(201).json(
      new SuccessResponse({
        message: 'Conversation created successfully',
        data: {
          id: conversation.id,
        },
      })
    );
  },

  // @controller PATCH /:id
  updateConversation: async (
    request: Request & Validated<typeof updateConversationSchema>,
    response: Response
  ) => {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: request.validated.params.id,
      },
      select: {
        isPinned: true,
        isArchived: true,
      },
    });

    // check if conversation is both pinned and archived
    if (
      (request.validated.body.isPinned ?? conversation!.isPinned) &&
      (request.validated.body.isArchived ?? conversation!.isArchived)
    )
      throw new ErrorResponse({
        code: 400,
        message: 'A conversation cannot be both pinned and archived',
      });

    // update the conversation
    await prisma.conversation.update({
      where: {
        id: request.validated.params.id,
      },
      data: request.validated.body,
    });

    // return response with success
    return response.status(204).send();
  },

  // @controller DELETE /:id
  deleteConversation: async (
    request: Request & Validated<typeof conversationIdSchema>,
    response: Response
  ) => {
    // delete the conversation
    await prisma.conversation.delete({
      where: {
        id: request.validated.params.id,
      },
    });

    // return response with success
    return response.status(204).send();
  },

  // @controller GET /:id
  listMessages: async (
    request: Request & Validated<typeof conversationIdSchema>,
    response: Response
  ) => {
    // find all messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId: request.validated.params.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        role: true,
        parts: true,
      },
    });

    // return response with success
    return response.status(200).json(
      new SuccessResponse({
        message: 'Messages retrieved successfully',
        data: messages,
      })
    );
  },

  // @controller POST /:id
  createMessage: async (
    request: Request & Validated<typeof createMessageSchema>,
    response: Response
  ) => {
    // find all messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId: request.validated.params.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        role: true,
        parts: true,
      },
    });

    // validate all the messages and the new message
    const validatedMessages = await validateUIMessages({
      messages: [...messages, request.validated.body.message],
    });

    // convert the validated messages to model messages
    const modelMessages = await convertToModelMessages(validatedMessages);

    // stream text from openai
    const result = streamText({
      model: openai(OPENAI_CONFIG.model),
      system: OPENAI_CONFIG.SYSTEM_PROMPT,
      messages: modelMessages,
    });

    // consume the stream
    result.consumeStream();

    // convert model stream into UI message stream
    const stream = toUIMessageStream({
      stream: result.stream,
      originalMessages: validatedMessages,
      onEnd: async ({ messages }) => {
        for (const m of messages) {
          await prisma.message.upsert({
            where: {
              id: m.id,
            },
            update: {},
            create: {
              id: m.id,
              conversationId: request.validated.params.id,
              role: m.role,
              parts: m.parts as Prisma.InputJsonValue,
            },
          });
        }
      },
    });

    // pipe UI message stream directly to Express response
    return pipeUIMessageStreamToResponse({ response, stream });
  },
};

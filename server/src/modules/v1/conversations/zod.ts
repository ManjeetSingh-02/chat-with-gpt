// external-imports
import z from 'zod';

// schema for conversationId params
const conversationIdParamsSchema = z.object({
  id: z.uuid(),
});

// schema for conversationId
export const conversationIdSchema = z.object({
  params: conversationIdParamsSchema,
});

// schema for listConversations
export const listConversationsSchema = z.object({
  query: z
    .object({
      isArchived: z.stringbool().optional(),
      isPinned: z.stringbool().optional(),
    })
    .refine(d => !(d.isArchived && d.isPinned), {
      error: 'A conversation cannot be both pinned and archived',
    }),
});

// schema for updateConversation
export const updateConversationSchema = z.object({
  params: conversationIdParamsSchema,
  body: z
    .object({
      title: z.string().trim().nonempty().optional(),
      isArchived: z.boolean().optional(),
      isPinned: z.boolean().optional(),
    })
    .refine(d => Object.keys(d).length > 0, {
      error: 'At least one field must be provided for update',
    })
    .refine(d => !(d.isArchived && d.isPinned), {
      error: 'A conversation cannot be both pinned and archived',
    }),
});

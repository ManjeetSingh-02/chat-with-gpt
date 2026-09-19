import type { UIMessage } from 'ai';

export type Conversation = {
  id: string;
  isArchived: boolean;
  isPinned: boolean;
  title: string;
  updatedAt: string;
};

export type ListConversationsParams = {
  isArchived?: boolean;
  isPinned?: boolean;
};

export type ListConversationsResponse = {
  data: Conversation[];
  meta: {
    total: number;
    pinned: number;
    archived: number;
  };
};

export type CreateConversationResponse = {
  data: {
    id: string;
  };
};

export type UpdateConversationData = {
  title?: string;
  isPinned?: boolean;
  isArchived?: boolean;
};

export type ListMessagesResponse = {
  data: UIMessage[];
};

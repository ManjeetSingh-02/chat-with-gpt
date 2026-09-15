import type { ListConversationsParams } from '@/types/conversations';
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
    },
  },
});

export const conversationKeys = {
  all: ['conversations'] as const,

  list: (params?: ListConversationsParams) =>
    params
      ? ([...conversationKeys.all, 'list', params] as const)
      : ([...conversationKeys.all, 'list'] as const),
};

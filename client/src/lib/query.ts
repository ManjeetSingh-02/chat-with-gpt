import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
    },
  },
});
import type { ListConversationsParams } from '@/types/conversations';

export const conversationKeys = {
  all: ['conversations'] as const,

  list: (params?: ListConversationsParams) =>
    params
      ? ([...conversationKeys.all, 'list', params] as const)
      : ([...conversationKeys.all, 'list'] as const),
};

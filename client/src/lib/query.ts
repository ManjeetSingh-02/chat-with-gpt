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
  list: (params?: ListConversationsParams) =>
    params ? (['list', params] as const) : (['list'] as const),
};

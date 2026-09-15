import { conversations } from '@/api/conversations';
import { conversationKeys, queryClient } from '@/lib/query';
import type { UpdateConversationData } from '@/types/conversations';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useConversations = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: conversationKeys.list(),
    queryFn: () => conversations.listConversations({ isArchived: false }),
  });

  const pinned = data?.data.data.filter(c => c.isPinned) ?? [];
  const recents = data?.data.data.filter(c => !c.isPinned) ?? [];

  return {
    data: { pinned, recents },
    isLoading,
    isError,
    error,
  };
};

export const useCreateConversation = () => {
  return useMutation({
    mutationFn: () => conversations.createConversation(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: conversationKeys.list({ isArchived: false }) }),
  });
};

export const useUpdateConversation = (id: string) =>
  useMutation({
    mutationFn: (data: UpdateConversationData) => conversations.updateConversation(id, data),
    onSuccess: (_, data) => {
      if (data.isArchived === undefined)
        queryClient.invalidateQueries({ queryKey: conversationKeys.list({ isArchived: false }) });
      else queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
  });

export const useDeleteConversation = (id: string, isArchived: boolean) =>
  useMutation({
    mutationFn: () => conversations.deleteConversation(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: conversationKeys.list({ isArchived }) }),
  });

export const useDeleteConversations = () =>
  useMutation({
    mutationFn: () => conversations.deleteConversations(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationKeys.list() }),
  });

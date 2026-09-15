import { conversations } from '@/api/conversations';
import { conversationKeys, queryClient } from '@/lib/query';
import type { UpdateConversationData } from '@/types/conversations';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useConversations = ({ isArchived }: { isArchived: boolean }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: conversationKeys.list({ isArchived }),
    queryFn: () => conversations.listConversations({ isArchived }),
  });

  const archived = data?.data.data ?? [];
  const pinned = data?.data.data.filter(c => c.isPinned) ?? [];
  const recents = data?.data.data.filter(c => !c.isPinned) ?? [];

  return {
    data: { archived, pinned, recents },
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

export const useUpdateConversation = () =>
  useMutation({
    mutationFn: (data: { id: string; data: UpdateConversationData }) =>
      conversations.updateConversation(data.id, data.data),
    onSuccess: (_, data) => {
      if (data.data.isArchived === undefined)
        queryClient.invalidateQueries({ queryKey: conversationKeys.list({ isArchived: false }) });
      else queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
  });

export const useDeleteConversation = () =>
  useMutation({
    mutationFn: (data: { id: string; isArchived: boolean }) =>
      conversations.deleteConversation(data.id),
    onSuccess: (_, data) =>
      queryClient.invalidateQueries({
        queryKey: conversationKeys.list({ isArchived: data.isArchived }),
      }),
  });

export const useDeleteConversations = () =>
  useMutation({
    mutationFn: () => conversations.deleteConversations(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationKeys.list() }),
  });

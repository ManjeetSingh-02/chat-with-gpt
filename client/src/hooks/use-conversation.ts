import { conversations } from '@/api/conversations';
import { conversationKeys, queryClient } from '@/lib/query';
import type { UpdateConversationData } from '@/types/conversations';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => conversations.createConversation(),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
      navigate({ to: '/conversations/$id', params: { id: data.data.id } });
    },
  });
};

export const useUpdateConversation = (id: string) =>
  useMutation({
    mutationFn: (data: UpdateConversationData) => conversations.updateConversation(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationKeys.list() }),
  });

export const useDeleteConversation = () =>
  useMutation({
    mutationFn: (id: string) => conversations.deleteConversation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationKeys.list() }),
  });

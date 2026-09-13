import { axiosInstance } from '@/lib/axios';
import type {
  CreateConversationResponse,
  ListConversationsParams,
  ListConversationsResponse,
  UpdateConversationData,
} from '@/types/conversations';

export const conversations = {
  // GET /conversations
  listConversations: async (params?: ListConversationsParams) =>
    await axiosInstance.get<ListConversationsResponse>('/conversations', { params }),

  // POST /conversations
  createConversation: async () =>
    await axiosInstance.post<CreateConversationResponse>('/conversations'),

  // PATCH /conversations/:id
  updateConversation: async (id: string, data: UpdateConversationData) =>
    await axiosInstance.patch(`/conversations/${id}`, data),

  // DELETE /conversations
  deleteAllConversations: async () => await axiosInstance.delete('/conversations'),

  // DELETE /conversations/:id
  deleteConversation: async (id: string) => await axiosInstance.delete(`/conversations/${id}`),
};

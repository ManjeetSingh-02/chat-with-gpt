import { axiosInstance } from '@/lib/axios';
import type {
  CreateConversationResponse,
  ListConversationsParams,
  ListConversationsResponse,
  ListMessagesResponse,
  UpdateConversationData,
} from '@/types/conversations';

export const conversations = {
  // GET /conversations
  listConversations: async (params?: ListConversationsParams) =>
    await axiosInstance.get<ListConversationsResponse>('/conversations', { params }),

  // GET /conversations/:id
  listMessages: async (id: string) =>
    await axiosInstance.get<ListMessagesResponse>(`/conversations/${id}`),

  // POST /conversations
  createConversation: async () =>
    await axiosInstance.post<CreateConversationResponse>('/conversations'),

  // PATCH /conversations/:id
  updateConversation: async (id: string, data: UpdateConversationData) =>
    await axiosInstance.patch(`/conversations/${id}`, data),

  // DELETE /conversations
  deleteConversations: async () => await axiosInstance.delete('/conversations'),

  // DELETE /conversations/:id
  deleteConversation: async (id: string) => await axiosInstance.delete(`/conversations/${id}`),
};

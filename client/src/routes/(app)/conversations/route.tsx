import { ConversationComposer } from '@/components/conversation/composer';
import { toast } from '@/components/ui/toast';
import { useCreateConversation } from '@/hooks/use-conversation';
import { createFileRoute, Outlet, useNavigate, useParams } from '@tanstack/react-router';
import { SparklesIcon } from 'lucide-react';

export const Route = createFileRoute('/(app)/conversations')({
  component: function ConversationLayout() {
    const navigate = useNavigate();
    const useCreateConversationMutation = useCreateConversation();
    const { id } = useParams({ strict: false });

    function startNewConversation(message: string) {
      return useCreateConversationMutation.mutate(undefined, {
        onSuccess: ({ data }) =>
          navigate({
            to: '/conversations/$id',
            params: { id: data.data.id },
            state: { message },
          }),
        onError: error =>
          toast.add({
            title: error.message,
            type: 'error',
            timeout: 3000,
          }),
      });
    }

    return id ? (
      <Outlet />
    ) : (
      <div className="mx-auto flex min-h-screen w-3xl flex-col items-center justify-center gap-8">
        <div className="flex w-full flex-col items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-2xl">
            <SparklesIcon />
          </div>
          <h1 className="text-xl">What can I help you with?</h1>
        </div>

        <ConversationComposer
          onSubmit={startNewConversation}
          status="ready"
        />
      </div>
    );
  },
});

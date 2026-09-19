import { ConversationMessages } from '@/components/conversation/messages';
import { Spinner } from '@/components/ui/spinner';
import { useConversation } from '@/hooks/use-conversation';
import { createFileRoute, useLocation, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/(app)/conversations/$id')({
  component: function ConversationID() {
    const { id } = useParams({ from: '/(app)/conversations/$id' });
    const { data, error, isError, isLoading } = useConversation({ id });
    const { state } = useLocation();

    if (isLoading)
      return (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      );

    if (isError)
      return (
        <div className="flex items-center justify-center">
          <span className="text-destructive text-center">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </span>
        </div>
      );

    return (
      <ConversationMessages
        id={id}
        key={id}
        initialData={data}
        initialMessage={state.message}
      />
    );
  },
});

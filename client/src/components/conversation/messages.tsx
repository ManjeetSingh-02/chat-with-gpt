import { Conversation, ConversationContent } from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import { ConversationComposer } from '@/components/conversation/composer';
import { toast } from '@/components/ui/toast';
import { conversationKeys, queryClient } from '@/lib/query';
import { useChat } from '@ai-sdk/react';
import { useNavigate } from '@tanstack/react-router';
import { DefaultChatTransport, isTextUIPart, type UIMessage } from 'ai';
import { SparklesIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function ConversationMessages({
  id,
  initialData,
  initialMessage,
}: {
  id: string;
  initialData: UIMessage[];
  initialMessage?: string;
}) {
  const navigate = useNavigate();
  const hasSentInitialMessage = useRef(false);

  const { messages, sendMessage, status, stop } = useChat({
    messages: initialData,
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_API_URL}/conversations/${id}`,
      credentials: 'include',
      prepareSendMessagesRequest: ({ messages }) => ({ body: { message: messages.at(-1) } }),
    }),
    onError: error =>
      toast.add({
        title: error.message,
        type: 'error',
        timeout: 3000,
      }),
    onFinish: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.messages(id) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.list() });
    },
  });

  useEffect(() => {
    if (!initialMessage || hasSentInitialMessage.current) return;

    hasSentInitialMessage.current = true;

    sendMessage({ text: initialMessage });

    navigate({ to: '.', replace: true, state: {} });
  }, [initialMessage, navigate, sendMessage]);

  return (
    <div className="flex h-screen w-full flex-col items-center overflow-hidden py-6">
      {messages.length === 0 ? (
        <div className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-2xl">
              <SparklesIcon />
            </div>

            <h1 className="text-xl">What can I help you with?</h1>
          </div>

          <ConversationComposer
            onSubmit={text => sendMessage({ text })}
            onStop={stop}
            status={status}
          />
        </div>
      ) : (
        <>
          <Conversation className="scrollbar-thumb-muted-foreground min-h-0 w-full flex-1 scrollbar-thin scrollbar-track-transparent">
            <ConversationContent className="mx-auto w-full max-w-3xl">
              {messages.map(m => (
                <Message
                  key={m.id}
                  from={m.role}
                >
                  <MessageContent
                    className={m.role === 'assistant' ? 'bg-muted rounded-md px-8 py-4' : ''}
                  >
                    {m.role === 'assistant' &&
                    !m.parts.some(isTextUIPart) &&
                    (status === 'submitted' || status === 'streaming') ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      <MessageResponse>
                        {m.parts
                          .filter(isTextUIPart)
                          .map(p => p.text)
                          .join('')}
                      </MessageResponse>
                    )}
                  </MessageContent>
                </Message>
              ))}
            </ConversationContent>
          </Conversation>

          <div className="w-full max-w-3xl">
            <ConversationComposer
              onSubmit={text => sendMessage({ text })}
              onStop={stop}
              status={status}
            />
          </div>
        </>
      )}
    </div>
  );
}

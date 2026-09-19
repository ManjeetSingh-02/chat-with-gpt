import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ChatStatus } from 'ai';
import { Send, Square } from 'lucide-react';
import { useState } from 'react';

export function ConversationComposer({
  onSubmit,
  onStop,
  status,
}: {
  onSubmit: (message: string) => void;
  onStop?: () => void;
  status: ChatStatus;
}) {
  const [text, setText] = useState('');
  const isGenerating = status === 'submitted' || status === 'streaming';

  function handleSubmit() {
    if (isGenerating) onStop?.();
    else {
      if (!text.trim()) return;
      const m = text.trim();
      onSubmit(m);
      setText('');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="bg-card flex w-full items-end gap-4 rounded-xl p-2 focus-within:border">
      <Textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Ask anything..."
        onKeyDown={handleKeyDown}
        rows={2}
        className="no-scrollbar field-sizing-content max-h-26 min-h-10 resize-none overflow-y-auto border-none bg-inherit! focus-visible:ring-0"
      />

      <Button
        title={isGenerating ? 'Stop generating' : 'Send message'}
        type={isGenerating ? 'button' : 'submit'}
        onClick={handleSubmit}
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground bg-background! size-10"
      >
        {isGenerating ? <Square fill="currentColor" /> : <Send />}
      </Button>
    </div>
  );
}

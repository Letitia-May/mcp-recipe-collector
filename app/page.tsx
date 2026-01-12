'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import { Loader } from '@/components/ai-elements/loader';
import { CopyIcon, RefreshCcwIcon } from 'lucide-react';

export default function Chat() {
  const { messages, sendMessage, status, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  const [input, setInput] = useState('');

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);

    if (!hasText) {
      return;
    }

    sendMessage({ text: message.text });
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">🍳 Recipe Agent</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ask me to search recipes, get recipe details, or add new recipes!
          </p>
        </div>

        <Conversation className="h-full">
          <ConversationContent>
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground mt-8">
                <p>Start a conversation by asking about recipes!</p>
                <p className="text-sm mt-2">
                  Try: &quot;Search for banana recipes&quot; or &quot;Show me recipe 1&quot;
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id}>
                {message.parts.map((part, i) => {
                  if (part.type === 'text') {
                    return (
                      <Message key={`${message.id}-${i}`} from={message.role}>
                        <MessageContent>
                          <MessageResponse>{part.text}</MessageResponse>
                        </MessageContent>
                        {message.role === 'assistant' &&
                          i === message.parts.length - 1 &&
                          message.id === messages[messages.length - 1]?.id && (
                            <MessageActions>
                              <MessageAction onClick={() => regenerate()} label="Retry">
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction
                                onClick={() => navigator.clipboard.writeText(part.text)}
                                label="Copy"
                              >
                                <CopyIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                      </Message>
                    );
                  }
                  return null;
                })}
              </div>
            ))}

            {status === 'submitted' && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Ask about recipes..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

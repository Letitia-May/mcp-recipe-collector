'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useState } from 'react';

export default function Chat() {
  const [mounted, setMounted] = useState(false);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header
        style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid #ddd',
          background: 'white',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🍳 Recipe Agent</h1>
        <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.9rem' }}>
          Ask me to search recipes, get recipe details, or add new recipes!
        </p>
      </header>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>
            <p>Start a conversation by asking about recipes!</p>
            <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
              Try: &quot;Search for banana recipes&quot; or &quot;Show me recipe 1&quot;
            </p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '1rem',
                borderRadius: '12px',
                background: m.role === 'user' ? '#007AFF' : 'white',
                color: m.role === 'user' ? 'white' : '#333',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                {m.role === 'user' ? 'You' : '🤖 Agent'}
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {m.parts.map((part, index) =>
                  part.type === 'text' ? <span key={index}>{part.text}</span> : null
                )}
              </div>
            </div>
          </div>
        ))}

        {(status === 'submitted' || status === 'streaming') && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                🤖 Agent
              </div>
              <div style={{ color: '#666' }}>Thinking...</div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
        style={{
          padding: '1rem 2rem',
          borderTop: '1px solid #ddd',
          background: 'white',
          display: 'flex',
          gap: '1rem',
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about recipes..."
          disabled={status !== 'ready'}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '24px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={status !== 'ready' || !input?.trim()}
          style={{
            padding: '0.75rem 2rem',
            borderRadius: '24px',
            border: 'none',
            background: status !== 'ready' || !input?.trim() ? '#ccc' : '#007AFF',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: status !== 'ready' || !input?.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

'use client';
import { useState, useRef, useEffect } from 'react';
import type { DentalAnalysis } from '@/lib/schemas';
import ComingSoonModal from '../ComingSoonModal';
import { usePlan } from '@/hooks/usePlan';
import styles from '../AskAIChat.module.css';

interface Message { role: 'user' | 'assistant'; content: string; id: string; }

const SUGGESTED = [
  'Is this serious?',
  'How much does treatment usually cost?',
  'Do I really need this treatment now?',
  'What happens if I wait?',
  'Can I prevent this from getting worse?',
];

export default function AskAIChat({ findings }: { findings: DentalAnalysis }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { plan } = usePlan();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;
    
    // ENTERPRISE ENTITLEMENT ENGINE
    if (!plan.hasAIChat) {
      setIsModalOpen(true);
      return;
    }
    
    const userMsg: Message = { role: 'user', content: text, id: Date.now().toString() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          findings: findings.findings,
          patientSummary: findings.patient_summary,
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) {
        setIsLoading(false);
        return;
      }
      
      const decoder = new TextDecoder();
      let assistantText = '';
      const assistantId = (Date.now() + 1).toString();

      setMessages(prev => [...prev, { role: 'assistant', content: '', id: assistantId }]);

      while (true) {
        // @ts-ignore - reader is verified above
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantText } : m));
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.', id: Date.now().toString() }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <span>💬</span>
        <div>
          <div className={styles.chatTitle}>Ask DentoBot</div>
          <div className={styles.chatSub}>Ask anything about your record</div>
        </div>
        <div className="glow-dot" />
      </div>

      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.welcome}>
            <p>Hi! I&apos;m DentoBot. I&apos;ve read your dental record and I&apos;m here to help you understand it. What would you like to know?</p>
            <div className={styles.suggestions}>
              {SUGGESTED.map(s => (
                <button key={s} className={styles.suggestion} onClick={() => sendMessage(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`${styles.message} ${m.role === 'user' ? styles.userMsg : styles.botMsg}`}>
            {m.role === 'assistant' && <div className={styles.botAvatar}>🤖</div>}
            <div className={styles.bubble}>{m.content || <span className={styles.typing}><span /><span /><span /></span>}</div>
            {m.role === 'user' && <div className={styles.userAvatar}>👤</div>}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className={styles.message}>
            <div className={styles.botAvatar}>🤖</div>
            <div className={`${styles.bubble} ${styles.typingBubble}`}><span /><span /><span /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputRow}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about your dental record..."
          className={`input ${styles.chatInput}`}
          disabled={isLoading}
        />
        <button type="submit" className={`btn btn-primary ${styles.sendBtn}`} disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>

      <ComingSoonModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        featureName="DentoBot AI Chat (DentoGraph Pro)" 
      />
    </div>
  );
}

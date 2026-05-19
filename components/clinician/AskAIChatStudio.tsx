'use client';
import { useState, useRef, useEffect } from 'react';
import type { DentalAnalysis } from '@/lib/schemas';
import ComingSoonModal from '../ComingSoonModal';
import { usePlan } from '@/hooks/usePlan';
import styles from '../AskAIChat.module.css';

interface Message { role: 'user' | 'assistant'; content: string; id: string; }

const SUGGESTED = [
  'Generate Insurance Narrative (CDT)',
  'Synthesize Differential Diagnosis',
  'Cross-reference ADA Guidelines',
  'Summarize Periodontal Risk',
  'Analyze Clinical Manifest',
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
          mode: 'clinical', // Signal to AI to use professional jargon
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
        // @ts-ignore
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantText } : m));
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Diagnostic engine error. Please retry query.', id: Date.now().toString() }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className={styles.chatContainer} style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
      <div className={styles.chatHeader} style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
        <span style={{ filter: 'grayscale(1)' }}>🤖</span>
        <div>
          <div className={styles.chatTitle} style={{ color: '#fff' }}>Clinical AI Engine</div>
          <div className={styles.chatSub} style={{ color: '#94a3b8' }}>Synthesis of Pathological Manifest</div>
        </div>
      </div>

      <div className={styles.messages} style={{ background: '#0f172a' }}>
        {messages.length === 0 && (
          <div className={styles.welcome}>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Clinical co-pilot initialized. Query the pathological manifest for differential diagnostics or insurance narratives.</p>
            <div className={styles.suggestions}>
              {SUGGESTED.map(s => (
                <button key={s} className={styles.suggestion} onClick={() => sendMessage(s)} style={{ background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155' }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`${styles.message} ${m.role === 'user' ? styles.userMsg : styles.botMsg}`}>
            {m.role === 'assistant' && <div className={styles.botAvatar} style={{ background: '#334155' }}>AI</div>}
            <div className={styles.bubble} style={{ background: m.role === 'user' ? '#1e293b' : '#0f172a', color: '#fff', border: m.role === 'assistant' ? '1px solid #334155' : 'none' }}>
              {m.content || <span className={styles.typing}><span /><span /><span /></span>}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className={styles.message}>
            <div className={styles.botAvatar} style={{ background: '#334155' }}>AI</div>
            <div className={`${styles.bubble} ${styles.typingBubble}`} style={{ background: '#0f172a', border: '1px solid #334155' }}><span /><span /><span /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputRow} style={{ background: '#1e293b', borderTop: '1px solid #334155' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Query clinical manifest..."
          className={`input ${styles.chatInput}`}
          style={{ background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
          disabled={isLoading}
        />
        <button type="submit" className={`btn btn-primary ${styles.sendBtn}`} style={{ background: '#38bdf8', border: 'none' }} disabled={isLoading || !input.trim()}>
          Query
        </button>
      </form>
      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        featureName="Clinical AI Engine (Enterprise Edition)"
      />
    </div>
  );
}

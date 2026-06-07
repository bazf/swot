/* InputForm — anonymous thought entry: pick a zone, type, launch. */

import { useState } from 'react';
import logo from '../../assets/logo.png';
import { CAT_ORDER } from '../../data/catalog';
import type { CategoryKey } from '../../state/types';
import { CatButton } from './CatButton';

interface InputFormProps {
  onSubmit?: (cat: CategoryKey, text: string) => void;
}

export function InputForm({ onSubmit }: InputFormProps) {
  const [cat, setCat] = useState<CategoryKey | null>(null);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(0);
  const [toast, setToast] = useState(false);
  const ready = !!cat && text.trim().length > 1;

  const submit = () => {
    if (!ready || !cat) return;
    onSubmit?.(cat, text.trim());
    setSent((s) => s + 1);
    setText('');
    setCat(null);
    setToast(true);
    setTimeout(() => setToast(false), 1600);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '70px 18px 22px', zIndex: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <img src={logo} alt="" style={{ height: 30 }} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>Галактика ліцею</div>
          <div style={{ fontSize: 10, color: 'var(--ink-mute)' }}>анонімно · надіслано: {sent}</div>
        </div>
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
        Оберіть зону думки
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {CAT_ORDER.map((k) => (
          <CatButton key={k} cat={k} active={cat === k} onClick={() => setCat(k)} />
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Напишіть свою думку…"
        aria-label="Ваша думка"
        className="no-scrollbar"
        style={{
          flex: 1,
          minHeight: 74,
          resize: 'none',
          borderRadius: 16,
          padding: '14px',
          background: 'var(--surface)',
          border: '1px solid var(--glass-brd)',
          color: 'var(--ink)',
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          lineHeight: 1.4,
          outline: 'none',
        }}
      />

      <button
        className="btn btn-gold"
        disabled={!ready}
        onClick={submit}
        style={{
          marginTop: 14,
          width: '100%',
          opacity: ready ? 1 : 0.45,
          cursor: ready ? 'pointer' : 'not-allowed',
          transform: 'none',
          padding: '15px',
        }}
      >
        🚀 Запустити в космос
      </button>

      {toast && (
        <div
          role="status"
          style={{
            position: 'absolute',
            bottom: 88,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 18px',
            borderRadius: 999,
            background: 'rgba(40,224,196,.18)',
            border: '1px solid rgba(40,224,196,.6)',
            color: 'var(--ink)',
            fontSize: 13,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'fade-up .35s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <span>✦</span> Думку відправлено!
        </div>
      )}
    </div>
  );
}

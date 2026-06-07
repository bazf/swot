/* InputForm — one anonymous thought at a time: type (or pick a suggestion),
   launch it to space. The AI categorizes later, so there's no zone picker. */

import { useEffect, useRef, useState } from 'react';
import launchSound from '../../assets/audio/launching-missile.mp3';
import logo from '../../assets/logo.png';
import { randomSuggestions } from '../../data/suggestions';
import { playOneShot } from '../../lib/audio';
import { vibrate } from '../../lib/haptics';

const IDLE_MS = 6000;

/** Liftoff haptic: a short tick then a rumble, in step with the launch sound. */
const LAUNCH_VIBRATION = [12, 18, 70];

interface InputFormProps {
  onSubmit?: (text: string) => void;
}

export function InputForm({ onSubmit }: InputFormProps) {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(0);
  const [toast, setToast] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [chips, setChips] = useState<string[] | null>(null);
  const idleRef = useRef<number | null>(null);
  const ready = text.trim().length > 1;

  // After a spell of inactivity with an empty box, offer suggestions.
  useEffect(() => {
    if (idleRef.current) window.clearTimeout(idleRef.current);
    if (text.trim().length === 0) {
      idleRef.current = window.setTimeout(() => setChips(randomSuggestions(3)), IDLE_MS);
    } else {
      setChips(null);
    }
    return () => {
      if (idleRef.current) window.clearTimeout(idleRef.current);
    };
  }, [text]);

  const submit = () => {
    if (!ready) return;
    playOneShot(launchSound, 0.7);
    vibrate(LAUNCH_VIBRATION);
    onSubmit?.(text.trim());
    setSent((s) => s + 1);
    setText('');
    setChips(null);
    setLaunching(true);
    window.setTimeout(() => {
      setLaunching(false);
      setToast(true);
      window.setTimeout(() => setToast(false), 1500);
    }, 850);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '64px 20px 28px', zIndex: 5 }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={logo} alt="" style={{ height: 30 }} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>Галактика ліцею</div>
          <div style={{ fontSize: 10, color: 'var(--ink-mute)' }}>анонімно · надіслано: {sent}</div>
        </div>
      </div>

      {/* centered input block — the CTA always stays on screen */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, textAlign: 'center' }}>
          Ваша думка про наш рік
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напишіть одну думку…"
          aria-label="Ваша думка"
          rows={3}
          className="no-scrollbar"
          style={{
            height: 96,
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
          style={{ width: '100%', opacity: ready ? 1 : 0.45, cursor: ready ? 'pointer' : 'not-allowed', transform: 'none', padding: '15px' }}
        >
          🚀 Запустити в космос
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => setChips(randomSuggestions(3))}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          💡 Запропонувати думку
        </button>

        {chips && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, animation: 'fade-up .35s ease' }}>
            {chips.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setText(s);
                  setChips(null);
                }}
                style={{
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '10px 13px',
                  borderRadius: 12,
                  background: 'var(--surface)',
                  border: '1px solid var(--glass-brd)',
                  color: 'var(--ink-dim)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  lineHeight: 1.3,
                }}
              >
                ✦ {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* rocket launch feedback */}
      {launching && (
        <div style={{ position: 'absolute', left: '50%', bottom: 120, transform: 'translateX(-50%)', zIndex: 30, pointerEvents: 'none', textAlign: 'center' }}>
          <div style={{ fontSize: 46, animation: 'rocket-launch .85s ease-in forwards' }}>🚀</div>
          <div
            style={{
              width: 12,
              height: 12,
              margin: '0 auto',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,200,120,.9), transparent 70%)',
              animation: 'rocket-smoke .85s ease-out forwards',
            }}
          />
        </div>
      )}

      {toast && (
        <div
          role="status"
          style={{
            position: 'absolute',
            bottom: 92,
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

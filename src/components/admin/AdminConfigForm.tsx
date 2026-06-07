/* AdminConfigForm — hidden tool (?admin=1) that AES-encrypts the app config.
   Paste the resulting ciphertext into src/lib/encrypted-config.ts and commit. */

import { useState, type CSSProperties } from 'react';
import logo from '../../assets/logo.png';
import type { AppConfig } from '../../lib/config';
import { decryptJson, encryptJson } from '../../lib/crypto';
import { DEFAULT_SESSION_ID } from '../../lib/session';

type FbKey =
  | 'apiKey'
  | 'authDomain'
  | 'databaseURL'
  | 'projectId'
  | 'storageBucket'
  | 'messagingSenderId'
  | 'appId';

// Public structural identifiers are pre-filled; secrets (apiKey/appId/OpenRouter) stay blank.
const FB_DEFAULTS: Record<FbKey, string> = {
  apiKey: '',
  authDomain: 'swot-1a7f2.firebaseapp.com',
  databaseURL: 'https://swot-1a7f2-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'swot-1a7f2',
  storageBucket: 'swot-1a7f2.firebasestorage.app',
  messagingSenderId: '295271212780',
  appId: '',
};

const FB_ORDER: FbKey[] = [
  'apiKey',
  'authDomain',
  'databaseURL',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  background: 'var(--surface)',
  border: '1px solid var(--glass-brd)',
  color: 'var(--ink)',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  outline: 'none',
};
const labelStyle: CSSProperties = { fontSize: 11, color: 'var(--ink-dim)', marginBottom: 4, display: 'block' };

function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label style={{ display: 'block' }}>
      <span style={labelStyle}>{label}</span>
      <input style={inputStyle} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function AdminConfigForm() {
  const [fb, setFb] = useState<Record<FbKey, string>>(FB_DEFAULTS);
  const [orKey, setOrKey] = useState('');
  const [orModel, setOrModel] = useState('meta-llama/llama-3-8b-instruct:free');
  const [sessionId, setSessionId] = useState(DEFAULT_SESSION_ID);
  const [password, setPassword] = useState('');
  const [cipher, setCipher] = useState('');
  const [status, setStatus] = useState('');

  const setFbKey = (k: FbKey, v: string) => setFb((s) => ({ ...s, [k]: v }));

  const onEncrypt = () => {
    if (!password) return setStatus('⚠️ Введіть пароль шифрування');
    if (!fb.databaseURL) return setStatus('⚠️ databaseURL обовʼязковий');
    const config: AppConfig = {
      firebase: { ...fb },
      openrouter: { key: orKey, model: orModel || undefined },
      sessionId: sessionId || undefined,
    };
    const ct = encryptJson(config, password);
    const back = decryptJson<AppConfig>(ct, password);
    setCipher(ct);
    setStatus(back ? '✓ Зашифровано та перевірено (round-trip OK)' : '⚠️ Помилка перевірки');
  };

  const snippet = cipher ? `export const ENCRYPTED_CONFIG = ${JSON.stringify(cipher)};` : '';
  const copy = () => {
    try {
      navigator.clipboard?.writeText(snippet);
      setStatus('📋 Рядок скопійовано — вставте у src/lib/encrypted-config.ts');
    } catch {
      setStatus('Скопіюйте рядок вручну');
    }
  };

  return (
    <div className="app-root" style={{ position: 'fixed', inset: 0, overflow: 'auto' }}>
      <div className="cosmos-bg" style={{ opacity: 0.5 }} />
      <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto', padding: '32px 20px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <img src={logo} alt="" style={{ height: 40 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Адмін · Шифрування конфігурації</div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>AES · ключ передається через #key= у посиланні</div>
          </div>
        </div>

        <div className="glass" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12, borderRadius: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--gold-soft)' }}>Firebase</div>
          {FB_ORDER.map((k) => (
            <Field key={k} label={k} value={fb[k]} onChange={(v) => setFbKey(k, v)} placeholder={k === 'apiKey' ? 'AIza…' : undefined} />
          ))}

          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, color: 'var(--gold-soft)', marginTop: 6 }}>OpenRouter</div>
          <Field label="OpenRouter API key" value={orKey} onChange={setOrKey} placeholder="sk-or-…" />
          <Field label="Модель" value={orModel} onChange={setOrModel} />

          <Field label="Session id (Firebase namespace)" value={sessionId} onChange={setSessionId} />

          <div style={{ height: 1, background: 'var(--hairline)', margin: '4px 0' }} />
          <Field label="Пароль шифрування (передасте у #key=)" value={password} onChange={setPassword} type="password" />

          <button className="btn btn-gold" onClick={onEncrypt} style={{ width: '100%', padding: '13px' }}>
            🔒 Зашифрувати
          </button>
          {status && <div style={{ fontSize: 12.5, color: 'var(--ink-dim)' }}>{status}</div>}
        </div>

        {cipher && (
          <div className="glass" style={{ padding: 18, marginTop: 16, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-dim)' }}>Вставте цей рядок у <b>src/lib/encrypted-config.ts</b> і закомітьте:</div>
            <textarea
              readOnly
              value={snippet}
              className="no-scrollbar"
              style={{ ...inputStyle, minHeight: 110, resize: 'vertical', fontFamily: 'monospace', fontSize: 11.5 }}
            />
            <button className="btn btn-ghost" onClick={copy} style={{ alignSelf: 'flex-start' }}>
              📋 Скопіювати рядок
            </button>
            <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', lineHeight: 1.5 }}>
              Посилання для модератора: <code>…/swot/?role=board#key=ВАШ_ПАРОЛЬ</code>
              <br />
              Посилання для вчителів: <code>…/swot/#key=ВАШ_ПАРОЛЬ</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

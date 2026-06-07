/* AccessError — shown when a config blob is committed but the URL key is missing
   or wrong (brief: "show access error if the password is invalid/absent"). */

import logo from '../../assets/logo.png';

export function AccessError() {
  return (
    <div className="app-root" style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', padding: 24 }}>
      <div className="cosmos-bg" style={{ opacity: 0.5 }} />
      <div
        className="glass"
        style={{
          position: 'relative',
          maxWidth: 420,
          textAlign: 'center',
          padding: '34px 28px',
          borderRadius: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <img src={logo} alt="" style={{ height: 56, opacity: 0.9 }} />
        <div style={{ fontSize: 40 }}>🔒</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, margin: 0 }}>Доступ закрито</h1>
        <p style={{ color: 'var(--ink-dim)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Щоб приєднатися до місії, відкрийте посилання з ключем доступу, яке надіслав модератор —
          воно має закінчуватися на <code style={{ color: 'var(--gold-soft)' }}>#key=…</code>.
        </p>
      </div>
    </div>
  );
}

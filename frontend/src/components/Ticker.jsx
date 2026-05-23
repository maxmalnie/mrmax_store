// Animowany pasek z hasłami u góry — z mockupu
const ITEMS = [
  'DROP 01 · WEARABLE WALLS',
  'EDITION OF 50 / NUMBERED',
  'PRINT-ON-DEMAND · MADE TO ORDER',
  'FREE EU SHIPPING OVER €120',
  'ARTIST OWNED · NO RESELLERS',
];

export default function Ticker() {
  // Powiel zawartość 2× żeby pętla była ciągła
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((text, i) => (
          <span key={i}>
            <svg viewBox="0 0 8 8" aria-hidden="true">
              <circle cx="4" cy="4" r="3" fill="currentColor" />
            </svg>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

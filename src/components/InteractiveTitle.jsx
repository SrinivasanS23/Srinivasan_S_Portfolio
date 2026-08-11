import React from 'react';

/**
 * InteractiveTitle
 * Splits text into words and individual characters with whiteSpace: nowrap on word wrappers
 * so:
 * 1. Words NEVER break awkwardly mid-word across lines (e.g. "Vis" on line 1, "iting" on line 2).
 * 2. Hovering over a particular letter triggers the PURE GOLD hover glow ONLY for that specific letter.
 */
export default function InteractiveTitle({
  text,
  children,
  as: Component = 'span',
  className = '',
  style = {},
  ...props
}) {
  const content = text !== undefined ? String(text) : (typeof children === 'string' || typeof children === 'number' ? String(children) : null);

  if (content !== null) {
    const words = content.split(' ');

    return (
      <Component className={className} style={{ ...style, display: 'inline-block' }} {...props}>
        {words.map((word, wIdx) => (
          <span
            key={wIdx}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap'
            }}
          >
            {word.split('').map((char, cIdx) => (
              <span
                key={cIdx}
                className="char-hover"
              >
                {char}
              </span>
            ))}
            {wIdx < words.length - 1 && (
              <span style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                {'\u00A0'}
              </span>
            )}
          </span>
        ))}
      </Component>
    );
  }

  return (
    <Component className={className} style={style} {...props}>
      {children}
    </Component>
  );
}

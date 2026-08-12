import React from 'react';

/**
 * InteractiveTitle
 * Splits text into words and individual characters with whiteSpace: nowrap on word wrappers:
 * 1. Prevents awkward mid-word breaks across lines.
 * 2. Pure 24K Gold hover effect on desktop.
 * 3. Mobile touch-glide & tap gold glow interaction: as the user taps or glides their finger over characters on mobile, each character lights up in pure gold.
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

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.classList && target.classList.contains('char-hover')) {
        target.classList.add('char-hover-active');
        setTimeout(() => {
          target.classList.remove('char-hover-active');
        }, 700);
      }
    }
  };

  const handleTouchStart = (e) => {
    const el = e.currentTarget;
    if (el && el.classList && el.classList.contains('char-hover')) {
      el.classList.add('char-hover-active');
      setTimeout(() => {
        el.classList.remove('char-hover-active');
      }, 700);
    }
  };

  if (content !== null) {
    const words = content.split(' ');

    return (
      <Component
        className={className}
        style={{ ...style, display: 'inline-block' }}
        onTouchMove={handleTouchMove}
        {...props}
      >
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
                onTouchStart={handleTouchStart}
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

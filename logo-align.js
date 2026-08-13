function alignLogo(){
  const name = document.querySelector('.logo-name');
  const tagline = document.querySelector('.logo-tagline');
  if (!name || !tagline) return;

  name.style.transform = 'none';
  name.style.letterSpacing = '0px';

  const w0 = name.getBoundingClientRect().width;
  const taglineWidth = tagline.getBoundingClientRect().width;

  const n = name.textContent.length;
  const gaps = n - 1;
  if (gaps <= 0) return;

  // Measure again with a trial spacing to learn whether this browser adds
  // an extra invisible gap after the last character (some do, some don't —
  // it varies by rendering engine). Two real measurements let us detect it
  // instead of guessing.
  const trial = 2;
  name.style.letterSpacing = trial + 'px';
  const w1 = name.getBoundingClientRect().width;
  name.style.letterSpacing = '0px';

  const rate = (w1 - w0) / trial; // width added per 1px of letter-spacing
  if (rate <= 0) return;

  const trailingUnits = rate - gaps; // ~0 if no trailing gap, ~1 if there is one

  // Spacing needed so the *visible* text (P through X) spans exactly
  // taglineWidth — independent of any invisible trailing gap.
  const finalSpacing = (taglineWidth - w0) / gaps;

  // If there's an invisible trailing gap, the box is wider than the visible
  // text by trailingUnits * finalSpacing, and centering that box shifts the
  // visible glyphs left by half that amount. Shift back to compensate.
  const shift = (trailingUnits * finalSpacing) / 2;

  name.style.letterSpacing = finalSpacing + 'px';
  name.style.transform = shift ? `translateX(${shift}px)` : 'none';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', alignLogo);
} else {
  alignLogo();
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(alignLogo);
}

window.addEventListener('resize', alignLogo);

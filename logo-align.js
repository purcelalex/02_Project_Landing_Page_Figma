function alignLogo(){
  const name = document.querySelector('.logo-name');
  const tagline = document.querySelector('.logo-tagline');
  if (!name || !tagline) return;

  name.style.letterSpacing = 'normal';

  const nameWidth = name.getBoundingClientRect().width;
  const taglineWidth = tagline.getBoundingClientRect().width;
  const gaps = name.textContent.length - 1;
  if (gaps <= 0) return;

  const spacing = (taglineWidth - nameWidth) / gaps;
  name.style.letterSpacing = spacing + 'px';
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

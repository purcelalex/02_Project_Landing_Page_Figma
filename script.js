const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', function(e){
  e.preventDefault();
  status.textContent = '';
  status.className = 'form-status';

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  const subject = encodeURIComponent(`New message from ${name} — Clarity Coaching site`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

  window.location.href = `mailto:purcelalex@outlook.com?subject=${subject}&body=${body}`;

  status.textContent = "Your email app should open with the message ready — just hit send there to deliver it.";
  status.className = 'form-status success';
});

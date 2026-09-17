const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

const requestType = new URLSearchParams(window.location.search).get('service');
const requestMessages = {
  'free-sample': 'I would like to request a free data cleaning sample (maximum 100 rows). Please let me know the next steps and the secure transfer method.',
  'quote': 'I would like to request a quote for a data cleaning project. Please let me know what project details you need.'
};

if (requestMessages[requestType] && !form.message.value) {
  form.message.value = requestMessages[requestType];
}

form.addEventListener('submit', function(e){
  e.preventDefault();
  status.textContent = '';
  status.className = 'form-status';

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  const topic = requestType === 'free-sample' ? 'Free data cleaning sample' : requestType === 'quote' ? 'Data cleaning quote' : 'Website enquiry';
  const subject = encodeURIComponent(`${topic} from ${name} — PURCELALEX`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

  status.textContent = "Your email app should open with the message ready — just hit send there to deliver it.";
  status.className = 'form-status success';
  form.reset();

  window.location.href = `mailto:purcelalex@outlook.com?subject=${subject}&body=${body}`;
});

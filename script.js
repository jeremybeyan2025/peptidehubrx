const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('#navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });
}

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => navLinks?.classList.remove('open'));
});

const leadForm = document.querySelector('#leadForm');
const formMessage = document.querySelector('#formMessage');

if (leadForm && formMessage) {
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(leadForm));
    console.log('Lead captured:', data);
    formMessage.textContent = 'Received. A care coordinator would review this request next.';
    leadForm.reset();
  });
}

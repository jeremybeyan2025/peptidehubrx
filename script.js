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
  link.addEventListener('click', () => {
    navLinks?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

// Reliable JavaScript marquee fallback for GitHub Pages/mobile browsers.
function startTicker() {
  const ticker = document.querySelector('.ticker-track');
  if (!ticker || prefersReducedMotion) return;

  const firstGroup = ticker.querySelector('.ticker-group');
  if (!firstGroup) return;

  let distance = firstGroup.scrollWidth;
  let position = 0;
  let lastTime = performance.now();
  const speed = window.innerWidth < 600 ? 28 : 42;

  const resizeObserver = new ResizeObserver(() => {
    distance = firstGroup.scrollWidth;
  });
  resizeObserver.observe(firstGroup);

  ticker.classList.add('js-ticker-active');

  function animate(now) {
    const delta = (now - lastTime) / 1000;
    lastTime = now;
    position -= speed * delta;

    if (Math.abs(position) >= distance) {
      position = 0;
    }

    ticker.style.transform = `translate3d(${position}px, 0, 0)`;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

startTicker();

const leadForm = document.querySelector('#leadForm');
const formMessage = document.querySelector('#formMessage');

if (leadForm && formMessage) {
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(leadForm));
    console.log('PeptideHubRx lead captured:', data);
    formMessage.textContent = 'Received. A care coordinator would review this eligibility request next.';
    leadForm.reset();
  });
}

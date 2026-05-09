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
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

if (!prefersReducedMotion) {
  const layers = document.querySelectorAll('[data-depth]');
  let pointerX = 0;
  let pointerY = 0;
  let scrollY = window.scrollY;
  let ticking = false;

  const animateLayers = () => {
    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 0);
      const x = pointerX * depth * 22;
      const y = pointerY * depth * 18 + scrollY * depth * 0.12;
      layer.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.07)`;
    });
    ticking = false;
  };

  const requestLayerTick = () => {
    if (!ticking) {
      requestAnimationFrame(animateLayers);
      ticking = true;
    }
  };

  window.addEventListener('pointermove', (event) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    requestLayerTick();
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    requestLayerTick();
  }, { passive: true });

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1200px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

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

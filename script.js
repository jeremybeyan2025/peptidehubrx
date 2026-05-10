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

    if (Math.abs(position) >= distance) position = 0;

    ticker.style.transform = `translate3d(${position}px, 0, 0)`;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

startTicker();

const pathQuiz = document.querySelector('#pathQuiz');
const quizResult = document.querySelector('#quizResult');

if (pathQuiz && quizResult) {
  pathQuiz.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(pathQuiz));

    const paths = {
      repair: {
        title: 'Repair + Resilience Path',
        body: 'Best starting conversation: recovery, tissue-support education, medication review, injury history, inflammatory burden, and provider screening. Relevant education pages: BPC-157, TB-500, and KPV.'
      },
      metabolic: {
        title: 'Metabolic Clarity Path',
        body: 'Best starting conversation: GLP-1 history, appetite, protein intake, resistance training, hydration, GI tolerance, labs, and clinician monitoring. Relevant education page: GLP-1s.'
      },
      glow: {
        title: 'Glow + Barrier Path',
        body: 'Best starting conversation: skin quality, hair-support goals, barrier health, inflammation, cosmetic expectations, and claim-safe education. Relevant education pages: GHK-Cu and KPV.'
      },
      focus: {
        title: 'Sleep + Focus Path',
        body: 'Best starting conversation: sleep quality, stress load, focus goals, stimulant or medication use, mental-health history, and neurologic safety review. Relevant education pages: DSIP and Semax.'
      }
    };

    const selected = paths[data.goal] || {
      title: 'Provider Review Path',
      body: 'Best starting conversation: goals, safety flags, current medications, medical history, and whether peptide education is appropriate at all.'
    };

    let safety = 'Next step: bring this path to a qualified clinician for screening. This does not recommend a compound, dose, or protocol.';
    if (data.flags === 'yes' || data.support === 'none') {
      safety = 'Priority: clinician review first. Safety flags or lack of oversight should be addressed before any treatment discussion.';
    }

    quizResult.innerHTML = `<strong>${selected.title}</strong>${selected.body}<span>${safety}</span>`;
    quizResult.classList.add('show');
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

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

function setLeadGoal(goalText) {
  const leadGoalSelect = document.querySelector('#leadForm select[name="goal"]');
  if (!leadGoalSelect || !goalText) return;

  const normalizedGoal = goalText.trim().toLowerCase();
  let matchedOption = Array.from(leadGoalSelect.options).find((option) => {
    return option.value.trim().toLowerCase() === normalizedGoal || option.textContent.trim().toLowerCase() === normalizedGoal;
  });

  if (!matchedOption) {
    matchedOption = document.createElement('option');
    matchedOption.value = goalText;
    matchedOption.textContent = goalText;
    leadGoalSelect.appendChild(matchedOption);
  }

  leadGoalSelect.value = matchedOption.value;
  leadGoalSelect.dispatchEvent(new Event('change', { bubbles: true }));
}

function addQuizSummaryToLeadForm(title, body, safety) {
  const leadForm = document.querySelector('#leadForm');
  if (!leadForm) return;

  let summary = document.querySelector('#leadQuizSummary');
  if (!summary) {
    summary = document.createElement('div');
    summary.id = 'leadQuizSummary';
    summary.className = 'quiz-result show lead-quiz-summary';
    leadForm.prepend(summary);
  }

  summary.innerHTML = `<strong>${title}</strong>${body}<span>${safety}</span>`;

  let hiddenPath = leadForm.querySelector('input[name="quiz_path"]');
  if (!hiddenPath) {
    hiddenPath = document.createElement('input');
    hiddenPath.type = 'hidden';
    hiddenPath.name = 'quiz_path';
    leadForm.appendChild(hiddenPath);
  }
  hiddenPath.value = `${title} — ${body} — ${safety}`;
}

function goToLeadForm() {
  const contactSection = document.querySelector('#contact');
  const nameField = document.querySelector('#leadForm input[name="name"]');
  if (!contactSection) return;

  contactSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => nameField?.focus({ preventScroll: true }), 550);
}

const pathQuiz = document.querySelector('#pathQuiz');
const quizResult = document.querySelector('#quizResult');

if (pathQuiz && quizResult) {
  pathQuiz.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(pathQuiz));

    const paths = {
      repair: {
        title: 'Repair + Resilience Path',
        body: 'Best starting conversation: recovery, tissue-support education, medication review, injury history, inflammatory burden, and provider screening. Relevant education pages: BPC-157, TB-500, and KPV.',
        leadGoal: 'Recovery support education'
      },
      metabolic: {
        title: 'Metabolic Clarity Path',
        body: 'Best starting conversation: GLP-1 history, appetite, protein intake, resistance training, hydration, GI tolerance, labs, and clinician monitoring. Relevant education page: GLP-1s.',
        leadGoal: 'Metabolic support education'
      },
      glow: {
        title: 'Glow + Barrier Path',
        body: 'Best starting conversation: skin quality, hair-support goals, barrier health, inflammation, cosmetic expectations, and claim-safe education. Relevant education pages: GHK-Cu and KPV.',
        leadGoal: 'General peptide education'
      },
      focus: {
        title: 'Sleep + Focus Path',
        body: 'Best starting conversation: sleep quality, stress load, focus goals, stimulant or medication use, mental-health history, and neurologic safety review. Relevant education pages: DSIP and Semax.',
        leadGoal: 'Sleep or cognitive education'
      }
    };

    const selected = paths[data.goal] || {
      title: 'Provider Review Path',
      body: 'Best starting conversation: goals, safety flags, current medications, medical history, and whether peptide education is appropriate at all.',
      leadGoal: 'General peptide education'
    };

    let safety = 'Next step: bring this path to a qualified clinician for screening. This does not recommend a compound, dose, or protocol.';
    if (data.flags === 'yes' || data.support === 'none') {
      safety = 'Priority: clinician review first. Safety flags or lack of oversight should be addressed before any treatment discussion.';
    }

    quizResult.innerHTML = `<strong>${selected.title}</strong>${selected.body}<span>${safety}</span><button type="button" class="btn btn-primary quiz-continue" id="continueToLead">Continue to Intake Form</button>`;
    quizResult.classList.add('show');

    setLeadGoal(selected.leadGoal);
    addQuizSummaryToLeadForm(selected.title, selected.body, safety);

    quizResult.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });

    const continueButton = document.querySelector('#continueToLead');
    continueButton?.addEventListener('click', goToLeadForm, { once: true });
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

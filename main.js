const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');

if (navToggle && siteNav) {
  const closeNavigation = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    siteNav.classList.remove('is-open');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    siteNav.classList.toggle('is-open');
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNavigation);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeNavigation();
      navToggle.focus();
    }
  });
}

const billingButtons = document.querySelectorAll('.toggle-btn');
const priceElements = document.querySelectorAll('.price');

if (billingButtons.length && priceElements.length) {
  billingButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedBilling = button.dataset.billing;

      billingButtons.forEach((btn) => {
        const isSelected = btn === button;
        btn.classList.toggle('is-active', isSelected);
        btn.setAttribute('aria-pressed', String(isSelected));
      });

      priceElements.forEach((price) => {
        const amount = selectedBilling === 'yearly' ? price.dataset.yearly : price.dataset.monthly;
        price.textContent = `$${amount}`;
      });
    });
  });
}

const faqButtons = document.querySelectorAll('.faq-btn');

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const panelId = button.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
  });
});

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const validators = {
    fullName: (value) => value.trim().length >= 2 || 'Enter your full name (at least 2 characters).',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Enter a valid email address.',
    company: (value) => value.trim().length >= 2 || 'Enter your company name.',
    budget: (value) => Number(value) >= 1000 || 'Budget must be at least 1000 AUD.',
    message: (value) => value.trim().length >= 20 || 'Project brief must be at least 20 characters.'
  };

  const setFieldError = (input, message) => {
    const errorElement = document.getElementById(`error-${input.id}`);
    if (!errorElement) return;

    if (message) {
      errorElement.textContent = message;
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
    } else {
      errorElement.textContent = '';
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
    }
  };

  const validateInput = (input) => {
    const rule = validators[input.name];
    if (!rule) return true;
    const result = rule(input.value);
    if (result === true) {
      setFieldError(input, '');
      return true;
    }
    setFieldError(input, result);
    return false;
  };

  const allInputs = contactForm.querySelectorAll('input, textarea');
  allInputs.forEach((input) => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        validateInput(input);
      }
    });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let firstInvalid = null;
    let isFormValid = true;

    allInputs.forEach((input) => {
      const valid = validateInput(input);
      if (!valid && !firstInvalid) {
        firstInvalid = input;
      }
      isFormValid = isFormValid && valid;
    });

    const successMessage = contactForm.querySelector('.form-success');
    if (!successMessage) return;

    if (!isFormValid) {
      successMessage.textContent = 'Please fix the highlighted fields before submitting.';
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    successMessage.textContent = 'Thanks. Your request has been received and we will contact you shortly.';
    contactForm.reset();
  });
}

const sliderTrack = document.querySelector('[data-slider-track]');
const sliderButtons = document.querySelectorAll('[data-slide]');

if (sliderTrack && sliderButtons.length) {
  const cards = Array.from(sliderTrack.children);
  let currentStart = 0;

  const getVisibleCount = () => (window.innerWidth >= 760 ? 2 : 1);

  const render = () => {
    const visible = getVisibleCount();
    cards.forEach((card, index) => {
      const isVisible = index >= currentStart && index < currentStart + visible;
      card.hidden = !isVisible;
    });
  };

  sliderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const visible = getVisibleCount();
      const maxStart = Math.max(0, cards.length - visible);

      if (button.dataset.slide === 'next') {
        currentStart = Math.min(maxStart, currentStart + visible);
      }

      if (button.dataset.slide === 'prev') {
        currentStart = Math.max(0, currentStart - visible);
      }

      render();
    });
  });

  window.addEventListener('resize', () => {
    const visible = getVisibleCount();
    currentStart = Math.min(currentStart, Math.max(0, cards.length - visible));
    render();
  });

  render();
}

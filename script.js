/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — script.js
   Sections:
     1. Theme Toggle (Dark / Light)
     2. Navigation — scroll behaviour + active link
     3. Hamburger / Mobile Menu
     4. Scroll Reveal
     5. Skill Bars (animate on scroll)
     6. Project Filter
     7. Contact Form (validation + char count)
═══════════════════════════════════════════════════════════ */

/* ─── Grab elements once ─────────────────────────────────── */
const nav          = document.getElementById('nav');
const themeToggle  = document.getElementById('themeToggle');
const themeIcon    = document.getElementById('themeIcon');
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
const navLinks     = document.querySelectorAll('.nav-links a');
const sections     = document.querySelectorAll('section[id]');
const revealEls    = document.querySelectorAll('.reveal');
const barFills     = document.querySelectorAll('.bar-fill');
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm  = document.getElementById('contactForm');
const formStatus   = document.getElementById('formStatus');
const msgTextarea  = document.getElementById('message');
const charCountEl  = document.getElementById('charCount');

/* ═══════════════════════════════════════════════════════════
   1. THEME TOGGLE — Dark / Light Mode
   Persists preference to localStorage.
═══════════════════════════════════════════════════════════ */
let currentTheme = localStorage.getItem('portfolio-theme') || 'dark';

// Apply saved theme on load
applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
  localStorage.setItem('portfolio-theme', currentTheme);
});

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  // Swap icon
  if (theme === 'dark') {
    themeIcon.className = 'fa-solid fa-sun';   // show sun (click to go light)
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  } else {
    themeIcon.className = 'fa-solid fa-moon';  // show moon (click to go dark)
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
}

/* ═══════════════════════════════════════════════════════════
   3. NAVIGATION
   a) Add frosted-glass background when scrolled
   b) Highlight active nav link based on scroll position
═══════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  handleNavScroll();
  updateActiveNavLink();
}, { passive: true });

function handleNavScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}

function updateActiveNavLink() {
  let currentSection = '';
  const scrollMidpoint = window.scrollY + window.innerHeight / 2;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollMidpoint >= top && scrollMidpoint < bottom) {
      currentSection = section.id;
    }
  });

  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === '#' + currentSection;
    link.classList.toggle('active', isActive);
  });
}

/* ═══════════════════════════════════════════════════════════
   4. HAMBURGER / MOBILE MENU
   Toggle the mobile dropdown and animate the hamburger icon.
═══════════════════════════════════════════════════════════ */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is tapped
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const clickedOutside =
    !hamburger.contains(e.target) && !mobileMenu.contains(e.target);
  if (clickedOutside && mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  }
});

function closeMobileMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
}

/* ═══════════════════════════════════════════════════════════
   5. SCROLL REVEAL
   Elements with class="reveal" fade in when they enter view.
═══════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════════════════
   6. SKILL BARS
   Animate width from 0% to the data-width value when visible.
═══════════════════════════════════════════════════════════ */
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.width + '%';
        barObserver.unobserve(fill);
      }
    });
  },
  { threshold: 0.3 }
);

barFills.forEach(bar => barObserver.observe(bar));

/* ═══════════════════════════════════════════════════════════
   7. PROJECT FILTER
   Show/hide cards based on selected category.
═══════════════════════════════════════════════════════════ */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;

      if (match) {
        card.style.display = 'flex';
        // Small re-entrance animation
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ═══════════════════════════════════════════════════════════
   8. CONTACT FORM
   a) Character counter for the message textarea
   b) Client-side validation
   c) Simulated send with loading state
═══════════════════════════════════════════════════════════ */

// — Character Counter —
msgTextarea.addEventListener('input', () => {
  charCountEl.textContent = msgTextarea.value.length;
});

// — Form Submit —
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearFormStatus();

  const fname   = contactForm.fname.value.trim();
  const lname   = contactForm.lname.value.trim();
  const email   = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate
  if (!fname || !lname) {
    showFormStatus('error', '⚠️ Please enter both your first and last name.');
    return;
  }

  if (!email || !emailPattern.test(email)) {
    showFormStatus('error', '⚠️ Please enter a valid email address.');
    return;
  }

  if (!message) {
    showFormStatus('error', '⚠️ Please write a message before sending.');
    return;
  }

  if (window.location.protocol === 'file:' || window.location.origin === 'null') {
    showFormStatus(
      'error',
      '⚠️ FormSubmit cannot send messages from a local HTML file. Please test this page through a local web server or deploy it online first.'
    );
    return;
  }

  const submitBtn = contactForm.querySelector('[type="submit"]');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  try {
    const formData = new FormData(contactForm);
    const response = await fetch(contactForm.action, {
      method: 'POST',
      mode: 'cors',
      body: formData
    });

    if (response.ok) {
      showFormStatus(
        'success',
        `✅ Message sent! Thanks, ${fname}. I'll get back to you soon.`
      );
      contactForm.reset();
      charCountEl.textContent = '0';
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    showFormStatus(
      'error',
      '⚠️ Unable to send your message right now. Please try again later or use a live web server.'
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
  }
});

function showFormStatus(type, message) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
}

function clearFormStatus() {
  formStatus.textContent = '';
  formStatus.className = 'form-status';
}

/* ─── Keyframe for filter re-entrance (injected once) ───── */
(function injectFilterAnimation() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ═══════════════════════════════════════════════════════════
   9. PARTICLE BACKGROUND ANIMATION
   Creates floating animated particles that connect when close.
═══════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 50;
  const connectionDistance = 150;

  // Resize canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.radius = Math.random() * 2 + 1;
      
      // Check current theme
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' || !document.documentElement.getAttribute('data-theme');
      
      if (isDarkMode) {
        // Dark mode: blue particles
        this.color = Math.random() > 0.7 
          ? 'rgba(79, 142, 247, 0.6)'  
          : 'rgba(79, 142, 247, 0.3)';
        this.connectionColor = 'rgba(79, 142, 247, 0.3)';
      } else {
        // Light mode: bright white particles (more visible)
        this.color = Math.random() > 0.7 
          ? 'rgba(79, 142, 247, 0.9)'  // brighter blue
          : 'rgba(79, 142, 247, 0.6)'; // medium blue
        this.connectionColor = 'rgba(79, 142, 247, 0.4)';
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Keep in bounds
      this.x = Math.max(0, Math.min(canvas.width, this.x));
      this.y = Math.max(0, Math.min(canvas.height, this.y));
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Draw connections
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = 1 - (distance / connectionDistance);
          const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' || !document.documentElement.getAttribute('data-theme');
          const lineColor = isDarkMode 
            ? `rgba(79, 142, 247, ${opacity * 0.3})`
            : `rgba(79, 142, 247, ${opacity * 0.5})`; // brighter in light mode
          
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' || !document.documentElement.getAttribute('data-theme');
    const bgColor = isDarkMode 
      ? 'rgba(15, 17, 23, 0.05)'
      : 'rgba(248, 249, 251, 0.08)'; // slightly higher opacity for light mode trail
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
  }

  animate();
})();

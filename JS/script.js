/* ============================================
   HerGonz AI Agency - Interactive Scripts
   Futuristic Particle System & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // THEME SWITCHER (Light / Dark)
  // ============================================
  (() => {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Aplica el tema y anima la transición sin afectar al estado inicial
    function applyTheme(theme, animate) {
      if (animate) {
        root.classList.add('theme-transition');
        // Quita la clase tras la transición para no interferir con otros estilos
        window.setTimeout(() => root.classList.remove('theme-transition'), 450);
      }
      root.setAttribute('data-theme', theme);
      if (toggle) {
        toggle.setAttribute('aria-checked', String(theme === 'dark'));
      }
    }

    // El tema ya fue fijado por el script inline del <head> (evita parpadeo);
    // aquí solo sincronizamos el estado del botón.
    applyTheme(root.getAttribute('data-theme') || 'dark', false);

    if (toggle) {
      toggle.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next, true);
      });
    }

    // Si el usuario no ha elegido manualmente, seguir la preferencia del sistema
    systemDark.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light', true);
      }
    });
  })();

  // ============================================
  // PARTICLE CANVAS SYSTEM
  // ============================================
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '99, 233, 245' : '54, 101, 143';
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Pulse opacity
        this.opacity = 0.15 + Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.15;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Create particles (fewer for performance)
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      const maxDist = 150;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDist) {
            const opacity = (1 - distance / maxDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = `rgba(99, 233, 245, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      connectParticles();
      animationId = requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Pause when tab not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animateParticles();
      }
    });
  }

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        // Reset dropdown cuando se cierra el menú hamburguesa
        const dropdownItem = navLinks.querySelector('.nav-item-dropdown');
        if (dropdownItem) dropdownItem.classList.remove('active');
      }
    });

    // Mobile Dropdown Accordion — abre/cierra el submenú sin cerrar el menú principal
    const dropdownTrigger = navLinks.querySelector('.nav-link-dropdown');
    if (dropdownTrigger) {
      dropdownTrigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
          e.preventDefault();
          e.stopPropagation();
          dropdownTrigger.parentElement.classList.toggle('active');
        }
      });
    }

    // Cerrar menú al hacer clic en un link normal (NO en el trigger del dropdown)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        // Si es el trigger del dropdown, ya se gestiona arriba → salir
        if (link.classList.contains('nav-link-dropdown')) return;
        // Cerrar el menú principal
        navLinks.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        // Cerrar también el submenú si estaba desplegado
        const dropdownItem = navLinks.querySelector('.nav-item-dropdown');
        if (dropdownItem) dropdownItem.classList.remove('active');
      });
    });
  }

  // ============================================
  // SCROLL REVEAL ANIMATION
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger children if they are in a grid
        const parent = entry.target;
        const revealChildren = parent.querySelectorAll('.reveal');

        if (revealChildren.length > 0) {
          revealChildren.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('revealed');
            }, index * 120);
          });
        }

        parent.classList.add('revealed');
        revealObserver.unobserve(parent);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  const counterElements = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const originalText = element.textContent;

    // Extraemos el número inicial y el resto del texto (p. ej. "150+" → 150 y "+")
    const numberMatch = originalText.match(/\d+/);
    if (!numberMatch || isNaN(target)) return;
    const suffix = originalText.replace(numberMatch[0], '');

    const duration = 2000;
    const frameRate = 16;
    const totalFrames = duration / frameRate;
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(easeOut * target);

      element.textContent = `${currentCount}${suffix}`;

      if (frame >= totalFrames) {
        clearInterval(counter);
        element.textContent = `${target}${suffix}`;
      }
    }, frameRate);
  }

  // ============================================
  // METRIC PROGRESS BARS
  // ============================================
  const metricBars = document.querySelectorAll('.metric-card__bar-fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animate');
        }, 300);
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  metricBars.forEach(bar => barObserver.observe(bar));

  // NOTA: el envío del formulario de contacto se gestiona en JS/n8n-send.js

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      // En móvil, el trigger del dropdown solo debe abrir el acordeón, NO hacer scroll
      if (this.classList.contains('nav-link-dropdown') && window.innerWidth <= 991) {
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ============================================
  // HERO BADGE ANIMATION
  // ============================================
  const heroBadge = document.querySelector('.hero__badge');
  if (heroBadge) {
    heroBadge.style.opacity = '0';
    heroBadge.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      heroBadge.style.transition = 'all 0.6s ease';
      heroBadge.style.opacity = '1';
      heroBadge.style.transform = 'translateY(0)';
    }, 400);
  }

  // ============================================
  // CARD TILT EFFECT ON HOVER
  // ============================================
  const tiltCards = document.querySelectorAll('.service-card, .benefit-card, .metric-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============================================
  // DYNAMIC YEAR IN FOOTER
  // ============================================
  const yearEl = document.querySelector('.footer__copyright');
  if (yearEl) {
    const year = new Date().getFullYear();
    yearEl.textContent = yearEl.textContent.replace(/\d{4}/, year);
  }

  // ============================================
  // WHATSAPP BUTTON SCROLL VISIBILITY
  // ============================================
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn) {
    // Initially hide
    whatsappBtn.style.opacity = '0';
    whatsappBtn.style.transform = 'scale(0.5) translateY(20px)';

    let whatsappShown = false;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400 && !whatsappShown) {
        whatsappShown = true;
        whatsappBtn.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        whatsappBtn.style.opacity = '1';
        whatsappBtn.style.transform = 'scale(1) translateY(0)';
      }
    }, { passive: true });
  }

  // ============================================
  // CURSOR GLOW EFFECT (Desktop only)
  // ============================================
  if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99, 233, 245, 0.04), transparent 70%);
      pointer-events: none;
      z-index: 0;
      transition: transform 0.1s ease;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }

  // ============================================
  // FAQ ACCORDION
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-item__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items (only one open at a time)
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          const otherTrigger = other.querySelector('.faq-item__trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      item.classList.toggle('active', !isActive);
      trigger.setAttribute('aria-expanded', String(!isActive));
    });
  });


});

// ============================================
// VIDEO DE FONDO — reinicia la reproducción al entrar en pantalla
// ============================================
const video = document.querySelector('.video-bg-container video');
const contenedor = document.querySelector('.video-bg-container');

if (video && contenedor) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.currentTime = 0;
        video.play();
      }
    });
  }, { threshold: 0.3 });

  videoObserver.observe(contenedor);
}

// ============================================
// WEB CREATION ANIMATION (PREMIUM SECTION)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const webCreationSection = document.getElementById('web-creation');
  const mockupContainer = document.querySelector('.wc-mockup-body');
  if (!webCreationSection || !mockupContainer) return;

  const steps = document.querySelectorAll('.wc-step');
  const dots = document.querySelectorAll('.wc-flow-dot');
  let animationTriggered = false;
  let currentStep = 0;
  let animationTimeout;

  const runAnimationFlow = () => {
    if (currentStep >= steps.length) return;

    // Remove active from all
    steps.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    // Add active to current
    if (steps[currentStep]) steps[currentStep].classList.add('active');
    
    // Update dots (all up to current should be active)
    for (let i = 0; i <= currentStep; i++) {
      if (dots[i]) dots[i].classList.add('active');
    }

    // Schedule next step
    let delay = 3500; // default delay
    if (currentStep === 0) delay = 3500; // Chat typing
    if (currentStep === 1) delay = 2500; // Wireframe
    if (currentStep === 2) delay = 3500; // Code
    if (currentStep === 3) delay = 3000; // Mobile
    if (currentStep === 4) return; // Stop at final step

    currentStep++;
    animationTimeout = setTimeout(runAnimationFlow, delay);
  };

  // Trigger animation on scroll
  const wcObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animationTriggered) {
        animationTriggered = true;
        // Small delay before starting
        setTimeout(() => {
          currentStep = 0;
          runAnimationFlow();
        }, 500);
      }
    });
  }, { threshold: 0.4 });

  wcObserver.observe(webCreationSection);

  // Replay button logic
  const btnReplay = document.getElementById('btn-demo-replay');
  if (btnReplay) {
    btnReplay.addEventListener('click', (e) => {
      e.preventDefault();
      clearTimeout(animationTimeout);
      currentStep = 0;
      runAnimationFlow();
    });
  }

  // (Dropdown toggle is handled inside the navToggle block above)
});
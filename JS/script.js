/* ============================================
   HerGonz AI Agency - Interactive Scripts
   Futuristic Particle System & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

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
      }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
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
  const target = parseInt(element.getAttribute('data-count'));
  const originalText = element.textContent;

  // Extraemos el número inicial y el resto del texto
  const numberMatch = originalText.match(/\d+/);
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

  // ============================================
  // FORM HANDLING
  // ============================================
  //const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = {
        name: document.getElementById('form-name').value,

        email: document.getElementById('form-email').value,
        phone: document.getElementById('form-phone').value,
        business: document.getElementById('form-business').value
      };

      const submitBtn = document.getElementById('form-submit');
      const originalText = submitBtn.innerHTML;

      // Simulate submission


    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

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


})

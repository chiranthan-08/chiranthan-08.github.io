/**
 * CHIRANTHAN SIDDU K S - PORTFOLIO INTERACTIVE CONTROLLER
 * Handles typing animation, skill filtering, modals, copy actions, form handling, and navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Dynamic Typing Effect
  // =========================================================================
  const typedTextElement = document.getElementById('typedText');
  const roles = [
    'Information Science Engineer',
    'Full Stack MERN Developer',
    'AWS Cloud Champ Lead',
    'Artificial Intelligence Enthusiast',
    'Python & Java Programmer',
    'Guinness World Record Hackathonian'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeRole() {
    if (!typedTextElement) return;

    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(typeRole, typingSpeed);
  }
  typeRole();

  // =========================================================================
  // 2. Navbar Scroll Behavior & Active Section Observer
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar background blur on scroll
    if (scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    // Active navigation highlighting
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =========================================================================
  // 3. Mobile Drawer Navigation
  // =========================================================================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('active');
    mobileDrawer?.setAttribute('aria-hidden', 'false');
    mobileMenuToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('active');
    mobileDrawer?.setAttribute('aria-hidden', 'true');
    mobileMenuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileMenuToggle?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // =========================================================================
  // 4. Skills Category Filtering
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // =========================================================================
  // 5. Stats Number Counter Animation
  // =========================================================================
  const counters = document.querySelectorAll('.counter');
  let hasAnimatedStats = false;

  const statsSection = document.querySelector('.stats-container');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimatedStats) {
            hasAnimatedStats = true;
            counters.forEach(counter => {
              const target = parseFloat(counter.getAttribute('data-target'));
              const decimals = parseInt(counter.getAttribute('data-decimal') || '0', 10);
              const duration = 1800; // ms
              const stepTime = 20;
              const steps = duration / stepTime;
              const increment = target / steps;
              let current = 0;

              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  counter.textContent = decimals > 0 ? target.toFixed(decimals) : target.toString();
                  clearInterval(timer);
                } else {
                  counter.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString();
                }
              }, stepTime);
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    statsObserver.observe(statsSection);
  }

  // =========================================================================
  // 6. Project Details Data & Modal Controller
  // =========================================================================
  const projectsData = {
    'student-connect': {
      title: 'Student Connect — Karnataka Engineering Hub',
      badge: 'Academic Flagship',
      category: 'Web-Based Platform',
      image: 'assets/images/project-student-connect.svg',
      description: 'A comprehensive web application that centralises critical admissions data, cutoffs, ratings, and events for engineering institutions across Karnataka.',
      highlights: [
        'Designed multi-criteria search algorithms for branch, location, cutoff rank range, and institutional ranking.',
        'Created a responsive, cross-platform interface compatible with mobile, tablet, and desktop viewport sizes.',
        'Implemented real-time notification pipelines for college admission deadlines, state counseling updates, and symposiums.',
        'Optimized client-side rendering for instant search filtering and fast indexing.'
      ],
      techStack: ['JavaScript (ES6+)', 'HTML5 / Modern CSS', 'Responsive UI', 'Search Filters', 'REST API Client'],
      role: 'Lead Full-Stack Developer'
    },
    'event-ai': {
      title: 'AI-Powered Event Management Platform',
      badge: 'Full Stack MERN + AI',
      category: 'AI & Full Stack Application',
      image: 'assets/images/project-event-ai.svg',
      description: 'An intelligent event planning and attendance ecosystem built with React.js, Node.js, Express.js, and MongoDB, augmented by AI optimization.',
      highlights: [
        'Engineered an AI-powered schedule & logistics generator to assist organizers in planning venue capacity, time slots, and speaker agendas.',
        'Developed real-time QR/Attendance monitoring systems for live participant tracking.',
        'Integrated geolocation-based event discovery and interactive venue map routing.',
        'Configured strict Role-Based Access Control (RBAC) with secure JWT tokens for 3 distinct roles: Users, Organisers, and Administrators.'
      ],
      techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'WebSockets', 'AI Models'],
      role: 'Full-Stack & AI Systems Architect'
    },
    'aws-cloud': {
      title: 'AWS Cloud Infrastructure & Containerized Deployments',
      badge: 'AWS Certified Leadership',
      category: 'Cloud Computing & DevOps',
      image: 'assets/images/project-aws-cloud.svg',
      description: 'Scalable cloud infrastructure blueprints, containerization pipelines, and technical research developed under the AWS Cloud Champ Club.',
      highlights: [
        'Configured scalable multi-tier architectures utilizing Amazon EC2, S3 bucket storage, and IAM least-privilege security policies.',
        'Implemented Docker containerization for MERN stack services to achieve parity across development and deployment environments.',
        'Accredited through IIT Madras (NPTEL Cloud Computing) and AWS Cloud Quest: Cloud Practitioner certification.',
        'Led peer mentorship workshops demonstrating cloud deployments, Linux CLI administration, and CI/CD pipelines.'
      ],
      techStack: ['AWS Cloud (EC2, S3, IAM)', 'Docker', 'Linux CLI', 'Git & GitHub Actions', 'IIT Madras NPTEL'],
      role: 'Innovation & Research Lead (AWS Cloud Champ Club)'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalProjectBody = document.getElementById('modalProjectBody');
  const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
  const closeProjectFooterBtn = document.getElementById('closeProjectFooterBtn');
  const viewProjectBtns = document.querySelectorAll('.view-project-btn');

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data || !projectModal || !modalProjectBody || !modalProjectTitle) return;

    modalProjectTitle.textContent = data.title;

    modalProjectBody.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; max-height: 240px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" />
      </div>
      <div style="display: flex; gap: 0.5rem; margin-bottom: 0.85rem; flex-wrap: wrap;">
        <span class="project-badge-highlight">${data.badge}</span>
        <span class="tag">${data.category}</span>
        <span class="tag" style="color: var(--cyan-primary);"><i class="fa-solid fa-user-gear"></i> ${data.role}</span>
      </div>
      <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem; font-size: 0.95rem;">${data.description}</p>
      
      <h4 style="font-family: var(--font-heading); font-size: 1rem; color: var(--text-primary); margin-bottom: 0.6rem;">Key Engineering Highlights:</h4>
      <ul style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem;">
        ${data.highlights.map(item => `<li style="font-size: 0.88rem; color: var(--text-secondary); display: flex; gap: 0.5rem;"><i class="fa-solid fa-circle-check text-cyan" style="margin-top: 0.2rem;"></i> <span>${item}</span></li>`).join('')}
      </ul>

      <h4 style="font-family: var(--font-heading); font-size: 1rem; color: var(--text-primary); margin-bottom: 0.6rem;">Tech Stack & Tools:</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.45rem;">
        ${data.techStack.map(tech => `<span class="tag" style="background: rgba(0, 242, 254, 0.1); color: var(--cyan-primary); border-color: rgba(0, 242, 254, 0.3); font-weight: 600;">${tech}</span>`).join('')}
      </div>
    `;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    projectModal?.classList.remove('active');
    projectModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  viewProjectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      if (projectId) openProjectModal(projectId);
    });
  });

  closeProjectModalBtn?.addEventListener('click', closeProjectModal);
  closeProjectFooterBtn?.addEventListener('click', closeProjectModal);
  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  // =========================================================================
  // 7. Resume Modal Controller
  // =========================================================================
  const resumeModal = document.getElementById('resumeModal');
  const resumeModalBtn = document.getElementById('resumeModalBtn');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
  const closeResumeFooterBtn = document.getElementById('closeResumeFooterBtn');
  const openResumeTriggers = document.querySelectorAll('.open-resume-trigger');

  function openResumeModal() {
    resumeModal?.classList.add('active');
    resumeModal?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    resumeModal?.classList.remove('active');
    resumeModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  resumeModalBtn?.addEventListener('click', openResumeModal);
  openResumeTriggers.forEach(btn => btn.addEventListener('click', openResumeModal));
  closeResumeModalBtn?.addEventListener('click', closeResumeModal);
  closeResumeFooterBtn?.addEventListener('click', closeResumeModal);
  resumeModal?.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResumeModal();
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResumeModal();
      closeDrawer();
    }
  });

  // =========================================================================
  // 8. Toast Notifications & Copy to Clipboard
  // =========================================================================
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer;

  function showToast(message, isSuccess = true) {
    if (!toast || !toastMessage) return;

    clearTimeout(toastTimer);
    toastMessage.textContent = message;
    
    const icon = toast.querySelector('.toast-icon');
    if (icon) {
      icon.className = isSuccess 
        ? 'fa-solid fa-circle-check toast-icon text-cyan' 
        : 'fa-solid fa-triangle-exclamation toast-icon text-amber';
    }

    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // Copy Buttons handler
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied "${textToCopy}" to clipboard!`);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }
    });
  });

  // =========================================================================
  // 9. Contact Form Handler (Direct Mailto with auto prefill)
  // =========================================================================
  const contactForm = document.getElementById('portfolioContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('userName')?.value.trim();
      const email = document.getElementById('userEmail')?.value.trim();
      const subject = document.getElementById('msgSubject')?.value.trim();
      const message = document.getElementById('userMessage')?.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', false);
        return;
      }

      // Format mailto link
      const encodedSubject = encodeURIComponent(`[Portfolio Contact] ${subject}`);
      const encodedBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:chiranthansiddu20@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      // Open email client
      window.location.href = mailtoUrl;

      showToast('Opening your default email client to send message...');
      contactForm.reset();
    });
  }

  console.log('⚡ Chiranthan Siddu K S Portfolio Loaded Successfully.');
});

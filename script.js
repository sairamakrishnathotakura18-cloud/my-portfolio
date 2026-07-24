/**
 * Personal Portfolio Website - Sairamakrishna
 * JavaScript Interactive Features & UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initThemeToggle();
  initDynamicTyping();
  initNavbarScroll();
  initScrollSpy();
  initSkillProgress();
  initProjectFilters();
  initContactForm();
  initBackToTop();
  initScrollReveal();
});

/* ----------------------------------------------------
   1. Dark / Light Theme Toggle
---------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
      
      showToast(newTheme === 'dark' ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.className = 'fa-solid fa-moon';
      themeBtn.setAttribute('title', 'Switch to Dark Mode');
    } else {
      themeIcon.className = 'fa-solid fa-sun';
      themeBtn.setAttribute('title', 'Switch to Light Mode');
    }
  }
}

/* ----------------------------------------------------
   2. Dynamic Typing Animation in Hero
---------------------------------------------------- */
function initDynamicTyping() {
  const typedSpan = document.getElementById('typedText');
  if (!typedSpan) return;

  const roles = [
    'Full-Stack Developer',
    'UI/UX Design Architect',
    'AI & Web Systems Engineer',
    'Open Source Contributor'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 45;
  const pauseEnd = 2000;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delta = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delta = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delta = 500;
    }

    setTimeout(type, delta);
  }

  type();
}

/* ----------------------------------------------------
   3. Navbar Scroll Class Toggle & Mobile Collapse
---------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const navCollapse = document.getElementById('navbarNav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Close mobile nav on click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}

/* ----------------------------------------------------
   4. Active Navigation Link ScrollSpy
---------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ----------------------------------------------------
   5. Animated Skill Progress Bars
---------------------------------------------------- */
function initSkillProgress() {
  const skillSection = document.getElementById('skills');
  const progressFills = document.querySelectorAll('.progress-bar-fill');
  let animated = false;

  function checkScroll() {
    if (!skillSection) return;
    const sectionPos = skillSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.3;

    if (sectionPos < screenPos && !animated) {
      progressFills.forEach(fill => {
        const targetWidth = fill.getAttribute('data-percentage') || '85%';
        fill.style.width = targetWidth;
      });
      animated = true;
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Check on load
}

/* ----------------------------------------------------
   6. Project Category Filtering
---------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ----------------------------------------------------
   7. Contact Form Handling & Validation
---------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('❌ Please complete all required fields.', 'danger');
      return;
    }

    if (!validateEmail(email)) {
      showToast('⚠️ Please enter a valid email address.', 'warning');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...`;

    setTimeout(() => {
      const mailtoUrl = `mailto:sairamakrishnathotakura18@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      window.location.href = mailtoUrl;

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      form.reset();
      
      showToast(`🎉 Thank you, ${name}! Sending your message to sairamakrishnathotakura18@gmail.com.`);
    }, 1000);
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/* ----------------------------------------------------
   8. Back to Top Button
---------------------------------------------------- */
function initBackToTop() {
  const backBtn = document.getElementById('backToTopBtn');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ----------------------------------------------------
   9. Scroll Reveal Animations (Intersection Observer)
---------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.fade-in-up');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------
   10. Toast Notification System
---------------------------------------------------- */
function showToast(message, type = 'success') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.innerHTML = `<span>${message}</span>`;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ----------------------------------------------------
   11. Interactive Resume & Project Modals Helper
---------------------------------------------------- */
function triggerResumeDownload() {
  showToast('📄 Preparing Resume download...');
  setTimeout(() => {
    // Generate mock resume blob or download trigger
    const element = document.createElement('a');
    const resumeText = `=====================================================
SRK- FULL-STACK SOFTWARE ENGINEER
kakinada, India | sairamakrishnathotakura18@gmail.com | 
=====================================================

SUMMARY:
Passionate Software Engineer  crafting high-performance full-stack web applications, REST APIs, responsive UIs and python.

SKILLS:
- Languages: JavaScript (ES6+), Python, Java, C++, HTML5, CSS3/SASS, SQL
- Frameworks & Libraries: Express, React, Node.js, Django
- Tools & Cloud: Git, Docker, PostgreSQL, REST APIs, WebSockets, Figma

EXPERIENCE:
Full-Stack Engineer | 2025- Present
- 
Frontend Developer | WebCraft Digital | 2025 - PRESENT
- Built 5+ custom responsive client interfaces with Bootstrap 5 and modern JS.

EDUCATION:
B-TECH in Computer Science & Engineering | ITM University | 2025 - 2029
`;
    const file = new Blob([resumeText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'SRK_Software_Engineer_Resume.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('✅ Resume downloaded successfully!');
  }, 1000);
}

function openProjectModal(title, imageSrc, category, description, techArray, demoUrl, githubUrl) {
  const modalTitle = document.getElementById('projectModalTitle');
  const modalImg = document.getElementById('projectModalImg');
  const modalCategory = document.getElementById('projectModalCategory');
  const modalDesc = document.getElementById('projectModalDesc');
  const modalTech = document.getElementById('projectModalTech');
  const modalDemoBtn = document.getElementById('projectModalDemoBtn');
  const modalGithubBtn = document.getElementById('projectModalGithubBtn');

  if (modalTitle) modalTitle.textContent = title;
  if (modalImg) modalImg.src = imageSrc;
  if (modalCategory) modalCategory.textContent = category;
  if (modalDesc) modalDesc.textContent = description;

  if (modalTech) {
    modalTech.innerHTML = techArray.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
  }

  if (modalDemoBtn) modalDemoBtn.onclick = () => window.open(demoUrl || '#', '_blank');
  if (modalGithubBtn) modalGithubBtn.onclick = () => window.open(githubUrl || 'https://github.com', '_blank');

  const projectBsModal = new bootstrap.Modal(document.getElementById('projectDetailModal'));
  projectBsModal.show();
}

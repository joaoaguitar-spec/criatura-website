// Mobile nav toggle
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
menuBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', isOpen);
});
// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', false);
  });
});

// Pedra-Pão toggle
const pedraBtn = document.getElementById('pedra-btn');
const pedraPanel = document.getElementById('pedra-panel');
pedraBtn.addEventListener('click', () => {
  const isOpen = pedraPanel.classList.toggle('is-open');
  pedraBtn.setAttribute('aria-expanded', isOpen);
  pedraBtn.textContent = isOpen ? '← Fechar a Pedra-Pão' : 'A Pedra-Pão →';
  if (isOpen) {
    pedraPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--amber)' : '';
      });
    }
  });
}, { threshold: 0.3 });
sections.forEach(s => observer.observe(s));

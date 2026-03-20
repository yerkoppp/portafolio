// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const icon = themeToggle.querySelector('i');
const navLogo = document.getElementById('navLogo');

// Dark mode por defecto
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);
updateLogo(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    updateLogo(newTheme);
});

function updateThemeIcon(theme) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function updateLogo(theme) {
    navLogo.src = theme === 'dark' ? 'assets/icono_dark.png' : 'assets/icono_light.png';
}

// Acción del nuevo botón: lleva al simulador indicando que fue intencional
document.getElementById('androidModeBtn').addEventListener('click', () => {
    window.location.href = "android-portfolio.html?force=android";
});

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Cerrar menú al hacer click en un link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Accordion for certifications
document.querySelectorAll('.cert-category-header').forEach(header => {
    header.addEventListener('click', () => {
        const category = header.parentElement;
        const wasActive = category.classList.contains('active');
        
        // Cerrar todas las categorías
        document.querySelectorAll('.cert-category').forEach(cat => {
            cat.classList.remove('active');
        });
        
        // Abrir la clickeada si no estaba activa
        if (!wasActive) {
            category.classList.add('active');
        }
    });
});

// Abrir la primera categoría por defecto
const firstCategory = document.querySelector('.cert-category');
if (firstCategory) {
    firstCategory.classList.add('active');
}

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Parallax effect on hero
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// --- Modo Accesibilidad (Neurodivergente) ---
const neuroBtn = document.getElementById('neuroModeBtn');
const rootHtml = document.documentElement;

// Mantener preferencia al recargar o cambiar de Web a Android
if (localStorage.getItem('neuroMode') === 'true') {
    rootHtml.setAttribute('data-accesibilidad', 'neuro');
}

neuroBtn.addEventListener('click', () => {
    const isNeuro = rootHtml.getAttribute('data-accesibilidad') === 'neuro';
    if (isNeuro) {
        rootHtml.removeAttribute('data-accesibilidad');
        localStorage.setItem('neuroMode', 'false');
    } else {
        rootHtml.setAttribute('data-accesibilidad', 'neuro');
        localStorage.setItem('neuroMode', 'true');
    }
});
function activateSearch() {
    const orb = document.getElementById('searchOrb');
    const input = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');
    const icon = orb.querySelector('.search-icon');
    
    if (!orb.classList.contains('active')) {
        orb.classList.add('active');
        icon.style.display = 'none';
        btn.classList.remove('hidden');
        setTimeout(() => input.focus(), 300);
    }
}

function deactivateSearch() {
    const orb = document.getElementById('searchOrb');
    const input = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');
    const icon = orb.querySelector('.search-icon');
    
    orb.classList.remove('active');
    icon.style.display = 'block';
    btn.classList.add('hidden');
    input.value = '';
}

document.addEventListener('click', (e) => {
    const orb = document.getElementById('searchOrb');
    if (orb && !orb.contains(e.target)) {
        deactivateSearch();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        deactivateSearch();
    }
});

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        event.currentTarget.classList.add('active');
    }
}

function openCapsule(capsule) {
    if (capsule.classList.contains('sealed')) {
        alert('这个记忆胶囊还未到开启时间！');
        return;
    }
    
    capsule.style.transform = 'scale(1.05)';
    setTimeout(() => {
        capsule.style.transform = '';
    }, 200);
}

function filterRadar(maxDistance) {
    if (window.alumniRadar) {
        window.alumniRadar.filterByDistance(maxDistance);
    }
    
    document.querySelectorAll('#radar button.glass').forEach(btn => {
        btn.classList.remove('bg-white/20');
    });
    event.target.classList.add('bg-white/20');
}

function addTimelineNode() {
    if (window.timeline) {
        window.timeline.addNewNode();
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
}

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(reveal => observer.observe(reveal));
}

function updateActiveNav() {
    const sections = ['home', 'timeline', 'radar', 'classroom'];
    const navItems = document.querySelectorAll('.nav-item');
    
    let currentSection = '';
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSection = sectionId;
            }
        }
    });
    
    navItems.forEach((item, index) => {
        if (sections[index] === currentSection) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            animateCounters();
        }, 500);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initScrollReveal();
    initSmoothScroll();
    
    window.addEventListener('scroll', updateActiveNav);
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    alert(`搜索: ${query}`);
                }
            }
        });
    }
});

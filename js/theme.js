class ThemeManager {
    constructor() {
        this.theme = 'dark';
        this.init();
    }
    
    init() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
        this.createThemeToggle();
    }
    
    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('theme', theme);
        
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            document.documentElement.style.setProperty('--bg-primary', '#f8fafc');
            document.documentElement.style.setProperty('--bg-secondary', '#e2e8f0');
            document.documentElement.style.setProperty('--text-primary', '#1e293b');
            document.documentElement.style.setProperty('--text-secondary', '#64748b');
            document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
            document.documentElement.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.1)');
        } else {
            document.body.classList.remove('light-theme');
            document.documentElement.style.setProperty('--bg-primary', '#0f172a');
            document.documentElement.style.setProperty('--bg-secondary', '#1e293b');
            document.documentElement.style.setProperty('--text-primary', '#ffffff');
            document.documentElement.style.setProperty('--text-secondary', '#94a3b8');
            document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.15)');
            document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.25)');
        }
        
        this.updateToggleIcon();
    }
    
    toggleTheme() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        gsap.from('body', {
            opacity: 0.8,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
    
    createThemeToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'theme-toggle';
        toggle.className = 'fixed bottom-30 right-6 z-50 w-12 h-12 glass rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer';
        toggle.onclick = () => this.toggleTheme();
        toggle.innerHTML = `
            <svg id="theme-icon-dark" class="w-6 h-6 ${this.theme === 'dark' ? '' : 'hidden'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
            <svg id="theme-icon-light" class="w-6 h-6 ${this.theme === 'light' ? '' : 'hidden'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
        `;
        
        document.body.appendChild(toggle);
    }
    
    updateToggleIcon() {
        const darkIcon = document.getElementById('theme-icon-dark');
        const lightIcon = document.getElementById('theme-icon-light');
        
        if (darkIcon && lightIcon) {
            if (this.theme === 'dark') {
                darkIcon.classList.remove('hidden');
                lightIcon.classList.add('hidden');
            } else {
                darkIcon.classList.add('hidden');
                lightIcon.classList.remove('hidden');
            }
        }
    }
}

let themeManager;
document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
});

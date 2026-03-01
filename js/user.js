class UserSystem {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.modal = null;
        this.init();
    }
    
    init() {
        this.loadUsers();
        this.checkSession();
        this.createAuthModal();
        this.createProfilePanel();
    }
    
    loadUsers() {
        const stored = localStorage.getItem('alumniUsers');
        if (stored) {
            this.users = JSON.parse(stored);
        }
    }
    
    saveUsers() {
        localStorage.setItem('alumniUsers', JSON.stringify(this.users));
    }
    
    checkSession() {
        const session = localStorage.getItem('alumniSession');
        if (session) {
            this.currentUser = JSON.parse(session);
            this.updateUI();
        }
    }
    
    createAuthModal() {
        this.modal = document.createElement('div');
        this.modal.id = 'auth-modal';
        this.modal.className = 'fixed inset-0 z-[9999] hidden items-center justify-center';
        this.modal.innerHTML = `
            <div class="absolute inset-0 bg-black/60 backdrop-blur-md" onclick="userSystem.closeModal()"></div>
            <div class="relative glass rounded-3xl p-8 max-w-md w-full mx-4 transform scale-90 opacity-0 transition-all duration-500" id="auth-modal-content">
                <div id="login-form">
                    <div class="text-center mb-8">
                        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-amber-400 flex items-center justify-center font-bold text-3xl">时</div>
                        <h3 class="text-2xl font-bold">欢迎回来</h3>
                        <p class="text-sm text-gray-400 mt-1">登录你的校友账号</p>
                    </div>
                    <form id="login-form-element" class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">邮箱</label>
                            <input type="email" id="login-email" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="your@email.com" required>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">密码</label>
                            <input type="password" id="login-password" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="••••••••" required>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="rounded border-slate-600">
                                <span class="text-gray-400">记住我</span>
                            </label>
                            <a href="#" class="text-blue-400 hover:text-blue-300">忘记密码？</a>
                        </div>
                        <button type="submit" class="w-full py-4 bg-gradient-to-r from-blue-500 to-amber-500 rounded-xl font-medium hover:opacity-90 transition-opacity">
                            登录
                        </button>
                    </form>
                    <div class="mt-6 text-center">
                        <p class="text-sm text-gray-400">还没有账号？ <a href="#" onclick="userSystem.showRegisterForm()" class="text-blue-400 hover:text-blue-300">立即注册</a></p>
                    </div>
                    <div class="mt-6">
                        <div class="relative">
                            <div class="absolute inset-0 flex items-center">
                                <div class="w-full border-t border-slate-700"></div>
                            </div>
                            <div class="relative flex justify-center text-sm">
                                <span class="px-4 bg-slate-900/50 text-gray-400">或</span>
                            </div>
                        </div>
                        <div class="mt-4 flex gap-3">
                            <button onclick="userSystem.socialLogin('wechat')" class="flex-1 py-3 glass rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                <svg class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.036 2.96c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/>
                                </svg>
                                微信
                            </button>
                            <button onclick="userSystem.socialLogin('qq')" class="flex-1 py-3 glass rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                <svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29.43 2.213 0 6.29.256 6.29-.43 0-.687-1.77-1.182-1.77-1.182 2.085-1.77 1.905-3.967 1.905-3.967.845 1.588 1.634 2.072 1.746 2.072.111 0 .283-.36.283-1.025 0-2.514-2.166-6.954-2.166-6.954V9.325C18.29 3.364 14.268 2 12.003 2z"/>
                                </svg>
                                QQ
                            </button>
                        </div>
                    </div>
                </div>
                
                <div id="register-form" class="hidden">
                    <div class="text-center mb-8">
                        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-amber-400 flex items-center justify-center font-bold text-3xl">时</div>
                        <h3 class="text-2xl font-bold">加入校友录</h3>
                        <p class="text-sm text-gray-400 mt-1">创建你的校友账号</p>
                    </div>
                    <form id="register-form-element" class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">姓名</label>
                            <input type="text" id="register-name" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="你的真实姓名" required>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">邮箱</label>
                            <input type="email" id="register-email" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="your@email.com" required>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">密码</label>
                            <input type="password" id="register-password" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="至少6位密码" required>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-sm text-gray-400 mb-2">入学年份</label>
                                <select id="register-year" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors">
                                    ${Array.from({length: 20}, (_, i) => `<option value="${2024 - i}">${2024 - i}级</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm text-gray-400 mb-2">院系</label>
                                <select id="register-department" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors">
                                    <option value="计算机系">计算机系</option>
                                    <option value="外语系">外语系</option>
                                    <option value="数学系">数学系</option>
                                    <option value="物理系">物理系</option>
                                    <option value="化学系">化学系</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" class="w-full py-4 bg-gradient-to-r from-blue-500 to-amber-500 rounded-xl font-medium hover:opacity-90 transition-opacity">
                            注册
                        </button>
                    </form>
                    <div class="mt-6 text-center">
                        <p class="text-sm text-gray-400">已有账号？ <a href="#" onclick="userSystem.showLoginForm()" class="text-blue-400 hover:text-blue-300">立即登录</a></p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
        
        document.getElementById('login-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });
        
        document.getElementById('register-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });
    }
    
    createProfilePanel() {
        const panel = document.createElement('div');
        panel.id = 'profile-panel';
        panel.className = 'fixed top-20 right-6 z-50 glass rounded-2xl p-6 w-80 hidden transform scale-95 opacity-0 transition-all duration-300';
        panel.innerHTML = `
            <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-amber-500 p-[2px]">
                    <img id="profile-avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=alumni" class="w-full h-full rounded-full bg-slate-800">
                </div>
                <div>
                    <h4 id="profile-name" class="font-bold text-lg">用户名</h4>
                    <p id="profile-info" class="text-sm text-gray-400">计算机系 2010级</p>
                </div>
            </div>
            <div class="space-y-2 mb-6">
                <a href="#" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>个人资料</span>
                </a>
                <a href="#" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>设置</span>
                </a>
                <a href="#" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <span>消息</span>
                    <span class="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
                </a>
            </div>
            <button onclick="userSystem.logout()" class="w-full py-3 glass rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-red-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                退出登录
            </button>
        `;
        
        document.body.appendChild(panel);
    }
    
    openModal() {
        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');
        
        setTimeout(() => {
            const content = document.getElementById('auth-modal-content');
            content.classList.remove('scale-90', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
    
    closeModal() {
        const content = document.getElementById('auth-modal-content');
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-90', 'opacity-0');
        
        setTimeout(() => {
            this.modal.classList.remove('flex');
            this.modal.classList.add('hidden');
        }, 500);
    }
    
    showRegisterForm() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
    }
    
    showLoginForm() {
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    }
    
    login() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('alumniSession', JSON.stringify(user));
            this.closeModal();
            this.updateUI();
            this.showNotification('登录成功！欢迎回来');
        } else {
            this.showNotification('邮箱或密码错误');
        }
    }
    
    register() {
        const user = {
            id: Date.now(),
            name: document.getElementById('register-name').value,
            email: document.getElementById('register-email').value,
            password: document.getElementById('register-password').value,
            year: document.getElementById('register-year').value,
            department: document.getElementById('register-department').value,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        
        if (this.users.find(u => u.email === user.email)) {
            this.showNotification('该邮箱已被注册');
            return;
        }
        
        this.users.push(user);
        this.saveUsers();
        
        this.currentUser = user;
        localStorage.setItem('alumniSession', JSON.stringify(user));
        this.closeModal();
        this.updateUI();
        this.showNotification('注册成功！欢迎加入');
    }
    
    socialLogin(platform) {
        this.showNotification(`${platform}登录功能开发中...`);
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('alumniSession');
        this.updateUI();
        this.hideProfilePanel();
        this.showNotification('已退出登录');
    }
    
    updateUI() {
        const loginBtn = document.querySelector('nav button.glass');
        const avatar = document.querySelector('nav .w-10.h-10.rounded-full');
        
        if (this.currentUser) {
            if (loginBtn) loginBtn.textContent = this.currentUser.name;
            if (avatar) {
                avatar.querySelector('img').src = this.currentUser.avatar;
                avatar.onclick = () => this.toggleProfilePanel();
            }
            
            document.getElementById('profile-name').textContent = this.currentUser.name;
            document.getElementById('profile-info').textContent = `${this.currentUser.department} ${this.currentUser.year}级`;
            document.getElementById('profile-avatar').src = this.currentUser.avatar;
        } else {
            if (loginBtn) {
                loginBtn.textContent = '登录';
                loginBtn.onclick = () => this.openModal();
            }
        }
    }
    
    toggleProfilePanel() {
        const panel = document.getElementById('profile-panel');
        
        if (panel.classList.contains('hidden')) {
            panel.classList.remove('hidden');
            setTimeout(() => {
                panel.classList.remove('scale-95', 'opacity-0');
                panel.classList.add('scale-100', 'opacity-100');
            }, 10);
        } else {
            this.hideProfilePanel();
        }
    }
    
    hideProfilePanel() {
        const panel = document.getElementById('profile-panel');
        panel.classList.remove('scale-100', 'opacity-100');
        panel.classList.add('scale-95', 'opacity-0');
        setTimeout(() => panel.classList.add('hidden'), 300);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-24 left-1/2 transform -translate-x-1/2 glass px-6 py-3 rounded-full text-sm z-[9999]';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        gsap.fromTo(notification, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.3 }
        );
        
        setTimeout(() => {
            gsap.to(notification, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                onComplete: () => notification.remove()
            });
        }, 3000);
    }
}

let userSystem;
document.addEventListener('DOMContentLoaded', () => {
    userSystem = new UserSystem();
});

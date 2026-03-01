class MemoryCapsule {
    constructor() {
        this.capsules = [];
        this.modal = null;
        this.init();
    }
    
    init() {
        this.loadCapsules();
        this.createCapsuleModal();
        this.initCapsuleAnimations();
    }
    
    loadCapsules() {
        const stored = localStorage.getItem('memoryCapsules');
        if (stored) {
            this.capsules = JSON.parse(stored);
        } else {
            this.capsules = [
                {
                    id: 1,
                    title: '致十年后的自己',
                    content: '希望你已经实现了所有梦想，依然保持着那份热爱。',
                    recipient: '自己',
                    openDate: '2024-06-01',
                    createdAt: '2024-01-01',
                    status: 'pending',
                    emoji: '💌'
                },
                {
                    id: 2,
                    title: '给室友的生日惊喜',
                    content: '生日快乐！这是我们在宿舍一起度过的最后一个生日了。',
                    recipient: '室友小明',
                    openDate: '2024-03-15',
                    createdAt: '2024-01-15',
                    status: 'delivered',
                    emoji: '🎁'
                },
                {
                    id: 3,
                    title: '毕业五周年纪念',
                    content: '五年了，我们依然是最好的朋友。',
                    recipient: '全班同学',
                    openDate: '2019-06-01',
                    createdAt: '2014-06-01',
                    status: 'opened',
                    emoji: '📸'
                }
            ];
            this.saveCapsules();
        }
    }
    
    saveCapsules() {
        localStorage.setItem('memoryCapsules', JSON.stringify(this.capsules));
    }
    
    createCapsuleModal() {
        this.modal = document.createElement('div');
        this.modal.id = 'capsule-modal';
        this.modal.className = 'fixed inset-0 z-[9999] hidden items-center justify-center';
        this.modal.innerHTML = `
            <div class="absolute inset-0 bg-black/60 backdrop-blur-md" onclick="memoryCapsule.closeModal()"></div>
            <div class="relative glass rounded-3xl p-8 max-w-md w-full mx-4 transform scale-90 opacity-0 transition-all duration-500" id="capsule-modal-content">
                <div id="capsule-create-form">
                    <div class="text-center mb-6">
                        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center text-4xl animate-bounce">
                            💌
                        </div>
                        <h3 class="text-2xl font-bold">创建记忆胶囊</h3>
                        <p class="text-sm text-gray-400 mt-1">封存此刻，给未来一个惊喜</p>
                    </div>
                    <form id="create-capsule-form" class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">收件人</label>
                            <input type="text" id="capsule-recipient" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="可以是自己或朋友">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">标题</label>
                            <input type="text" id="capsule-title" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="给这个胶囊起个名字">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">想说的话</label>
                            <textarea id="capsule-content" rows="4" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="写下你想说的话..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">开启时间</label>
                            <input type="date" id="capsule-open-date" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors">
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">选择图标</label>
                            <div class="flex gap-2 flex-wrap">
                                ${['💌', '🎁', '📸', '🎵', '✨', '🌟', '💫', '🎈'].map(emoji => `
                                    <button type="button" onclick="memoryCapsule.selectEmoji('${emoji}')" class="emoji-btn w-10 h-10 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors text-xl" data-emoji="${emoji}">${emoji}</button>
                                `).join('')}
                            </div>
                            <input type="hidden" id="capsule-emoji" value="💌">
                        </div>
                        <button type="submit" class="w-full py-4 bg-gradient-to-r from-blue-500 to-amber-500 rounded-xl font-medium hover:opacity-90 transition-opacity mt-6">
                            封存胶囊
                        </button>
                    </form>
                </div>
                
                <div id="capsule-open-view" class="hidden">
                    <div class="text-center">
                        <div id="open-capsule-emoji" class="text-6xl mb-4"></div>
                        <h3 id="open-capsule-title" class="text-2xl font-bold mb-2"></h3>
                        <p id="open-capsule-recipient" class="text-sm text-gray-400 mb-6"></p>
                        <div class="glass rounded-xl p-6 mb-6">
                            <p id="open-capsule-content" class="text-gray-300 leading-relaxed"></p>
                        </div>
                        <p id="open-capsule-date" class="text-xs text-gray-500"></p>
                        <button onclick="memoryCapsule.closeModal()" class="mt-6 px-8 py-3 glass rounded-xl font-medium hover:bg-white/10 transition-colors">
                            关闭
                        </button>
                    </div>
                </div>
                
                <div id="capsule-seal-animation" class="hidden absolute inset-0 flex items-center justify-center">
                    <div class="seal-animation">
                        <div class="capsule-body">
                            <div class="capsule-glow"></div>
                            <span class="text-6xl" id="sealing-emoji">💌</span>
                        </div>
                        <div class="seal-particles"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
        
        document.getElementById('create-capsule-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createCapsule();
        });
    }
    
    selectEmoji(emoji) {
        document.querySelectorAll('.emoji-btn').forEach(btn => {
            btn.classList.remove('ring-2', 'ring-blue-500');
            if (btn.dataset.emoji === emoji) {
                btn.classList.add('ring-2', 'ring-blue-500');
            }
        });
        document.getElementById('capsule-emoji').value = emoji;
    }
    
    openCreateModal() {
        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');
        
        document.getElementById('capsule-create-form').classList.remove('hidden');
        document.getElementById('capsule-open-view').classList.add('hidden');
        document.getElementById('capsule-seal-animation').classList.add('hidden');
        
        setTimeout(() => {
            const content = document.getElementById('capsule-modal-content');
            content.classList.remove('scale-90', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
    
    closeModal() {
        const content = document.getElementById('capsule-modal-content');
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-90', 'opacity-0');
        
        setTimeout(() => {
            this.modal.classList.remove('flex');
            this.modal.classList.add('hidden');
        }, 500);
    }
    
    createCapsule() {
        const capsule = {
            id: Date.now(),
            title: document.getElementById('capsule-title').value,
            content: document.getElementById('capsule-content').value,
            recipient: document.getElementById('capsule-recipient').value || '自己',
            openDate: document.getElementById('capsule-open-date').value,
            createdAt: new Date().toISOString().split('T')[0],
            status: 'pending',
            emoji: document.getElementById('capsule-emoji').value
        };
        
        this.playSealAnimation(capsule.emoji, () => {
            this.capsules.push(capsule);
            this.saveCapsules();
            this.renderCapsules();
            this.closeModal();
            this.showNotification('胶囊已封存！💌');
        });
    }
    
    playSealAnimation(emoji, callback) {
        document.getElementById('capsule-create-form').classList.add('hidden');
        document.getElementById('capsule-seal-animation').classList.remove('hidden');
        document.getElementById('sealing-emoji').textContent = emoji;
        
        const sealAnimation = document.querySelector('.seal-animation');
        sealAnimation.style.animation = 'seal-pulse 2s ease-out forwards';
        
        this.createSealParticles();
        
        setTimeout(() => {
            callback();
        }, 2000);
    }
    
    createSealParticles() {
        const container = document.querySelector('.seal-particles');
        container.innerHTML = '';
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'seal-particle';
            particle.style.setProperty('--angle', `${Math.random() * 360}deg`);
            particle.style.setProperty('--distance', `${100 + Math.random() * 100}px`);
            particle.style.animationDelay = `${Math.random() * 0.5}s`;
            container.appendChild(particle);
        }
    }
    
    openCapsule(id) {
        const capsule = this.capsules.find(c => c.id === id);
        if (!capsule) return;
        
        const openDate = new Date(capsule.openDate);
        const now = new Date();
        
        if (openDate > now) {
            this.showCountdown(capsule);
            return;
        }
        
        this.playOpenAnimation(capsule);
    }
    
    showCountdown(capsule) {
        const openDate = new Date(capsule.openDate);
        const now = new Date();
        const diff = openDate - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        this.showNotification(`还需要等待 ${days}天${hours}小时${minutes}分钟 才能开启`);
    }
    
    playOpenAnimation(capsule) {
        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');
        
        const content = document.getElementById('capsule-modal-content');
        content.classList.remove('scale-90', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
        
        document.getElementById('capsule-create-form').classList.add('hidden');
        document.getElementById('capsule-seal-animation').classList.add('hidden');
        document.getElementById('capsule-open-view').classList.remove('hidden');
        
        document.getElementById('open-capsule-emoji').textContent = capsule.emoji;
        document.getElementById('open-capsule-title').textContent = capsule.title;
        document.getElementById('open-capsule-recipient').textContent = `致 ${capsule.recipient}`;
        document.getElementById('open-capsule-content').textContent = capsule.content;
        document.getElementById('open-capsule-date').textContent = `写于 ${capsule.createdAt}`;
        
        gsap.from('#open-capsule-emoji', {
            scale: 0,
            rotation: 360,
            duration: 1,
            ease: 'elastic.out(1, 0.5)'
        });
        
        gsap.from('#open-capsule-content', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.5
        });
        
        capsule.status = 'opened';
        this.saveCapsules();
        this.renderCapsules();
    }
    
    renderCapsules() {
        const container = document.getElementById('my-capsules-list');
        if (!container) return;
        
        container.innerHTML = this.capsules.map(capsule => `
            <div class="bg-slate-800/50 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-800 transition-colors capsule-item" onclick="memoryCapsule.openCapsule(${capsule.id})">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br ${capsule.status === 'pending' ? 'from-blue-500/20 to-amber-500/20' : capsule.status === 'opened' ? 'from-green-500/20 to-teal-500/20' : 'from-purple-500/20 to-pink-500/20'} flex items-center justify-center text-2xl">
                    ${capsule.status === 'pending' ? '🔒' : capsule.emoji}
                </div>
                <div class="flex-1">
                    <div class="font-medium">${capsule.title}</div>
                    <div class="text-xs text-gray-400">${capsule.openDate} 开启</div>
                </div>
                <span class="text-xs px-2 py-1 rounded-full ${
                    capsule.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 
                    capsule.status === 'opened' ? 'bg-green-500/20 text-green-400' : 
                    'bg-purple-500/20 text-purple-400'
                }">
                    ${capsule.status === 'pending' ? '待开启' : capsule.status === 'opened' ? '已开启' : '已送达'}
                </span>
            </div>
        `).join('');
    }
    
    initCapsuleAnimations() {
        document.querySelectorAll('.memory-capsule').forEach(capsule => {
            capsule.addEventListener('click', () => {
                if (capsule.classList.contains('sealed')) {
                    gsap.to(capsule, {
                        keyframes: [
                            { rotation: -5, duration: 0.1 },
                            { rotation: 5, duration: 0.1 },
                            { rotation: -5, duration: 0.1 },
                            { rotation: 0, duration: 0.1 }
                        ]
                    });
                }
            });
        });
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

let memoryCapsule;
document.addEventListener('DOMContentLoaded', () => {
    memoryCapsule = new MemoryCapsule();
});

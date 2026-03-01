class Timeline {
    constructor() {
        this.container = document.getElementById('timelineContainer');
        this.progress = document.getElementById('timelineProgress');
        this.nodes = document.querySelectorAll('.timeline-node');
        this.editModal = null;
        this.isDragging = false;
        this.draggedNode = null;
        this.startY = 0;
        this.startTop = 0;
        
        if (this.container && this.progress) {
            this.init();
            this.initDragAndDrop();
            this.createEditModal();
        }
    }
    
    init() {
        gsap.registerPlugin(ScrollTrigger);
        
        this.nodes.forEach((node, index) => {
            const isLeft = node.querySelector('.timeline-content.left');
            
            gsap.to(node, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: node,
                    start: 'top 80%',
                    end: 'top 50%',
                    toggleActions: 'play none none reverse',
                    onEnter: () => this.updateProgress(node)
                }
            });
            
            const content = node.querySelector('.timeline-content');
            if (content) {
                gsap.from(content, {
                    x: isLeft ? -100 : 100,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: node,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
            
            this.addNodeControls(node);
        });
        
        window.addEventListener('scroll', () => this.updateProgressLine());
    }
    
    addNodeControls(node) {
        const content = node.querySelector('.timeline-content');
        if (!content) return;
        
        const controls = document.createElement('div');
        controls.className = 'timeline-controls opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 flex gap-1';
        controls.innerHTML = `
            <button onclick="timeline.editNode(this.closest('.timeline-node'))" class="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="编辑">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>
            <button onclick="timeline.deleteNode(this.closest('.timeline-node'))" class="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-colors text-red-400" title="删除">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        `;
        
        content.style.position = 'relative';
        content.classList.add('group');
        content.appendChild(controls);
    }
    
    initDragAndDrop() {
        this.nodes.forEach(node => {
            const dot = node.querySelector('.timeline-dot');
            if (!dot) return;
            
            dot.setAttribute('draggable', 'true');
            dot.style.cursor = 'grab';
            
            dot.addEventListener('mousedown', (e) => this.startDrag(e, node));
            dot.addEventListener('touchstart', (e) => this.startDrag(e, node), { passive: false });
        });
        
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('mouseup', () => this.endDrag());
        document.addEventListener('touchend', () => this.endDrag());
    }
    
    startDrag(e, node) {
        e.preventDefault();
        this.isDragging = true;
        this.draggedNode = node;
        this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        const dot = node.querySelector('.timeline-dot');
        dot.style.cursor = 'grabbing';
        dot.style.transform = 'translateX(-50%) scale(1.5)';
        
        gsap.to(node, {
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.8)',
            duration: 0.3
        });
    }
    
    drag(e) {
        if (!this.isDragging || !this.draggedNode) return;
        
        e.preventDefault();
        const currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const deltaY = currentY - this.startY;
        
        const content = this.draggedNode.querySelector('.timeline-content');
        if (content) {
            gsap.to(content, {
                y: deltaY * 0.5,
                duration: 0.1
            });
        }
    }
    
    endDrag() {
        if (!this.isDragging || !this.draggedNode) return;
        
        const dot = this.draggedNode.querySelector('.timeline-dot');
        dot.style.cursor = 'grab';
        dot.style.transform = 'translateX(-50%)';
        
        const content = this.draggedNode.querySelector('.timeline-content');
        if (content) {
            gsap.to(content, {
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        }
        
        gsap.to(this.draggedNode, {
            boxShadow: 'none',
            duration: 0.3
        });
        
        this.isDragging = false;
        this.draggedNode = null;
    }
    
    createEditModal() {
        this.editModal = document.createElement('div');
        this.editModal.id = 'timeline-edit-modal';
        this.editModal.className = 'fixed inset-0 z-[9999] hidden items-center justify-center bg-black/50 backdrop-blur-sm';
        this.editModal.innerHTML = `
            <div class="glass rounded-2xl p-8 max-w-lg w-full mx-4 transform scale-95 opacity-0 transition-all duration-300" id="modal-content">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold">编辑时光节点</h3>
                    <button onclick="timeline.closeModal()" class="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <form id="timeline-edit-form" class="space-y-4">
                    <input type="hidden" id="edit-node-id">
                    <div>
                        <label class="block text-sm text-gray-400 mb-2">时间</label>
                        <input type="text" id="edit-date" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="例如：2010年9月">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-400 mb-2">标题</label>
                        <input type="text" id="edit-title" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="事件标题">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-400 mb-2">描述</label>
                        <textarea id="edit-description" rows="3" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="记录这一刻..."></textarea>
                    </div>
                    <div>
                        <label class="block text-sm text-gray-400 mb-2">标签（用逗号分隔）</label>
                        <input type="text" id="edit-tags" class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="计算机系, 宿舍201">
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="button" onclick="timeline.closeModal()" class="flex-1 py-3 glass rounded-xl font-medium hover:bg-white/10 transition-colors">取消</button>
                        <button type="submit" class="flex-1 py-3 bg-gradient-to-r from-blue-500 to-amber-500 rounded-xl font-medium hover:opacity-90 transition-opacity">保存</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(this.editModal);
        
        document.getElementById('timeline-edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNode();
        });
    }
    
    editNode(node) {
        const content = node.querySelector('.timeline-content');
        const date = content.querySelector('.text-amber-400')?.textContent || '';
        const title = content.querySelector('h3')?.textContent || '';
        const description = content.querySelector('p')?.textContent || '';
        const tags = Array.from(content.querySelectorAll('.flex.gap-2 span')).map(t => t.textContent).join(', ');
        
        document.getElementById('edit-node-id').value = node.dataset.year || Date.now();
        document.getElementById('edit-date').value = date;
        document.getElementById('edit-title').value = title;
        document.getElementById('edit-description').value = description;
        document.getElementById('edit-tags').value = tags;
        
        this.editModal.classList.remove('hidden');
        this.editModal.classList.add('flex');
        
        setTimeout(() => {
            const modalContent = document.getElementById('modal-content');
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
    
    closeModal() {
        const modalContent = document.getElementById('modal-content');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        
        setTimeout(() => {
            this.editModal.classList.remove('flex');
            this.editModal.classList.add('hidden');
        }, 300);
    }
    
    saveNode() {
        const nodeId = document.getElementById('edit-node-id').value;
        const node = document.querySelector(`.timeline-node[data-year="${nodeId}"]`);
        
        if (node) {
            const content = node.querySelector('.timeline-content');
            const dateEl = content.querySelector('.text-amber-400');
            const titleEl = content.querySelector('h3');
            const descEl = content.querySelector('p');
            
            if (dateEl) dateEl.textContent = document.getElementById('edit-date').value;
            if (titleEl) titleEl.textContent = document.getElementById('edit-title').value;
            if (descEl) descEl.textContent = document.getElementById('edit-description').value;
            
            gsap.from(content, {
                scale: 0.95,
                opacity: 0.5,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        }
        
        this.closeModal();
        this.showNotification('保存成功！');
    }
    
    deleteNode(node) {
        if (confirm('确定要删除这个时光节点吗？')) {
            gsap.to(node, {
                opacity: 0,
                y: -50,
                scale: 0.8,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => {
                    node.style.display = 'none';
                    this.showNotification('已删除');
                }
            });
        }
    }
    
    addNewNode() {
        const newNode = document.createElement('div');
        newNode.className = 'timeline-node';
        newNode.dataset.year = new Date().getFullYear();
        newNode.innerHTML = `
            <div class="timeline-dot" onclick="activateNode(this)"></div>
            <div class="timeline-content right glass hover-card">
                <div class="text-amber-400 text-sm font-bold mb-2">刚刚</div>
                <h3 class="text-2xl font-bold mb-3">新的记忆</h3>
                <p class="text-gray-300 mb-4">点击编辑添加内容...</p>
                <div class="flex gap-2 mb-4">
                    <span class="px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300">新标签</span>
                </div>
            </div>
        `;
        
        this.container.appendChild(newNode);
        this.addNodeControls(newNode);
        
        gsap.from(newNode, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });
        
        setTimeout(() => this.editNode(newNode), 500);
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
        }, 2000);
    }
    
    updateProgress(node) {
        const dot = node.querySelector('.timeline-dot');
        if (dot && !dot.classList.contains('active')) {
            document.querySelectorAll('.timeline-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        }
    }
    
    updateProgressLine() {
        if (!this.container || !this.progress) return;
        
        const rect = this.container.getBoundingClientRect();
        const scrollProgress = Math.min(Math.max(
            (window.innerHeight - rect.top) / (rect.height + window.innerHeight) * 100,
            0
        ), 100);
        
        this.progress.style.height = `${scrollProgress}%`;
    }
}

function activateNode(dot) {
    document.querySelectorAll('.timeline-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
}

let timeline;
document.addEventListener('DOMContentLoaded', () => {
    timeline = new Timeline();
});

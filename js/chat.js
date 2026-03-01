class ChatSystem {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.contacts = [
            { id: 1, name: '李明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liming', lastMessage: '好久不见！', time: '刚刚', online: true, unread: 2 },
            { id: 2, name: '王芳', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangfang', lastMessage: '周末聚会见~', time: '10分钟前', online: true, unread: 0 },
            { id: 3, name: '张伟', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangwei', lastMessage: '收到，谢谢！', time: '1小时前', online: false, unread: 0 },
            { id: 4, name: '计算机系一班', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=class1', lastMessage: '聚会通知：...', time: '昨天', online: false, unread: 5, isGroup: true },
        ];
        this.currentChat = null;
        this.init();
    }
    
    init() {
        this.createChatWidget();
        this.loadMessages();
    }
    
    createChatWidget() {
        const widget = document.createElement('div');
        widget.id = 'chat-widget';
        widget.className = 'fixed bottom-6 right-6 z-50';
        widget.innerHTML = `
            <div id="chat-window" class="hidden glass rounded-2xl overflow-hidden mb-4 w-80 transform scale-95 opacity-0 transition-all duration-300 origin-bottom-right">
                <div id="chat-list-view">
                    <div class="p-4 border-b border-white/10 flex items-center justify-between">
                        <h3 class="font-bold">消息</h3>
                        <div class="flex gap-2">
                            <button class="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </button>
                            <button class="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div id="chat-contacts" class="max-h-80 overflow-y-auto">
                        ${this.contacts.map(contact => `
                            <div class="chat-contact p-4 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors" data-id="${contact.id}">
                                <div class="relative">
                                    <img src="${contact.avatar}" class="w-12 h-12 rounded-full">
                                    ${contact.online ? '<span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></span>' : ''}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between">
                                        <span class="font-medium truncate">${contact.name}</span>
                                        <span class="text-xs text-gray-400">${contact.time}</span>
                                    </div>
                                    <p class="text-sm text-gray-400 truncate">${contact.lastMessage}</p>
                                </div>
                                ${contact.unread > 0 ? `<span class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">${contact.unread}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div id="chat-detail-view" class="hidden">
                    <div class="p-4 border-b border-white/10 flex items-center gap-3">
                        <button onclick="chatSystem.showContactList()" class="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        <img id="chat-detail-avatar" src="" class="w-10 h-10 rounded-full">
                        <div class="flex-1">
                            <h4 id="chat-detail-name" class="font-medium"></h4>
                            <p id="chat-detail-status" class="text-xs text-green-400">在线</p>
                        </div>
                        <button class="p-2 rounded-lg hover:bg-white/10 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                            </svg>
                        </button>
                    </div>
                    <div id="chat-messages" class="h-64 overflow-y-auto p-4 space-y-4">
                    </div>
                    <div class="p-4 border-t border-white/10">
                        <div class="flex gap-2">
                            <input type="text" id="chat-input" class="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" placeholder="输入消息...">
                            <button onclick="chatSystem.sendMessage()" class="p-2 bg-gradient-to-r from-blue-500 to-amber-500 rounded-xl hover:opacity-90 transition-opacity">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <button id="chat-toggle" onclick="chatSystem.toggle()" class="w-14 h-14 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative">
                <svg id="chat-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <svg id="close-icon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span id="chat-badge" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">7</span>
            </button>
        `;
        
        document.body.appendChild(widget);
        
        document.querySelectorAll('.chat-contact').forEach(el => {
            el.addEventListener('click', () => this.openChat(parseInt(el.dataset.id)));
        });
        
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chat-window');
        const chatIcon = document.getElementById('chat-icon');
        const closeIcon = document.getElementById('close-icon');
        
        if (this.isOpen) {
            window.classList.remove('hidden');
            setTimeout(() => {
                window.classList.remove('scale-95', 'opacity-0');
                window.classList.add('scale-100', 'opacity-100');
            }, 10);
            chatIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        } else {
            window.classList.remove('scale-100', 'opacity-100');
            window.classList.add('scale-95', 'opacity-0');
            setTimeout(() => window.classList.add('hidden'), 300);
            chatIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    }
    
    openChat(contactId) {
        this.currentChat = this.contacts.find(c => c.id === contactId);
        if (!this.currentChat) return;
        
        document.getElementById('chat-list-view').classList.add('hidden');
        document.getElementById('chat-detail-view').classList.remove('hidden');
        
        document.getElementById('chat-detail-avatar').src = this.currentChat.avatar;
        document.getElementById('chat-detail-name').textContent = this.currentChat.name;
        document.getElementById('chat-detail-status').textContent = this.currentChat.online ? '在线' : '离线';
        
        this.loadChatMessages(contactId);
    }
    
    showContactList() {
        document.getElementById('chat-detail-view').classList.add('hidden');
        document.getElementById('chat-list-view').classList.remove('hidden');
        this.currentChat = null;
    }
    
    loadMessages() {
        const stored = localStorage.getItem('chatMessages');
        if (stored) {
            this.messages = JSON.parse(stored);
        }
    }
    
    loadChatMessages(contactId) {
        const container = document.getElementById('chat-messages');
        const chatMessages = this.messages.filter(m => m.contactId === contactId);
        
        if (chatMessages.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-400 text-sm py-8">
                    开始和 ${this.currentChat.name} 聊天吧
                </div>
            `;
        } else {
            container.innerHTML = chatMessages.map(msg => `
                <div class="flex ${msg.sent ? 'justify-end' : 'justify-start'}">
                    <div class="max-w-[70%] ${msg.sent ? 'bg-gradient-to-r from-blue-500 to-amber-500' : 'glass'} rounded-2xl px-4 py-2">
                        <p class="text-sm">${msg.content}</p>
                        <p class="text-xs ${msg.sent ? 'text-white/70' : 'text-gray-400'} mt-1">${msg.time}</p>
                    </div>
                </div>
            `).join('');
        }
        
        container.scrollTop = container.scrollHeight;
    }
    
    sendMessage() {
        const input = document.getElementById('chat-input');
        const content = input.value.trim();
        
        if (!content || !this.currentChat) return;
        
        const message = {
            id: Date.now(),
            contactId: this.currentChat.id,
            content,
            sent: true,
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        
        this.messages.push(message);
        localStorage.setItem('chatMessages', JSON.stringify(this.messages));
        
        input.value = '';
        this.loadChatMessages(this.currentChat.id);
        
        setTimeout(() => this.simulateReply(), 1000 + Math.random() * 2000);
    }
    
    simulateReply() {
        if (!this.currentChat) return;
        
        const replies = [
            '好的，收到！',
            '没问题~',
            '哈哈，太有意思了',
            '周末见！',
            '好久不见啊',
            '最近怎么样？',
            '期待聚会！'
        ];
        
        const message = {
            id: Date.now(),
            contactId: this.currentChat.id,
            content: replies[Math.floor(Math.random() * replies.length)],
            sent: false,
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        
        this.messages.push(message);
        localStorage.setItem('chatMessages', JSON.stringify(this.messages));
        
        if (this.currentChat) {
            this.loadChatMessages(this.currentChat.id);
        }
    }
}

let chatSystem;
document.addEventListener('DOMContentLoaded', () => {
    chatSystem = new ChatSystem();
});

// =====================
// 🤖 CHATBOT WIDGET
// =====================

class TirupatiChatbot {
    constructor() {
        this.isOpen = false;
        this.isRegistered = false;
        this.userData = {
            email: '',
            contact: '',
            sessionId: this.generateSessionId(),
            startTime: new Date().toISOString(),
            messages: []
        };
        this.knowledgeBase = {
            products: {
                keywords: ['products', 'furniture', 'what do you offer', 'items', 'catalog', 'modular'],
                response: "We specialize in **modular furniture** including:\n\n• **Modular Kitchens** - Custom-designed with modern fittings\n• **Bedroom Furniture** - Wardrobes, beds, storage solutions\n• **Living Room Sets** - Sofas, TV units, display cabinets\n• **Dining Tables** - Custom dining sets for any space\n• **Room Ceilings** - False ceiling designs and lighting\n• **Accessories** - Decorative items and furniture accessories\n\nAll our products are customizable to fit your space!",
                source: "Product Catalog"
            },
            pricing: {
                keywords: ['price', 'cost', 'how much', 'expensive', 'budget', 'rates', 'money'],
                response: "Our pricing is **custom-based** depending on design and materials:\n\n**Starting ranges:**\n• Modular Kitchen: ₹80,000 - ₹3,00,000\n• Bedroom Sets: ₹50,000 - ₹2,00,000\n• Living Room: ₹40,000 - ₹1,50,000\n\n💡 **Free consultation and quote available!**\nContact us for personalized pricing based on your needs.",
                source: "Pricing Guide"
            },
            installation: {
                keywords: ['installation', 'fitting', 'delivery', 'setup', 'assemble', 'service'],
                response: "**Yes! Complete installation services included:**\n\n✅ Free site measurement and planning\n✅ Professional installation team\n✅ Quality fittings and hardware\n✅ Post-installation cleanup\n\n**Timeline:** 2-7 days depending on project size\n**Warranty:** 1-year installation warranty included",
                source: "Installation Services"
            },
            warranty: {
                keywords: ['warranty', 'guarantee', 'policy', 'maintenance', 'repair', 'after sales'],
                response: "**Our Comprehensive Warranty:**\n\n🔧 **1 Year** - Installation & fitting\n🪵 **5 Years** - Structural warranty\n🔗 **2 Years** - Hardware warranty\n\n**Includes:**\n• Manufacturing defects coverage\n• Free maintenance visits (first year)\n• 24/7 customer support",
                source: "Warranty Policy"
            },
            contact: {
                keywords: ['contact', 'phone', 'address', 'location', 'reach', 'call', 'whatsapp'],
                response: "**Get in Touch with Tirupati:**\n\n📞 **Phone:** +91 9876543210\n📧 **Email:** info@tirupati.com\n📍 **Address:** Tirupati, Andhra Pradesh\n\n**Business Hours:**\nMon-Sat: 9:00 AM - 7:00 PM\n\n💬 **WhatsApp** for quick quotes!\n🏠 **Free Home Visit** available",
                source: "Contact Information"
            },
            specifications: {
                keywords: ['specs', 'specifications', 'materials', 'dimensions'],
                response: "Content from your PDF here...",
                source: "tirupati-catalog.pdf"
            }
        };
        this.init();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        this.createWidget();
        this.bindEvents();
        this.loadVisitorData();
    }

    loadVisitorData() {
        // Check if user data exists in localStorage
        const savedUserData = localStorage.getItem('tirupati_user_data');
        if (savedUserData) {
            const userData = JSON.parse(savedUserData);
            // Check if data is less than 30 days old
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            if (new Date(userData.lastVisit) > thirtyDaysAgo) {
                this.userData.email = userData.email;
                this.userData.contact = userData.contact;
                this.isRegistered = true;
                this.updateUserVisit();
            }
        }
    }

    updateUserVisit() {
        const userData = {
            email: this.userData.email,
            contact: this.userData.contact,
            lastVisit: new Date().toISOString()
        };
        localStorage.setItem('tirupati_user_data', JSON.stringify(userData));
    }

    saveVisitorSession() {
        const sessionData = {
            sessionId: this.userData.sessionId,
            email: this.userData.email,
            contact: this.userData.contact,
            startTime: this.userData.startTime,
            endTime: new Date().toISOString(),
            messages: this.userData.messages,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            page: window.location.href
        };

        // Save to localStorage for admin panel
        let allSessions = JSON.parse(localStorage.getItem('tirupati_chat_sessions') || '[]');
        allSessions.push(sessionData);
        
        // Keep only last 1000 sessions to prevent storage overflow
        if (allSessions.length > 1000) {
            allSessions = allSessions.slice(-1000);
        }
        
        localStorage.setItem('tirupati_chat_sessions', JSON.stringify(allSessions));

        // Also send to server if available (you can implement server endpoint)
        this.sendToServer(sessionData);
    }

    sendToServer(sessionData) {
        // Optional: Send data to your server endpoint
        // fetch('/api/chat-sessions', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(sessionData)
        // });
        
        console.log('Session data saved:', sessionData);
    }

    createWidget() {
        // Create chatbot CSS
        const style = document.createElement('style');
        style.textContent = `
            .tirupati-chatbot-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 350px;
                max-width: 90vw;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                border-radius: 12px;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .tirupati-chat-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                z-index: 10001;
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .tirupati-chat-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6);
            }
            
            .tirupati-chat-container {
                height: 400px;
                overflow-y: auto;
                background: #f9fafb;
                padding: 16px;
                scroll-behavior: smooth;
            }
            
            .tirupati-message {
                margin-bottom: 12px;
                animation: tirupatiSlideIn 0.3s ease-out;
            }
            
            .tirupati-user-message {
                display: flex;
                justify-content: flex-end;
            }
            
            .tirupati-bot-message {
                display: flex;
                align-items: flex-start;
                gap: 8px;
            }
            
            .tirupati-message-content {
                max-width: 80%;
                padding: 12px;
                border-radius: 12px;
                font-size: 14px;
                line-height: 1.4;
            }
            
            .tirupati-user-content {
                background: #2563eb;
                color: white;
            }
            
            .tirupati-bot-content {
                background: white;
                color: #374151;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .tirupati-bot-avatar {
                width: 32px;
                height: 32px;
                background: #dbeafe;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                color: #2563eb;
            }
            
            .tirupati-chat-input {
                padding: 16px;
                background: white;
                border-top: 1px solid #e5e7eb;
                display: flex;
                gap: 8px;
            }
            
            .tirupati-input-field {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }
            
            .tirupati-input-field:focus {
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }
            
            .tirupati-send-button {
                background: #2563eb;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .tirupati-send-button:hover {
                background: #1d4ed8;
            }
            
            .tirupati-typing {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 8px 12px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            .tirupati-typing-dot {
                width: 6px;
                height: 6px;
                background: #9ca3af;
                border-radius: 50%;
                animation: tirupatiTyping 1.5s ease-in-out infinite;
            }
            
            .tirupati-typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .tirupati-typing-dot:nth-child(3) { animation-delay: 0.4s; }
            
            .tirupati-source {
                font-size: 11px;
                color: #6b7280;
                margin-top: 4px;
                opacity: 0.8;
            }
            
            .tirupati-header {
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: white;
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .tirupati-header-avatar {
                width: 40px;
                height: 40px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .tirupati-hidden {
                display: none;
            }
            
            .tirupati-registration-form {
                background: white;
                height: 400px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .tirupati-registration-form input {
                transition: all 0.3s ease;
            }
            
            .tirupati-registration-form input:focus {
                border-color: #2563eb !important;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
                outline: none;
            }
            
            .tirupati-registration-form button:hover {
                background: linear-gradient(135deg, #1d4ed8, #1e40af) !important;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            }
            
            .tirupati-chat-interface {
                display: flex;
                flex-direction: column;
                height: 400px;
            }
            
            @keyframes tirupatiSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes tirupatiTyping {
                0%, 60%, 100% { opacity: 0.4; }
                30% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Create chatbot HTML
        const widget = document.createElement('div');
        widget.innerHTML = `
            <button class="tirupati-chat-toggle" id="tirupatiChatToggle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            </button>
            
            <div class="tirupati-chatbot-widget tirupati-hidden" id="tirupatiChatWidget">
                <div class="tirupati-header">
                    <div class="tirupati-header-avatar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                        </svg>
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 16px;">Divyanshi - Tirupati Assistant</div>
                        <div style="font-size: 12px; opacity: 0.9;">Ask about our furniture & services</div>
                    </div>
                    <button id="tirupatiCloseBtn" style="position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 16px;">&times;</button>
                </div>
                
                <!-- Registration Form -->
                <div class="tirupati-registration-form" id="tirupatiRegistrationForm">
                    <div style="padding: 24px; text-align: center;">
                        <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 18px;">Welcome to Tirupati Trader Associates!</h3>
                        <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">Please provide your details to chat with Divyanshi:</p>
                        
                        <div style="margin-bottom: 16px;">
                            <input type="email" id="tirupatiUserEmail" placeholder="Enter your email address" 
                                   style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" required>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <input type="tel" id="tirupatiUserContact" placeholder="Enter your contact number" 
                                   style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" required>
                        </div>
                        
                        <button id="tirupatiStartChatBtn" 
                                style="width: 100%; padding: 12px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                            Chat with Divyanshi
                        </button>
                        
                        <p style="margin: 16px 0 0 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
                            🔒 Your information is secure and will only be used for support purposes.
                        </p>
                    </div>
                </div>
                
                <!-- Chat Interface -->
                <div class="tirupati-chat-interface tirupati-hidden" id="tirupatiChatInterface">
                    <div class="tirupati-chat-container" id="tirupatiChatContainer">
                        <div class="tirupati-message tirupati-bot-message">
                            <div class="tirupati-bot-avatar">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                                </svg>
                            </div>
                            <div class="tirupati-message-content tirupati-bot-content">
                                Hello! I'm Divyanshi from Tirupati Trader Associates. I can help you with questions about our modular furniture, pricing, installation, and more. What would you like to know?
                            </div>
                        </div>
                    </div>
                    
                    <div class="tirupati-chat-input">
                        <input type="text" class="tirupati-input-field" id="tirupatiChatInput" placeholder="Ask Divyanshi about our products..." maxlength="500">
                        <button class="tirupati-send-button" id="tirupatiSendButton">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
    }

    bindEvents() {
        const toggle = document.getElementById('tirupatiChatToggle');
        const closeBtn = document.getElementById('tirupatiCloseBtn');
        const startChatBtn = document.getElementById('tirupatiStartChatBtn');
        const emailInput = document.getElementById('tirupatiUserEmail');
        const contactInput = document.getElementById('tirupatiUserContact');

        toggle.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        startChatBtn.addEventListener('click', () => this.handleRegistration());
        
        // Handle Enter key in registration form
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') contactInput.focus();
        });
        
        contactInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleRegistration();
        });

        // Chat input events (will be bound after registration)
        this.bindChatEvents();
    }

    bindChatEvents() {
        const input = document.getElementById('tirupatiChatInput');
        const sendBtn = document.getElementById('tirupatiSendButton');

        if (input && sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
    }

    toggleChat() {
        const widget = document.getElementById('tirupatiChatWidget');
        const toggle = document.getElementById('tirupatiChatToggle');

        if (this.isOpen) {
            this.closeChat();
        } else {
            widget.classList.remove('tirupati-hidden');
            toggle.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            `;
            this.isOpen = true;
            
            // Show appropriate interface
            if (this.isRegistered) {
                this.showChatInterface();
            } else {
                this.showRegistrationForm();
            }
        }
    }

    closeChat() {
        const widget = document.getElementById('tirupatiChatWidget');
        const toggle = document.getElementById('tirupatiChatToggle');
        
        widget.classList.add('tirupati-hidden');
        toggle.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
        `;
        this.isOpen = false;
        
        // Save session data when closing chat
        if (this.isRegistered) {
            this.saveVisitorSession();
        }
    }

    showRegistrationForm() {
        const regForm = document.getElementById('tirupatiRegistrationForm');
        const chatInterface = document.getElementById('tirupatiChatInterface');
        
        regForm.classList.remove('tirupati-hidden');
        chatInterface.classList.add('tirupati-hidden');
        
        setTimeout(() => document.getElementById('tirupatiUserEmail').focus(), 100);
    }

    showChatInterface() {
        const regForm = document.getElementById('tirupatiRegistrationForm');
        const chatInterface = document.getElementById('tirupatiChatInterface');
        
        regForm.classList.add('tirupati-hidden');
        chatInterface.classList.remove('tirupati-hidden');
        
        setTimeout(() => document.getElementById('tirupatiChatInput').focus(), 100);
    }

    handleRegistration() {
        const email = document.getElementById('tirupatiUserEmail').value.trim();
        const contact = document.getElementById('tirupatiUserContact').value.trim();
        
        // Validate inputs
        if (!email || !contact) {
            alert('Please fill in both email and contact number.');
            return;
        }
        
        if (!this.validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        if (!this.validateContact(contact)) {
            alert('Please enter a valid contact number.');
            return;
        }
        
        // Store user data
        this.userData.email = email;
        this.userData.contact = contact;
        this.userData.sessionId = this.generateSessionId();
        this.userData.startTime = new Date().toISOString();
        this.isRegistered = true;
        
        // Save to localStorage
        this.updateUserVisit();
        
        // Show chat interface
        this.showChatInterface();
        
        // Add welcome message with user's name
        this.addBotMessage(`Welcome to Tirupati Trader Associates! I am Divyanshi and what can I help you please...`);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateContact(contact) {
        const contactRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return contactRegex.test(contact.replace(/[\s\-\(\)]/g, ''));
    }

    sendMessage() {
        const input = document.getElementById('tirupatiChatInput');
        const message = input.value.trim();
        
        if (message && this.isRegistered) {
            // Track user message
            this.userData.messages.push({
                type: 'user',
                message: message,
                timestamp: new Date().toISOString()
            });
            
            this.addUserMessage(message);
            input.value = '';
            
            this.showTyping();
            
            setTimeout(() => {
                this.hideTyping();
                const response = this.generateResponse(message);
                
                // Track bot response
                this.userData.messages.push({
                    type: 'bot',
                    message: response.text,
                    timestamp: new Date().toISOString(),
                    source: response.source
                });
                
                this.addBotMessage(response.text, response.source);
            }, 800 + Math.random() * 800);
        }
    }

    addUserMessage(message) {
        const container = document.getElementById('tirupatiChatContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'tirupati-message tirupati-user-message';
        
        messageDiv.innerHTML = `
            <div class="tirupati-message-content tirupati-user-content">
                ${this.escapeHtml(message)}
            </div>
        `;
        
        container.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addBotMessage(message, source = null) {
        const container = document.getElementById('tirupatiChatContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'tirupati-message tirupati-bot-message';
        
        messageDiv.innerHTML = `
            <div class="tirupati-bot-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
            </div>
            <div class="tirupati-message-content tirupati-bot-content">
                ${this.formatMessage(message)}
                ${source ? `<div class="tirupati-source">📄 Source: ${source}</div>` : ''}
            </div>
        `;
        
        container.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTyping() {
        const container = document.getElementById('tirupatiChatContainer');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'tirupatiTyping';
        typingDiv.className = 'tirupati-message tirupati-bot-message';
        
        typingDiv.innerHTML = `
            <div class="tirupati-bot-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
            </div>
            <div class="tirupati-typing">
                <div class="tirupati-typing-dot"></div>
                <div class="tirupati-typing-dot"></div>
                <div class="tirupati-typing-dot"></div>
            </div>
        `;
        
        container.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        const typing = document.getElementById('tirupatiTyping');
        if (typing) typing.remove();
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        for (const [key, data] of Object.entries(this.knowledgeBase)) {
            if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return { text: data.response, source: data.source };
            }
        }
        
        return {
            text: "I'd be happy to help! You can ask me about:\n\n• **Products** - Our modular furniture range\n• **Pricing** - Cost estimates and budgets\n• **Installation** - Delivery and setup\n• **Warranty** - Our guarantee policies\n• **Contact** - How to reach us\n\nWhat would you like to know?",
            source: "General Help"
        };
    }

    formatMessage(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/•/g, '<span style="color: #2563eb;">•</span>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
        const container = document.getElementById('tirupatiChatContainer');
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }
}

// Initialize chatbot
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.tirupatiChatbot = new TirupatiChatbot();
    });
}
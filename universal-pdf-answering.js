/**
 * Universal PDF Question Answering System
 * Handles ANY visitor question by synchronizing with complete PDF content
 * Creates comprehensive, contextual answers from all available information
 */

class UniversalPDFAnsweringSystem {
    constructor() {
        this.fullPDFContent = '';
        this.contentIndex = {};
        this.sentenceDatabase = [];
        this.topicClusters = {};
        this.questionPatterns = {};
        this.isInitialized = false;
    }

    // Initialize the complete system
    async initialize() {
        try {
            console.log('🔄 Initializing Universal PDF Answering System...');
            
            // Load and process complete PDF
            await this.loadCompletePDF();
            
            // Create comprehensive content index
            this.createContentIndex();
            
            // Build sentence database for matching
            this.buildSentenceDatabase();
            
            // Create topic clusters
            this.createTopicClusters();
            
            // Initialize question classification
            this.initializeQuestionClassification();
            
            this.isInitialized = true;
            console.log('✅ Universal PDF Answering System ready!');
            console.log(`📊 Indexed ${this.sentenceDatabase.length} sentences from PDF`);
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Universal PDF System:', error);
            this.createFallbackIndex();
            return false;
        }
    }

    // Load complete PDF and extract all content
    async loadCompletePDF() {
        try {
            if (typeof pdfjsLib === 'undefined') {
                await this.loadPDFJS();
            }

            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            const loadingTask = pdfjsLib.getDocument('./documents/tirupati-catalog.pdf');
            const pdf = await loadingTask.promise;
            
            let fullContent = '';
            let pageContents = [];
            
            // Extract text from all pages with page tracking
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                
                const pageText = textContent.items
                    .map(item => item.str)
                    .join(' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                
                if (pageText.length > 10) {
                    pageContents.push({
                        pageNum,
                        content: pageText,
                        sentences: this.extractSentences(pageText)
                    });
                    fullContent += pageText + ' ';
                }
            }
            
            this.fullPDFContent = fullContent;
            this.pageContents = pageContents;
            
            console.log(`📄 Loaded ${pdf.numPages} pages with ${fullContent.length} characters`);
            
        } catch (error) {
            console.error('Error loading complete PDF:', error);
            throw error;
        }
    }

    // Load PDF.js library
    async loadPDFJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Extract sentences from text
    extractSentences(text) {
        return text
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 10)
            .map(s => s.replace(/\s+/g, ' '));
    }

    // Create comprehensive content index
    createContentIndex() {
        const words = this.fullPDFContent.toLowerCase()
            .replace(/[^\w\s₹]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2);

        // Create word frequency index
        this.contentIndex.wordFreq = {};
        words.forEach(word => {
            this.contentIndex.wordFreq[word] = (this.contentIndex.wordFreq[word] || 0) + 1;
        });

        // Extract key entities
        this.contentIndex.prices = this.extractAllPrices();
        this.contentIndex.products = this.extractAllProducts();
        this.contentIndex.materials = this.extractAllMaterials();
        this.contentIndex.features = this.extractAllFeatures();
        this.contentIndex.processes = this.extractAllProcesses();
        this.contentIndex.contacts = this.extractAllContacts();
        this.contentIndex.locations = this.extractAllLocations();
        this.contentIndex.timeframes = this.extractAllTimeframes();
    }

    // Extract all pricing information
    extractAllPrices() {
        const pricePatterns = [
            /₹\s*[\d,]+(?:\s*-\s*₹?\s*[\d,]+)?/g,
            /(?:from|starting|starts)\s+₹?\s*[\d,]+/gi,
            /(?:price|cost|rate|budget)\s*:?\s*₹?\s*[\d,]+/gi,
            /[\d,]+\s*(?:rupees|rs\.?)/gi
        ];

        const prices = [];
        const content = this.fullPDFContent;

        pricePatterns.forEach(pattern => {
            const matches = content.match(pattern) || [];
            matches.forEach(match => {
                const context = this.getContextAroundMatch(content, match);
                prices.push({ price: match.trim(), context });
            });
        });

        return prices;
    }

    // Extract all product information
    extractAllProducts() {
        const productKeywords = [
            'kitchen', 'bedroom', 'living room', 'dining', 'wardrobe', 'cabinet',
            'sofa', 'bed', 'table', 'chair', 'shelf', 'drawer', 'door', 'handle',
            'modular', 'furniture', 'interior', 'design', 'storage'
        ];

        return this.extractEntitiesByKeywords(productKeywords);
    }

    // Extract all material information
    extractAllMaterials() {
        const materialKeywords = [
            'wood', 'plywood', 'laminate', 'veneer', 'polish', 'finish',
            'hardware', 'hinge', 'mechanism', 'quality', 'grade', 'coating'
        ];

        return this.extractEntitiesByKeywords(materialKeywords);
    }

    // Extract all features
    extractAllFeatures() {
        const featureKeywords = [
            'soft-close', 'telescopic', 'pull-out', 'storage', 'space',
            'adjustable', 'modular', 'custom', 'design', 'installation'
        ];

        return this.extractEntitiesByKeywords(featureKeywords);
    }

    // Extract process information
    extractAllProcesses() {
        const processKeywords = [
            'process', 'step', 'procedure', 'installation', 'delivery',
            'consultation', 'measurement', 'design', 'manufacturing', 'service'
        ];

        return this.extractEntitiesByKeywords(processKeywords);
    }

    // Extract contact information
    extractAllContacts() {
        const phoneRegex = /(?:\+91|0)?[\s-]?[6-9]\d{9}/g;
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const socialRegex = /(?:whatsapp|instagram|facebook|linkedin)/gi;

        const contacts = {
            phones: [...new Set(this.fullPDFContent.match(phoneRegex) || [])],
            emails: [...new Set(this.fullPDFContent.match(emailRegex) || [])],
            social: [...new Set(this.fullPDFContent.match(socialRegex) || [])]
        };

        return contacts;
    }

    // Extract location information
    extractAllLocations() {
        const locationKeywords = [
            'address', 'location', 'city', 'state', 'pin', 'area',
            'hyderabad', 'telangana', 'india', 'near', 'opposite'
        ];

        return this.extractEntitiesByKeywords(locationKeywords);
    }

    // Extract timeframe information
    extractAllTimeframes() {
        const timePatterns = [
            /\d+\s*(?:days?|weeks?|months?|years?)/gi,
            /(?:within|in|after)\s+\d+\s*(?:days?|weeks?)/gi,
            /(?:delivery|installation|completion)\s+(?:time|period)/gi
        ];

        const timeframes = [];
        timePatterns.forEach(pattern => {
            const matches = this.fullPDFContent.match(pattern) || [];
            matches.forEach(match => {
                const context = this.getContextAroundMatch(this.fullPDFContent, match);
                timeframes.push({ timeframe: match.trim(), context });
            });
        });

        return timeframes;
    }

    // Extract entities by keywords
    extractEntitiesByKeywords(keywords) {
        const entities = [];
        
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b\\w*${keyword}\\w*\\b`, 'gi');
            const matches = this.fullPDFContent.match(regex) || [];
            
            matches.forEach(match => {
                const context = this.getContextAroundMatch(this.fullPDFContent, match);
                entities.push({ term: match.trim(), keyword, context });
            });
        });

        return entities;
    }

    // Get context around a match
    getContextAroundMatch(content, match, contextLength = 100) {
        const index = content.indexOf(match);
        if (index === -1) return match;

        const start = Math.max(0, index - contextLength);
        const end = Math.min(content.length, index + match.length + contextLength);
        
        return content.substring(start, end).trim();
    }

    // Build sentence database for similarity matching
    buildSentenceDatabase() {
        this.sentenceDatabase = [];
        
        this.pageContents.forEach(page => {
            page.sentences.forEach(sentence => {
                if (sentence.length > 20) {
                    this.sentenceDatabase.push({
                        text: sentence,
                        page: page.pageNum,
                        words: sentence.toLowerCase().split(/\s+/),
                        topics: this.identifyTopics(sentence)
                    });
                }
            });
        });
    }

    // Identify topics in a sentence
    identifyTopics(sentence) {
        const topics = [];
        const lowerSentence = sentence.toLowerCase();
        
        const topicKeywords = {
            pricing: ['price', 'cost', '₹', 'budget', 'expensive', 'cheap', 'rate'],
            products: ['kitchen', 'bedroom', 'living', 'furniture', 'wardrobe', 'sofa'],
            materials: ['wood', 'plywood', 'laminate', 'material', 'quality'],
            process: ['installation', 'delivery', 'process', 'step', 'procedure'],
            warranty: ['warranty', 'guarantee', 'service', 'maintenance'],
            contact: ['phone', 'email', 'contact', 'address', 'location']
        };

        Object.entries(topicKeywords).forEach(([topic, keywords]) => {
            if (keywords.some(keyword => lowerSentence.includes(keyword))) {
                topics.push(topic);
            }
        });

        return topics;
    }

    // Create topic clusters
    createTopicClusters() {
        this.topicClusters = {};
        
        this.sentenceDatabase.forEach(sentence => {
            sentence.topics.forEach(topic => {
                if (!this.topicClusters[topic]) {
                    this.topicClusters[topic] = [];
                }
                this.topicClusters[topic].push(sentence);
            });
        });
    }

    // Initialize question classification patterns
    initializeQuestionClassification() {
        this.questionPatterns = {
            // What questions
            what: {
                patterns: [/what\s+(?:is|are|do|does)/i, /what.*(?:price|cost)/i],
                handler: 'handleWhatQuestions'
            },
            // How questions
            how: {
                patterns: [/how\s+(?:much|many|to|can|do)/i, /how.*(?:price|work)/i],
                handler: 'handleHowQuestions'  
            },
            // Where questions
            where: {
                patterns: [/where\s+(?:is|are|can|do)/i, /where.*located/i],
                handler: 'handleWhereQuestions'
            },
            // When questions
            when: {
                patterns: [/when\s+(?:do|can|will)/i, /when.*(?:delivery|installation)/i],
                handler: 'handleWhenQuestions'
            },
            // Why questions
            why: {
                patterns: [/why\s+(?:should|do|is)/i, /why.*choose/i],
                handler: 'handleWhyQuestions'
            },
            // Comparison questions
            comparison: {
                patterns: [/(?:vs|versus|compare|difference|better)/i, /which.*(?:better|best)/i],
                handler: 'handleComparisonQuestions'
            },
            // Request/Need statements
            need: {
                patterns: [/(?:i need|i want|looking for|require)/i, /need.*(?:quote|price)/i],
                handler: 'handleNeedStatements'
            }
        };
    }

    // MAIN METHOD: Answer any visitor question
    answerAnyQuestion(question) {
        if (!this.isInitialized) {
            return this.getFallbackAnswer(question);
        }

        try {
            console.log(`🤔 Processing question: "${question}"`);
            
            // Step 1: Classify question type
            const questionType = this.classifyQuestion(question);
            
            // Step 2: Find relevant content using multiple methods
            const relevantContent = this.findRelevantContent(question);
            
            // Step 3: Generate comprehensive answer
            const answer = this.generateComprehensiveAnswer(question, questionType, relevantContent);
            
            console.log(`✅ Generated answer with ${relevantContent.length} relevant pieces`);
            return answer;
            
        } catch (error) {
            console.error('Error answering question:', error);
            return this.getFallbackAnswer(question);
        }
    }

    // Classify the question type
    classifyQuestion(question) {
        const questionLower = question.toLowerCase();
        
        for (const [type, config] of Object.entries(this.questionPatterns)) {
            if (config.patterns.some(pattern => pattern.test(questionLower))) {
                return type;
            }
        }
        
        return 'general';
    }

    // Find relevant content using multiple search methods
    findRelevantContent(question) {
        const questionWords = question.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2);
        
        const relevantPieces = [];
        
        // Method 1: Direct word matching in sentences
        this.sentenceDatabase.forEach(sentence => {
            let matchScore = 0;
            questionWords.forEach(word => {
                if (sentence.words.includes(word)) {
                    matchScore += word.length; // Longer words get higher score
                }
            });
            
            if (matchScore > 0) {
                relevantPieces.push({
                    content: sentence.text,
                    score: matchScore,
                    page: sentence.page,
                    topics: sentence.topics,
                    type: 'sentence'
                });
            }
        });
        
        // Method 2: Topic-based matching
        questionWords.forEach(word => {
            Object.entries(this.topicClusters).forEach(([topic, sentences]) => {
                if (topic.includes(word) || word.includes(topic)) {
                    sentences.slice(0, 3).forEach(sentence => {
                        relevantPieces.push({
                            content: sentence.text,
                            score: 5,
                            page: sentence.page,
                            topics: [topic],
                            type: 'topic'
                        });
                    });
                }
            });
        });
        
        // Method 3: Entity-based matching
        const entityMatches = this.findEntityMatches(question);
        entityMatches.forEach(match => {
            relevantPieces.push({
                content: match.context,
                score: 8,
                entity: match.term,
                type: 'entity'
            });
        });
        
        // Sort by relevance and remove duplicates
        const uniquePieces = this.removeDuplicateContent(relevantPieces);
        return uniquePieces
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Top 10 most relevant pieces
    }

    // Find entity matches in question
    findEntityMatches(question) {
        const matches = [];
        const questionLower = question.toLowerCase();
        
        // Check all indexed entities
        Object.values(this.contentIndex).forEach(entityGroup => {
            if (Array.isArray(entityGroup)) {
                entityGroup.forEach(entity => {
                    if (entity.term && questionLower.includes(entity.term.toLowerCase())) {
                        matches.push(entity);
                    }
                });
            }
        });
        
        return matches;
    }

    // Remove duplicate content
    removeDuplicateContent(pieces) {
        const seen = new Set();
        return pieces.filter(piece => {
            const key = piece.content.substring(0, 50);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    // Generate natural, conversational answer
    generateComprehensiveAnswer(question, questionType, relevantContent) {
        if (relevantContent.length === 0) {
            return this.generateGenericAnswer(question);
        }
        
        // Extract key information naturally
        const keyInfo = this.extractKeyInformation(question, relevantContent);
        
        // Generate natural response
        return this.createNaturalResponse(question, questionType, keyInfo);
    }

    // Extract key information without overwhelming details
    extractKeyInformation(question, relevantContent) {
        const questionLower = question.toLowerCase();
        const keyInfo = {
            prices: [],
            products: [],
            timeframes: [],
            contact: null,
            mainPoints: []
        };

        // Extract most relevant prices (max 2)
        if (questionLower.includes('price') || questionLower.includes('cost') || questionLower.includes('budget')) {
            keyInfo.prices = this.contentIndex.prices.slice(0, 2);
        }

        // Extract main points from relevant content (max 2)
        relevantContent.slice(0, 2).forEach(content => {
            if (content.content.length > 20 && content.content.length < 150) {
                keyInfo.mainPoints.push(content.content);
            }
        });

        // Extract timeframes if question asks about timing
        if (questionLower.includes('time') || questionLower.includes('when') || questionLower.includes('delivery')) {
            keyInfo.timeframes = this.contentIndex.timeframes.slice(0, 1);
        }

        // Extract contact if needed
        if (questionLower.includes('contact') || questionLower.includes('phone') || questionLower.includes('call')) {
            keyInfo.contact = this.contentIndex.contacts;
        }

        return keyInfo;
    }

    // Create natural, conversational response
    createNaturalResponse(question, questionType, keyInfo) {
        const questionLower = question.toLowerCase();
        let response = '';

        // Natural conversation starters
        if (questionLower.includes('price') || questionLower.includes('cost')) {
            response = this.createPricingResponse(keyInfo);
        } else if (questionLower.includes('kitchen')) {
            response = this.createKitchenResponse(keyInfo);
        } else if (questionLower.includes('bedroom') || questionLower.includes('wardrobe')) {
            response = this.createBedroomResponse(keyInfo);
        } else if (questionLower.includes('living room') || questionLower.includes('sofa')) {
            response = this.createLivingRoomResponse(keyInfo);
        } else if (questionLower.includes('material') || questionLower.includes('quality')) {
            response = this.createMaterialResponse(keyInfo);
        } else if (questionLower.includes('contact') || questionLower.includes('phone')) {
            response = this.createContactResponse(keyInfo);
        } else if (questionLower.includes('time') || questionLower.includes('delivery')) {
            response = this.createTimelineResponse(keyInfo);
        } else {
            response = this.createGeneralResponse(keyInfo);
        }

        return response;
    }

    // Create natural pricing response
    createPricingResponse(keyInfo) {
        let response = "Sure! Our pricing varies based on your specific needs. ";
        
        if (keyInfo.prices.length > 0) {
            const price = keyInfo.prices[0];
            response += `Generally, you can expect ${price.price}. `;
        } else {
            response += "For kitchens, we typically start around ₹80,000, bedrooms from ₹50,000, and living rooms from ₹40,000. ";
        }
        
        response += "The final cost depends on size, materials, and customization. Would you like me to arrange a free home visit for an accurate quote?";
        
        return response;
    }

    // Create natural kitchen response
    createKitchenResponse(keyInfo) {
        let response = "Great choice! We specialize in modular kitchens with modern designs. ";
        
        if (keyInfo.mainPoints.length > 0) {
            response += keyInfo.mainPoints[0] + " ";
        }
        
        response += "Our kitchens come with soft-close fittings, premium materials, and we handle everything from design to installation. ";
        response += "Interested in seeing some design options?";
        
        return response;
    }

    // Create natural bedroom response
    createBedroomResponse(keyInfo) {
        let response = "Perfect! We create beautiful bedroom solutions that maximize your space. ";
        
        if (keyInfo.mainPoints.length > 0) {
            response += keyInfo.mainPoints[0] + " ";
        }
        
        response += "Our wardrobes and bedroom furniture are custom-made to fit your room perfectly. ";
        response += "Would you like to see some bedroom designs?";
        
        return response;
    }

    // Create natural living room response
    createLivingRoomResponse(keyInfo) {
        let response = "Excellent! We design complete living room setups that bring families together. ";
        
        if (keyInfo.mainPoints.length > 0) {
            response += keyInfo.mainPoints[0] + " ";
        }
        
        response += "From comfortable sofas to stylish TV units and storage solutions - we cover it all. ";
        response += "Want to discuss your living room ideas?";
        
        return response;
    }

    // Create natural material response
    createMaterialResponse(keyInfo) {
        let response = "Quality is our priority! We use premium materials like marine plywood and high-grade laminates. ";
        
        if (keyInfo.mainPoints.length > 0 && keyInfo.mainPoints[0].includes('material')) {
            response += keyInfo.mainPoints[0] + " ";
        } else {
            response += "All our hardware is from trusted brands like Hettich, and we provide 5-year warranty on structure. ";
        }
        
        response += "Quality you can trust for years to come!";
        
        return response;
    }

    // Create natural contact response
    createContactResponse(keyInfo) {
        let response = "Absolutely! I'd love to connect you with our team. ";
        
        if (keyInfo.contact && keyInfo.contact.phones.length > 0) {
            response += `You can call us at ${keyInfo.contact.phones[0]} or `;
        }
        
        response += "we can arrange a free home visit where our designer will discuss your requirements and show you samples. ";
        response += "When would be a good time for you?";
        
        return response;
    }

    // Create natural timeline response
    createTimelineResponse(keyInfo) {
        let response = "Good question! ";
        
        if (keyInfo.timeframes.length > 0) {
            response += keyInfo.timeframes[0].timeframe + " is typical for most projects. ";
        } else {
            response += "Usually, it takes 15-20 days from design approval to installation. ";
        }
        
        response += "We'll give you an exact timeline after understanding your specific requirements. ";
        response += "Shall I arrange a consultation to discuss this?";
        
        return response;
    }

    // Create natural general response
    createGeneralResponse(keyInfo) {
        let response = "Thanks for asking! ";
        
        if (keyInfo.mainPoints.length > 0) {
            response += keyInfo.mainPoints[0] + " ";
        } else {
            response += "We're here to help create the perfect furniture solution for your home. ";
        }
        
        response += "Whether it's kitchens, bedrooms, or living rooms - we've got you covered. ";
        response += "What specific area are you looking to work on?";
        
        return response;
    }

    // Synthesize main content from relevant pieces
    synthesizeMainContent(pieces) {
        if (pieces.length === 0) return '';
        
        let content = '';
        const topics = [...new Set(pieces.flatMap(p => p.topics || []))];
        
        if (topics.length > 0) {
            content += `**Key Information:**\n`;
        }
        
        pieces.forEach((piece, index) => {
            if (piece.content.length > 20) {
                content += `• ${piece.content}\n`;
            }
        });
        
        return content;
    }

    // Extract specific details for the question
    extractSpecificDetails(question, relevantContent) {
        const questionLower = question.toLowerCase();
        let details = [];
        
        // Look for prices if question mentions cost/price
        if (questionLower.includes('price') || questionLower.includes('cost')) {
            const prices = this.contentIndex.prices.slice(0, 3);
            prices.forEach(p => details.push(`💰 ${p.price} - ${p.context.substring(0, 80)}...`));
        }
        
        // Look for timeframes if question mentions time
        if (questionLower.includes('time') || questionLower.includes('when') || questionLower.includes('delivery')) {
            const timeframes = this.contentIndex.timeframes.slice(0, 2);
            timeframes.forEach(t => details.push(`⏱️ ${t.timeframe} - ${t.context.substring(0, 80)}...`));
        }
        
        // Look for contact info if question mentions contact
        if (questionLower.includes('contact') || questionLower.includes('phone') || questionLower.includes('call')) {
            const contacts = this.contentIndex.contacts;
            if (contacts.phones.length > 0) details.push(`📞 Phone: ${contacts.phones[0]}`);
            if (contacts.emails.length > 0) details.push(`📧 Email: ${contacts.emails[0]}`);
        }
        
        return details.length > 0 ? details.join('\n') : null;
    }

    // Get related information
    getRelatedInformation(questionType, relevantContent) {
        const relatedTopics = [...new Set(relevantContent.flatMap(p => p.topics || []))];
        const related = [];
        
        relatedTopics.slice(0, 3).forEach(topic => {
            if (this.topicClusters[topic] && this.topicClusters[topic].length > 0) {
                const sentence = this.topicClusters[topic][0];
                related.push(`• ${sentence.text}`);
            }
        });
        
        return related.length > 0 ? related.join('\n') : null;
    }

    // Get contextual call-to-action
    getContextualCTA(question, type) {
        const questionLower = question.toLowerCase();
        
        if (questionLower.includes('price') || questionLower.includes('quote') || questionLower.includes('cost')) {
            return `\n\n📞 **Ready for a personalized quote?** Call us at +91 72075-34088 for detailed pricing!`;
        }
        
        if (questionLower.includes('visit') || questionLower.includes('showroom') || questionLower.includes('see')) {
            return `\n\n🏠 **Want to see our products?** We offer free home consultations and showroom visits!`;
        }
        
        if (type === 'need') {
            return `\n\n✨ **Let's bring your vision to life!** Contact us for a free consultation and 3D design.`;
        }
        
        return `\n\n💬 **Have more questions?** Feel free to ask anything about our products and services!`;
    }

    // Generate natural generic answer
    generateGenericAnswer(question) {
        const responses = [
            "That's a great question! We specialize in creating beautiful modular furniture for Indian homes. Whether you're looking for kitchens, bedrooms, or living rooms, we've got some amazing options. What specific area interests you most?",
            
            "I'd be happy to help! We design and install custom furniture solutions including modular kitchens, wardrobes, and complete home interiors. Could you tell me a bit more about what you have in mind?",
            
            "Absolutely! We work on all kinds of furniture projects - from compact kitchen designs to spacious bedroom setups. What's your main requirement? I can share some relevant options with you."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Natural fallback when system is loading
    getFallbackAnswer(question) {
        const responses = [
            "Let me check that for you! While I'm pulling up the latest information, I can tell you we specialize in modular kitchens, bedroom furniture, and living room solutions. What specific details would you like to know?",
            
            "Good question! I'm just loading our complete product range to give you the most accurate answer. In the meantime, feel free to call us at +91 72075-34088 if you need immediate assistance!",
            
            "I want to give you the best possible answer! Let me gather the specific details about that. You can also WhatsApp us for quick responses while I'm checking our catalog."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Create fallback index when PDF loading fails
    createFallbackIndex() {
        console.log('🔄 Creating fallback content index...');
        
        // Use comprehensive fallback data
        this.contentIndex = {
            prices: [
                { price: '₹80,000 - ₹3,00,000', context: 'Modular kitchen complete solutions with premium materials and installation' },
                { price: '₹50,000 - ₹2,00,000', context: 'Bedroom furniture sets including wardrobes, beds, and storage units' },
                { price: '₹40,000 - ₹1,50,000', context: 'Living room furniture with sofa sets, TV units, and display cabinets' }
            ],
            contacts: {
                phones: ['+91 72075-34088'],
                emails: ['tirupatitraderassociate2021@gmail.com'],
                social: ['WhatsApp', 'Instagram']
            }
        };
        
        this.isInitialized = true;
    }
}

// Export for use in chatbot
window.UniversalPDFAnsweringSystem = UniversalPDFAnsweringSystem;
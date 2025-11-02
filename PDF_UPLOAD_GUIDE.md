# 📚 How to Upload and Integrate Knowledge Base PDF

## 🎯 Quick Answer
**Upload Location:** Place your PDF in the `documents/` folder I just created.

## 📂 Folder Structure
```
Tirupati/
├── documents/          ← PUT YOUR PDF HERE
│   ├── README.md
│   └── your-catalog.pdf
├── js/
│   └── chatbot.js     ← UPDATE KNOWLEDGE BASE HERE
└── [other files...]
```

## 🔄 Integration Process

### Step 1: Upload PDF
1. **Copy your PDF** to: `c:\Users\dell\Desktop\Tirupati\documents\`
2. **Recommended name**: `tirupati-catalog.pdf` or `furniture-guide.pdf`

### Step 2: Update Chatbot Knowledge
**Edit file:** `js/chatbot.js` (lines 16-45)

**Add new entries like this:**
```javascript
this.knowledgeBase = {
    // ... existing entries ...
    
    // ADD YOUR NEW CONTENT HERE
    "new_topic": {
        keywords: ['keyword1', 'keyword2', 'related terms'],
        response: "Your detailed answer from the PDF content",
        source: "Your PDF Name"
    }
};
```

## 📝 Example: Adding Kitchen Cabinet Info

If your PDF has kitchen cabinet details, add:

```javascript
kitchen_cabinets: {
    keywords: ['cabinet', 'storage', 'kitchen storage', 'drawers', 'shelves'],
    response: "Our **modular kitchen cabinets** feature:\n\n• **Material:** Marine plywood with laminate finish\n• **Hardware:** Soft-close hinges and telescopic channels\n• **Sizes:** Standard and custom dimensions available\n• **Colors:** 50+ laminate options\n\nStarting from ₹12,000 per linear foot.",
    source: "Kitchen Catalog 2024"
}
```

## 🚀 Quick Method

### For Immediate Use:
1. **Read your PDF**
2. **Identify key topics** (pricing, products, services, etc.)
3. **Open:** `js/chatbot.js`
4. **Find line 16:** `this.knowledgeBase = {`
5. **Add new entries** before the closing `};`
6. **Save and test**

## 💡 Pro Tips

### Keywords Strategy:
- Include **variations** of terms customers might use
- Add **synonyms** and **common misspellings**
- Use **specific product names** from your catalog

### Response Format:
- Use **markdown** for formatting (`**bold**`, `• bullets`)
- Include **prices** when available
- Add **contact prompts** for complex queries

## 🔍 Current Knowledge Base Topics:
- ✅ Products & Services
- ✅ Pricing Information
- ✅ Installation Details
- ✅ Warranty Information
- ✅ Contact Information

**You can add:** Specifications, Materials, Design Options, Maintenance, etc.

## 📞 Need Help?

**Can't edit the code?** 
Send me your PDF content and I'll help integrate it into the chatbot knowledge base.

**Testing the chatbot:**
1. Open your website
2. Click the chat button
3. Register with email/contact
4. Ask questions using the keywords you added

---
**Location:** `documents/` folder ← Your PDF goes here!
**Configuration:** `js/chatbot.js` ← Update knowledge here!
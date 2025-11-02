# Divyanshi Chatbot - Tirupati Trader Associates - User Registration & Admin Guide

## 🔐 User Registration System

### How It Works
1. **First-time visitors** must provide email and contact number before accessing Divyanshi chat
2. **Returning visitors** (within 30 days) can chat directly without re-registration
3. **All chat sessions** with Divyanshi are automatically tracked and stored
4. **User data** is saved locally and can be exported by admin

### User Experience
- Visitors click the chat button (blue circle in bottom-right)
- New users see a registration form requiring:
  - Valid email address
  - Contact number (phone)
- After registration, users receive personalized welcome from Divyanshi
- Chat history and user data is automatically tracked

## 📊 Admin Panel Features

### Accessing Admin Panel
Open: `http://localhost:8080/admin-panel.html` (or your domain/admin-panel.html)

### Dashboard Features
1. **Statistics Overview**
   - Total chat sessions
   - Unique visitors count
   - Total messages exchanged
   - Average session duration

2. **Session Management**
   - View all chat sessions in a table
   - Filter by date range and email
   - View detailed session information
   - Delete individual sessions

3. **Data Export**
   - Export all data to CSV format
   - Includes user details, session info, and chat messages
   - Perfect for CRM integration or analysis

4. **Session Details**
   - Complete chat conversation history
   - User information (email, contact)
   - Technical data (browser, referrer, etc.)
   - Session duration and timestamps

### Admin Actions
- **Refresh**: Update data from localStorage
- **Export CSV**: Download visitor data as spreadsheet
- **Clear Data**: Remove all stored sessions (use carefully!)
- **Filter**: Search by date range or email address
- **View**: See complete session details and chat history
- **Delete**: Remove specific sessions

## 🛠 Technical Implementation

### Data Storage
- **Local Storage**: All data stored in browser's localStorage
- **Session Tracking**: Each visitor gets unique session ID
- **Message Logging**: All user and bot messages are recorded
- **Visitor History**: 30-day visitor recognition system

### Data Structure
```javascript
{
  sessionId: "session_timestamp_randomid",
  email: "user@example.com",
  contact: "+1234567890",
  startTime: "2023-12-07T10:30:00Z",
  endTime: "2023-12-07T10:45:00Z",
  messages: [
    {
      type: "user|bot",
      message: "chat content",
      timestamp: "2023-12-07T10:31:00Z",
      source: "knowledge_base" // for bot messages
    }
  ],
  userAgent: "browser info",
  referrer: "referring website",
  page: "current page URL"
}
```

### Privacy & Security
- **Local Storage Only**: No data sent to external servers by default
- **30-Day Expiry**: User registration expires after 30 days
- **Secure Validation**: Email and phone number validation
- **No Personal Data Leaks**: All data stays on your domain

## 🚀 Server Integration (Optional)

### To Send Data to Your Server
Uncomment the `sendToServer()` method in `js/chatbot.js`:

```javascript
sendToServer(sessionData) {
    fetch('/api/chat-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
    });
}
```

### Google Sheets Integration
You can also integrate with Google Sheets API for automatic data sync.

## 📋 Admin Tasks

### Daily Tasks
1. Check admin panel for new visitor data
2. Export CSV for record keeping
3. Review popular questions in chat logs

### Weekly Tasks
1. Analyze visitor patterns and popular topics
2. Update chatbot knowledge base if needed
3. Export weekly reports for management

### Monthly Tasks
1. Clear old sessions if storage gets full
2. Analyze conversion data and visitor sources
3. Update contact information or business details

## 🔧 Customization Options

### Registration Form
- Modify fields in `js/chatbot.js` (line ~350)
- Add additional validation rules
- Customize styling and messages

### Data Retention
- Change 30-day expiry in `loadVisitorData()` method
- Modify session storage limits (currently 1000 sessions)
- Adjust auto-save intervals

### Admin Panel
- Customize statistics display
- Add new filtering options
- Modify export format

## 📞 Support

For technical support or customizations:
- Check browser console for errors
- Ensure localStorage is enabled
- Verify server is running on correct port
- All data is stored locally - no internet required for basic functionality

## 🎯 Benefits for Business

1. **Lead Generation**: Collect visitor email and contact info
2. **Customer Support**: Track all customer conversations
3. **Analytics**: Understand visitor questions and patterns  
4. **Follow-up**: Export data for marketing campaigns
5. **Compliance**: Keep records of all customer interactions

---
*This system provides a complete visitor tracking and chat management solution for your Tirupati furniture website.*
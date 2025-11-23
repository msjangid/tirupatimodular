# Contact Form Management System - Admin Guide

## Overview
Complete contact form management system with admin panel for Innovative Modular Studio website.

## Features
✓ Contact form submission with validation
✓ Data stored in JSON file (data/contacts.json)
✓ Secure admin panel with authentication
✓ Real-time statistics (Total, Unread, Read)
✓ Mark messages as read/unread
✓ Reply via email or WhatsApp
✓ Delete messages
✓ Auto-refresh every 30 seconds
✓ Responsive design for all devices

## File Structure
```
Tirupati/
├── contact.html           # Contact form page
├── admin-panel.html       # Admin dashboard
├── save-contact.php       # Backend to save submissions
├── get-contacts.php       # Backend to retrieve/manage submissions
├── .htaccess             # Security and configuration
└── data/
    └── contacts.json     # Contact submissions storage
```

## Setup Instructions

### 1. File Permissions
Ensure the `data` folder is writable:
```powershell
# Windows - no action needed, already has write permissions
```

### 2. Admin Credentials
**Default Login:**
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT: Change these credentials!**

Edit `get-contacts.php` line 18-19:
```php
if ($username === 'admin' && $password === 'admin123') {
```

Change to your own secure credentials:
```php
if ($username === 'yourname' && $password === 'YourSecurePassword123!') {
```

### 3. Email Notifications
Configure email in `save-contact.php` line 70:
```php
$adminEmail = 'tirupatitraderassociate2021@gmail.com';
```

## Usage Guide

### Accessing Admin Panel
1. Open: `http://localhost/tirupati/admin-panel.html`
2. Login with credentials
3. View all contact submissions

### Admin Panel Features

#### Dashboard Statistics
- **Total Messages**: All contact form submissions
- **Unread**: New messages requiring attention
- **Read**: Messages already reviewed

#### Filter Messages
- **All Messages**: View everything
- **Unread**: Only new messages
- **Read**: Only reviewed messages

#### Message Actions
Each message card shows:
- Name, Email, Phone, Timestamp
- Full message content
- Action buttons:
  - **Mark as Read/Unread**: Change status
  - **Reply**: Opens email client
  - **WhatsApp**: Direct WhatsApp chat (if phone provided)
  - **Delete**: Remove message (with confirmation)

#### Auto Features
- Auto-refresh: Every 30 seconds
- Manual refresh: Click "Refresh" button
- Real-time statistics update

### Contact Form Behavior
1. User fills form on `contact.html`
2. JavaScript validates input
3. Submits to `save-contact.php`
4. Saved to `data/contacts.json`
5. Optional email sent to admin
6. Success notification shown

## Data Storage

### JSON Format
```json
[
  {
    "id": "contact_6564f3a2b1c4e5.12345678",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "Interested in modular furniture...",
    "timestamp": "2024-11-23T10:30:00.000Z",
    "userAgent": "Mozilla/5.0...",
    "ip": "127.0.0.1",
    "status": "unread",
    "submittedAt": "2024-11-23 10:30:00"
  }
]
```

### Data Limits
- Maximum 1000 submissions stored (auto-cleanup)
- Older messages removed when limit reached

## Security Features

1. **Authentication Required**: Admin panel requires login
2. **Data Directory Protected**: .htaccess blocks direct access
3. **Input Sanitization**: All data sanitized before storage
4. **Session Management**: PHP sessions for admin auth
5. **CORS Headers**: Proper cross-origin handling

## Troubleshooting

### "Failed to save contact data"
- Check `data/` folder exists
- Verify folder write permissions
- Check disk space

### Admin panel not loading
- Ensure PHP is running (XAMPP Apache started)
- Check browser console for errors
- Clear browser cache/cookies

### Emails not sending
- XAMPP doesn't send emails by default
- Configure SMTP in php.ini, or
- Use third-party service (Gmail SMTP, SendGrid, etc.)

### Messages not appearing
- Check `data/contacts.json` file exists
- Verify JSON format is valid
- Check browser network tab for errors

## Advanced Configuration

### Change Data Storage Location
Edit both PHP files:
```php
$dataDir = __DIR__ . '/data';  // Change to your path
```

### Increase Storage Limit
Edit `save-contact.php` line 59:
```php
$contacts = array_slice($contacts, 0, 1000);  // Change 1000 to your limit
```

### Add More Admin Users
Modify `get-contacts.php` authentication:
```php
$validUsers = [
    'admin' => 'admin123',
    'manager' => 'manager456',
    'support' => 'support789'
];

if (isset($validUsers[$username]) && $validUsers[$username] === $password) {
    // Login successful
}
```

## Backup & Maintenance

### Manual Backup
Copy `data/contacts.json` regularly:
```powershell
Copy-Item "data\contacts.json" "data\contacts_backup_$(Get-Date -Format 'yyyyMMdd').json"
```

### Automated Backup Script
Create `backup-contacts.php`:
```php
<?php
$source = __DIR__ . '/data/contacts.json';
$backup = __DIR__ . '/data/contacts_backup_' . date('Y-m-d_H-i-s') . '.json';
copy($source, $backup);
echo "Backup created: " . basename($backup);
?>
```

### Clean Old Messages
Add cleanup functionality in admin panel or create cron job.

## GitHub Pages Limitations
⚠️ **Important**: PHP files won't work on GitHub Pages (static hosting only)

For GitHub Pages, you need:
1. Use a backend service (Firebase, Netlify Forms, Formspree)
2. Or use client-side storage (localStorage only)
3. Or integrate with Google Sheets API

Current setup works perfectly on:
- Local XAMPP/WAMP
- Shared hosting with PHP
- VPS/Cloud servers (AWS, DigitalOcean, etc.)

## Support
For issues or questions:
- Email: tirupatitraderassociate2021@gmail.com
- WhatsApp: +91 8520984088

## Version History
- v1.0 (2024-11-23): Initial release
  - Contact form with validation
  - Admin panel with authentication
  - JSON storage system
  - Email notifications
  - WhatsApp integration

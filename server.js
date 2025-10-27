const express = require('express');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// Serve static files
app.use(express.static('./'));

// Handle contact form submissions
app.post('/save-contact', (req, res) => {
    try {
        const contactData = req.body;
        const filePath = path.join(__dirname, 'assets', 'contact', 'contact_us.xlsx');
        
        // Create contacts directory if it doesn't exist
        const dir = path.join(__dirname, 'assets', 'contact');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Read existing file or create new workbook
        let workbook;
        if (fs.existsSync(filePath)) {
            workbook = xlsx.readFile(filePath);
        } else {
            workbook = xlsx.utils.book_new();
            workbook.SheetNames.push('Contacts');
            workbook.Sheets['Contacts'] = xlsx.utils.json_to_sheet([]);
        }

        // Get the worksheet
        let worksheet = workbook.Sheets['Contacts'];
        
        // Convert worksheet to JSON to append new data
        let contacts = xlsx.utils.sheet_to_json(worksheet);
        contacts.push(contactData);

        // Convert back to worksheet
        worksheet = xlsx.utils.json_to_sheet(contacts);
        workbook.Sheets['Contacts'] = worksheet;

        // Write to file
        xlsx.writeFile(workbook, filePath);

        res.status(200).json({ message: 'Contact saved successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Failed to save contact' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
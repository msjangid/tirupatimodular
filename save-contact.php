<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Validate required fields
    if (!isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
        throw new Exception('Missing required fields');
    }
    
    // Sanitize input data
    $submission = [
        'id' => uniqid('contact_', true),
        'name' => htmlspecialchars(trim($data['name']), ENT_QUOTES, 'UTF-8'),
        'email' => filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL),
        'phone' => isset($data['phone']) ? htmlspecialchars(trim($data['phone']), ENT_QUOTES, 'UTF-8') : '',
        'message' => htmlspecialchars(trim($data['message']), ENT_QUOTES, 'UTF-8'),
        'timestamp' => $data['timestamp'] ?? date('c'),
        'userAgent' => $data['userAgent'] ?? $_SERVER['HTTP_USER_AGENT'] ?? '',
        'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
        'status' => 'unread',
        'submittedAt' => date('Y-m-d H:i:s')
    ];
    
    // Validate email
    if (!filter_var($submission['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email address');
    }
    
    // Define data directory and file
    $dataDir = __DIR__ . '/data';
    $dataFile = $dataDir . '/contacts.json';
    
    // Create data directory if it doesn't exist
    if (!file_exists($dataDir)) {
        if (!mkdir($dataDir, 0755, true)) {
            throw new Exception('Failed to create data directory');
        }
    }
    
    // Load existing contacts
    $contacts = [];
    if (file_exists($dataFile)) {
        $jsonContent = file_get_contents($dataFile);
        $contacts = json_decode($jsonContent, true) ?? [];
    }
    
    // Add new submission
    array_unshift($contacts, $submission); // Add to beginning of array
    
    // Keep only last 1000 submissions to prevent file from growing too large
    $contacts = array_slice($contacts, 0, 1000);
    
    // Save to file
    if (file_put_contents($dataFile, json_encode($contacts, JSON_PRETTY_PRINT)) === false) {
        throw new Exception('Failed to save contact data');
    }
    
    // Optional: Send email notification to admin
    $adminEmail = 'tirupatitraderassociate2021@gmail.com';
    $subject = 'New Contact Form Submission - ' . $submission['name'];
    $emailBody = "New contact form submission:\n\n" .
                 "Name: {$submission['name']}\n" .
                 "Email: {$submission['email']}\n" .
                 "Phone: {$submission['phone']}\n" .
                 "Message: {$submission['message']}\n" .
                 "Submitted: {$submission['submittedAt']}\n" .
                 "IP: {$submission['ip']}\n";
    
    $emailHeaders = "From: noreply@innovativemodularstudio.com\r\n" .
                   "Reply-To: {$submission['email']}\r\n" .
                   "X-Mailer: PHP/" . phpversion();
    
    // Attempt to send email (suppress errors if mail server not configured)
    @mail($adminEmail, $subject, $emailBody, $emailHeaders);
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Contact form submitted successfully',
        'id' => $submission['id']
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

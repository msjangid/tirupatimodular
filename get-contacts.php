<?php
// Admin API to retrieve contact submissions
session_start();

// Set response headers
header('Content-Type: application/json');

// Simple authentication check
$isAuthenticated = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;

// Handle login
if (isset($_POST['action']) && $_POST['action'] === 'login') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Simple hardcoded credentials (change these!)
    if ($username === 'admin' && $password === 'admin123') {
        $_SESSION['admin_logged_in'] = true;
        echo json_encode(['success' => true, 'message' => 'Login successful']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
    exit();
}

// Handle logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Logged out']);
    exit();
}

// Check authentication for data access
if (!$isAuthenticated) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

// Get contacts data
$dataFile = __DIR__ . '/data/contacts.json';

if (!file_exists($dataFile)) {
    echo json_encode([
        'success' => true,
        'contacts' => [],
        'total' => 0
    ]);
    exit();
}

$contacts = json_decode(file_get_contents($dataFile), true) ?? [];

// Handle mark as read/unread
if (isset($_POST['action']) && $_POST['action'] === 'mark_status') {
    $id = $_POST['id'] ?? '';
    $status = $_POST['status'] ?? 'unread';
    
    foreach ($contacts as &$contact) {
        if ($contact['id'] === $id) {
            $contact['status'] = $status;
            break;
        }
    }
    
    file_put_contents($dataFile, json_encode($contacts, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true, 'message' => 'Status updated']);
    exit();
}

// Handle delete
if (isset($_POST['action']) && $_POST['action'] === 'delete') {
    $id = $_POST['id'] ?? '';
    
    $contacts = array_filter($contacts, function($contact) use ($id) {
        return $contact['id'] !== $id;
    });
    
    file_put_contents($dataFile, json_encode(array_values($contacts), JSON_PRETTY_PRINT));
    echo json_encode(['success' => true, 'message' => 'Contact deleted']);
    exit();
}

// Filter by status if requested
$filterStatus = $_GET['status'] ?? 'all';
if ($filterStatus !== 'all') {
    $contacts = array_filter($contacts, function($contact) use ($filterStatus) {
        return ($contact['status'] ?? 'unread') === $filterStatus;
    });
}

// Return contacts
echo json_encode([
    'success' => true,
    'contacts' => array_values($contacts),
    'total' => count($contacts)
]);
?>


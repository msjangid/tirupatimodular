<?php
header('Content-Type: application/json');

$category = isset($_GET['category']) ? $_GET['category'] : 'album';
$folderPath = __DIR__ . '/main/' . $category;

$images = [];

if (is_dir($folderPath)) {
    $files = scandir($folderPath);
    foreach ($files as $file) {
        $filePath = $folderPath . '/' . $file;
        // Check if it's a valid image file
        if (is_file($filePath) && preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $file)) {
            $images[] = 'main/' . $category . '/' . $file;
        }
    }
    // Sort images naturally
    natsort($images);
}

echo json_encode([
    'category' => $category,
    'images' => array_values($images),
    'count' => count($images)
]);
?>

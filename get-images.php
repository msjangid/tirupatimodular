<?php
header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] : 'get';

if ($action === 'categories') {
    // Return list of all available categories
    $mainPath = __DIR__ . '/main';
    $categories = [];
    
    if (is_dir($mainPath)) {
        $items = scandir($mainPath);
        foreach ($items as $item) {
            $itemPath = $mainPath . '/' . $item;
            if (is_dir($itemPath) && $item !== '.' && $item !== '..') {
                // Count images in this category
                $files = scandir($itemPath);
                $imageCount = 0;
                foreach ($files as $file) {
                    $filePath = $itemPath . '/' . $file;
                    if (is_file($filePath) && preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $file)) {
                        $imageCount++;
                    }
                }
                if ($imageCount > 0) {
                    $categories[] = [
                        'id' => $item,
                        'name' => ucfirst($item),
                        'count' => $imageCount
                    ];
                }
            }
        }
    }
    
    usort($categories, function($a, $b) {
        // Keep 'album' first, then sort others alphabetically
        if ($a['id'] === 'album') return -1;
        if ($b['id'] === 'album') return 1;
        return strcmp($a['id'], $b['id']);
    });
    
    echo json_encode([
        'categories' => $categories,
        'total' => count($categories)
    ]);
} else {
    // Return images for a specific category
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
}
?>

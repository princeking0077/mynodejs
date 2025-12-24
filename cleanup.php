<?php
echo "<h1>System Cleanup Tool</h1>";
echo "<pre>";

function deleteDir($dirPath) {
    if (! is_dir($dirPath)) {
        return; // Ignore if not missing
    }
    if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
        $dirPath .= '/';
    }
    $files = glob($dirPath . '*', GLOB_MARK);
    foreach ($files as $file) {
        if (is_dir($file)) {
            deleteDir($file);
        } else {
            unlink($file);
        }
    }
    rmdir($dirPath);
    echo "✅ Deleted: $dirPath\n";
}

// 1. Delete Corrupt Server Modules
echo "Targeting 'server/node_modules'...\n";
deleteDir(__DIR__ . '/server/node_modules');

// 2. Delete Lock Files
if (file_exists(__DIR__ . '/package-lock.json')) {
    unlink(__DIR__ . '/package-lock.json');
    echo "✅ Deleted package-lock.json\n";
}
if (file_exists(__DIR__ . '/server/package-lock.json')) {
    unlink(__DIR__ . '/server/package-lock.json');
    echo "✅ Deleted server/package-lock.json\n";
}

echo "\n--- CLEANUP COMPLETE ---\n";
echo "You can now Restart the Node Server.";
echo "</pre>";
?>

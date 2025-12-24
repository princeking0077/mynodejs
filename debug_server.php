<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Hostinger Node.js Debugger</h1>";
echo "<pre>";

// 1. Check Directory Structure
echo "<h2>1. Directory Listing (Root)</h2>";
$files = scandir(__DIR__);
foreach ($files as $file) {
    if ($file == '.' || $file == '..') continue;
    $type = is_dir($file) ? '[DIR]' : '[FILE]';
    echo "$type $file\n";
}

// 2. Check Node Modules
echo "\n<h2>2. Node Modules Check</h2>";
if (is_dir('node_modules')) {
    echo "node_modules exists.\n";
    $modules = scandir('node_modules');
    echo "Count: " . (count($modules) - 2) . " folders inside.\n";
    if (in_array('express', $modules)) echo "✅ express found\n"; else echo "❌ express NOT found\n";
    if (in_array('mysql2', $modules)) echo "✅ mysql2 found\n"; else echo "❌ mysql2 NOT found\n";
    if (in_array('dotenv', $modules)) echo "✅ dotenv found\n"; else echo "❌ dotenv NOT found\n";
} else {
    echo "❌ node_modules directory MISSING! This is why it crashed.\n";
}

// 3. Environment Check
echo "\n<h2>3. Environment Config Check</h2>";
$envPath = __DIR__ . '/server/.env';
if (file_exists($envPath)) {
    echo "✅ server/.env exists\n";
    $envContent = file_get_contents($envPath);
    // basic parsing
    $lines = explode("\n", $envContent);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;
        
        $parts = explode('=', $line, 2);
        if (count($parts) == 2) {
            $key = trim($parts[0]);
            $val = trim($parts[1]);
            // Hide secrets
            if (strpos($key, 'PASS') !== false || strpos($key, 'KEY') !== false) {
                $val = "********";
            }
            echo "$key = $val\n";
        }
    }
} else {
    echo "❌ server/.env MISSING\n";
    if (file_exists('.env.production')) {
        echo "⚠️ .env.production exists in root (but app looks in server/)\n";
    }
}

// 4. Permissions Check
echo "\n<h2>4. Critical Paths Check</h2>";
$uploads = __DIR__ . '/server/uploads';
if (file_exists($uploads)) {
    echo "server/uploads exists: " . (is_writable($uploads) ? "✅ Writable" : "❌ NOT Writable") . "\n";
} else {
    echo "server/uploads MISSING (App tries to create it)\n";
    echo "parent dir writable? " . (is_writable(__DIR__ . '/server') ? "✅ YES" : "❌ NO") . "\n";
}

echo "\n<h2>5. Entry Point Check</h2>";
if (file_exists('start_server.js')) echo "✅ start_server.js exists\n";
if (file_exists('server/index.js')) echo "✅ server/index.js exists\n";


echo "</pre>";
?>

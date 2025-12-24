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

// 3. Try to Run Node Manually
echo "\n<h2>3. Test Node Execution</h2>";
echo "Attempting to run: node -v\n";
$output = shell_exec('node -v 2>&1');
echo "Node Version: $output\n";

echo "Attempting to run: node index.js (dry run)\n";
// Run with a timeout or just check syntax
$output_app = shell_exec('node index.js 2>&1');
// This will hang if it works, so strictly this might not be perfect, 
// strictly we want to see if it immediately crashes.
// Better: Check syntax
echo "Checking Syntax...\n";
$syntax = shell_exec('node --check index.js 2>&1');
echo "Syntax Check: " . ($syntax ? $syntax : "OK") . "\n";


echo "\n<h2>4. Check Environment config</h2>";
if (file_exists('server/.env')) {
    echo "✅ server/.env exists\n";
    echo "Content Preview (Safe):\n";
    $env = file_get_contents('server/.env');
    // Mask passwords
    $env = preg_replace('/(PASSWORD|PASS|KEY)=.*/', '$1=*****', $env);
    echo $env;
} else {
    echo "❌ server/.env MISSING\n";
}

echo "</pre>";
?>

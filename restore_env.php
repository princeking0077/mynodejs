<?php
$envPath = __DIR__ . '/server/.env';
$content = "PORT=3000
NODE_ENV=production
DB_HOST=127.0.0.1
DB_USER=u480091743_shoaib
DB_PASS=Shaikh@001001
DB_NAME=u480091743_pharmacy
JWT_SECRET=super_secret_pharmacy_key_2025
";

if (file_put_contents($envPath, $content)) {
    echo "<h1>✅ server/.env RESTORED!</h1>";
    echo "<pre>" . htmlspecialchars($content) . "</pre>";
} else {
    echo "<h1>❌ Failed to write file. Check permissions.</h1>";
}
?>

const InternalLinkingEngine = require('./services/internal-linking-engine');
const pool = require('./db');

(async () => {
    console.log('Starting Internal Link Regeneration...');
    console.log('Target: Updating all content to use new top-level SEO friendly URLs.');

    try {
        const result = await InternalLinkingEngine.regenerateAllLinks();
        console.log('-----------------------------------');
        console.log('Regeneration Complete!');
        console.log(`Success: ${result.success}`);
        console.log(`Failed: ${result.failed}`);

        if (result.errors.length > 0) {
            console.log('Errors:', JSON.stringify(result.errors, null, 2));
        }
    } catch (e) {
        console.error('Fatal Error during regeneration:', e);
    } finally {
        // Close DB connection if needed, though pool usually persists.
        // For a script, we force exit or pool.end().
        // Assuming pool export has .end() or similar.
        // If it's mysql2 pool
        if (pool && pool.end) {
            pool.end();
            console.log('Database connection closed.');
        } else {
            console.log('Process finishing...');
            process.exit(0);
        }
    }
})();

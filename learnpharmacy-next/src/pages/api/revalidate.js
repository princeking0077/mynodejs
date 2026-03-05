export default async function handler(req, res) {
    // Check for secret to confirm this is a valid request
    if (req.query.secret !== process.env.REVALIDATE_SECRET && req.query.secret !== 'learnpharmacy_revalidate_2024') {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        const { path, paths } = req.query;

        // Revalidate multiple paths if provided
        if (paths) {
            const pathArray = Array.isArray(paths) ? paths : [paths];
            await Promise.all(pathArray.map(p => res.revalidate(p)));
            return res.json({ 
                revalidated: true, 
                paths: pathArray,
                message: `Revalidated ${pathArray.length} pages` 
            });
        }

        // Revalidate single path
        if (path) {
            await res.revalidate(path);
            return res.json({ 
                revalidated: true, 
                path,
                message: `Revalidated ${path}` 
            });
        }

        // Revalidate common pages if no specific path provided
        const commonPaths = [
            '/',
            '/gpat-tests',
            '/gpat-syllabus',
            '/bpharm-syllabus'
        ];

        await Promise.all(commonPaths.map(p => res.revalidate(p)));
        
        return res.json({ 
            revalidated: true, 
            paths: commonPaths,
            message: 'Revalidated common pages' 
        });

    } catch (err) {
        return res.status(500).json({ 
            message: 'Error revalidating',
            error: err.message 
        });
    }
}

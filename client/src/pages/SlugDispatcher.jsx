import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { resolveSlug } from '../services/slugService';
import GpatModuleView from './GpatModuleView'; // Assuming this is the correct path
import SubjectView from './SubjectView'; // Assuming this is the correct path

const SlugDispatcher = () => {
    const { slug } = useParams();
    const result = resolveSlug(slug);

    if (!result) {
        // Fallback or 404
        return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>
            <h1>404 - Page Not Found</h1>
            <p>The content you are looking for does not exist.</p>
        </div>;
        // Ideally render a proper NotFound component
    }

    if (result.type === 'GPAT_MODULE') {
        // GpatModuleView expects params or lookup. 
        // Currently it uses useParams() -> moduleUrl.
        // Since we are rendering it directly, we might need to mock params OR modify GpatModuleView.
        // BUT, since the route is /:slug, useParams() in GpatModuleView will return { slug: ... } NOT moduleUrl.
        // We should probably pass the data directly to the component to avoid weird param dependency.
        // Let's modify GpatModuleView to accept 'moduleData' prop OR just rely on the fact that if we map /:slug, 'slug' matches what it expects?
        // GpatModuleView expects 'moduleUrl'. If we mapped <Route path="/:moduleUrl">, then useParams() has moduleUrl.
        // Here we have <Route path="/:slug">. Key mismatch.
        // We should pass the data as props.
        return <GpatModuleView data={result.data} />;
    }

    if (result.type === 'SUBJECT') {
        // Similarly for SubjectView. It normally expects /subject/:subjectId
        // we will modify it to accept the resolved subject data directly.
        return <SubjectView data={result.data} context={result.context} />;
    }

    return null;
};

export default SlugDispatcher;

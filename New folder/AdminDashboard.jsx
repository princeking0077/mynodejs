import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import DashboardOverview from './DashboardOverview';
import ContentEditor from './ContentEditor';

const AdminDashboard = ({ user, onLogout }) => {
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'year', 'editor'
  const [context, setContext] = useState(null);

  const handleContextSelect = (newContext) => {
    if (!newContext) {
      // Back to overview
      setViewMode('overview');
      setContext(null);
    } else if (newContext.type === 'subject') {
      // Open editor for subject
      setViewMode('editor');
      setContext(newContext);
    } else if (newContext.type === 'year') {
      // Show year view (can be implemented later)
      setViewMode('year');
      setContext(newContext);
    }
  };

  const getTitle = () => {
    if (viewMode === 'overview') {
      return 'Dashboard Overview';
    } else if (viewMode === 'editor' && context) {
      return `Content Editor - ${context.subjectTitle}`;
    }
    return 'Content Manager';
  };

  return (
    <AdminLayout
      onSelectContext={handleContextSelect}
      title={getTitle()}
      user={user}
      onLogout={onLogout}
    >
      {viewMode === 'overview' && (
        <DashboardOverview onSelectSubject={handleContextSelect} />
      )}
      
      {viewMode === 'editor' && context && (
        <ContentEditor 
          context={context}
          onBack={() => handleContextSelect(null)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;

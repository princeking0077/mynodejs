import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SubjectView from './pages/SubjectView';
import YearView from './pages/YearView';
import SearchPage from './pages/SearchPage';
import AdminDashboard from './pages/Admin/Dashboard';
import Settings from './pages/Admin/Settings';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { HelmetProvider } from 'react-helmet-async';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/year/:yearId" element={<YearView />} />
            <Route path="/subject/:subjectSlug/:topicSlug?" element={<SubjectView />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Router >
  );
}

export default App;

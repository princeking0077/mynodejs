import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const SubjectView = lazy(() => import('./pages/SubjectView'));
const YearView = lazy(() => import('./pages/YearView'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Settings = lazy(() => import('./pages/Admin/Settings'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
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
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </Router >
  );
}

export default App;

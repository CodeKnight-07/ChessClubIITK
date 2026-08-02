import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import PageTransition from './components/PageTransition';

import ServerError500 from './pages/ServerError500';

// Lazy loaded page components for optimal production bundle code-splitting
const Landing = React.lazy(() => import('./pages/Landing'));
const Calendar = React.lazy(() => import('./pages/Calendar'));
const Events = React.lazy(() => import('./pages/Events'));
const EventRegistration = React.lazy(() => import('./pages/EventRegistration'));
const Blogs = React.lazy(() => import('./pages/Blogs'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PreviousTeams = React.lazy(() => import('./pages/PreviousTeams'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Login = React.lazy(() => import('./pages/Login'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));

// Premium, brand-aligned loading spinner fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-zinc-950 text-primary">
    <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <MainLayout>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
                <Route path="/calendar" element={<PageTransition><Calendar /></PageTransition>} />
                <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
                <Route path="/events/register/:id" element={<PageTransition><EventRegistration /></PageTransition>} />
                <Route path="/blogs" element={<PageTransition><Blogs /></PageTransition>} />
                <Route path="/blog/:id" element={<PageTransition><BlogPost /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="/previous-teams" element={<PageTransition><PreviousTeams /></PageTransition>} />
                <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
                <Route path="/user" element={<PageTransition><UserProfile /></PageTransition>} />
                <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
                <Route path="/500" element={<PageTransition><ServerError500 /></PageTransition>} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;

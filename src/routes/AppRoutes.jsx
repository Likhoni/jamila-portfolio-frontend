import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/ProjectDetail';
import Blog from '../pages/Blog';
import BlogDetail from '../pages/BlogDetail';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

// Dashboard Studio Pages
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import Overview from '../pages/dashboard/Overview';
import PostsList from '../pages/dashboard/PostsList';
import PostEditor from '../pages/dashboard/PostEditor';
import ProjectsManager from '../pages/dashboard/ProjectsManager';
import SkillsManager from '../pages/dashboard/SkillsManager';
import ExperienceManager from '../pages/dashboard/ExperienceManager';
import TaxonomyManager from '../pages/dashboard/TaxonomyManager';
import CommentsModeration from '../pages/dashboard/CommentsModeration';
import MessagesInbox from '../pages/dashboard/MessagesInbox';
import ProfileSettings from '../pages/dashboard/ProfileSettings';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />

      {/* Owner-Only Studio Dashboard (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="posts" element={<PostsList />} />
        <Route path="posts/new" element={<PostEditor />} />
        <Route path="posts/:slug/edit" element={<PostEditor />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="skills" element={<SkillsManager />} />
        <Route path="experience" element={<ExperienceManager />} />
        <Route path="taxonomy" element={<TaxonomyManager />} />
        <Route path="comments" element={<CommentsModeration />} />
        <Route path="messages" element={<MessagesInbox />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileText, FolderGit2, Sparkles,
  Briefcase, Tags, MessageSquare, Mail, User, ArrowLeft
} from 'lucide-react';
import Badge from '../ui/Badge';

export default function Sidebar({ pendingCommentsCount = 0, unreadMessagesCount = 0 }) {
  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Posts', path: '/dashboard/posts', icon: FileText },
    { name: 'Projects', path: '/dashboard/projects', icon: FolderGit2 },
    { name: 'Skills', path: '/dashboard/skills', icon: Sparkles },
    { name: 'Experience', path: '/dashboard/experience', icon: Briefcase },
    { name: 'Taxonomy', path: '/dashboard/taxonomy', icon: Tags },
    {
      name: 'Comments',
      path: '/dashboard/comments',
      icon: MessageSquare,
      badge: pendingCommentsCount > 0 ? pendingCommentsCount : null,
      badgeVariant: 'warning',
    },
    {
      name: 'Messages',
      path: '/dashboard/messages',
      icon: Mail,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
      badgeVariant: 'danger',
    },
    { name: 'Profile & Auth', path: '/dashboard/profile', icon: User },
  ];

  return (
    <aside
      className="dashboard-sidebar"
      style={{
        width: '260px',
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRight: '1px solid var(--border-glass)',
        padding: 'var(--space-24) var(--space-16)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)',
        minHeight: '100vh',
      }}
    >
      <div style={{ padding: '0 var(--space-12) var(--space-16) var(--space-12)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 'var(--space-8)' }}>
        <NavLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-8)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textDecoration: 'none',
            marginBottom: 'var(--space-12)',
          }}
        >
          <ArrowLeft size={14} />
          Back to Live Site
        </NavLink>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          Owner Studio
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                transition: 'all var(--transition-fast)',
                textDecoration: 'none',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
                <Icon size={18} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  style={{
                    background: item.badgeVariant === 'danger' ? 'var(--status-danger)' : 'var(--status-warning)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

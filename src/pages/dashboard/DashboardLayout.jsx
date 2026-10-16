import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../../components/dashboard/Sidebar';
import { dashboardApi } from '../../api/dashboard';

export default function DashboardLayout() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      return res.data;
    },
    refetchInterval: 30000, // Background poll every 30s for notifications
  });

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
      }}
      className="dashboard-wrapper"
    >
      <Sidebar
        pendingCommentsCount={stats?.pending_comments || 0}
        unreadMessagesCount={stats?.unread_messages || 0}
      />

      <main
        style={{
          flex: 1,
          padding: 'var(--space-32) var(--space-48)',
          overflowY: 'auto',
          maxWidth: '1280px',
        }}
        className="dashboard-content"
      >
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-wrapper {
            flex-direction: column !important;
          }
          .dashboard-sidebar {
            width: 100% !important;
            min-height: auto !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border-glass) !important;
          }
          .dashboard-sidebar nav {
            flex-direction: row !important;
            overflow-x: auto !important;
            padding-bottom: 8px !important;
          }
          .dashboard-sidebar nav a {
            white-space: nowrap !important;
          }
          .dashboard-content {
            padding: var(--space-20) var(--space-16) !important;
          }
        }
      `}</style>
    </div>
  );
}

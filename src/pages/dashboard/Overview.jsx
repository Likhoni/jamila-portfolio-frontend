import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FileText, FolderGit2, Sparkles, MessageSquare, Heart, Eye,
  Mail, ArrowUpRight, TrendingUp, CheckCircle, Clock
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { dashboardApi } from '../../api/dashboard';
import { formatDate } from '../../utils/formatDate';

export default function Overview() {
  useEffect(() => {
    document.title = 'Owner Studio Overview — DevFolio';
  }, []);

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <Skeleton height="36px" width="300px" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-16)' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="110px" borderRadius="var(--radius-lg)" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <EmptyState
        isError
        title="Failed to load dashboard metrics"
        description={error?.message}
        onRetry={refetch}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-32)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-16)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '4px' }}>
            System Analytics & Telemetry
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
            Real-time portfolio metrics compiled natively via SQL ORM aggregations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
          <Link to="/dashboard/posts/new">
            <Button size="sm">
              + New Post
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" size="sm">
              <ArrowUpRight size={14} />
              View Live
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid (Wireframe 4) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-16)',
        }}
      >
        <StatCard
          title="Total Articles"
          value={stats.total_posts}
          subtitle={`${stats.published_posts} Published / ${stats.draft_posts} Drafts`}
          icon={FileText}
          color="var(--accent-primary)"
        />
        <StatCard
          title="Total Page Views"
          value={stats.total_views}
          subtitle="Non-duplicate visitor tracking"
          icon={Eye}
          color="var(--status-info)"
        />
        <StatCard
          title="Total Likes"
          value={stats.total_likes}
          subtitle="Idempotent visitor reactions"
          icon={Heart}
          color="var(--status-danger)"
        />
        <StatCard
          title="Pending Comments"
          value={stats.pending_comments}
          subtitle={`${stats.total_comments} Total comments`}
          icon={MessageSquare}
          color={stats.pending_comments > 0 ? "var(--status-warning)" : "var(--status-success)"}
        />
        <StatCard
          title="Unread Messages"
          value={stats.unread_messages}
          subtitle="Contact submissions"
          icon={Mail}
          color={stats.unread_messages > 0 ? "var(--status-danger)" : "var(--status-success)"}
        />
        <StatCard
          title="Active Projects"
          value={stats.total_projects}
          subtitle={`${stats.total_skills} verified skills`}
          icon={FolderGit2}
          color="var(--accent-secondary)"
        />
      </div>

      {/* Two Column Section: Top Posts & Recent Comments */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 'var(--space-24)',
        }}
      >
        {/* Top 5 Posts by Views (Wireframe 4) */}
        <Card style={{ padding: 'var(--space-24)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-16)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} color="var(--accent-primary)" />
              Top Articles by Traffic
            </h3>
            <Link to="/dashboard/posts" style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
              View all
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
            {stats.top_posts?.map((p, idx) => (
              <div
                key={p.slug}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', minWidth: 0 }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', width: '18px' }}>
                    #{idx + 1}
                  </span>
                  <Link
                    to={`/blog/${p.slug}`}
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {p.title}
                  </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)', flexShrink: 0, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={12} />
                    {p.views}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} />
                    {p.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Latest 5 Comments (Wireframe 4) */}
        <Card style={{ padding: 'var(--space-24)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-16)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} color="var(--accent-secondary)" />
              Recent Comments
            </h3>
            <Link to="/dashboard/comments" style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
              Moderation queue
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
            {stats.recent_comments?.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>
                    {c.name}
                  </span>
                  <Badge variant={c.is_approved ? 'success' : 'warning'} size="sm">
                    {c.is_approved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                  "{c.content}"
                </p>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  on <Link to={`/blog/${c.post_slug}`} style={{ color: 'inherit', fontWeight: 500 }}>{c.post_title}</Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Small Monthly Activity Chart Bar (Wireframe 4) */}
      {stats.posts_per_month?.length > 0 && (
        <Card style={{ padding: 'var(--space-24)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-16)' }}>
            Publishing Velocity (Last 6 Months)
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 'var(--space-24)',
              height: '140px',
              paddingTop: 'var(--space-16)',
            }}
          >
            {stats.posts_per_month.map((item, idx) => {
              const maxCount = Math.max(...stats.posts_per_month.map((m) => m.count), 1);
              const heightPct = Math.max(15, (item.count / maxCount) * 100);

              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-8)',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {item.count}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '48px',
                      height: `${heightPct}%`,
                      background: 'var(--accent-gradient)',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'height 0.4s ease-out',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

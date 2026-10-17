import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2, Eye, Globe, FileEdit, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../../components/dashboard/DataTable';
import ConfirmModal from '../../components/dashboard/ConfirmModal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { postsApi } from '../../api/posts';
import { formatDate } from '../../utils/formatDate';
import { useDebounce } from '../../hooks/useDebounce';

export default function PostsList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search, 400);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = 'Manage Posts — Owner Studio';
  }, []);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard-posts', { status: statusFilter, search: debouncedSearch, page }],
    queryFn: async () => {
      const res = await postsApi.getPosts({
        status: statusFilter,
        search: debouncedSearch || undefined,
        page,
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const posts = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 6);

  // Toggle publish / unpublish mutation
  const togglePublishMutation = useMutation({
    mutationFn: ({ slug, currentStatus }) => {
      const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      return postsApi.updatePost(slug, { status: newStatus });
    },
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-posts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(`Post marked as ${vars.currentStatus === 'PUBLISHED' ? 'Draft' : 'Published'}`);
    },
    onError: (err) => {
      const msg = err.response?.data?.content?.[0] || err.response?.data?.detail || 'Failed to toggle status.';
      toast.error(msg);
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: (slug) => postsApi.deletePost(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-posts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Post permanently deleted.');
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error('Failed to delete post.');
    },
  });

  const columns = [
    {
      header: 'Title',
      accessor: 'title',
      render: (post) => (
        <div style={{ maxWidth: '320px' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
            {post.title}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            /{post.slug} • {formatDate(post.published_at || post.created_at)}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (post) => (
        <Badge variant={post.status === 'PUBLISHED' ? 'success' : 'warning'}>
          {post.status}
        </Badge>
      ),
    },
    {
      header: 'Category',
      accessor: 'category_name',
      render: (post) => <Badge size="sm">{post.category_name || 'General'}</Badge>,
    },
    {
      header: 'Views',
      accessor: 'views_count',
      render: (post) => <span>{post.views_count}</span>,
    },
    {
      header: 'Likes',
      accessor: 'likes_count',
      render: (post) => <span>{post.likes_count || 0}</span>,
    },
    {
      header: 'Comments',
      accessor: 'comments_count',
      render: (post) => <span>{post.comments_count || 0}</span>,
    },
    {
      header: 'Actions',
      render: (post) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          {/* Publish / Unpublish Toggle */}
          <button
            onClick={() => togglePublishMutation.mutate({ slug: post.slug, currentStatus: post.status })}
            title={post.status === 'PUBLISHED' ? 'Switch to Draft' : 'Publish Article'}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: post.status === 'PUBLISHED' ? 'var(--status-warning)' : 'var(--status-success)',
              padding: '6px',
            }}
          >
            {post.status === 'PUBLISHED' ? <XCircle size={16} /> : <CheckCircle size={16} />}
          </button>

          {/* Edit Button */}
          <Link
            to={`/dashboard/posts/${post.slug}/edit`}
            title="Edit Article"
            style={{ color: 'var(--accent-primary)', padding: '6px' }}
          >
            <Edit2 size={16} />
          </Link>

          {/* View Article */}
          <Link
            to={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View Public Post"
            style={{ color: 'var(--text-muted)', padding: '6px' }}
          >
            <Eye size={16} />
          </Link>

          {/* Delete Button (Trigger ConfirmModal) */}
          <button
            onClick={() => setDeleteTarget(post)}
            title="Delete Article"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--status-danger)',
              padding: '6px',
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-16)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '4px' }}>
            Articles & Blog Posts
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
            Manage publication status, review traffic analytics, and draft new content.
          </p>
        </div>

        <Link to="/dashboard/posts/new">
          <Button size="md">
            <Plus size={16} />
            Write New Post
          </Button>
        </Link>
      </div>

      {/* Filter Row: Search & Status Select */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: 'var(--space-16)',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search by title, excerpt..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ paddingLeft: '42px', height: '42px', background: 'var(--bg-surface-elevated)' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{ height: '42px', minWidth: '150px', background: 'var(--bg-surface-elevated)' }}
        >
          <option value="all">All Statuses</option>
          <option value="PUBLISHED">Published Only</option>
          <option value="DRAFT">Drafts Only</option>
        </select>
      </div>

      {/* Posts Table */}
      <DataTable
        columns={columns}
        data={posts}
        loading={isLoading}
        error={isError ? error : null}
        onRetry={refetch}
        emptyMessage="No posts match your query."
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.slug)}
        loading={deleteMutation.isPending}
        title="Delete Blog Post"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? All associated comments and images will be permanently removed.`}
      />
    </div>
  );
}

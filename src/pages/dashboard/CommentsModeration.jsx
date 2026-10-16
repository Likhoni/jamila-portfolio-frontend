import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Trash2, Globe, Mail, MessageSquare, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../../components/dashboard/DataTable';
import ConfirmModal from '../../components/dashboard/ConfirmModal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { commentsApi } from '../../api/comments';
import { formatDate } from '../../utils/formatDate';

export default function CommentsModeration() {
  const [filterApproved, setFilterApproved] = useState('pending'); // 'pending' | 'approved' | 'all'
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = 'Comment Moderation Queue — Owner Studio';
  }, []);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard-comments', { filterApproved, page }],
    queryFn: async () => {
      const params = { page };
      if (filterApproved === 'pending') {
        params.is_approved = 'false';
      } else if (filterApproved === 'approved') {
        params.is_approved = 'true';
      }
      const res = await commentsApi.getModerationComments(params);
      return res.data;
    },
    keepPreviousData: true,
  });

  const comments = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 10);

  // Approve / Unapprove Toggle Mutation
  const toggleApproveMutation = useMutation({
    mutationFn: ({ id, isApproved }) => commentsApi.updateComment(id, { is_approved: !isApproved }),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-comments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success(vars.isApproved ? 'Comment unapproved.' : 'Comment approved and published!');
    },
    onError: () => toast.error('Failed to update comment status.'),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => commentsApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-comments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Comment deleted.');
      setDeleteTarget(null);
    },
    onError: () => toast.error('Failed to delete comment.'),
  });

  const columns = [
    {
      header: 'Commenter',
      render: (c) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Mail size={12} />
            {c.email}
          </div>
          {c.website && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-primary)' }}>
              <a href={c.website} target="_blank" rel="noopener noreferrer">{c.website}</a>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Comment Content',
      render: (c) => (
        <div style={{ maxWidth: '380px' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            "{c.content}"
          </p>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>
            on post: <Link to={`/blog/${c.post_slug}`} style={{ color: 'var(--accent-primary)' }}>{c.post_title}</Link>
            {' '}• {formatDate(c.created_at)}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'is_approved',
      render: (c) => (
        <Badge variant={c.is_approved ? 'success' : 'warning'}>
          {c.is_approved ? 'Approved' : 'Pending Review'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (c) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <button
            onClick={() => toggleApproveMutation.mutate({ id: c.id, isApproved: c.is_approved })}
            title={c.is_approved ? 'Unapprove' : 'Approve & Publish'}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: c.is_approved ? 'var(--status-warning-bg)' : 'var(--status-success-bg)',
              color: c.is_approved ? 'var(--status-warning)' : 'var(--status-success)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {c.is_approved ? <X size={14} /> : <Check size={14} />}
            {c.is_approved ? 'Unapprove' : 'Approve'}
          </button>

          <button
            onClick={() => setDeleteTarget(c)}
            title="Delete comment"
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-16)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '4px' }}>
            Comment Moderation Queue
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
            Review, approve, or reject public user comments before they are visible on articles.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          <button
            onClick={() => { setFilterApproved('pending'); setPage(1); }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filterApproved === 'pending' ? 'transparent' : 'var(--border-subtle)',
              background: filterApproved === 'pending' ? 'var(--accent-gradient)' : 'var(--bg-surface-elevated)',
              color: filterApproved === 'pending' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
            }}
          >
            Pending Review
          </button>
          <button
            onClick={() => { setFilterApproved('approved'); setPage(1); }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filterApproved === 'approved' ? 'transparent' : 'var(--border-subtle)',
              background: filterApproved === 'approved' ? 'var(--accent-gradient)' : 'var(--bg-surface-elevated)',
              color: filterApproved === 'approved' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
            }}
          >
            Approved
          </button>
          <button
            onClick={() => { setFilterApproved('all'); setPage(1); }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filterApproved === 'all' ? 'transparent' : 'var(--border-subtle)',
              background: filterApproved === 'all' ? 'var(--accent-gradient)' : 'var(--bg-surface-elevated)',
              color: filterApproved === 'all' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
            }}
          >
            All
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={comments}
        loading={isLoading}
        error={isError ? error : null}
        onRetry={refetch}
        emptyMessage="No comments match this filter."
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange: (p) => setPage(p),
        }}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
        title="Delete Comment"
        message={`Are you sure you want to delete the comment by "${deleteTarget?.name}"?`}
      />
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, MailOpen, Trash2, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../../components/dashboard/DataTable';
import ConfirmModal from '../../components/dashboard/ConfirmModal';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { contactApi } from '../../api/contact';
import { formatDate } from '../../utils/formatDate';

export default function MessagesInbox() {
  const [filterRead, setFilterRead] = useState('all'); // 'all' | 'unread' | 'read'
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = 'Contact Inbox — Owner Studio';
  }, []);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard-messages', { filterRead, page }],
    queryFn: async () => {
      const params = { page };
      if (filterRead === 'unread') {
        params.is_read = 'false';
      } else if (filterRead === 'read') {
        params.is_read = 'true';
      }
      const res = await contactApi.getMessages(params);
      return res.data;
    },
    keepPreviousData: true,
  });

  const messages = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 10);

  // Toggle Read Status Mutation
  const toggleReadMutation = useMutation({
    mutationFn: ({ id, isRead }) => contactApi.updateMessage(id, { is_read: !isRead }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-messages'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Message status updated.');
    },
    onError: () => toast.error('Failed to update message status.'),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => contactApi.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-messages'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Message deleted.');
      setDeleteTarget(null);
      setSelectedMessage(null);
    },
    onError: () => toast.error('Failed to delete message.'),
  });

  const openMessageModal = (msg) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      toggleReadMutation.mutate({ id: msg.id, isRead: false });
    }
  };

  const columns = [
    {
      header: 'Sender',
      render: (m) => (
        <div>
          <div style={{ fontWeight: m.is_read ? 500 : 700, color: 'var(--text-primary)' }}>
            {m.name}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            {m.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Subject & Preview',
      render: (m) => (
        <div
          onClick={() => openMessageModal(m)}
          style={{ maxWidth: '380px', cursor: 'pointer' }}
        >
          <div style={{ fontWeight: m.is_read ? 500 : 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
            {m.subject}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {m.message}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'is_read',
      render: (m) => (
        <Badge variant={m.is_read ? 'default' : 'danger'}>
          {m.is_read ? 'Read' : 'Unread'}
        </Badge>
      ),
    },
    {
      header: 'Received',
      render: (m) => <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{formatDate(m.created_at)}</span>,
    },
    {
      header: 'Actions',
      render: (m) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <button
            onClick={() => toggleReadMutation.mutate({ id: m.id, isRead: m.is_read })}
            title={m.is_read ? 'Mark as Unread' : 'Mark as Read'}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--accent-primary)',
              padding: '6px',
            }}
          >
            {m.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
          </button>

          <button
            onClick={() => setDeleteTarget(m)}
            title="Delete Message"
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
            Contact Inquiries Inbox
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
            Read, manage, and respond to incoming inquiries from your portfolio contact form.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          <button
            onClick={() => { setFilterRead('unread'); setPage(1); }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filterRead === 'unread' ? 'transparent' : 'var(--border-subtle)',
              background: filterRead === 'unread' ? 'var(--accent-gradient)' : 'var(--bg-surface-elevated)',
              color: filterRead === 'unread' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
            }}
          >
            Unread Only
          </button>
          <button
            onClick={() => { setFilterRead('all'); setPage(1); }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: filterRead === 'all' ? 'transparent' : 'var(--border-subtle)',
              background: filterRead === 'all' ? 'var(--accent-gradient)' : 'var(--bg-surface-elevated)',
              color: filterRead === 'all' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
            }}
          >
            All Messages
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={messages}
        loading={isLoading}
        error={isError ? error : null}
        onRetry={refetch}
        emptyMessage="No messages found in your inbox."
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* Message Reader Modal */}
      <Modal
        isOpen={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject || 'Message Details'}
        maxWidth="540px"
      >
        {selectedMessage && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-12)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedMessage.name}</div>
                <a href={`mailto:${selectedMessage.email}`} style={{ fontSize: 'var(--text-xs)' }}>
                  {selectedMessage.email}
                </a>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                {formatDate(selectedMessage.created_at)}
              </div>
            </div>

            <div
              style={{
                fontSize: 'var(--text-sm)',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
                background: 'var(--bg-secondary)',
                padding: 'var(--space-16)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {selectedMessage.message}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-12)' }}>
              <a href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}>
                <Button size="sm">
                  Reply via Email
                </Button>
              </a>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteTarget(selectedMessage)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
        title="Delete Message"
        message={`Are you sure you want to delete message from "${deleteTarget?.name}"?`}
      />
    </div>
  );
}

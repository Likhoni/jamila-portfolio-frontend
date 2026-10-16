import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to permanently delete this item? This action cannot be undone.',
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="420px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-16)' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--status-danger-bg)',
              color: 'var(--status-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} />
          </div>

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {message}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-12)' }}>
          <Button variant="secondary" onClick={onClose} disabled={loading} size="sm">
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading} disabled={loading} size="sm">
            Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  );
}

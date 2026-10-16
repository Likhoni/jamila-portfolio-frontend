import React from 'react';
import { AlertCircle, FolderSearch, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your search criteria or filters.',
  isError = false,
  onRetry,
  actionText = 'Retry',
  actionComponent,
  icon: CustomIcon,
  style = {},
}) {
  const Icon = CustomIcon || (isError ? AlertCircle : FolderSearch);

  return (
    <div
      style={{
        padding: 'var(--space-48) var(--space-24)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-16)',
        background: 'var(--bg-glass-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-subtle)',
        ...style,
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isError ? 'var(--status-danger-bg)' : 'var(--accent-light)',
          color: isError ? 'var(--status-danger)' : 'var(--accent-primary)',
        }}
      >
        <Icon size={28} />
      </div>

      <div>
        <h4 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)' }}>{title}</h4>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
          {description}
        </p>
      </div>

      {isError && onRetry && (
        <Button variant="secondary" onClick={onRetry} size="sm">
          <RefreshCw size={14} />
          {actionText}
        </Button>
      )}

      {actionComponent}
    </div>
  );
}

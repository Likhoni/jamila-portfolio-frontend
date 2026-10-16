import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  style = {},
  className = '',
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--accent-light)',
          color: 'var(--accent-primary)',
          borderColor: 'transparent',
        };
      case 'success':
        return {
          background: 'var(--status-success-bg)',
          color: 'var(--status-success)',
          borderColor: 'transparent',
        };
      case 'warning':
        return {
          background: 'var(--status-warning-bg)',
          color: 'var(--status-warning)',
          borderColor: 'transparent',
        };
      case 'danger':
        return {
          background: 'var(--status-danger-bg)',
          color: 'var(--status-danger)',
          borderColor: 'transparent',
        };
      case 'default':
      default:
        return {
          background: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
          borderColor: 'var(--border-subtle)',
        };
    }
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: size === 'sm' ? '3px 10px' : '6px 14px',
        fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        border: '1px solid',
        whiteSpace: 'nowrap',
        ...getVariantStyles(),
        ...style,
      }}
    >
      {children}
    </span>
  );
}

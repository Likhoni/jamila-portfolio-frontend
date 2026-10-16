import React from 'react';

export default function Card({
  children,
  className = '',
  style = {},
  hoverable = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`glass-card ${className}`}
      style={{
        padding: 'var(--space-24)',
        background: 'var(--bg-glass-card)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        transition: hoverable ? 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

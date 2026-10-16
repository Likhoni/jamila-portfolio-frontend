import React from 'react';

export default function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
  type = 'rect',
  style = {},
  className = '',
}) {
  if (type === 'card') {
    return (
      <div
        className={`glass-card ${className}`}
        style={{
          padding: 'var(--space-24)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-16)',
          ...style,
        }}
      >
        <div style={{ width: '100%', height: '180px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', animation: 'skeletonPulse 1.5s infinite ease-in-out' }} />
        <div style={{ width: '40%', height: '16px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', animation: 'skeletonPulse 1.5s infinite ease-in-out' }} />
        <div style={{ width: '80%', height: '24px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', animation: 'skeletonPulse 1.5s infinite ease-in-out' }} />
        <div style={{ width: '100%', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', animation: 'skeletonPulse 1.5s infinite ease-in-out' }} />
      </div>
    );
  }

  return (
    <>
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: type === 'circle' ? '50%' : borderRadius,
          backgroundColor: 'var(--bg-secondary)',
          animation: 'skeletonPulse 1.5s infinite ease-in-out',
          ...style,
        }}
      />
      <style>{`
        @keyframes skeletonPulse {
          0% { opacity: 0.5; }
          50% { opacity: 0.9; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}

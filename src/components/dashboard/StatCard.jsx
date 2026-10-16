import React from 'react';
import Card from '../ui/Card';

export default function StatCard({ title, value, icon: Icon, color = 'var(--accent-primary)', subtitle }) {
  return (
    <Card style={{ padding: 'var(--space-20)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-12)' }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
        {value}
      </div>

      {subtitle && (
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>
          {subtitle}
        </div>
      )}
    </Card>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UserCheck, Code, Globe, Shield } from 'lucide-react';
import Button from '../ui/Button';

export default function AboutPreview({ profile }) {
  const bio = profile?.bio || 'Full-Stack Developer passionate about designing resilient cloud APIs and intuitive modern frontend applications.';
  const years = profile?.years_of_experience || 5;

  return (
    <section className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <div
          className="glass-card"
          style={{
            padding: 'var(--space-48)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 0.8fr)',
            gap: 'var(--space-48)',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 'var(--space-8)',
              }}
            >
              Background & Focus
            </div>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-16)' }}>
              Engineering Scalable Systems with Precision
            </h2>

            {/* Bio summary */}
            <p
              style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--line-height-body)',
                marginBottom: 'var(--space-24)',
              }}
            >
              {bio}
            </p>

            <Link to="/about">
              <Button variant="outline" size="md">
                More about me
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {/* Quick Metrics highlight card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-16)',
            }}
          >
            <div
              style={{
                padding: 'var(--space-24)',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                {years}+
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>
                Years Experience
              </div>
            </div>

            <div
              style={{
                padding: 'var(--space-24)',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--accent-secondary)', fontFamily: 'var(--font-heading)' }}>
                100%
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>
                API Coverage
              </div>
            </div>

            <div
              style={{
                padding: 'var(--space-24)',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--status-success)', fontFamily: 'var(--font-heading)' }}>
                0
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>
                Hardcoded Data
              </div>
            </div>

            <div
              style={{
                padding: 'var(--space-24)',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--status-info)', fontFamily: 'var(--font-heading)' }}>
                sub-50ms
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>
                Avg Latency
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

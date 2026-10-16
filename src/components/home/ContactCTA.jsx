import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function ContactCTA() {
  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div
          className="glass-card"
          style={{
            padding: 'var(--space-48) var(--space-32)',
            textAlign: 'center',
            background: 'var(--accent-gradient-soft)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-24)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <MessageSquare size={22} />
          </div>

          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-8)' }}>
              Have an ambitious project or engineering role in mind?
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto' }}>
              Let's build something exceptional together. Drop me a line directly through the contact terminal.
            </p>
          </div>

          <Link to="/contact">
            <Button size="lg">
              Get in touch
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

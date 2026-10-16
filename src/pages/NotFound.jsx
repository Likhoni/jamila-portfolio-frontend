import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 — Page Not Found';
  }, []);

  return (
    <PageContainer>
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--space-64) var(--space-24)',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--accent-gradient-soft)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-24)',
          }}
        >
          <Compass size={40} />
        </div>

        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 800, margin: 0 }} className="gradient-text">
          404
        </h1>

        <h2 style={{ fontSize: 'var(--text-2xl)', marginTop: 'var(--space-8)', marginBottom: 'var(--space-16)' }}>
          Coordinates Not Found
        </h2>

        <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', marginBottom: 'var(--space-32)' }}>
          The page or endpoint you are attempting to visit does not exist or has been relocated to another galaxy.
        </p>

        <Link to="/">
          <Button size="lg">
            <Home size={18} />
            Return to Homepage
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
}

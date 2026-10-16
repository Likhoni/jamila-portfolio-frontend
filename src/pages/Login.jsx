import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isOwner, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target after login (F-3)
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    document.title = 'Owner Authentication — DevFolio';
  }, []);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (!loading && isOwner) {
      navigate(from, { replace: true });
    }
  }, [isOwner, loading, navigate, from]);

  // Prevent flashing login page while session restore is in flight (F-2)
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border-subtle)',
            borderTopColor: 'var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      await login(username, password);
      toast.success('Welcome back, owner!');
      navigate(from, { replace: true });
    } catch (err) {
      // B-14: Login must fail with 401 for wrong password and must not reveal whether username exists
      const msg = err.response?.data?.detail || 'Invalid credentials.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--hero-mesh)',
        padding: 'var(--space-24)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
              marginBottom: 'var(--space-16)',
            }}
          >
            <Lock size={26} />
          </div>

          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-8)' }}>
            Owner Studio Login
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Restricted administrative gateway for the site owner.
          </p>
        </div>

        <Card style={{ padding: 'var(--space-32)' }}>
          {errorMsg && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--status-danger-bg)',
                color: 'var(--status-danger)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: 'var(--space-20)',
              }}
            >
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            <Input
              label="Username"
              id="login-username"
              placeholder="admin"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              label="Password"
              id="login-password"
              type="password"
              placeholder="••••••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              size="lg"
              loading={submitting}
              disabled={submitting}
              style={{ width: '100%', marginTop: 'var(--space-8)' }}
            >
              Sign In to Studio
              <ArrowRight size={18} />
            </Button>
          </form>

          <div
            style={{
              marginTop: 'var(--space-24)',
              paddingTop: 'var(--space-16)',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
            }}
          >
            <Link to="/" style={{ color: 'var(--text-secondary)' }}>
              ← Return to public website
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

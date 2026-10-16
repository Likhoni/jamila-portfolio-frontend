import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Mail, CheckCircle } from 'lucide-react';
import { Github, Linkedin, Twitter } from '../ui/SocialIcons';
import Button from '../ui/Button';

export default function Hero({ profile }) {
  const name = profile?.full_name || 'Rifat Hasan';
  const headline = profile?.headline || 'Senior Full-Stack Engineer & System Architect';
  const bio = profile?.bio || 'Building reliable, high-throughput web applications with Django REST Framework, React, and cloud architectures.';
  const isAvailable = profile?.is_available_for_hire ?? true;

  return (
    <section
      style={{
        position: 'relative',
        padding: 'var(--space-96) 0 var(--space-64) 0',
        overflow: 'hidden',
        background: 'var(--hero-mesh)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
            alignItems: 'center',
            gap: 'var(--space-64)',
          }}
          className="hero-grid"
        >
          {/* Left Column: Headline, Bio, CTAs, Socials */}
          <div>
            {isAvailable && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-8)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-glass-card)',
                  border: '1px solid var(--border-glass)',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: 'var(--space-24)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: 'var(--status-success)',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--status-success)',
                    boxShadow: '0 0 10px var(--status-success)',
                  }}
                />
                Available for freelance & full-time roles
              </div>
            )}

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: 'var(--space-16)',
                letterSpacing: '-0.03em',
              }}
            >
              Hi, I'm <span className="gradient-text">{name}</span>
            </h1>

            <h2
              style={{
                fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-24)',
                lineHeight: 1.35,
              }}
            >
              {headline}
            </h2>

            <p
              style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-muted)',
                marginBottom: 'var(--space-32)',
                maxWidth: '560px',
                lineHeight: 'var(--line-height-body)',
              }}
            >
              {bio.slice(0, 220)}...
            </p>

            {/* 2 CTAs (Section 9.1) */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-16)',
                marginBottom: 'var(--space-32)',
              }}
            >
              <Link to="/projects">
                <Button size="lg">
                  View Projects
                  <ArrowRight size={18} />
                </Button>
              </Link>

              {profile?.resume_url ? (
                <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" download>
                  <Button variant="secondary" size="lg">
                    <Download size={18} />
                    Download Resume
                  </Button>
                </a>
              ) : (
                <Link to="/about">
                  <Button variant="secondary" size="lg">
                    <Download size={18} />
                    View Resume
                  </Button>
                </Link>
              )}
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Follow me:
              </span>
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }}
                >
                  <Github size={20} />
                </a>
              )}
              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }}
                >
                  <Linkedin size={20} />
                </a>
              )}
              {profile?.x_url && (
                <a
                  href={profile.x_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }}
                >
                  <Twitter size={20} />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                  style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }}
                >
                  <Mail size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Photo / Illustration with soft gradient glow */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '320px',
                height: '320px',
                borderRadius: 'var(--radius-lg)',
                padding: '8px',
                background: 'var(--accent-gradient)',
                boxShadow: 'var(--shadow-glow)',
                animation: 'floatSlow 4s ease-in-out infinite alternate',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 'calc(var(--radius-lg) - 6px)',
                  overflow: 'hidden',
                  background: 'var(--bg-surface-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'var(--accent-gradient-soft)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-8)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    <span style={{ fontSize: '72px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                      {name.charAt(0)}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{headline}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatSlow {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-10px); }
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-grid div {
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </section>
  );
}
